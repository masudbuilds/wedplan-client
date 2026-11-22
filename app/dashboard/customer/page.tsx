"use client"

import * as React from "react"
import Link from "next/link"
import {
  CalendarCheck,
  Heart,
  Sparkles,
  Clock,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Ban,
  MapPin,
  Calendar,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { DevJwtTester } from "@/components/dashboard/dev-jwt-tester"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
        return <Badge className="bg-emerald-600 text-white border-none">Accepted</Badge>
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-700 border-amber-300">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Declined</Badge>
      case "cancelled":
        return <Badge variant="outline" className="text-muted-foreground">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <RoleGuard allowedRoles={["customer"]}>
      <DashboardShell
        navItems={CUSTOMER_NAV_ITEMS}
        title="Planning Dashboard"
        subtitle="Manage your wedding bookings, track inquiries, and plan your special celebration."
      >
        <div className="space-y-6">
          {/* Welcome Banner */}
          <Card className="border-primary/20 bg-gradient-to-r from-blush/60 via-card to-blush/30 shadow-xs overflow-hidden">
            <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-white border-none text-[11px] px-2.5 py-0.5">
                    Couple Account
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-accent" /> Ready to plan
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  Welcome back, {user?.name || "Lovely Couple"}!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Explore top wedding venues, photographers, and stylists, or check the status of your existing booking inquiries.
                </p>
              </div>

              <Button
                render={
                  <Link href="/services" className="rounded-full shadow-xs">
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Browse Services
                  </Link>
                }
              />
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              <StatCard
                title="Total Inquiries"
                value={String(stats?.totalBookings ?? 0)}
                description="Submitted booking requests"
                variant="default"
                icon={<CalendarCheck className="w-5 h-5" />}
              />
              <StatCard
                title="Pending Requests"
                value={String(stats?.pending ?? 0)}
                description="Awaiting vendor response"
                variant="gold"
                icon={<Clock className="w-5 h-5" />}
              />
              <StatCard
                title="Accepted Bookings"
                value={String(stats?.accepted ?? 0)}
                description="Confirmed wedding artisans"
                variant="primary"
                icon={<CheckCircle2 className="w-5 h-5" />}
              />
              <StatCard
                title="Declined"
                value={String(stats?.rejected ?? 0)}
                description="Unavailable dates"
                variant="default"
                icon={<XCircle className="w-5 h-5" />}
              />
              <StatCard
                title="Cancelled"
                value={String(stats?.cancelled ?? 0)}
                description="Withdrawn by you"
                variant="sage"
                icon={<Ban className="w-5 h-5" />}
              />
            </div>
          )}

          {/* 3 Most Recent Bookings Section */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="font-serif text-lg">Recent Booking Requests</CardTitle>
                <CardDescription>
                  Your latest inquiries submitted to wedding service specialists.
                </CardDescription>
              </div>
              <Link
                href="/dashboard/customer/bookings"
                className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
              >
                View all bookings <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                  ))}
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="p-8 border border-dashed border-border/80 rounded-2xl text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-blush text-primary flex items-center justify-center mx-auto">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">No booking requests submitted yet</p>
                    <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
                      Explore our directory of photographers, venues, and caterers to send your first inquiry.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    render={
                      <Link href="/services" className="rounded-full">
                        <Heart className="w-3.5 h-3.5 mr-1.5" />
                        Explore Wedding Catalog
                      </Link>
                    }
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-xl border border-border/70 bg-card hover:bg-muted/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Service Thumbnail */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/60">
                          {booking.serviceImage ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={booking.serviceImage}
                              alt={booking.serviceName || "Service"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              WP
                            </div>
                          )}
                        </div>

                        {/* Booking Meta */}
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-foreground leading-snug">
                            {booking.serviceName || "Service no longer available"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Vendor:{" "}
                            <span className="font-medium text-foreground">
                              {booking.vendorName || booking.vendor?.businessName || booking.vendor?.name || "WedPlan Partner"}
                            </span>
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-primary" />
                              {booking.eventDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-primary" />
                              {booking.eventLocation}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Link */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                        {getStatusBadge(booking.status)}
                        <Link
                          href="/dashboard/customer/bookings"
                          className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                        >
                          Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Developer JWT Verification Helper */}
          <DevJwtTester />
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
