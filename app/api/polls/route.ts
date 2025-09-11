import { NextRequest, NextResponse } from 'next/server'
import { serverDb } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status') as 'active' | 'closed' | 'draft' | null
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const filters = {
      ...(search && { search }),
      ...(status && { status }),
      limit,
      offset
    }

    const polls = await serverDb.getPolls(filters)
    
    return NextResponse.json(polls)
  } catch (error) {
    console.error('Error fetching polls:', error)
    return NextResponse.json(
      { error: 'Failed to fetch polls' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, options, vote_type, allow_multiple_votes, max_votes_per_user, expires_at } = body

    // Validate required fields
    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: 'Title and at least 2 options are required' },
        { status: 400 }
      )
    }

    // Validate options
    const validOptions = options.filter((option: string) => option.trim() !== '')
    if (validOptions.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 valid options are required' },
        { status: 400 }
      )
    }

    // Create poll data
    const pollData = {
      title: title.trim(),
      description: description?.trim() || null,
      vote_type: vote_type || 'single',
      allow_multiple_votes: allow_multiple_votes || false,
      max_votes_per_user: max_votes_per_user || (allow_multiple_votes ? null : 1),
      expires_at: expires_at || null,
      status: 'active' as const
    }

    // Create the poll using the database utility
    const poll = await serverDb.createPoll(pollData, validOptions)
    
    return NextResponse.json(poll, { status: 201 })
  } catch (error) {
    console.error('Error creating poll:', error)
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    )
  }
}
