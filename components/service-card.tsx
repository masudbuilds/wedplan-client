import Link from "next/link"
import { MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PremiumBadge } from "@/components/premium-badge"
import { Service } from "@/types"
import { cn } from "@/lib/utils"

interface ServiceCardProps {
  service: Service
  isVendorPremium?: boolean
}

// Photo-first service card with pricing, vendor badge, and details CTA
export function ServiceCard({ service, isVendorPremium }: ServiceCardProps) {
  const primaryImage =
    service.images?.[0] ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"

  const vendorInitials = service.vendorName
    ? service.vendorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "WP"

  return (
    <Card className="group overflow-hidden rounded-2xl border border-border/70 bg-card card-hover-lift shadow-xs flex flex-col h-full">
      {/* Photo Header */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted">
        <img
          src={primaryImage}
          alt={service.serviceName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <Badge className="bg-card/90 text-foreground backdrop-blur-xs font-medium text-[11px] shadow-xs hover:bg-card">
            {service.category}
          </Badge>
          {isVendorPremium && <PremiumBadge size="sm" />}
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-serif font-bold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {service.serviceName}
            </h3>
            <span className="text-sm font-semibold text-primary whitespace-nowrap">
              ${service.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-muted-foreground/80" />
            <span className="line-clamp-1">{service.location}</span>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
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
              {service.vendorName || "Verified Vendor"}
            </span>
          </div>

          <Link
            href={`/services/${service.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-full text-xs hover:bg-primary hover:text-white hover:border-primary shrink-0"
            )}
          >
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
