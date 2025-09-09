/**
 * Database Client Module
 * 
 * This module provides client-side database operations for the ALX Polly application.
 * It uses Supabase as the backend and provides functions for managing polls, votes, and results.
 * 
 * All functions in this module are designed to be called from client components and handle
 * authentication and error handling internally.
 */

import { createClient } from '@/lib/supabase'
import type { 
  Poll, 
  PollInsert, 
  PollOption, 
  PollOptionInsert, 
  Vote, 
  VoteInsert,
  PollResult 
} from '@/types/database'

/**
 * Client-side database operations
 * 
 * This object contains all database operations that can be performed from the client side.
 * Each function handles its own authentication and error handling.
 */
export const db = {
  /**
   * Poll Operations
   */

  /**
   * Retrieves a list of polls with optional filtering
   * 
   * This function fetches polls from the database with their associated options and vote counts.
   * Results can be filtered by status, search terms, and paginated with limit and offset.
   * 
   * @async
   * @function getPolls
   * @param {Object} [filters] - Optional filters to apply to the query
   * @param {'active'|'closed'|'draft'} [filters.status] - Filter polls by their status
   * @param {string} [filters.search] - Search term to filter polls by title or description
   * @param {number} [filters.limit] - Maximum number of polls to return
   * @param {number} [filters.offset] - Number of polls to skip (for pagination)
   * @returns {Promise<Poll[]>} Array of poll objects with their options and vote counts
   * @throws {Error} If the database query fails
   */
  async getPolls(filters?: {
    status?: 'active' | 'closed' | 'draft'
    search?: string
    limit?: number
    offset?: number
  }) {
    const supabase = createClient()
    
    let query = supabase
      .from('polls')
      .select(`
        *,
        poll_options (*),
        votes (count)
      `)
      .order('created_at', { ascending: false })
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }
    
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  },

  /**
   * Retrieves a single poll by its ID
   * 
   * This function fetches a specific poll with its associated options and vote counts.
   * 
   * @async
   * @function getPoll
   * @param {string} id - The unique identifier of the poll to retrieve
   * @returns {Promise<Poll>} The poll object with its options and vote counts
   * @throws {Error} If the poll doesn't exist or the query fails
   */
  async getPoll(id: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('polls')
      .select(`
        *,
        poll_options (*),
        votes (count)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Creates a new poll with options
   * 
   * This function creates a new poll and its associated options in the database.
   * It requires the user to be authenticated and automatically sets the created_by field.
   * 
   * @async
   * @function createPoll
   * @param {Omit<PollInsert, 'created_by'>} pollData - The poll data without the created_by field
   * @param {string[]} options - Array of option texts for the poll
   * @returns {Promise<Poll>} The newly created poll object
   * @throws {Error} If the user is not authenticated or the database operation fails
   */
  async createPoll(pollData: Omit<PollInsert, 'created_by'>, options: string[]) {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('User not authenticated')
    
    // Start a transaction
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        ...pollData,
        created_by: user.id
      })
      .select()
      .single()
    
    if (pollError) throw pollError
    
    // Insert poll options
    const pollOptions: PollOptionInsert[] = options.map((text, index) => ({
      poll_id: poll.id,
      text,
      order_index: index
    }))
    
    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(pollOptions)
    
    if (optionsError) throw optionsError
    
    return poll
  },

  /**
   * Updates an existing poll
   * 
   * This function updates a poll with the provided changes.
   * 
   * @async
   * @function updatePoll
   * @param {string} id - The unique identifier of the poll to update
   * @param {Partial<PollInsert>} updates - The fields to update and their new values
   * @returns {Promise<Poll>} The updated poll object
   * @throws {Error} If the poll doesn't exist or the update fails
   */
  async updatePoll(id: string, updates: Partial<PollInsert>) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('polls')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Deletes a poll
   * 
   * This function deletes a poll and all its associated data (options, votes).
   * 
   * @async
   * @function deletePoll
   * @param {string} id - The unique identifier of the poll to delete
   * @throws {Error} If the poll doesn't exist or the deletion fails
   */
  async deletePoll(id: string) {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  /**
   * Vote Operations
   */

  /**
   * Records a user's vote for one or more poll options
   * 
   * This function creates vote records for the specified poll options.
   * It requires the user to be authenticated.
   * 
   * @async
   * @function vote
   * @param {string} pollId - The unique identifier of the poll being voted on
   * @param {string[]} optionIds - Array of option IDs the user is voting for
   * @throws {Error} If the user is not authenticated or the vote fails
   */
  async vote(pollId: string, optionIds: string[]) {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) throw new Error('User not authenticated')
    
    // Create vote records
    const votes: VoteInsert[] = optionIds.map(optionId => ({
      poll_id: pollId,
      option_id: optionId,
      user_id: user.id
    }))
    
    const { error } = await supabase
      .from('votes')
      .insert(votes)
    
    if (error) throw error
  },

  /**
   * Retrieves a user's votes for a specific poll
   * 
   * This function fetches the option IDs that the current user has voted for in a poll.
   * 
   * @async
   * @function getUserVotes
   * @param {string} pollId - The unique identifier of the poll
   * @returns {Promise<string[]>} Array of option IDs the user has voted for
   * @throws {Error} If the query fails
   */
  async getUserVotes(pollId: string) {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return []
    
    const { data, error } = await supabase
      .from('votes')
      .select('option_id')
      .eq('poll_id', pollId)
      .eq('user_id', user.id)
    
    if (error) throw error
    return data.map(vote => vote.option_id)
  },

  /**
   * Results Operations
   */

  /**
   * Retrieves the results of a poll
   * 
   * This function fetches the results of a poll, including options and vote counts.
   * 
   * @async
   * @function getPollResults
   * @param {string} pollId - The unique identifier of the poll
   * @returns {Promise<PollResult[]>} Array of poll results with options and vote counts
   * @throws {Error} If the query fails
   */
  async getPollResults(pollId: string): Promise<PollResult[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('poll_results')
      .select('*')
      .eq('poll_id', pollId)
      .order('order_index')
    
    if (error) throw error
    return data
  },

  /**
   * Gets the total number of votes for a poll
   * 
   * This function counts the total number of votes cast for a specific poll.
   * 
   * @async
   * @function getTotalVotes
   * @param {string} pollId - The unique identifier of the poll
   * @returns {Promise<number>} The total number of votes
   * @throws {Error} If the query fails
   */
  async getTotalVotes(pollId: string) {
    const supabase = createClient()
    
    const { count, error } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('poll_id', pollId)
    
    if (error) throw error
    return count || 0
  }
}
