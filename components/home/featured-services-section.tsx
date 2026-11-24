"use client"

import * as React from "react"
import Link from "next/link"
import { AlertCircle, RotateCcw } from "lucide-react"
import { Service } from "@/types"
import { getFeaturedServices } from "@/lib/api"
import { SectionHeading } from "@/components/section-heading"
import { ServiceCard } from "@/components/service-card"
import { ServiceCardSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "@/components/empty-state"
import { FadeIn } from "@/components/motion-wrapper"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Section 2: Dynamic Featured Wedding Services from real backend API
export function FeaturedServicesSection() {
  const [services, setServices] = React.useState<Service[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)

  React.useEffect(() => {
    let active = true

    getFeaturedServices()
      .then((data) => {
        if (active) {
          setServices(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (active) {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to load featured services. Please try again."
          setError(msg)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [refreshTrigger])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        <FadeIn>
          <SectionHeading
            title="Featured Wedding Services"
            subtitle="Browse packages across photography, venues, florals, and attire with transparent pricing and direct inquiries."
          />
        </FadeIn>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error State with Retry */}
        {!loading && error && (
          <div className="p-8 text-center border border-destructive/20 rounded-2xl bg-destructive/5 space-y-4 max-w-md mx-auto">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
            <p className="text-sm font-medium text-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="rounded-full"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <EmptyState
            title="No Services Available"
            description="Our curators are currently onboarding new wedding artisans. Please check back shortly."
            actionLabel="Browse Catalog"
            actionHref="/services"
          />
        )}

        {/* Dynamic Services Grid */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <FadeIn key={service.id} delay={index * 0.08}>
                <ServiceCard
                  service={service}
                  isVendorPremium={service.vendor?.isPremium || service.isPremium}
                />
              </FadeIn>
            ))}
          </div>
        )}

        {/* View All Services Link */}
        <div className="mt-8 text-center">
          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full px-8 hover:bg-primary hover:text-white hover:border-primary shadow-xs"
            )}
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}
