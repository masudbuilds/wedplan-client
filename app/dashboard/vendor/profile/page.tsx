"use client"

import * as React from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { ProfileSettingsForm } from "@/components/profile-settings-form"
import { useAuth } from "@/lib/auth-context"
import { VENDOR_NAV_ITEMS } from "@/lib/vendor-nav"
import { Skeleton } from "@/components/ui/skeleton"

export default function VendorProfilePage() {
  const { user, isLoading } = useAuth()

  return (
    <RoleGuard allowedRoles={["vendor"]}>
      <DashboardShell
        navItems={VENDOR_NAV_ITEMS}
        title="Vendor Profile Settings"
        subtitle="Manage your studio identity, contact details, business name, and profile photo."
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
