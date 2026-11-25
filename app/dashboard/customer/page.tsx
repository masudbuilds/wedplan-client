"use client"

import * as React from "react"
import Link from "next/link"
import {
  CalendarCheck,
  Heart,
  Sparkles,
  Clock,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Ban,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { getCustomerStats, getMyBookings } from "@/lib/api"
import { Booking, CustomerStats, NavItem } from "@/types"

const CUSTOMER_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard Overview", href: "/dashboard/customer", icon: "overview" },
  { title: "My Bookings", href: "/dashboard/customer/bookings", icon: "bookings" },
  { title: "Profile Settings", href: "/dashboard/customer/profile", icon: "profile" },
]

export default function CustomerDashboardPage() {
  const { user } = useAuth()

  const [stats, setStats] = React.useState<CustomerStats | null>(null)
  const [recentBookings, setRecentBookings] = React.useState<Booking[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)

  React.useEffect(() => {
    let active = true

    Promise.all([getCustomerStats(), getMyBookings()])
      .then(([statsData, bookingsData]) => {
        if (active) {
          setStats(statsData)
          setRecentBookings(bookingsData.slice(0, 3))
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to load customer dashboard data."
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

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-sage text-sage-foreground border border-sage-foreground/15 hover:bg-sage text-[11px] font-medium px-2.5 py-0.5">
            Accepted
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30 hover:bg-amber-500/15 text-[11px] font-medium px-2.5 py-0.5">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="text-[11px] font-medium px-2.5 py-0.5">
            Rejected
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-muted-foreground text-[11px] font-medium px-2.5 py-0.5">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const kpiItems = [
    {
      title: "Total Inquiries",
      value: String(stats?.totalBookings ?? 0),
      description: "Submitted booking requests",
      icon: <CalendarCheck className="w-4 h-4" />,
      iconClass: "bg-muted text-foreground",
    },
    {
      title: "Pending Requests",
      value: String(stats?.pending ?? 0),
      description: "Awaiting vendor response",
      icon: <Clock className="w-4 h-4" />,
      iconClass: "bg-[#C9A66B]/15 text-gold-text",
    },
    {
      title: "Accepted Bookings",
      value: String(stats?.accepted ?? 0),
      description: "Confirmed wedding artisans",
      icon: <CheckCircle2 className="w-4 h-4" />,
      iconClass: "bg-sage text-sage-foreground",
    },
    {
      title: "Rejected",
      value: String(stats?.rejected ?? 0),
      description: "Rejected by vendor",
      icon: <XCircle className="w-4 h-4" />,
      iconClass: "bg-blush text-primary-text",
    },
    {
      title: "Cancelled",
      value: String(stats?.cancelled ?? 0),
      description: "Withdrawn by you",
      icon: <Ban className="w-4 h-4" />,
      iconClass: "bg-muted text-muted-foreground",
    },
  ]

  return (
    <RoleGuard allowedRoles={["customer"]}>
      <DashboardShell
        navItems={CUSTOMER_NAV_ITEMS}
        title="Planning Dashboard"
        subtitle="Manage your wedding bookings, track inquiries, and plan your special celebration."
      >
        <div className="space-y-6 max-w-5xl">
          {/* Welcome Banner */}
          <section className="rounded-2xl border border-border bg-gradient-to-r from-blush/45 via-card to-card p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blush text-primary-text">
                  Customer Account
                </span>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" /> Ready to plan
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Welcome back, {user?.name || "Customer"}!
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Explore top wedding venues, photographers, and stylists, or check the status of your existing booking inquiries.
              </p>
            </div>

            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-full shadow-xs text-xs h-10 px-5 shrink-0"
              )}
            >
              <Heart className="w-3.5 h-3.5 mr-1.5 fill-current" />
              Browse Services
            </Link>
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

          {/* 3 Most Recent Bookings Section */}
          <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">
                  Recent Booking Requests
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your latest inquiries submitted to wedding service specialists.
                </p>
              </div>
              <Link
                href="/dashboard/customer/bookings"
                className="inline-flex items-center gap-1 text-xs text-primary-text font-medium hover:underline shrink-0"
              >
                View all bookings
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-10 border border-dashed border-border rounded-2xl text-center space-y-3">
                <div className="w-11 h-11 rounded-full bg-blush text-primary-text flex items-center justify-center mx-auto">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg font-bold text-foreground">
                    No booking requests submitted yet
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Explore our directory of photographers, venues, and caterers to send your first inquiry.
                  </p>
                </div>
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "rounded-full text-xs h-9 px-4"
                  )}
                >
                  <Heart className="w-3.5 h-3.5 mr-1.5 text-primary-text" />
                  Explore Wedding Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-xl border border-border bg-background/60 hover:bg-muted/35 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Service Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/70">
                        {booking.serviceImage ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={booking.serviceImage}
                            alt={booking.serviceName || "Service"}
                            className="block w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            WP
                          </div>
                        )}
                      </div>

                      {/* Booking Meta */}
                      <div className="space-y-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-snug truncate">
                          {booking.serviceName || "Service no longer available"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          Vendor:{" "}
                          <span className="font-medium text-foreground">
                            {booking.vendorName || booking.vendor?.businessName || booking.vendor?.name || "WedPlan Partner"}
                          </span>
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-primary-text" />
                            {booking.eventDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary-text" />
                            {booking.eventLocation}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Link */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-border/60 shrink-0">
                      {getStatusBadge(booking.status)}
                      <Link
                        href="/dashboard/customer/bookings"
                        className="text-xs text-primary-text font-medium hover:underline inline-block"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
