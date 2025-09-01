import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Calendar, BarChart3 } from "lucide-react"
import { PollResultChart } from "@/components/poll-result-chart"

// Mock data for demonstration
const mockPoll = {
  id: "1",
  title: "What's your favorite programming language?",
  description: "Let's see what the community prefers for their daily development work. This poll will help us understand the most popular languages in our community.",
  options: [
    { id: "1", text: "JavaScript/TypeScript", votes: 45, percentage: 28.8 },
    { id: "2", text: "Python", votes: 38, percentage: 24.4 },
    { id: "3", text: "Java", votes: 25, percentage: 16.0 },
    { id: "4", text: "C++", votes: 18, percentage: 11.5 },
    { id: "5", text: "Go", votes: 15, percentage: 9.6 },
    { id: "6", text: "Rust", votes: 15, percentage: 9.6 },
  ],
  totalVotes: 156,
  isActive: true,
  allowMultipleVotes: false,
  createdAt: new Date("2024-01-15"),
  expiresAt: new Date("2024-02-15"),
  createdBy: "John Doe",
}

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const poll = mockPoll // In real app, fetch by params.id

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/polls" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Polls
        </Link>
        <h1 className="text-3xl font-bold">{poll.title}</h1>
        <p className="text-muted-foreground mt-2">{poll.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Vote</CardTitle>
                  <CardDescription>
                    {poll.allowMultipleVotes 
                      ? "You can select multiple options" 
                      : "Select your preferred option"
                    }
                  </CardDescription>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${
                  poll.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {poll.isActive ? "Active" : "Closed"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {poll.isActive ? (
                <div className="space-y-3">
                  {poll.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <input
                        type={poll.allowMultipleVotes ? "checkbox" : "radio"}
                        name="vote"
                        value={option.id}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{option.text}</div>
                        <div className="text-sm text-muted-foreground">
                          {option.votes} votes ({option.percentage}%)
                        </div>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <Button className="w-full mt-6">Submit Vote</Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Poll Closed</h3>
                  <p className="text-muted-foreground">This poll is no longer accepting votes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Poll Results Chart */}
          <PollResultChart options={poll.options} totalVotes={poll.totalVotes} />
          
          {/* Poll Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Poll Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Total Votes</span>
                </div>
                <span className="font-medium">{poll.totalVotes}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Created</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {poll.createdAt.toLocaleDateString()}
                </span>
              </div>
              {poll.expiresAt && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Expires</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {poll.expiresAt.toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Poll Creator */}
          <Card>
            <CardHeader>
              <CardTitle>Created by</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-medium">
                    {poll.createdBy.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{poll.createdBy}</div>
                  <div className="text-sm text-muted-foreground">Poll Creator</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
