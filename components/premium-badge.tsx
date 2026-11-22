import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PremiumBadgeProps {
  label?: string
  className?: string
  size?: "sm" | "default"
}

// Gold badge indicating verified premium vendor status
export function PremiumBadge({
  label = "Premium Vendor",
  className,
  size = "default",
}: PremiumBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1 font-medium bg-[#C9A66B]/15 text-[#9A6E2E] dark:text-[#E2C38C] border-[#C9A66B]/40 shadow-xs",
        size === "sm" ? "text-[11px] px-2 py-0.5" : "text-xs px-2.5 py-1",
        className
      )}
    >
      <Sparkles className={size === "sm" ? "w-3 h-3 text-[#C9A66B]" : "w-3.5 h-3.5 text-[#C9A66B]"} />
      <span>{label}</span>
    </Badge>
  )
}
