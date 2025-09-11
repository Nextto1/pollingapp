'use client'

/**
 * Protected Route Component
 * 
 * This component provides route protection by restricting access to authenticated users only.
 * If a user is not authenticated, they are redirected to the sign-in page.
 * While authentication state is being loaded, a loading indicator is displayed.
 * 
 * This component is used to wrap pages or components that should only be accessible
 * to authenticated users.
 */

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

/**
 * Props for the ProtectedRoute component
 * 
 * @interface ProtectedRouteProps
 * @property {React.ReactNode} children - The content to render when the user is authenticated
 * @property {React.ReactNode} [fallback] - Optional custom loading component to show while checking auth state
 */
interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * A component that restricts access to authenticated users only
 * 
 * @component
 * @param {ProtectedRouteProps} props - Component props
 * @param {React.ReactNode} props.children - Content to render when user is authenticated
 * @param {React.ReactNode} [props.fallback] - Optional custom loading component
 * @returns {JSX.Element|null} The protected content, loading indicator, or null
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth() // Get authentication state
  const router = useRouter()

  // Redirect to sign-in page if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router]) // Re-run effect when these dependencies change

  // Show loading indicator while authentication state is being determined
  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // Return null during the redirect to prevent flash of content
  if (!user) {
    return null
  }

  // User is authenticated, render the protected content
  return <>{children}</>
}
