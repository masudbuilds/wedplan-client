"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Service } from "@/types"
import { getFeaturedServices } from "@/lib/api"
import { SectionHeading } from "@/components/section-heading"
import { ServiceCard } from "@/components/service-card"
import { ServiceCardSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "@/components/empty-state"
import { FadeIn } from "@/components/motion-wrapper"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Section 2: Dynamic Featured Wedding Services
export function FeaturedServicesSection() {
  const [services, setServices] = React.useState<Service[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    // Load approved and active featured services
    getFeaturedServices()
      .then((data) => setServices(data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <FadeIn>
          <SectionHeading
            eyebrow="Handpicked Excellence"
            title="Featured Wedding Services"
            subtitle="Browse top-rated wedding specialists celebrated for artistry, reliability, and unforgettable memories."
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

        {/* Empty State */}
        {!loading && services.length === 0 && (
          <EmptyState
            title="No Services Available"
            description="Our curators are currently onboarding new wedding artisans. Please check back shortly."
            actionLabel="Browse Catalog"
            actionHref="/services"
          />
        )}

        {/* Dynamic Services Grid with Gentle Staggered Motion */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <FadeIn key={service.id} delay={index * 0.08}>
                <ServiceCard service={service} isVendorPremium={index % 2 === 0} />
              </FadeIn>
            ))}
          </div>
        )}

        {/* View All Services Link */}
        <FadeIn delay={0.2}>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-8 hover:bg-primary hover:text-white hover:border-primary gap-2"
              )}
            >
              <span>View All Wedding Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
