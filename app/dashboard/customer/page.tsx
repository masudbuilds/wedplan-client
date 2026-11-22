"use client"

import * as React from "react"
import Link from "next/link"
import { CalendarCheck, Heart, Sparkles, Clock, ArrowRight } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { DevJwtTester } from "@/components/dashboard/dev-jwt-tester"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { NavItem } from "@/types"

const CUSTOMER_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard Overview", href: "/dashboard/customer", icon: "overview" },
  { title: "My Bookings", href: "/dashboard/customer/bookings", icon: "bookings" },
  { title: "Profile Settings", href: "/dashboard/customer/profile", icon: "profile" },
]

export default function CustomerDashboardPage() {
  const { user } = useAuth()

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

          {/* Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Active Bookings"
              value="0"
              description="Confirmed wedding vendors"
              variant="primary"
              icon={<CalendarCheck className="w-5 h-5" />}
            />
            <StatCard
              title="Pending Inquiries"
              value="0"
              description="Awaiting vendor response"
              variant="gold"
              icon={<Clock className="w-5 h-5" />}
            />
            <StatCard
              title="Saved Services"
              value="8"
              description="Available wedding options"
              variant="sage"
              icon={<Heart className="w-5 h-5" />}
            />
          </div>

          {/* Planning Checklist / Getting Started */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader>
              <CardTitle className="font-serif text-lg">Next Steps for Your Wedding</CardTitle>
              <CardDescription>
                Follow our curated steps to turn your dream wedding into a reality.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-blush text-primary flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Choose Your Wedding Venue</p>
                    <p className="text-xs text-muted-foreground">
                      Browse top-rated venues and check their availability dates.
                    </p>
                  </div>
                </div>
                <Link
                  href="/services?category=Wedding%20Venues"
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-blush text-primary flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Book an Editorial Photographer</p>
                    <p className="text-xs text-muted-foreground">
                      Capture timeless memories with verified wedding videographers and photographers.
                    </p>
                  </div>
                </div>
                <Link
                  href="/services?category=Photography%20%26%20Videography"
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>
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
