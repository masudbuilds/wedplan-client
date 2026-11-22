"use client"

import * as React from "react"
import Link from "next/link"
import { Users, Layers, Receipt, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { DevJwtTester } from "@/components/dashboard/dev-jwt-tester"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { NavItem } from "@/types"

const ADMIN_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard Overview", href: "/dashboard/admin", icon: "overview" },
  { title: "User Management", href: "/dashboard/admin/users", icon: "users" },
  { title: "Service Moderation", href: "/dashboard/admin/services", icon: "moderation" },
  { title: "Platform Transactions", href: "/dashboard/admin/transactions", icon: "transactions" },
]

export default function AdminDashboardPage() {
  const { user } = useAuth()

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <DashboardShell
        navItems={ADMIN_NAV_ITEMS}
        title="Super Admin Portal"
        subtitle="Manage users and accounts, moderate vendor packages, and oversee system operations."
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
                  Welcome, {user?.name || "Admin"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Review new vendor submissions, monitor platform registrations, and audit Stripe booking payments across the ecosystem.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  render={
                    <Link href="/dashboard/admin/services" className="rounded-full shadow-xs">
                      <Layers className="w-4 h-4 mr-1.5" />
                      Review Services
                    </Link>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <StatCard
              title="Platform Users"
              value="1"
              description="Active accounts"
              variant="default"
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard
              title="Pending Reviews"
              value="0"
              description="Services awaiting approval"
              variant="gold"
              icon={<Layers className="w-5 h-5" />}
            />
            <StatCard
              title="Total Bookings"
              value="0"
              description="Across all categories"
              variant="primary"
              icon={<CheckCircle2 className="w-5 h-5" />}
            />
            <StatCard
              title="Gross Volume"
              value="$0"
              description="Total transactions"
              variant="sage"
              icon={<Receipt className="w-5 h-5" />}
            />
          </div>

          {/* Moderation Queue Quick Link */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="font-serif text-lg">System Quick Links</CardTitle>
                <CardDescription>
                  Jump directly to administrative operations.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/dashboard/admin/users"
                className="p-4 rounded-xl border border-border/80 hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <Users className="w-5 h-5 text-primary mb-2" />
                  <h4 className="font-semibold text-sm">User Directory</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Manage roles, inspect accounts, and toggle user block status.
                  </p>
                </div>
                <div className="text-xs text-primary font-medium flex items-center gap-1 mt-4">
                  Manage <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/dashboard/admin/services"
                className="p-4 rounded-xl border border-border/80 hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <Layers className="w-5 h-5 text-primary mb-2" />
                  <h4 className="font-semibold text-sm">Service Approvals</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Approve or decline new wedding packages submitted by vendors.
                  </p>
                </div>
                <div className="text-xs text-primary font-medium flex items-center gap-1 mt-4">
                  Review <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>

              <Link
                href="/dashboard/admin/transactions"
                className="p-4 rounded-xl border border-border/80 hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <Receipt className="w-5 h-5 text-primary mb-2" />
                  <h4 className="font-semibold text-sm">Transactions</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Audit Stripe payments and platform commission payouts.
                  </p>
                </div>
                <div className="text-xs text-primary font-medium flex items-center gap-1 mt-4">
                  Audit <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Developer JWT Verification Helper */}
          <DevJwtTester />
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
