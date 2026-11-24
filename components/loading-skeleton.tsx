import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

// Skeleton for service cards during initial load or search
export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden border border-border/70 rounded-2xl bg-card shadow-xs flex flex-col h-full">
      <Skeleton className="w-full aspect-4/3" />
      <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Skeleton for dashboard KPI metric cards
export function StatCardSkeleton() {
  return (
    <Card className="border border-border/70 p-5 rounded-2xl">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
    </Card>
  )
}

// Skeleton for table rows in dashboard management views
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border/50">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="p-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}
