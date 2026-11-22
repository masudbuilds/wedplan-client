"use client"

import * as React from "react"
import { toast } from "sonner"
import { UploadCloud, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
  className?: string
  label?: string
}

// Reusable image upload component with drag/click selection and preview
export function ImageUpload({
  value,
  onChange,
  disabled,
  className,
  label = "Upload Profile Photo",
}: ImageUploadProps) {
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Quick client-side validation
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo exceeds the 5MB size limit.")
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed.")
      }

      onChange(data.url)
      toast.success("Image uploaded successfully!")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload photo."
      toast.error(msg)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {value ? (
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-border/80 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          disabled={disabled || uploading}
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-24 border-dashed rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-primary hover:border-primary/50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span>Uploading to ImgBB...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-5 h-5 text-muted-foreground" />
              <span>{label}</span>
              <span className="text-[10px] text-muted-foreground/80">
                JPG, PNG, or WebP up to 5MB
              </span>
            </>
          )}
        </Button>
      )}
    </div>
  )
}
