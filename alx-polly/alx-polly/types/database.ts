export type PollStatus = 'active' | 'closed' | 'draft'
export type VoteType = 'single' | 'multiple'

export interface Database {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          status: PollStatus
          vote_type: VoteType
          allow_multiple_votes: boolean
          max_votes_per_user: number | null
          expires_at: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: PollStatus
          vote_type?: VoteType
          allow_multiple_votes?: boolean
          max_votes_per_user?: number | null
          expires_at?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: PollStatus
          vote_type?: VoteType
          allow_multiple_votes?: boolean
          max_votes_per_user?: number | null
          expires_at?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          text: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          text: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          text?: string
          order_index?: number
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      poll_results: {
        Row: {
          poll_id: string
          title: string
          description: string | null
          status: PollStatus
          vote_type: VoteType
          allow_multiple_votes: boolean
          max_votes_per_user: number | null
          expires_at: string | null
          option_id: string
          option_text: string
          order_index: number
          vote_count: number
          percentage: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      poll_status: PollStatus
      vote_type: VoteType
    }
  }
}

// Helper types for easier usage
export type Poll = Database['public']['Tables']['polls']['Row']
export type PollInsert = Database['public']['Tables']['polls']['Insert']
export type PollUpdate = Database['public']['Tables']['polls']['Update']

export type PollOption = Database['public']['Tables']['poll_options']['Row']
export type PollOptionInsert = Database['public']['Tables']['poll_options']['Insert']
export type PollOptionUpdate = Database['public']['Tables']['poll_options']['Update']

export type Vote = Database['public']['Tables']['votes']['Row']
export type VoteInsert = Database['public']['Tables']['votes']['Insert']
export type VoteUpdate = Database['public']['Tables']['votes']['Update']

export type PollResult = Database['public']['Views']['poll_results']['Row']
