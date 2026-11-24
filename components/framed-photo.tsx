import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface FramedPhotoProps {
  src: string
  alt: string
  priority?: boolean
  sizes?: string
  aspectRatio?: string
  className?: string
  imageClassName?: string
}

/**
 * Concentric Framed Photo
 * Geometric rule: Outer radius = Inner radius + Padding
 * Inner container: rounded-2xl (16px)
 * Padding: p-3 (12px)
 * Outer frame: rounded-[28px] (16 + 12 = 28px)
 * Even 12px gap on all four sides with soft gold hairline border.
 */
export function FramedPhoto({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  aspectRatio = "aspect-4/5",
  className,
  imageClassName,
}: FramedPhotoProps) {
  return (
    <div
      className={cn(
        "relative rounded-[28px] border border-[#C9A66B]/60 p-3 bg-card/30 shadow-xs",
        className
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl bg-card border border-border/80 shadow-md",
          aspectRatio
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    </div>
  )
}
