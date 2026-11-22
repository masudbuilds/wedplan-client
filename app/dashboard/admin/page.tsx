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
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { DevJwtTester } from "@/components/dashboard/dev-jwt-tester"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <DashboardShell
        navItems={ADMIN_NAV_ITEMS}
        title="Admin Control Center"
        subtitle="Manage platform users, moderate vendor services, and monitor Stripe subscription payments."
      >
        <div className="space-y-6">
          {/* Welcome Banner */}
          <Card className="border-primary/20 bg-gradient-to-r from-blush/60 via-card to-blush/30 shadow-xs overflow-hidden">
            <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <Badge className="bg-foreground text-background border-none text-[11px] px-2.5 py-0.5">
                    Platform Administrator
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Full Access
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  Welcome back, {user?.name || "Admin"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Review new vendor submissions, manage user account permissions, and audit platform transactions.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/dashboard/admin/services?status=pending"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-full shadow-xs text-xs"
                  )}
                >
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  Review Pending Services
                  {stats && stats.pendingServices > 0 && (
                    <span className="ml-1.5 px-2 py-0.2 bg-white/20 rounded-full font-bold">
                      {stats.pendingServices}
                    </span>
                  )}
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

          {/* Metric Stat Cards Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {/* 1. Total Registered Users */}
              <StatCard
                title="Total Users"
                value={String(stats?.totalUsers ?? 0)}
                description="Registered accounts"
                variant="default"
                icon={<Users className="w-5 h-5" />}
              />

              {/* 2. Total Vendors */}
              <StatCard
                title="Total Vendors"
                value={String(stats?.totalVendors ?? 0)}
                description="Wedding professionals"
                variant="primary"
                icon={<Store className="w-5 h-5" />}
              />

              {/* 3. Total Customers */}
              <StatCard
                title="Total Customers"
                value={String(stats?.totalCustomers ?? 0)}
                description="Engaged couples"
                variant="sage"
                icon={<Heart className="w-5 h-5" />}
              />

              {/* 4. Total Services */}
              <StatCard
                title="Total Services"
                value={String(stats?.totalServices ?? 0)}
                description="Platform packages"
                variant="default"
                icon={<Package className="w-5 h-5" />}
              />

              {/* 5. Pending Services (clickable link to filtered services) */}
              <Link
                href="/dashboard/admin/services?status=pending"
                className="group block transition-transform hover:scale-[1.02]"
              >
                <StatCard
                  title="Pending Services"
                  value={String(stats?.pendingServices ?? 0)}
                  description="Awaiting moderation →"
                  variant="gold"
                  icon={<Clock className="w-5 h-5" />}
                  className={cn(
                    (stats?.pendingServices ?? 0) > 0 &&
                      "ring-2 ring-amber-400/50 bg-amber-500/5 cursor-pointer"
                  )}
                />
              </Link>

              {/* 6. Total Transactions */}
              <StatCard
                title="Transactions"
                value={String(stats?.totalTransactions ?? 0)}
                description="Stripe payments logged"
                variant="primary"
                icon={<Receipt className="w-5 h-5" />}
              />
            </div>
          )}

          {/* System Quick Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Users */}
            <Link
              href="/dashboard/admin/users"
              className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blush text-primary flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    Manage Users
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Search users by name or email, filter by customer/vendor/admin, inspect details, and block/unblock accounts.
                  </p>
                </div>
              </div>
              <div className="text-xs text-primary font-medium flex items-center gap-1 mt-4 pt-3 border-t border-border/50">
                View User Directory <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Services Moderation */}
            <Link
              href="/dashboard/admin/services"
              className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    Manage Services
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Review pending listings, approve or reject wedding packages, change status, and delete inappropriate entries.
                  </p>
                </div>
              </div>
              <div className="text-xs text-primary font-medium flex items-center gap-1 mt-4 pt-3 border-t border-border/50">
                Moderate Services <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Transactions */}
            <Link
              href="/dashboard/admin/transactions"
              className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    Payment Transactions
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Audit platform Stripe billing records, premium vendor subscription payments, and status history (read only).
                  </p>
                </div>
              </div>
              <div className="text-xs text-primary font-medium flex items-center gap-1 mt-4 pt-3 border-t border-border/50">
                Audit Transactions <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>

          {/* Developer JWT Verification Helper */}
          <DevJwtTester />
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
