"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function DashboardIndexPage() {
  const router = useRouter()
  const { user, role, isLoading } = useAuth()

  React.useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace("/sign-in?redirect=/dashboard")
      return
    }

    if (role === "admin") {
      router.replace("/dashboard/admin")
    } else if (role === "vendor") {
      router.replace("/dashboard/vendor")
    } else {
      router.replace("/dashboard/customer")
    }
  }, [user, role, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground text-sm">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span>Redirecting to your personalized dashboard...</span>
      </div>
    </div>
  )
}
