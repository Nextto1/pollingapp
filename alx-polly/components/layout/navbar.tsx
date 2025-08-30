'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, User, LogIn, LogOut, UserCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/polls')
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/polls" className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl">PollApp</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/polls" className="text-sm font-medium hover:text-primary transition-colors">
            Polls
          </Link>
          <Link href="/polls/create" className="text-sm font-medium hover:text-primary transition-colors">
            Create Poll
          </Link>
        </div>

        {/* Auth Buttons / User Menu */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <UserCircle className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium hidden sm:block">
                  {user.user_metadata?.name || user.email}
                </span>
              </div>
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
            <>
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
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
