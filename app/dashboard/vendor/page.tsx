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
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { Button, buttonVariants } from "@/components/ui/button"
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
  const capacityPercent = Math.min(100, Math.round((activeCount / freeLimit) * 100))

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

  const kpiItems = [
    {
      title: "Total Services",
      value: String(stats?.totalServices ?? 0),
      description: "All packages created",
      icon: <Package className="w-4 h-4" />,
      iconClass: "bg-muted text-foreground",
    },
    {
      title: "Active Services",
      value: isPremium ? `${activeCount} / ∞` : `${activeCount} / ${freeLimit}`,
      description: isPremium
        ? "Unlimited listings active"
        : `${activeCount} of ${freeLimit} active used`,
      icon: <Sparkles className="w-4 h-4" />,
      iconClass: "bg-blush text-primary-text",
    },
    {
      title: "Pending Requests",
      value: String(stats?.pendingBookings ?? 0),
      description: "Awaiting your response",
      icon: <Clock className="w-4 h-4" />,
      iconClass: "bg-[#C9A66B]/15 text-gold-text",
    },
    {
      title: "Accepted Bookings",
      value: String(stats?.acceptedBookings ?? 0),
      description: "Confirmed weddings",
      icon: <CheckCircle2 className="w-4 h-4" />,
      iconClass: "bg-sage text-sage-foreground",
    },
    {
      title: "Plan Status",
      value: isPremium ? "Premium" : "Free",
      description:
        isPremium && stats?.subscriptionExpiresAt
          ? `Renews ${formatExpiry(stats.subscriptionExpiresAt)}`
          : isPremium
          ? "Active subscription"
          : `${activeCount}/${freeLimit} slots used`,
      icon: <Crown className="w-4 h-4" />,
      iconClass: isPremium
        ? "bg-[#C9A66B]/15 text-gold-text"
        : "bg-muted text-muted-foreground",
    },
  ]

  return (
    <RoleGuard allowedRoles={["vendor"]}>
      <DashboardShell
        navItems={VENDOR_NAV_ITEMS}
        title="Vendor Studio Portal"
        subtitle="Manage your wedding listings, review client booking requests, and manage your subscription."
      >
        <div className="space-y-6 max-w-5xl">
          {/* Welcome Banner */}
          <section
            className={cn(
              "rounded-2xl border p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5",
              isPremium
                ? "border-[#C9A66B]/60 bg-linear-to-r from-[#C9A66B]/10 via-card to-card"
                : "border-border bg-linear-to-r from-blush/45 via-card to-card"
            )}
          >
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                {isPremium ? (
                  <PremiumBadge size="sm" />
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-card border border-border text-foreground">
                    Free Tier ({freeLimit} services max)
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  Vendor Partner
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {user?.businessName || user?.name || "Wedding Artisan"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isPremium
                  ? "Your Premium membership gives you unlimited service packages, priority search placement, and gold premium badges."
                  : `You are on the Free plan (${activeCount} of ${freeLimit} active services used). Upgrade to Premium for unlimited service listings and top-tier placement.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {!isPremium && (
                <Link
                  href="/dashboard/vendor/subscription"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "border-[#C9A66B]/60 text-gold-text hover:bg-[#C9A66B]/10 rounded-full text-xs h-10 px-4"
                  )}
                >
                  <Crown className="w-3.5 h-3.5 mr-1.5 text-[#C9A66B]" />
                  Upgrade to Premium
                </Link>
              )}
              <Link
                href="/dashboard/vendor/services/new"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "rounded-full shadow-xs text-xs h-10 px-5"
                )}
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                Add Service
              </Link>
            </div>
          </section>

          {/* Error State with Retry */}
          {error && !loading && (
            <div className="p-8 text-center border border-destructive/25 rounded-2xl bg-card space-y-3">
              <AlertCircle className="w-7 h-7 text-destructive mx-auto" />
              <p className="text-sm text-foreground font-medium">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRetry} className="rounded-full text-xs">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Try Again
              </Button>
            </div>
          )}

          {/* Metric Stat Cards */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : (
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {kpiItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex flex-col justify-between gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                        item.iconClass
                      )}
                    >
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-serif font-bold text-foreground tabular-nums">
                      {item.value}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Free Tier Notice Strip (If Free) */}
          {!loading && !isPremium && (
            <section className="rounded-2xl border border-[#C9A66B]/50 bg-[#C9A66B]/6 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1 w-full">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#C9A66B] shrink-0" />
                  <h3 className="font-semibold text-sm text-foreground">
                    Free Plan: {activeCount} of {freeLimit} active services used
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeCount >= freeLimit
                    ? "You have reached the maximum limit of 3 active services for free accounts. Upgrade to Premium for unlimited service listings."
                    : `You can activate ${freeLimit - activeCount} more service listing on your Free plan. Upgrade for unlimited packages and premium badge.`}
                </p>
                <div className="w-full max-w-xs h-1.5 rounded-full bg-border/80 overflow-hidden pt-0">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      activeCount >= freeLimit ? "bg-primary" : "bg-[#C9A66B]"
                    )}
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
              </div>
              <Link
                href="/dashboard/vendor/subscription"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-full border-[#C9A66B]/60 text-gold-text hover:bg-[#C9A66B]/15 text-xs shrink-0 h-9 px-4"
                )}
              >
                <Crown className="w-3.5 h-3.5 mr-1.5 text-[#C9A66B]" />
                Upgrade Now
              </Link>
            </section>
          )}

          {/* Quick Actions Navigation Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* My Services Card */}
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">
                      My Wedding Services
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Manage, edit, or toggle availability of your packages.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/vendor/services"
                    className="inline-flex items-center gap-1 text-xs text-primary-text font-medium hover:underline shrink-0"
                  >
                    View all
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/70">
                  Your services go through administrative approval before being showcased to couples. You can toggle live availability at any time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/dashboard/vendor/services"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full text-xs h-9 px-4")}
                >
                  <Package className="w-3.5 h-3.5 mr-1.5" />
                  Manage Services ({stats?.totalServices ?? 0})
                </Link>
                <Link
                  href="/dashboard/vendor/services/new"
                  className={cn(buttonVariants({ variant: "default", size: "sm" }), "rounded-full text-xs h-9 px-4")}
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                  Add New Service
                </Link>
              </div>
            </div>

            {/* Booking Requests Card */}
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">
                      Booking Requests
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Review wedding inquiries sent by couples.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/vendor/bookings"
                    className="inline-flex items-center gap-1 text-xs text-primary-text font-medium hover:underline shrink-0"
                  >
                    View all
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/70">
                  Couples are waiting for your confirmation. Respond promptly to inquiries to increase your booking acceptance rate.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  href="/dashboard/vendor/bookings"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full text-xs h-9 px-4")}
                >
                  <CalendarCheck className="w-3.5 h-3.5 mr-1.5 text-primary-text" />
                  Review Inquiries ({stats?.pendingBookings ?? 0} pending)
                </Link>
              </div>
            </div>
          </section>
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
