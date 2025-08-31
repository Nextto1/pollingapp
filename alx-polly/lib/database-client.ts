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

// Client-side database operations only
export const db = {
  // Poll operations
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

  async deletePoll(id: string) {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Vote operations
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

  // Results operations
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
