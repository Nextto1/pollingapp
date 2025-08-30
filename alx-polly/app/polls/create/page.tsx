import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function CreatePollPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-8">
          <Link href="/polls" className="text-muted-foreground hover:text-foreground">
            ← Back to Polls
          </Link>
          <h1 className="text-3xl font-bold mt-2">Create New Poll</h1>
          <p className="text-muted-foreground">Create a new poll for the community to vote on</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Poll Details</CardTitle>
            <CardDescription>
              Fill in the details below to create your poll
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              {/* Poll Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Poll Title *
                </label>
                <Input
                  id="title"
                  placeholder="What's your favorite programming language?"
                  required
                />
              </div>

              {/* Poll Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Add a description to provide more context..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Poll Options */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Poll Options *</label>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index}`}
                        required={index <= 2}
                      />
                      {index > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                </div>
              </div>

              {/* Poll Settings */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Poll Settings</label>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowMultiple"
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="allowMultiple" className="text-sm">
                    Allow multiple votes per user
                  </label>
                </div>

                <div className="space-y-2">
                  <label htmlFor="expiresAt" className="text-sm font-medium">
                    Expiration Date (Optional)
                  </label>
                  <Input
                    id="expiresAt"
                    type="datetime-local"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <Link href="/polls" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1">
                  Create Poll
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
