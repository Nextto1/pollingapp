import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, User, LogIn } from "lucide-react"

export function Navbar() {
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

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </nav>
  )
}
