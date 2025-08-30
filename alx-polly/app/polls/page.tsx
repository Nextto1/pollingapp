import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search } from "lucide-react"

// Mock data for demonstration
const mockPolls = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Let's see what the community prefers",
    totalVotes: 156,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Best framework for web development",
    description: "React, Vue, Angular, or something else?",
    totalVotes: 89,
    isActive: true,
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    title: "Preferred database for new projects",
    description: "SQL vs NoSQL preferences",
    totalVotes: 234,
    isActive: false,
    createdAt: new Date("2024-01-05"),
  },
]

export default function PollsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Polls</h1>
          <p className="text-muted-foreground">Discover and participate in community polls</p>
        </div>
        <Link href="/polls/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Poll
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search polls..."
          className="pl-10"
        />
      </div>

      {/* Polls Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPolls.map((poll) => (
          <Card key={poll.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{poll.title}</CardTitle>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  poll.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {poll.isActive ? "Active" : "Closed"}
                </span>
              </div>
              <CardDescription>{poll.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>{poll.totalVotes} votes</span>
                <span>{poll.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="mt-4">
                <Link href={`/polls/${poll.id}`}>
                  <Button variant="outline" className="w-full">
                    {poll.isActive ? "Vote Now" : "View Results"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockPolls.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Search className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No polls found</h3>
            <p>Try adjusting your search or create the first poll!</p>
          </div>
          <Link href="/polls/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create First Poll
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
