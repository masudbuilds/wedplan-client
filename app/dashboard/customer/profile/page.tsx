"use client"

import * as React from "react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { ProfileSettingsForm } from "@/components/profile-settings-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { NavItem } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const CUSTOMER_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard Overview", href: "/dashboard/customer", icon: "overview" },
  { title: "My Bookings", href: "/dashboard/customer/bookings", icon: "bookings" },
  { title: "Profile Settings", href: "/dashboard/customer/profile", icon: "profile" },
]

export default function CustomerProfilePage() {
  const { user, isLoading } = useAuth()

  return (
    <RoleGuard allowedRoles={["customer"]}>
      <DashboardShell
        navItems={CUSTOMER_NAV_ITEMS}
        title="Profile Settings"
        subtitle="Manage your personal details, contact identity, and wedding planner avatar."
      >
        <div className="max-w-3xl space-y-6">
          {isLoading || !user ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          ) : (
            <>
              {/* Account Identity Summary Bar */}
              <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <Avatar className="w-12 h-12 border border-border shrink-0">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="bg-blush text-primary-text text-sm font-medium">
                      {(user.name || "WP").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground truncate">
                        {user.name}
                      </h2>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blush text-primary-text">
                        Customer Account
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard/customer/bookings"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "rounded-full text-xs h-9 px-4 shrink-0 self-start sm:self-auto"
                  )}
                >
                  My Bookings
                </Link>
              </section>

              <ProfileSettingsForm
                user={user}
                className="rounded-2xl border border-border shadow-none ring-0 py-6 gap-6"
              />
            </>
          )}
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
