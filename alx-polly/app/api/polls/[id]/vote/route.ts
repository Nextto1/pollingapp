import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database-client'

/**
 * API Route Handler for Poll Voting
 * 
 * This endpoint handles user votes on a specific poll. It validates the vote request,
 * submits the vote to the database, and handles various error conditions including:
 * - Authentication requirements
 * - Poll status validation (active/inactive)
 * - Vote limit enforcement (single/multiple votes)
 * - Maximum votes per user validation
 * 
 * @route POST /api/polls/[id]/vote
 * @param {NextRequest} request - The incoming request object containing vote data
 * @param {Object} params - URL parameters
 * @param {string} params.id - The poll ID to vote on
 * @returns {NextResponse} JSON response indicating success or error
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Parse the request body to extract vote data
    const body = await request.json()
    const { optionIds } = body

    // Validate required fields - ensure at least one option is selected
    if (!optionIds || !Array.isArray(optionIds) || optionIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one option must be selected' },
        { status: 400 }
      )
    }

    // Submit votes to the database
    // This will trigger database-level validation for authentication, poll status, and vote limits
    await db.vote(params.id, optionIds)
    
    // Return success response if vote was recorded successfully
    return NextResponse.json({ message: 'Vote submitted successfully' })
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error submitting vote:', error)
    
    // Handle specific error cases with appropriate HTTP status codes
    if (error instanceof Error) {
      // Authentication error - user is not logged in
      if (error.message.includes('not authenticated')) {
        return NextResponse.json(
          { error: 'You must be logged in to vote' },
          { status: 401 } // Unauthorized
        )
      }
      
      // Poll status error - poll is no longer active
      if (error.message.includes('inactive poll')) {
        return NextResponse.json(
          { error: 'This poll is no longer active' },
          { status: 400 } // Bad Request
        )
      }
      
      // Poll expiration error - poll has expired
      if (error.message.includes('expired')) {
        return NextResponse.json(
          { error: 'This poll has expired' },
          { status: 400 } // Bad Request
        )
      }
      
      // Vote limit error - single vote policy violation
      if (error.message.includes('Multiple votes not allowed')) {
        return NextResponse.json(
          { error: 'Multiple votes are not allowed on this poll' },
          { status: 400 } // Bad Request
        )
      }
      
      // Maximum votes error - user has reached their vote limit
      if (error.message.includes('Maximum votes per user reached')) {
        return NextResponse.json(
          { error: 'You have reached the maximum number of votes for this poll' },
          { status: 400 } // Bad Request
        )
      }
    }
    
    // Generic error response for any unhandled errors
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 } // Internal Server Error
    )
  }
}
