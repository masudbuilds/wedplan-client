"use client"

import * as React from "react"
import Link from "next/link"
import {
  Package,
  CalendarCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
  Crown,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PremiumBadge } from "@/components/premium-badge"
import { useAuth } from "@/lib/auth-context"
import { getVendorStats } from "@/lib/api"
import { VendorStats } from "@/types"
import { VENDOR_NAV_ITEMS } from "@/lib/vendor-nav"
import { cn } from "@/lib/utils"

export default function VendorDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = React.useState<VendorStats | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)

  React.useEffect(() => {
    let active = true

    getVendorStats()
      .then((data) => {
        if (active) {
          setStats(data)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to load vendor dashboard statistics."
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

  const isPremium = stats?.isPremium ?? (user?.subscriptionPlan === "premium")
  const activeCount = stats?.activeServices ?? 0
  const freeLimit = 3

  const formatExpiry = (dateStr: string | null | undefined) => {
    if (!dateStr) return null
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

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
                      Free Tier ({freeLimit} services max)
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Vendor Partner
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  {user?.businessName || user?.name || "Wedding Artisan"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isPremium
                    ? "Your Premium membership gives you unlimited service packages, priority search placement, and verified gold badges."
                    : `You are on the Free plan (${activeCount} of ${freeLimit} active services used). Upgrade to Premium for unlimited service listings and top-tier placement.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!isPremium && (
                  <Link
                    href="/dashboard/vendor/subscription"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "border-accent/40 text-accent hover:bg-accent/10 rounded-full"
                    )}
                  >
                    <Crown className="w-4 h-4 mr-1.5" />
                    Upgrade to Premium
                  </Link>
                )}
                <Link
                  href="/dashboard/vendor/services/new"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-full shadow-xs"
                  )}
                >
                  <PlusCircle className="w-4 h-4 mr-1.5" />
                  Add Service
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Error State with Retry */}
          {error && !loading && (
            <div className="p-6 text-center border border-destructive/20 rounded-2xl bg-destructive/5 space-y-3">
              <AlertCircle className="w-6 h-6 text-destructive mx-auto" />
              <p className="text-sm text-foreground font-medium">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRetry} className="rounded-full">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Try Again
              </Button>
            </div>
          )}

          {/* Metric Stat Cards */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <StatCard
                title="Total Services"
                value={String(stats?.totalServices ?? 0)}
                description="All packages created"
                variant="default"
                icon={<Package className="w-5 h-5" />}
              />
              <StatCard
                title="Active Services"
                value={isPremium ? `${activeCount} / ∞` : `${activeCount} / ${freeLimit}`}
                description={
                  isPremium
                    ? "Unlimited listings active"
                    : `${activeCount} of ${freeLimit} active used`
                }
                variant="primary"
                icon={<Sparkles className="w-5 h-5" />}
              />
              <StatCard
                title="Pending Requests"
                value={String(stats?.pendingBookings ?? 0)}
                description="Awaiting your response"
                variant="gold"
                icon={<Clock className="w-5 h-5" />}
              />
              <StatCard
                title="Accepted Bookings"
                value={String(stats?.acceptedBookings ?? 0)}
                description="Confirmed weddings"
                variant="sage"
                icon={<CheckCircle2 className="w-5 h-5" />}
              />
              <StatCard
                title="Plan Status"
                value={isPremium ? "Premium" : "Free"}
                description={
                  isPremium && stats?.subscriptionExpiresAt
                    ? `Renews ${formatExpiry(stats.subscriptionExpiresAt)}`
                    : isPremium
                    ? "Active subscription"
                    : `${activeCount}/${freeLimit} slots used`
                }
                variant={isPremium ? "gold" : "default"}
                icon={<Crown className="w-5 h-5" />}
              />
            </div>
          )}

          {/* Free Tier Notice Card (If Free) */}
          {!loading && !isPremium && (
            <Card className="border-accent/30 bg-accent/5 shadow-xs">
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-accent" />
                    <h3 className="font-semibold text-sm text-foreground">
                      Free Plan: {activeCount} of {freeLimit} active services used
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeCount >= freeLimit
                      ? "You have reached the maximum limit of 3 active services for free accounts. Upgrade to Premium for unlimited service listings."
                      : `You can activate ${freeLimit - activeCount} more service listing on your Free plan. Upgrade for unlimited packages and premium badge.`}
                  </p>
                </div>
                <Link
                  href="/dashboard/vendor/subscription"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "rounded-full border-accent text-accent hover:bg-accent/10 text-xs shrink-0"
                  )}
                >
                  <Crown className="w-3.5 h-3.5 mr-1" />
                  Upgrade Now
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* My Services Card */}
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="font-serif text-lg">My Wedding Services</CardTitle>
                  <CardDescription>
                    Manage, edit, or toggle availability of your packages.
                  </CardDescription>
                </div>
                <Link
                  href="/dashboard/vendor/services"
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your services go through administrative approval before being showcased to couples. You can toggle live availability at any time.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href="/dashboard/vendor/services"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full text-xs")}
                  >
                    <Package className="w-3.5 h-3.5 mr-1.5" />
                    Manage Services ({stats?.totalServices ?? 0})
                  </Link>
                  <Link
                    href="/dashboard/vendor/services/new"
                    className={cn(buttonVariants({ variant: "default", size: "sm" }), "rounded-full text-xs")}
                  >
                    <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                    Add New Service
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Booking Requests Card */}
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="font-serif text-lg">Booking Requests</CardTitle>
                  <CardDescription>
                    Review wedding inquiries sent by couples.
                  </CardDescription>
                </div>
                <Link
                  href="/dashboard/vendor/bookings"
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Couples are waiting for your confirmation. Respond promptly to inquiries to increase your booking acceptance rate.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href="/dashboard/vendor/bookings"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full text-xs")}
                  >
                    <CalendarCheck className="w-3.5 h-3.5 mr-1.5" />
                    Review Inquiries ({stats?.pendingBookings ?? 0} pending)
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
