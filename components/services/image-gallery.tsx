"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ImageGalleryProps {
  images: string[]
  title: string
  className?: string
}

// Interactive photo gallery with 3:2 featured main view and clickable thumbnails
export function ImageGallery({ images, title, className }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [imgError, setImgError] = React.useState(false)

  const activeImage =
    images && images.length > 0
      ? images[selectedIndex] || images[0]
      : ""

  return (
    <div className={cn("space-y-3", className)}>
      {/* Featured Main Image: 3:2 fixed aspect ratio */}
      <div className="relative aspect-3/2 w-full overflow-hidden rounded-2xl border border-border/80 bg-muted shadow-xs">
        {imgError || !activeImage ? (
          <div className="h-full w-full flex items-center justify-center bg-muted/60 text-muted-foreground text-xs font-serif">
            Photo Preview
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={activeImage}
            alt={`${title} - view ${selectedIndex + 1}`}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-opacity duration-300"
          />
        )}
        {images && images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-medium">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails Bar (only if multiple images exist) */}
      {images && images.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSelectedIndex(idx)
                setImgError(false)
              }}
              className={cn(
                "relative aspect-3/2 w-20 sm:w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer",
                selectedIndex === idx
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border/60 opacity-70 hover:opacity-100"
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
