"use client"

import * as React from "react"
import { CalendarCheck, DollarSign, Package, Users } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { StatCard } from "@/components/stat-card"
import { ServiceCard } from "@/components/service-card"
import { CategoryTile } from "@/components/category-tile"
import { EmptyState } from "@/components/empty-state"
import {
  ServiceCardSkeleton,
  StatCardSkeleton,
} from "@/components/loading-skeleton"
import { FadeIn } from "@/components/motion-wrapper"
import {
  AuthSwitcher,
  TokenSwatches,
  PrimitivesDemo,
} from "./demo-sections"
import { SAMPLE_SERVICES, ALL_CATEGORIES } from "./sample-data"

export default function DesignPreviewPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl space-y-16">
      {/* Page Title & Intro */}
      <FadeIn>
        <SectionHeading
          eyebrow="Foundation & Design System"
          title="WedPlan Editorial Design System"
          subtitle="A preview of colors, typography, ShadCN UI primitives, and role-based components tailored for a romantic wedding marketplace."
        />
      </FadeIn>

      {/* Interactive Role Switcher */}
      <FadeIn delay={0.1}>
        <AuthSwitcher />
      </FadeIn>

      {/* Color Tokens */}
      <FadeIn delay={0.1}>
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-xl text-foreground">
            Design Tokens & Palette
          </h3>
          <TokenSwatches />
        </div>
      </FadeIn>

      {/* Stat Cards Showcase */}
      <FadeIn delay={0.1}>
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-xl text-foreground">
            Dashboard Metric Cards
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Bookings"
              value="18"
              description="3 pending inquiries"
              variant="primary"
              icon={<CalendarCheck className="w-5 h-5" />}
            />
            <StatCard
              title="Active Services"
              value="3 / 3"
              description="Free plan limit reached"
              variant="gold"
              icon={<Package className="w-5 h-5" />}
            />
            <StatCard
              title="Total Revenue"
              value="$14,250"
              description="+18% from last month"
              variant="sage"
              icon={<DollarSign className="w-5 h-5" />}
            />
            <StatCard
              title="Registered Users"
              value="342"
              description="Vendors & couples"
              variant="default"
              icon={<Users className="w-5 h-5" />}
            />
          </div>
        </div>
      </FadeIn>

      {/* Categories Showcase */}
      <FadeIn delay={0.1}>
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-xl text-foreground">
            Wedding Service Categories (PDF Spec)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ALL_CATEGORIES.map((cat, idx) => (
              <CategoryTile key={cat} name={cat} itemCount={12 + idx * 3} />
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Service Cards Showcase */}
      <FadeIn delay={0.1}>
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-xl text-foreground">
            Photo-First Service Cards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_SERVICES.map((serv, idx) => (
              <ServiceCard
                key={serv.id}
                service={serv}
                isVendorPremium={idx === 0}
              />
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Loading Skeletons */}
      <FadeIn delay={0.1}>
        <div className="space-y-4">
          <h3 className="font-serif font-bold text-xl text-foreground">
            Loading Skeleton States
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceCardSkeleton />
            <StatCardSkeleton />
            <EmptyState
              title="No Booking Requests Yet"
              description="When couples send inquiries for your services, they will appear here."
              actionLabel="Explore Services"
              actionHref="/services"
            />
          </div>
        </div>
      </FadeIn>

      {/* ShadCN Primitives & Interactivity */}
      <FadeIn delay={0.1}>
        <PrimitivesDemo />
      </FadeIn>
    </div>
  )
}
