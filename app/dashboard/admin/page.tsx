"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  Store,
  Heart,
  Package,
  Clock,
  Receipt,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { Button, buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/auth-context"
import { getAdminStats } from "@/lib/api"
import { AdminStats } from "@/types"
import { ADMIN_NAV_ITEMS } from "@/lib/admin-nav"
import { cn } from "@/lib/utils"

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = React.useState<AdminStats | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)

  React.useEffect(() => {
    let active = true

    getAdminStats()
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
              : "Failed to load platform statistics."
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

  const pendingServicesCount = stats?.pendingServices ?? 0

  const kpiItems = [
    {
      title: "Total Users",
      value: String(stats?.totalUsers ?? 0),
      description: "Registered accounts",
      icon: <Users className="w-4 h-4" />,
      iconClass: "bg-muted text-foreground",
      href: "/dashboard/admin/users",
    },
    {
      title: "Total Vendors",
      value: String(stats?.totalVendors ?? 0),
      description: "Wedding professionals",
      icon: <Store className="w-4 h-4" />,
      iconClass: "bg-blush text-primary-text",
      href: "/dashboard/admin/users?role=vendor",
    },
    {
      title: "Total Customers",
      value: String(stats?.totalCustomers ?? 0),
      description: "Registered customers",
      icon: <Heart className="w-4 h-4" />,
      iconClass: "bg-sage text-sage-foreground",
      href: "/dashboard/admin/users?role=customer",
    },
    {
      title: "Total Services",
      value: String(stats?.totalServices ?? 0),
      description: "Platform packages",
      icon: <Package className="w-4 h-4" />,
      iconClass: "bg-muted text-foreground",
      href: "/dashboard/admin/services",
    },
    {
      title: "Pending Services",
      value: String(pendingServicesCount),
      description: "Awaiting moderation",
      icon: <Clock className="w-4 h-4" />,
      iconClass: "bg-[#C9A66B]/15 text-gold-text",
      href: "/dashboard/admin/services?status=pending",
      highlight: pendingServicesCount > 0,
    },
    {
      title: "Transactions",
      value: String(stats?.totalTransactions ?? 0),
      description: "Stripe payments logged",
      icon: <Receipt className="w-4 h-4" />,
      iconClass: "bg-blush text-primary-text",
      href: "/dashboard/admin/transactions",
    },
  ]

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <DashboardShell
        navItems={ADMIN_NAV_ITEMS}
        title="Admin Control Center"
        subtitle="Manage platform users, moderate vendor services, and monitor Stripe subscription payments."
      >
        <div className="space-y-6 max-w-6xl">
          {/* Welcome Banner */}
          <section className="rounded-2xl border border-border bg-gradient-to-r from-blush/45 via-card to-card p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-foreground text-background">
                  Platform Administrator
                </span>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary-text" /> Full Access
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Welcome back, {user?.name || "Admin"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Review new vendor submissions, manage user account permissions, and audit platform transactions.
              </p>
            </div>

            <Link
              href="/dashboard/admin/services?status=pending"
              className={cn(
                buttonVariants({ variant: "default" }),
                "rounded-full shadow-xs text-xs h-10 px-5 shrink-0"
              )}
            >
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Review Pending Services
              {stats && stats.pendingServices > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full font-semibold tabular-nums">
                  {stats.pendingServices}
                </span>
              )}
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

          {/* Metric Stat Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : (
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {kpiItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "rounded-2xl border bg-card p-4 sm:p-5 flex flex-col justify-between gap-3 transition-colors hover:border-primary/40",
                    item.highlight
                      ? "border-[#C9A66B]/80 bg-[#C9A66B]/[0.06]"
                      : "border-border"
                  )}
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
                </Link>
              ))}
            </section>
          )}

          {/* System Quick Links Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Users */}
            <Link
              href="/dashboard/admin/users"
              className="rounded-2xl border border-border bg-card hover:border-primary/45 p-6 transition-colors flex flex-col justify-between gap-5 group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blush text-primary-text flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary-text transition-colors">
                    Manage Users
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Search users by name or email, filter by customer/vendor/admin, inspect details, and block/unblock accounts.
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-primary-text font-medium pt-3 border-t border-border/70">
                View User Directory
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>

            {/* Services Moderation */}
            <Link
              href="/dashboard/admin/services"
              className="rounded-2xl border border-border bg-card hover:border-primary/45 p-6 transition-colors flex flex-col justify-between gap-5 group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#C9A66B]/15 text-gold-text flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary-text transition-colors">
                    Manage Services
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Review pending listings, approve or reject wedding packages, change status, and delete inappropriate entries.
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-primary-text font-medium pt-3 border-t border-border/70">
                Moderate Services
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>

            {/* Transactions */}
            <Link
              href="/dashboard/admin/transactions"
              className="rounded-2xl border border-border bg-card hover:border-primary/45 p-6 transition-colors flex flex-col justify-between gap-5 group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sage text-sage-foreground flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary-text transition-colors">
                    Payment Transactions
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Audit platform Stripe billing records, premium vendor subscription payments, and status history (read only).
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-primary-text font-medium pt-3 border-t border-border/70">
                Audit Transactions
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </section>
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
