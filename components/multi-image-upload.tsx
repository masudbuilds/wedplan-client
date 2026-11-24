"use client"

import * as React from "react"
import { toast } from "sonner"
import { UploadCloud, Loader2, X, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiImageUploadProps {
  values: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  disabled?: boolean
  className?: string
}

export function MultiImageUpload({
  values = [],
  onChange,
  maxImages = 5,
  disabled = false,
  className,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const selectedFiles = Array.from(files)
    const remainingSlots = maxImages - values.length

    if (remainingSlots <= 0) {
      toast.error(`You have already uploaded the maximum of ${maxImages} images.`)
      return
    }

    const filesToUpload = selectedFiles.slice(0, remainingSlots)
    if (selectedFiles.length > remainingSlots) {
      toast.info(`Only ${remainingSlots} photo(s) can be added to stay within the ${maxImages} photo limit.`)
    }

    // Validate files
    for (const file of filesToUpload) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error(`"${file.name}" is not a valid format. Only JPG, PNG, and WebP are allowed.`)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the 5MB size limit.`)
        return
      }
    }

    setUploading(true)
    const newUrls: string[] = []

    try {
      for (const file of filesToUpload) {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.error || `Failed to upload ${file.name}`)
        }

        newUrls.push(data.url)
      }

      onChange([...values, ...newUrls])
      toast.success(
        newUrls.length === 1
          ? "Photo uploaded successfully!"
          : `${newUrls.length} photos uploaded successfully!`
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image."
      toast.error(msg)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemove = (indexToRemove: number) => {
    const updated = values.filter((_, idx) => idx !== indexToRemove)
    onChange(updated)
  }

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFilesSelect}
        className="hidden"
        disabled={disabled || uploading || values.length >= maxImages}
      />

      {/* Grid of uploaded images + upload button */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {values.map((url, index) => (
          <div
            key={url + index}
            className="relative aspect-square rounded-xl overflow-hidden border border-border/80 group bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Service photo ${index + 1}`}
              className="block w-full h-full object-cover transition-transform group-hover:scale-105"
            />

            {/* Badge for Primary / Cover Photo */}
            {index === 0 && (
              <span className="absolute bottom-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                Cover Photo
              </span>
            )}

            {/* Remove button */}
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={uploading}
                aria-label={`Remove photo ${index + 1}`}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/75 hover:bg-destructive text-white flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}

        {/* Upload Trigger Tile (shown if slot available) */}
        {values.length < maxImages && (
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "aspect-square rounded-xl border-2 border-dashed border-border/80 hover:border-primary/50 bg-card hover:bg-muted/30 transition-all flex flex-col items-center justify-center p-3 text-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
              uploading && "pointer-events-none"
            )}
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-[11px] font-medium text-foreground">
                  Uploading...
                </span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-blush flex items-center justify-center text-primary">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-foreground block">
                    Add Photo
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    {values.length} of {maxImages}
                  </span>
                </div>
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
        <span className="flex items-center gap-1">
          <ImageIcon className="w-3.5 h-3.5 text-primary" />
          First image will be the primary cover preview.
        </span>
        <span>JPG, PNG, WebP up to 5MB each ({values.length}/{maxImages})</span>
      </div>
    </div>
  )
}
