"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { ProfileSettingsForm } from "@/components/profile-settings-form"
import { useAuth } from "@/lib/auth-context"
import { NavItem } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

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
        <div className="max-w-2xl">
          {isLoading || !user ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          ) : (
            <ProfileSettingsForm user={user} />
          )}
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
