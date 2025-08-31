import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database-client'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { optionIds } = body

    // Validate required fields
    if (!optionIds || !Array.isArray(optionIds) || optionIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one option must be selected' },
        { status: 400 }
      )
    }

    // Submit votes
    await db.vote(params.id, optionIds)
    
    return NextResponse.json({ message: 'Vote submitted successfully' })
  } catch (error) {
    console.error('Error submitting vote:', error)
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('not authenticated')) {
        return NextResponse.json(
          { error: 'You must be logged in to vote' },
          { status: 401 }
        )
      }
      if (error.message.includes('inactive poll')) {
        return NextResponse.json(
          { error: 'This poll is no longer active' },
          { status: 400 }
        )
      }
      if (error.message.includes('expired')) {
        return NextResponse.json(
          { error: 'This poll has expired' },
          { status: 400 }
        )
      }
      if (error.message.includes('Multiple votes not allowed')) {
        return NextResponse.json(
          { error: 'Multiple votes are not allowed on this poll' },
          { status: 400 }
        )
      }
      if (error.message.includes('Maximum votes per user reached')) {
        return NextResponse.json(
          { error: 'You have reached the maximum number of votes for this poll' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    )
  }
}
