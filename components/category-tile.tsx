import Link from "next/link"
import Image from "next/image"
import * as React from "react"
import { cn } from "@/lib/utils"
import { ServiceCategory } from "@/types"

export const CATEGORY_PHOTOS: Record<ServiceCategory, string> = {
  "Photography & Videography": "/images/photography.jpg",
  "Wedding Venues": "/images/venues.jpg",
  "Decoration & Florist": "/images/decoration.jpg",
  "Catering Services": "/images/catering.jpg",
  "Makeup & Styling": "/images/makeup.jpg",
  "Wedding Fashion": "/images/fashion.jpg",
}

interface CategoryTileProps {
  name: ServiceCategory
  href?: string
  className?: string
}

// Editorial photo-first category tile
export function CategoryTile({
  name,
  href,
  className,
}: CategoryTileProps) {
  const imageSrc = CATEGORY_PHOTOS[name] || "/images/hero.jpg"
  const targetHref = href || `/services?category=${encodeURIComponent(name)}`

  return (
    <Link
      href={targetHref}
      className={cn(
        "group block rounded-xl bg-card border border-border/80 overflow-hidden shadow-xs hover:border-[#C9A66B]/60 hover:shadow-sm transition-all duration-300",
        className
      )}
    >
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>

      <div className="p-3 sm:p-3.5 text-center">
        <h3 className="font-serif font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {name}
        </h3>
      </div>
    </Link>
  )
}
