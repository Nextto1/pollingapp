'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import '@/styles/chart-animations.css'

/**
 * Poll Result Chart Component
 * 
 * This component visualizes poll results with animated horizontal bars.
 * It displays each option's vote count and percentage in a sorted order (highest votes first).
 * The chart includes animations for a more engaging user experience and handles the case
 * when there are no votes yet.
 */

/**
 * Represents a single poll option with its voting data
 * 
 * @interface PollOption
 * @property {string} id - Unique identifier for the poll option
 * @property {string} text - The text content of the poll option
 * @property {number} votes - Number of votes received for this option
 * @property {number} percentage - Percentage of total votes (0-100) for this option
 */
interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

/**
 * Props for the PollResultChart component
 * 
 * @interface PollResultChartProps
 * @property {PollOption[]} options - Array of poll options with their voting data
 * @property {number} totalVotes - Total number of votes across all options
 */
interface PollResultChartProps {
  options: PollOption[]
  totalVotes: number
}

/**
 * Color palette for chart bars
 * 
 * Defines a set of Tailwind CSS background color classes used for the chart bars.
 * Colors are applied in sequence and repeat if there are more options than colors.
 */
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

/**
 * Generates a staggered animation delay for chart bars
 * 
 * @param {number} index - The index of the chart bar
 * @returns {string} CSS-compatible animation delay value
 */
const getAnimationDelay = (index: number) => `${index * 100}ms`

/**
 * Poll Result Chart Component
 * 
 * Renders a visual representation of poll results using animated horizontal bars.
 * The chart displays each option's text, vote count, and percentage in a sorted order.
 * 
 * @param {PollResultChartProps} props - The component props
 * @param {PollOption[]} props.options - Array of poll options with voting data
 * @param {number} props.totalVotes - Total number of votes across all options
 * @returns {JSX.Element} The rendered chart component
 */
export function PollResultChart({ options, totalVotes }: PollResultChartProps) {
  /**
   * Reference to the chart container element for DOM manipulation
   * Used to access and animate the chart bars after render
   */
  const chartRef = useRef<HTMLDivElement>(null)

  /**
   * Initialize chart animations when component mounts or options change
   * Adds the 'animate-in' class to trigger CSS animations defined in chart-animations.css
   */
  useEffect(() => {
    if (chartRef.current) {
      const bars = chartRef.current.querySelectorAll('.chart-bar')
      bars.forEach((bar) => {
        bar.classList.add('animate-in')
      })
    }
  }, [options])

  /**
   * Sort options by vote count in descending order (highest votes first)
   * This ensures the most popular options appear at the top of the chart
   */
  const sortedOptions = [...options].sort((a, b) => b.votes - a.votes)

  /**
   * Render the poll results chart
   * 
   * The chart is wrapped in a Card component with a header and content section.
   * If there are no votes, a message is displayed encouraging users to vote.
   * Otherwise, each option is displayed with its text, vote count, percentage, and a visual bar.
   */
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Results Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chart container with reference for animation handling */}
        <div ref={chartRef} className="space-y-4">
          {/* Conditional rendering based on vote count */}
          {totalVotes === 0 ? (
            // Display when no votes are available
            <div className="text-center py-8 text-muted-foreground">
              No votes yet. Be the first to vote!
            </div>
          ) : (
            // Map through sorted options to create chart bars
            sortedOptions.map((option, index) => (
              <div key={option.id} className="space-y-1">
                {/* Option text and vote information */}
                <div className="flex justify-between text-sm">
                  <span className="font-medium truncate">{option.text}</span>
                  <span className="text-muted-foreground">
                    {option.votes} vote{option.votes !== 1 ? 's' : ''} ({option.percentage}%)
                  </span>
                </div>
                {/* Chart bar container */}
                <div className="h-8 w-full bg-muted rounded-md overflow-hidden flex items-center">
                  {/* Animated bar with dynamic width based on vote percentage */}
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