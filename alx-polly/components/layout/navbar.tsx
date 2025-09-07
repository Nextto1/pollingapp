'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, User, LogIn, LogOut, UserCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

/**
 * Navigation Bar Component
 * 
 * Renders the application's top navigation bar with logo, navigation links,
 * and authentication controls. The component adapts its display based on
 * the user's authentication state.
 */
export function Navbar() {
  // Get authentication state and methods from the auth context
  const { user, signOut, loading } = useAuth()
  // Get router for navigation after sign out
  const router = useRouter()

  /**
   * Handles user sign out action
   * 
   * Calls the signOut method from auth context and redirects
   * the user to the polls page after successful sign out
   */
  const handleSignOut = async () => {
    await signOut() // Execute sign out through auth provider
    router.push('/polls') // Redirect to polls page after sign out
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo section with app icon and name */}
        <Link href="/polls" className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl">PollApp</span>
        </Link>

        {/* Navigation Links - hidden on mobile, visible on medium screens and up */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/polls" className="text-sm font-medium hover:text-primary transition-colors">
            Polls
          </Link>
          <Link href="/polls/create" className="text-sm font-medium hover:text-primary transition-colors">
            Create Poll
          </Link>
        </div>

        {/* Authentication section with conditional rendering based on auth state */}
        <div className="flex items-center space-x-4">
          {/* Show loading indicator while auth state is being determined */}
          {loading ? (
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
          ) : user ? (
            /* When user is authenticated, show user info and sign out button */
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <UserCircle className="w-5 h-5 text-muted-foreground" />
                {/* User name/email - hidden on small screens */}
                <span className="text-sm font-medium hidden sm:block">
                  {user.user_metadata?.name || user.email}
                </span>
              </div>
              {/* Sign out button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            /* When user is not authenticated, show sign in and sign up buttons */
            <>
              {/* Sign in button with ghost styling */}
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              {/* Sign up button with primary styling */}
              <Link href="/auth/signup">
                <Button size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
