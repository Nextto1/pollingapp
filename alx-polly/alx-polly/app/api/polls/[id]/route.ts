import { NextRequest, NextResponse } from 'next/server'
import { serverDb } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const poll = await serverDb.getPoll(params.id)
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(poll)
  } catch (error) {
    console.error('Error fetching poll:', error)
    return NextResponse.json(
      { error: 'Failed to fetch poll' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, status, vote_type, allow_multiple_votes, max_votes_per_user, expires_at } = body

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // Update poll data
    const updateData = {
      title: title.trim(),
      description: description?.trim() || null,
      status: status || 'active',
      vote_type: vote_type || 'single',
      allow_multiple_votes: allow_multiple_votes || false,
      max_votes_per_user: max_votes_per_user || (allow_multiple_votes ? null : 1),
      expires_at: expires_at || null
    }

    const poll = await serverDb.updatePoll(params.id, updateData)
    
    return NextResponse.json(poll)
  } catch (error) {
    console.error('Error updating poll:', error)
    return NextResponse.json(
      { error: 'Failed to update poll' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await serverDb.deletePoll(params.id)
    
    return NextResponse.json({ message: 'Poll deleted successfully' })
  } catch (error) {
    console.error('Error deleting poll:', error)
    return NextResponse.json(
      { error: 'Failed to delete poll' },
      { status: 500 }
    )
  }
}
