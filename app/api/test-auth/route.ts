import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Test the connection by getting the current user
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Supabase connection error', 
        error: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Supabase connection working',
      user: user ? { id: user.id, email: user.email } : null,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to connect to Supabase',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
