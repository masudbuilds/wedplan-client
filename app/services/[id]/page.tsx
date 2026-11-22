"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  MapPin,
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronRight,
  AlertCircle,
  Lock,
} from "lucide-react"
import { Service } from "@/types"
import { getServiceById } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PremiumBadge } from "@/components/premium-badge"
import { ImageGallery } from "@/components/services/image-gallery"
import { BookingDialog } from "@/components/services/booking-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { FadeIn } from "@/components/motion-wrapper"
import { cn } from "@/lib/utils"

interface ServiceDetailsPageProps {
  params: Promise<{ id: string }>
}

export default function ServiceDetailsPage({ params }: ServiceDetailsPageProps) {
  const { id } = React.use(params)
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()

  const [service, setService] = React.useState<Service | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<boolean>(false)

  // 1. Enforce Authentication Access Rule: Redirect unauthenticated users
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/sign-in?redirect=${encodeURIComponent(`/services/${id}`)}`)
    }
  }, [user, authLoading, id, router])

  // 2. Fetch Service Details
  React.useEffect(() => {
    getServiceById(id)
      .then((data) => {
        if (!data) {
          setError(true)
        } else {
          setService(data)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  // Auth Loading Skeleton (prevents flash of content)
  if (authLoading || (!user && !error)) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl space-y-8">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="w-full aspect-16/10 rounded-2xl" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div>
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  // 3. Error / Invalid ID State
  if (error || (!loading && !service)) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Service Not Found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This wedding service does not exist, has been removed, or is currently pending administrator approval.
          </p>
        </div>
        <Link
          href="/services"
          className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6 gap-2")}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Services</span>
        </Link>
      </div>
    )
  }

  if (loading || !service) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-6xl space-y-6">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 aspect-16/10 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    )
  }

  // Role checks for booking rules
  const isVendor = user?.role === "vendor"
  const isAdmin = user?.role === "admin"
  const isCustomer = user?.role === "customer"
  const isOwnService = isVendor && user?.id === service.vendorId
  const isVendorPremium = service.vendorId === "vend-1" || service.vendorName?.includes("Julian")

  const vendorInitials = service.vendorName
    ? service.vendorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "WP"

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl space-y-8">
      {/* Breadcrumb & Return Link */}
      <nav className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
        <Link href="/services" className="hover:text-primary transition-colors">
          Services
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
        <span className="text-primary font-medium">{service.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 hidden sm:inline" />
        <span className="text-foreground truncate max-w-[200px] hidden sm:inline">
          {service.serviceName}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
        {/* Left Column: Media & Service Information */}
        <div className="lg:col-span-2 space-y-8">
          <FadeIn>
            <ImageGallery images={service.images} title={service.serviceName} />
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-blush text-primary border-primary/20 text-xs px-3 py-1 font-semibold">
                  {service.category}
                </Badge>
                {isVendorPremium && <PremiumBadge />}
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
                {service.serviceName}
              </h1>

              <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{service.location}</span>
              </div>
            </div>
          </FadeIn>

          {/* Description Section */}
          <FadeIn delay={0.15}>
            <div className="space-y-3 pt-4 border-t border-border/70">
              <h2 className="font-serif font-bold text-xl text-foreground">
                About This Service
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>
          </FadeIn>

          {/* Vendor Profile Card */}
          <FadeIn delay={0.2}>
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <Avatar className="w-12 h-12 border border-border">
                  <AvatarImage src={service.vendorImage} alt={service.vendorName} />
                  <AvatarFallback className="bg-blush text-primary font-semibold">
                    {vendorInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base text-foreground">
                      {service.vendorName}
                    </h3>
                    {isVendorPremium && <PremiumBadge size="sm" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Verified Wedding Specialist • Fast Response Rate
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-4">
          <Card className="border border-border/80 bg-card shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-6">
              {/* Price Banner */}
              <div className="space-y-1 pb-4 border-b border-border/70">
                <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                  Starting Investment
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-primary">
                    ${service.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">/ package</span>
                </div>
              </div>

              {/* Confidence Points */}
              <div className="space-y-2.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                  <span>Verified Artisan & Date Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Direct Vendor Communication</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A66B] shrink-0" />
                  <span>No Booking Intermediary Fees</span>
                </div>
              </div>

              {/* Role-Based Booking Actions */}
              <div className="pt-2 space-y-2">
                {isCustomer && user && (
                  <BookingDialog service={service} user={user} />
                )}

                {isVendor && (
                  <div className="space-y-2">
                    <Button disabled className="w-full rounded-full opacity-60">
                      <Lock className="w-4 h-4 mr-2" />
                      Request Booking
                    </Button>
                    <p className="text-[11px] text-center text-amber-600 dark:text-amber-400 font-medium">
                      {isOwnService
                        ? "You cannot book your own service."
                        : "Vendors cannot book services."}
                    </p>
                  </div>
                )}

                {isAdmin && (
                  <div className="space-y-2">
                    <Button disabled className="w-full rounded-full opacity-60">
                      <Lock className="w-4 h-4 mr-2" />
                      Request Booking
                    </Button>
                    <p className="text-[11px] text-center text-muted-foreground font-medium">
                      Admins cannot submit booking requests.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link
              href="/services"
              className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Return to all services
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
