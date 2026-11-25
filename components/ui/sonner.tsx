"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: (
          <span className="w-7 h-7 rounded-full bg-sage text-sage-foreground flex items-center justify-center shrink-0">
            <CircleCheckIcon className="size-4" />
          </span>
        ),
        info: (
          <span className="w-7 h-7 rounded-full bg-blush text-primary-text flex items-center justify-center shrink-0">
            <InfoIcon className="size-4" />
          </span>
        ),
        warning: (
          <span className="w-7 h-7 rounded-full bg-[#C9A66B]/20 text-gold-text flex items-center justify-center shrink-0">
            <TriangleAlertIcon className="size-4" />
          </span>
        ),
        error: (
          <span className="w-7 h-7 rounded-full bg-destructive/12 text-destructive flex items-center justify-center shrink-0">
            <OctagonXIcon className="size-4" />
          </span>
        ),
        loading: (
          <span className="w-7 h-7 rounded-full bg-muted text-primary-text flex items-center justify-center shrink-0">
            <Loader2Icon className="size-4 animate-spin" />
          </span>
        ),
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "1rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast group !bg-card !text-foreground !border !border-border !rounded-2xl !shadow-lg !px-4 !py-3.5 !gap-3 !font-sans items-center",
          title: "!text-xs sm:!text-sm !font-medium !text-foreground !leading-snug",
          description: "!text-xs !text-muted-foreground !leading-relaxed",
          icon: "!m-0 !w-7 !h-7 !shrink-0 flex items-center justify-center",
          closeButton:
            "!bg-card !border !border-border !text-muted-foreground hover:!text-foreground hover:!bg-muted !rounded-full transition-colors",
          success: "!border-sage-foreground/20",
          error: "!border-destructive/30",
          warning: "!border-[#C9A66B]/60",
          info: "!border-primary/25",
          actionButton:
            "!bg-primary !text-primary-foreground !rounded-full !text-xs !font-medium !px-3.5 !h-7",
          cancelButton:
            "!bg-muted !text-foreground !rounded-full !text-xs !font-medium !px-3.5 !h-7",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
