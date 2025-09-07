import * as React from "react"
import { Slot } from "@radix-ui/react-slot" // Allows rendering another component in place of this one
import { cva, type VariantProps } from "class-variance-authority" // For creating variant-based component styling

import { cn } from "@/lib/utils" // Utility for merging class names

// Define button styling variants using class-variance-authority
// This creates a function that generates class names based on provided variants
const buttonVariants = cva(
  // Base styles applied to all buttons
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      // Visual style variants
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // Size variants for different button dimensions
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10", // Square button for icons
      },
    },
    // Default variant values if not specified
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button component props interface
 * Extends standard button HTML attributes and adds variant props
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** 
   * When true, the button will render its children directly
   * Useful for wrapping other components with button functionality
   */
  asChild?: boolean
}

/**
 * Button component with multiple style variants
 * Uses forwardRef to allow ref passing to the underlying button element
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Use Slot component when asChild is true, otherwise use standard button element
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        // Merge variant classes with any provided className
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button" // For React DevTools

export { Button, buttonVariants }
