"use client"

import * as React from "react"
import Link from "next/link"
import { MapPin, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PremiumBadge } from "@/components/premium-badge"
import { Service } from "@/types"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface ServiceCardProps {
  service: Service
  isVendorPremium?: boolean
}

// Photo-first service card with pricing, vendor badge, and details CTA
export function ServiceCard({ service, isVendorPremium }: ServiceCardProps) {
  const { user } = useAuth()
  const [imgError, setImgError] = React.useState(false)

  const primaryImage = service.images?.[0] || ""

  const vendorInitials = service.vendorName
    ? service.vendorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "WP"

  // PDF Access Rule: Unauthenticated users are redirected to Sign In with return redirect
  const detailsHref = user
    ? `/services/${service.id}`
    : `/sign-in?redirect=${encodeURIComponent(`/services/${service.id}`)}`

  return (
    <div className="group overflow-hidden rounded-2xl border border-border/70 bg-card card-hover-lift shadow-xs flex flex-col h-full isolate">
      {/* Photo Header: fixed 4:3 aspect ratio, photo touches card border with no gap */}
      <div className="relative aspect-4/3 w-full bg-muted">
        {imgError || !primaryImage ? (
          <div className="h-full w-full flex flex-col items-center justify-center bg-muted/60 text-muted-foreground p-4 text-center">
            <Sparkles className="w-6 h-6 text-primary/40 mb-1" />
            <span className="font-serif text-xs font-semibold text-foreground/80">{service.category}</span>
            <span className="text-[10px] text-muted-foreground/70">Wedding Service</span>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={primaryImage}
            alt={service.serviceName}
            onError={() => setImgError(true)}
            className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-104"
          />
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <Badge className="bg-card/90 text-foreground backdrop-blur-xs font-medium text-[11px] shadow-xs hover:bg-card">
            {service.category}
          </Badge>
          {isVendorPremium && <PremiumBadge size="sm" />}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-1.5">
          <h3 className="font-serif font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {service.serviceName}
          </h3>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center text-xs text-muted-foreground gap-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground/80" />
              <span className="truncate">{service.location}</span>
            </div>
            <span className="text-sm sm:text-base font-serif font-bold text-primary whitespace-nowrap">
              ${service.price.toLocaleString()}
            </span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-1">
            {service.description}
          </p>
        </div>

        {/* Vendor Footer + CTA */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="w-7 h-7 border border-border">
              <AvatarImage src={service.vendorImage} alt={service.vendorName} />
              <AvatarFallback className="text-[10px] bg-blush text-primary font-medium">
                {vendorInitials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-foreground truncate max-w-[110px]">
              {service.vendorName || "Wedding Specialist"}
            </span>
          </div>

          <Link
            href={detailsHref}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full text-xs hover:bg-primary hover:text-white hover:border-primary shrink-0"
            )}
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  )
}
