'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import '@/styles/chart-animations.css'

interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

interface PollResultChartProps {
  options: PollOption[]
  totalVotes: number
}

// @ChartColors - Define a color palette for the chart bars
const chartColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-orange-500',
]

// @ChartAnimation - Controls the animation timing for each bar
const getAnimationDelay = (index: number) => `${index * 100}ms`

export function PollResultChart({ options, totalVotes }: PollResultChartProps) {
  // @ChartRef - Reference to access chart DOM elements
  const chartRef = useRef<HTMLDivElement>(null)

  // @ChartInit - Initialize chart animations when component mounts
  useEffect(() => {
    if (chartRef.current) {
      const bars = chartRef.current.querySelectorAll('.chart-bar')
      bars.forEach((bar) => {
        bar.classList.add('animate-in')
      })
    }
  }, [options])

  // Sort options by votes (highest first)
  const sortedOptions = [...options].sort((a, b) => b.votes - a.votes)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Results Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="space-y-4">
          {totalVotes === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No votes yet. Be the first to vote!
            </div>
          ) : (
            sortedOptions.map((option, index) => (
              <div key={option.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium truncate">{option.text}</span>
                  <span className="text-muted-foreground">
                    {option.votes} vote{option.votes !== 1 ? 's' : ''} ({option.percentage}%)
                  </span>
                </div>
                <div className="h-8 w-full bg-muted rounded-md overflow-hidden flex items-center">
                  <div 
                    className={`chart-bar h-full ${chartColors[index % chartColors.length]} opacity-0 transition-all duration-1000 ease-out`} 
                    style={{ 
                      width: `${option.percentage}%`,
                      transitionDelay: getAnimationDelay(index)
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}