import * as React from "react"
import Link from "next/link"
import { Inbox } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  className?: string
}

// Clean placeholder state when lists or search results are empty
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border rounded-2xl bg-card/50",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
        {icon || <Inbox className="w-7 h-7" />}
      </div>

      <h3 className="text-lg font-serif font-semibold text-foreground mb-1">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}

      {actionLabel && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6")}
            >
              {actionLabel}
            </Link>
          ) : (
            <Button
              onClick={onAction}
              variant="default"
              className="rounded-full px-6"
            >
              {actionLabel}
            </Button>
          )}
        </>
      )}
    </div>
  )
}
