// Poll-related types and interfaces

export interface PollOption {
  id: string
  text: string
  votes: number
}

export interface Poll {
  id: string
  title: string
  description?: string
  options: PollOption[]
  createdBy: string
  createdAt: Date
  expiresAt?: Date
  isActive: boolean
  allowMultipleVotes: boolean
  totalVotes: number
}

export interface CreatePollData {
  title: string
  description?: string
  options: string[]
  expiresAt?: Date
  allowMultipleVotes: boolean
}

export interface VoteData {
  pollId: string
  optionIds: string[]
  userId?: string
}

export interface PollResults {
  poll: Poll
  userVote?: string[]
  percentageByOption: Record<string, number>
}
