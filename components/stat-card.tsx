import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  variant?: "default" | "primary" | "gold" | "sage"
  className?: string
}

// Reusable metric card for customer, vendor, and admin dashboards
export function StatCard({
  title,
  value,
  description,
  icon,
  variant = "default",
  className,
}: StatCardProps) {
  const iconBgClasses = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    gold: "bg-[#C9A66B]/15 text-[#9A6E2E] dark:text-[#E2C38C]",
    sage: "bg-sage/40 text-[#2E4A34] dark:text-[#A8C5AE]",
  }

  return (
    <Card className={cn("border border-border/70 shadow-xs", className)}>
      <CardContent className="p-5 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              iconBgClasses[variant]
            )}
          >
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
