import Link from "next/link"
import * as React from "react"
import {
  Camera,
  Building2,
  Flower2,
  UtensilsCrossed,
  Sparkles,
  Shirt,
  LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ServiceCategory } from "@/types"

// Map categories to romantic thematic icons
export const CATEGORY_ICONS: Record<ServiceCategory, LucideIcon> = {
  "Photography & Videography": Camera,
  "Wedding Venues": Building2,
  "Decoration & Florist": Flower2,
  "Catering Services": UtensilsCrossed,
  "Makeup & Styling": Sparkles,
  "Wedding Fashion": Shirt,
}

interface CategoryTileProps {
  name: ServiceCategory
  itemCount?: number
  href?: string
  className?: string
}

// Editorial interactive category tile
export function CategoryTile({
  name,
  itemCount,
  href,
  className,
}: CategoryTileProps) {
  const Icon = CATEGORY_ICONS[name] || Sparkles
  const targetHref = href || `/services?category=${encodeURIComponent(name)}`

  return (
    <Link
      href={targetHref}
      className={cn(
        "group relative block p-5 sm:p-6 rounded-2xl bg-card border border-border/70 card-hover-lift shadow-xs transition-all duration-200 text-center hover:border-primary/40",
        className
      )}
    >
      <div className="mx-auto w-12 h-12 rounded-xl bg-blush/60 text-primary flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-200">
        <Icon className="w-6 h-6 transition-colors" />
      </div>

      <h3 className="font-serif font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
        {name}
      </h3>

      {itemCount !== undefined && (
        <p className="text-xs text-muted-foreground mt-1">
          {itemCount} {itemCount === 1 ? "vendor" : "vendors"}
        </p>
      )}
    </Link>
  )
}
