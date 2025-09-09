import { BarChart3 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h2 className="text-lg font-medium text-foreground">Loading PollApp...</h2>
        <p className="text-sm text-muted-foreground mt-2">Please wait while we redirect you</p>
      </div>
    </div>
  )
}
