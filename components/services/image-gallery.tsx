"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  title: string
  className?: string
}

// Interactive photo gallery with featured main view and clickable thumbnails
export function ImageGallery({ images, title, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const activeImage =
    images && images.length > 0
      ? images[selectedIndex] || images[0]
      : "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"

  return (
    <div className={cn("space-y-3", className)}>
      {/* Featured Main Image */}
      <div className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImage}
          alt={`${title} - view ${selectedIndex + 1}`}
          className="h-full w-full object-cover transition-all duration-300"
        />
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-medium">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails Bar (only if multiple images exist) */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "relative aspect-4/3 w-20 sm:w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer",
                selectedIndex === idx
                  ? "border-primary ring-2 ring-primary/20 scale-95"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
