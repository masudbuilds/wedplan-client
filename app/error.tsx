"use client"

import * as React from "react"
import Link from "next/link"
import { AlertCircle, RotateCcw, Home } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    // Optionally log to error reporting service in production
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] px-4 py-16 text-center">
      <div className="space-y-6 max-w-lg">
        {/* Thematic Error Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive shadow-xs">
          <AlertCircle className="w-8 h-8 opacity-90" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-destructive">
            Application Notice
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Something Went Wrong
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-1">
            We encountered an unexpected issue while loading this page. You can try refreshing the component or return to the homepage.
          </p>
          {error?.message && process.env.NODE_ENV === "development" && (
            <p className="mt-3 p-3 text-xs bg-muted text-muted-foreground rounded-lg font-mono text-left break-all">
              {error.message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Button
            onClick={() => reset()}
            className="rounded-full px-6 gap-2 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>

          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full px-6 gap-2"
            )}
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
