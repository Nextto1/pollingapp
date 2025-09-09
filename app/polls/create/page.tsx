'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Loader2 } from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { db } from "@/lib/database-client"
import { useAuth } from "@/contexts/auth-context"

interface PollFormData {
  title: string
  description: string
  options: string[]
  allowMultipleVotes: boolean
  expiresAt: string
}

export default function CreatePollPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState<PollFormData>({
    title: "",
    description: "",
    options: ["", ""], // Start with 2 required options
    allowMultipleVotes: false,
    expiresAt: ""
  })

  const handleInputChange = (field: keyof PollFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("") // Clear error when user starts typing
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData(prev => ({ ...prev, options: newOptions }))
  }

  const addOption = () => {
    if (formData.options.length < 10) { // Limit to 10 options
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, ""]
      }))
    }
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) { // Keep at least 2 options
      const newOptions = formData.options.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, options: newOptions }))
    }
  }

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError("Poll title is required")
      return false
    }

    if (formData.title.length > 255) {
      setError("Poll title must be less than 255 characters")
      return false
    }

    const validOptions = formData.options.filter(option => option.trim() !== "")
    if (validOptions.length < 2) {
      setError("At least 2 poll options are required")
      return false
    }

    if (validOptions.length > 10) {
      setError("Maximum 10 poll options allowed")
      return false
    }

    // Check for duplicate options
    const uniqueOptions = new Set(validOptions.map(option => option.trim().toLowerCase()))
    if (uniqueOptions.size !== validOptions.length) {
      setError("Poll options must be unique")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      // Filter out empty options
      const validOptions = formData.options.filter(option => option.trim() !== "")
      
      // Prepare poll data
      const pollData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        vote_type: formData.allowMultipleVotes ? 'multiple' as const : 'single' as const,
        allow_multiple_votes: formData.allowMultipleVotes,
        max_votes_per_user: formData.allowMultipleVotes ? null : 1,
        expires_at: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        status: 'active' as const
      }

      // Create the poll
      const poll = await db.createPoll(pollData, validOptions)
      
      // Show success message and redirect to polls listing
      router.push('/polls?success=true')
    } catch (err) {
      console.error('Error creating poll:', err)
      setError(err instanceof Error ? err.message : 'Failed to create poll. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Poll Title */}
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Poll Title *
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="What's your favorite programming language?"
                  required
                  maxLength={255}
                />
              </div>

              {/* Poll Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Add a description to provide more context..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  maxLength={1000}
                />
              </div>

              {/* Poll Options */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Poll Options *</label>
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required={index < 2}
                        maxLength={500}
                      />
                      {formData.options.length > 2 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="shrink-0"
                          onClick={() => removeOption(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {formData.options.length < 10 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={addOption}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  )}
                </div>
              </div>

              {/* Poll Settings */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Poll Settings</label>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allowMultiple"
                    checked={formData.allowMultipleVotes}
                    onChange={(e) => handleInputChange('allowMultipleVotes', e.target.checked)}
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
                    value={formData.expiresAt}
                    onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <Link href="/polls" className="flex-1">
                  <Button variant="outline" className="w-full" type="button" disabled={loading}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Poll'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
