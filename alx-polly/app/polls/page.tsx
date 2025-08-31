'use client'

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Loader2, CheckCircle, Edit, Trash2, MoreVertical } from "lucide-react"
import { db } from "@/lib/database-client"
import { useAuth } from "@/contexts/auth-context"
import type { Poll } from "@/types/database"

export default function PollsPage() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null)

  useEffect(() => {
    fetchPolls()
    
    // Check for success parameter
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true)
      // Remove the success parameter from URL
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      window.history.replaceState({}, '', url.toString())
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 5000)
    }
  }, [searchParams])

  const fetchPolls = async (search?: string) => {
    try {
      setLoading(true)
      const filters = {
        status: 'active' as const,
        ...(search && { search })
      }
      const data = await db.getPolls(filters)
      setPolls(data || [])
    } catch (err) {
      console.error('Error fetching polls:', err)
      setError('Failed to load polls')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPolls(searchTerm)
  }

  const getStatusColor = (status: string, expiresAt: string | null) => {
    if (status === 'closed') return "bg-gray-100 text-gray-800"
    if (expiresAt && new Date(expiresAt) < new Date()) return "bg-orange-100 text-orange-800"
    return "bg-green-100 text-green-800"
  }

  const getStatusText = (status: string, expiresAt: string | null) => {
    if (status === 'closed') return "Closed"
    if (expiresAt && new Date(expiresAt) < new Date()) return "Expired"
    return "Active"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleDeletePoll = async (pollId: string) => {
    if (!confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingPollId(pollId)
      await db.deletePoll(pollId)
      
      // Remove the poll from the local state
      setPolls(prevPolls => prevPolls.filter(poll => poll.id !== pollId))
      
      // Show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.error('Error deleting poll:', err)
      setError('Failed to delete poll. Please try again.')
    } finally {
      setDeletingPollId(null)
    }
  }

  const isPollOwner = (poll: Poll) => {
    return user && poll.created_by === user.id
  }

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
      <form onSubmit={handleSearch} className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search polls..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button 
          type="submit" 
          variant="ghost" 
          size="sm" 
          className="absolute right-1 top-1/2 transform -translate-y-1/2"
        >
          Search
        </Button>
      </form>

             {/* Success Message */}
       {showSuccess && (
         <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-6">
           <div className="flex items-center">
             <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
             <p className="text-sm text-green-800">Operation completed successfully!</p>
           </div>
         </div>
       )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md mb-6">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

             {/* Polls Grid */}
       {!loading && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           {polls.map((poll) => (
             <Card key={poll.id} className="hover:shadow-md transition-shadow">
               <CardHeader>
                 <div className="flex justify-between items-start">
                   <div className="flex-1 min-w-0">
                     <CardTitle className="text-lg truncate">{poll.title}</CardTitle>
                   </div>
                   <div className="flex items-center gap-2 ml-2">
                     <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(poll.status, poll.expires_at)}`}>
                       {getStatusText(poll.status, poll.expires_at)}
                     </span>
                     {isPollOwner(poll) && (
                       <div className="relative group">
                         <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                           <MoreVertical className="w-4 h-4" />
                         </Button>
                         <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                           <div className="py-1">
                             <Link href={`/polls/${poll.id}/edit`}>
                               <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                 <Edit className="w-4 h-4 mr-2" />
                                 Edit
                               </button>
                             </Link>
                             <button 
                               onClick={() => handleDeletePoll(poll.id)}
                               disabled={deletingPollId === poll.id}
                               className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                             >
                               {deletingPollId === poll.id ? (
                                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                               ) : (
                                 <Trash2 className="w-4 h-4 mr-2" />
                               )}
                               Delete
                             </button>
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
                 <CardDescription className="line-clamp-2">{poll.description}</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="flex justify-between items-center text-sm text-muted-foreground">
                   <span>{poll.poll_options?.length || 0} options</span>
                   <span>{formatDate(poll.created_at)}</span>
                 </div>
                 {poll.expires_at && (
                   <div className="text-xs text-muted-foreground mt-1">
                     Expires: {formatDate(poll.expires_at)}
                   </div>
                 )}
                 <div className="mt-4">
                   <Link href={`/polls/${poll.id}`}>
                     <Button variant="outline" className="w-full">
                       {poll.status === 'active' && (!poll.expires_at || new Date(poll.expires_at) > new Date()) 
                         ? "Vote Now" 
                         : "View Results"}
                     </Button>
                   </Link>
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       )}

      {/* Empty State */}
      {!loading && polls.length === 0 && (
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
