import { NextRequest, NextResponse } from 'next/server'
import type { Poll, VoteData } from '@/types/poll'

// Mock data store (replace with actual database)
let polls: Poll[] = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Let's see what the community prefers",
    options: [
      { id: "1", text: "JavaScript/TypeScript", votes: 45 },
      { id: "2", text: "Python", votes: 38 },
      { id: "3", text: "Java", votes: 25 },
      { id: "4", text: "C++", votes: 18 },
      { id: "5", text: "Go", votes: 15 },
      { id: "6", text: "Rust", votes: 15 },
    ],
    createdBy: "user1",
    createdAt: new Date("2024-01-15"),
    expiresAt: new Date("2024-02-15"),
    isActive: true,
    allowMultipleVotes: false,
    totalVotes: 156,
  }
]

// GET /api/polls/[id] - Get a specific poll
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const poll = polls.find(p => p.id === params.id)
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(poll)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch poll' },
      { status: 500 }
    )
  }
}

// PUT /api/polls/[id] - Update a poll
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const pollIndex = polls.findIndex(p => p.id === params.id)
    
    if (pollIndex === -1) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    // Update poll fields
    polls[pollIndex] = {
      ...polls[pollIndex],
      ...body,
      id: params.id, // Ensure ID doesn't change
    }

    return NextResponse.json(polls[pollIndex])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update poll' },
      { status: 500 }
    )
  }
}

// DELETE /api/polls/[id] - Delete a poll
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pollIndex = polls.findIndex(p => p.id === params.id)
    
    if (pollIndex === -1) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    polls.splice(pollIndex, 1)

    return NextResponse.json({ message: 'Poll deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete poll' },
      { status: 500 }
    )
  }
}
