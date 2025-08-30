import { NextRequest, NextResponse } from 'next/server'
import type { VoteData } from '@/types/poll'

// Mock data store (replace with actual database)
let polls = [
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

// POST /api/polls/[id]/vote - Submit a vote
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: VoteData = await request.json()
    const pollIndex = polls.findIndex(p => p.id === params.id)
    
    if (pollIndex === -1) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    const poll = polls[pollIndex]

    // Check if poll is active
    if (!poll.isActive) {
      return NextResponse.json(
        { error: 'Poll is not active' },
        { status: 400 }
      )
    }

    // Check if poll has expired
    if (poll.expiresAt && new Date() > poll.expiresAt) {
      return NextResponse.json(
        { error: 'Poll has expired' },
        { status: 400 }
      )
    }

    // Validate vote data
    if (!body.optionIds || body.optionIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one option must be selected' },
        { status: 400 }
      )
    }

    // Check if multiple votes are allowed
    if (!poll.allowMultipleVotes && body.optionIds.length > 1) {
      return NextResponse.json(
        { error: 'Multiple votes are not allowed for this poll' },
        { status: 400 }
      )
    }

    // Validate that all option IDs exist
    const validOptionIds = poll.options.map(option => option.id)
    const invalidOptions = body.optionIds.filter(id => !validOptionIds.includes(id))
    
    if (invalidOptions.length > 0) {
      return NextResponse.json(
        { error: 'Invalid option IDs provided' },
        { status: 400 }
      )
    }

    // TODO: Check if user has already voted (implement user authentication)
    // For now, we'll allow multiple votes from the same user

    // Update vote counts
    body.optionIds.forEach(optionId => {
      const option = poll.options.find(opt => opt.id === optionId)
      if (option) {
        option.votes++
      }
    })

    // Update total votes
    poll.totalVotes += body.optionIds.length

    return NextResponse.json({
      message: 'Vote submitted successfully',
      poll: poll
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    )
  }
}
