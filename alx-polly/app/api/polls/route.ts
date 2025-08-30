import { NextRequest, NextResponse } from 'next/server'
import type { Poll, CreatePollData } from '@/types/poll'

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

// GET /api/polls - Get all polls
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const active = searchParams.get('active')

    let filteredPolls = polls

    // Filter by search term
    if (search) {
      filteredPolls = filteredPolls.filter(poll =>
        poll.title.toLowerCase().includes(search.toLowerCase()) ||
        poll.description?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by active status
    if (active !== null) {
      const isActive = active === 'true'
      filteredPolls = filteredPolls.filter(poll => poll.isActive === isActive)
    }

    return NextResponse.json(filteredPolls)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    )
  }
}

// POST /api/polls - Create a new poll
export async function POST(request: NextRequest) {
  try {
    const body: CreatePollData = await request.json()
    
    // Validate required fields
    if (!body.title || !body.options || body.options.length < 2) {
      return NextResponse.json(
        { error: 'Title and at least 2 options are required' },
        { status: 400 }
      )
    }

    const newPoll: Poll = {
      id: Date.now().toString(), // Simple ID generation
      title: body.title,
      description: body.description,
      options: body.options.map((text, index) => ({
        id: (index + 1).toString(),
        text,
        votes: 0
      })),
      createdBy: "user1", // TODO: Get from auth
      createdAt: new Date(),
      expiresAt: body.expiresAt,
      isActive: true,
      allowMultipleVotes: body.allowMultipleVotes || false,
      totalVotes: 0,
    }

    polls.push(newPoll)

    return NextResponse.json(newPoll, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    )
  }
}
