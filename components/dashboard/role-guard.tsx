"use client"

import * as React from "react"
import Link from "next/link"
import { ShieldAlert, ArrowLeft, LayoutDashboard, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { UserRole } from "@/types"

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, role, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground text-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span>Verifying authentication and role permissions...</span>
        </div>
      </div>
    )
  }

  // If user is not logged in
  if (!user || !role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border/80 shadow-xs text-center p-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold">Authentication Required</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Please sign in to access this area of WedPlan.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Button
              render={
                <Link href="/sign-in" className="w-full rounded-full">
                  Sign In to Your Account
                </Link>
              }
            />
            <Button
              variant="outline"
              render={
                <Link href="/" className="w-full rounded-full">
                  Return to Home
                </Link>
              }
            />
          </div>
        </Card>
      </div>
    )
  }

  // If user role is not authorized for this specific dashboard
  if (!allowedRoles.includes(role)) {
    const userDashboard = `/dashboard/${role}`

    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg border-destructive/20 bg-destructive/5 text-center p-6 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-bold text-destructive">
              Access Restricted
            </h2>
            <p className="text-sm text-foreground">
              This dashboard section is restricted to{" "}
              <span className="font-semibold capitalize">
                {allowedRoles.join(" or ")}
              </span>{" "}
              accounts.
            </p>
            <p className="text-xs text-muted-foreground">
              You are currently signed in as a{" "}
              <span className="font-semibold capitalize text-foreground">{role}</span>.
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              render={
                <Link href={userDashboard} className="rounded-full">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Go to My {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                </Link>
              }
            />
            <Button
              variant="outline"
              render={
                <Link href="/" className="rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return Home
                </Link>
              }
            />
          </div>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
