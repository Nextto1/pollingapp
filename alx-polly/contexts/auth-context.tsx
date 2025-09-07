'use client'

/**
 * Authentication Context Module
 * 
 * This module provides a React Context for managing authentication state throughout the application.
 * It handles user authentication, session management, and provides authentication methods to components.
 * 
 * The context uses Supabase for authentication and maintains the current user state and session.
 * Components can access authentication state and methods through the useAuth hook.
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

/**
 * Authentication Context Type Definition
 * 
 * @interface AuthContextType
 * @property {User|null} user - The currently authenticated user or null if not authenticated
 * @property {Session|null} session - The current authentication session or null if not authenticated
 * @property {boolean} loading - Whether authentication state is being loaded
 * @property {Function} signIn - Function to authenticate a user with email and password
 * @property {Function} signUp - Function to register a new user
 * @property {Function} signOut - Function to sign out the current user
 */
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

/**
 * Authentication Context
 * 
 * The React Context that will hold authentication state and methods.
 * Initially undefined, it will be populated by the AuthProvider.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Authentication Provider Component
 * 
 * This component provides authentication state and methods to its children through context.
 * It initializes the authentication state, listens for changes, and provides authentication methods.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to auth context
 * @returns {JSX.Element} The provider component with its children
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State for the current user, session, and loading status
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient() // Initialize Supabase client

  useEffect(() => {
    /**
     * Fetches the initial session when the component mounts
     * This ensures we have the correct authentication state on page load
     */
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    /**
     * Subscribe to authentication state changes
     * This ensures the UI updates whenever the user signs in or out
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // Clean up subscription when component unmounts
    return () => subscription.unsubscribe()
  }, [supabase.auth])

  /**
   * Authenticates a user with email and password
   * 
   * @param {string} email - The user's email address
   * @param {string} password - The user's password
   * @returns {Promise<{error: any}>} Object containing error if authentication failed
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  /**
   * Registers a new user with email, password, and name
   * 
   * @param {string} email - The user's email address
   * @param {string} password - The user's password
   * @param {string} name - The user's display name
   * @returns {Promise<{error: any}>} Object containing error if registration failed
   */
  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name, // Store name in user metadata
        },
      },
    })
    return { error }
  }

  /**
   * Signs out the currently authenticated user
   * 
   * @returns {Promise<void>}
   */
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to access the authentication context
 * 
 * This hook provides access to the authentication state and methods from any component.
 * It must be used within a component that is a child of AuthProvider.
 * 
 * @function useAuth
 * @returns {AuthContextType} The authentication context value
 * @throws {Error} If used outside of an AuthProvider
 * 
 * @example
 * // In a component:
 * const { user, signIn, signOut } = useAuth();
 * 
 * // Check if user is authenticated
 * if (user) {
 *   // User is signed in
 * }
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
