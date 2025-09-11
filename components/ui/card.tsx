import * as React from "react"

import { cn } from "@/lib/utils" // Utility for merging class names

/**
 * Card Component System
 * 
 * A set of components that work together to create card-based UI elements.
 * The system includes Card (container), CardHeader, CardTitle, CardDescription,
 * CardContent, and CardFooter components that can be composed together.
 */

/**
 * Main Card container component
 * Provides the outer wrapper with styling for the card UI
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm", // Base card styling
      className // Allow custom classes to be added
    )}
    {...props}
  />
))
Card.displayName = "Card" // For React DevTools

/**
 * Card header component
 * Container for the card title and description
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)} // Padding and spacing for header content
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * Card title component
 * Main heading for the card
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight", // Typography styling for title
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * Card description component
 * Secondary text that provides additional context about the card content
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)} // Smaller, muted text for descriptions
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * Card content component
 * Container for the main content of the card
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-0", className)} // Padding with no top padding (assumes header above)
    {...props} 
  />
))
CardContent.displayName = "CardContent"

/**
 * Card footer component
 * Container for actions or additional information at the bottom of the card
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)} // Horizontal layout with padding
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
