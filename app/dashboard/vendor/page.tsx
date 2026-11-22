"use client"

import * as React from "react"
import Link from "next/link"
import { Package, CalendarCheck, DollarSign, PlusCircle, Crown, ArrowRight } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { DevJwtTester } from "@/components/dashboard/dev-jwt-tester"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PremiumBadge } from "@/components/premium-badge"
import { useAuth } from "@/lib/auth-context"
import { NavItem } from "@/types"

const VENDOR_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard Overview", href: "/dashboard/vendor", icon: "overview" },
  { title: "My Services", href: "/dashboard/vendor/services", icon: "services" },
  { title: "Add Service", href: "/dashboard/vendor/services/new", icon: "add-service" },
  { title: "Booking Requests", href: "/dashboard/vendor/bookings", icon: "bookings" },
  { title: "Subscription Plan", href: "/dashboard/vendor/subscription", icon: "subscription" },
  { title: "Business Profile", href: "/dashboard/vendor/profile", icon: "profile" },
]

export default function VendorDashboardPage() {
  const { user } = useAuth()
  const isPremium = user?.subscriptionPlan === "premium"

  return (
    <RoleGuard allowedRoles={["vendor"]}>
      <DashboardShell
        navItems={VENDOR_NAV_ITEMS}
        title="Vendor Studio Portal"
        subtitle="Manage your wedding listings, review client booking requests, and manage your subscription."
      >
        <div className="space-y-6">
          {/* Welcome Banner */}
          <Card className="border-primary/20 bg-gradient-to-r from-blush/60 via-card to-blush/30 shadow-xs overflow-hidden">
            <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  {isPremium ? (
                    <PremiumBadge />
                  ) : (
                    <Badge variant="outline" className="border-border text-muted-foreground text-[11px] px-2.5 py-0.5">
                      Free Tier (3 services max)
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Vendor Partner
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  {user?.businessName || user?.name || "Wedding Vendor"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isPremium
                    ? "Enjoy unlimited service packages, priority search placement, and prominent Gold badges."
                    : "You are currently on the Free plan. Upgrade to Premium for unlimited service listings and top-tier placement."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!isPremium && (
                  <Button
                    variant="outline"
                    className="border-accent/40 text-accent hover:bg-accent/10 rounded-full"
                    render={
                      <Link href="/dashboard/vendor/subscription">
                        <Crown className="w-4 h-4 mr-1.5" />
                        Upgrade Plan
                      </Link>
                    }
                  />
                )}
                <Button
                  render={
                    <Link href="/dashboard/vendor/services/new" className="rounded-full shadow-xs">
                      <PlusCircle className="w-4 h-4 mr-1.5" />
                      Add Service
                    </Link>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Active Packages"
              value={isPremium ? "0 / ∞" : "0 / 3"}
              description={isPremium ? "Unlimited listings active" : "Free tier service limit"}
              variant="primary"
              icon={<Package className="w-5 h-5" />}
            />
            <StatCard
              title="Booking Inquiries"
              value="0"
              description="Awaiting your response"
              variant="gold"
              icon={<CalendarCheck className="w-5 h-5" />}
            />
            <StatCard
              title="Total Revenue"
              value="$0"
              description="From confirmed bookings"
              variant="sage"
              icon={<DollarSign className="w-5 h-5" />}
            />
          </div>

          {/* Service Management Quick Card */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="font-serif text-lg">Your Wedding Listings</CardTitle>
                <CardDescription>
                  Services will be submitted for admin review before going live.
                </CardDescription>
              </div>
              <Link
                href="/dashboard/vendor/services"
                className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="p-8 border border-dashed border-border/80 rounded-2xl text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-blush text-primary flex items-center justify-center mx-auto">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">No services published yet</p>
                  <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
                    Create your first wedding package with descriptions, pricing, and high-resolution photos.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  render={
                    <Link href="/dashboard/vendor/services/new" className="rounded-full">
                      <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                      Publish First Service
                    </Link>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Developer JWT Verification Helper */}
          <DevJwtTester />
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
