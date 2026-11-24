import Link from "next/link"
import Image from "next/image"
import * as React from "react"
import { cn } from "@/lib/utils"
import { ServiceCategory } from "@/types"

export const CATEGORY_PHOTOS: Record<ServiceCategory, string> = {
  "Photography & Videography": "/images/photography.webp",
  "Wedding Venues": "/images/venues.webp",
  "Decoration & Florist": "/images/decoration.webp",
  "Catering Services": "/images/catering.webp",
  "Makeup & Styling": "/images/makeup.webp",
  "Wedding Fashion": "/images/fashion.webp",
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
  const imageSrc = CATEGORY_PHOTOS[name] || "/images/hero.webp"
  const targetHref = href || `/services?category=${encodeURIComponent(name)}`

  return (
    <Link
      href={targetHref}
      className={cn(
        "group relative block aspect-4/5 w-full rounded-2xl overflow-hidden bg-card border border-border/70 shadow-xs hover:border-[#C9A66B]/70 hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-104"
      />
      {/* Soft gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

      {/* Category Name at bottom */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-left">
        <h3 className="font-serif font-bold text-base sm:text-lg text-white drop-shadow-xs group-hover:text-[#F3E5D0] transition-colors leading-snug">
          {name}
        </h3>
      </div>
    </Link>
  )
}
