"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  Sparkles,
  Loader2,
  ArrowRight,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { getSessionStatus } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { SessionStatusResponse } from "@/types"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PremiumBadge } from "@/components/premium-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { refreshUser } = useAuth()

  // State: "polling" | "success" | "timeout" | "error"
  const [pollState, setPollState] = React.useState<"polling" | "success" | "timeout" | "error">(
    sessionId ? "polling" : "error"
  )
  const [sessionData, setSessionData] = React.useState<SessionStatusResponse | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(
    sessionId ? null : "No Stripe checkout session ID was provided."
  )
  const [pollAttempts, setPollAttempts] = React.useState(0)

  const maxAttempts = 15 // 15 attempts * 2s = 30 seconds

  React.useEffect(() => {
    if (!sessionId) return

    let isMounted = true
    let timerId: NodeJS.Timeout | null = null

    const checkStatus = async () => {
      try {
        const data = await getSessionStatus(sessionId)
        if (!isMounted) return

        setSessionData(data)

        if (data.isPremium) {
          setPollState("success")
          await refreshUser()
          return
        }

        // If not confirmed yet, increment attempts
        setPollAttempts((prev) => {
          const next = prev + 1
          if (next >= maxAttempts) {
            setPollState("timeout")
          } else {
            timerId = setTimeout(checkStatus, 2000)
          }
          return next
        })
      } catch (err: unknown) {
        if (!isMounted) return
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to verify payment session status."
        setErrorMessage(msg)
        setPollState("error")
      }
    }

    // Start first check
    checkStatus()

    return () => {
      isMounted = false
      if (timerId) clearTimeout(timerId)
    }
  }, [sessionId, refreshUser])

  const handleManualRetry = () => {
    setPollAttempts(0)
    setPollState("polling")
    setErrorMessage(null)
  }

  const formatExpiry = (dateStr?: string | null) => {
    if (!dateStr) return null
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* 1. POLLING STATE */}
        {pollState === "polling" && (
          <Card className="border-border/80 shadow-md text-center">
            <CardContent className="p-8 sm:p-10 space-y-5">
              <div className="w-16 h-16 rounded-full bg-accent/15 text-accent flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Confirming Your Payment
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  We are securely verifying your Stripe transaction and setting up your Premium account benefits...
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <Clock className="w-4 h-4 text-primary animate-pulse" />
                <span>Checking webhook confirmation ({(pollAttempts + 1)}/{maxAttempts})...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 2. SUCCESS CONFIRMED STATE */}
        {pollState === "success" && (
          <Card className="border-[#C9A66B]/50 bg-gradient-to-b from-[#C9A66B]/15 via-card to-card shadow-lg text-center overflow-hidden">
            <CardContent className="p-8 sm:p-10 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <PremiumBadge size="default" />
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  Welcome to Premium!
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Your payment has been successfully verified. You now have unlimited listings, priority search rank, and gold badges.
                </p>
              </div>

              {sessionData?.subscriptionExpiresAt && (
                <div className="p-3.5 rounded-xl bg-card border border-border/80 text-xs text-muted-foreground inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A66B]" />
                  <span>
                    Current period active through:{" "}
                    <strong className="text-foreground">
                      {formatExpiry(sessionData.subscriptionExpiresAt)}
                    </strong>
                  </span>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/dashboard/vendor"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full sm:w-auto rounded-full px-6 shadow-sm text-xs"
                  )}
                >
                  Go to Vendor Dashboard
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
                <Link
                  href="/dashboard/vendor/services/new"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full sm:w-auto rounded-full text-xs"
                  )}
                >
                  Create New Service
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 3. TIMEOUT / ASYNC WEBHOOK STATE */}
        {pollState === "timeout" && (
          <Card className="border-amber-300/60 bg-card shadow-md text-center">
            <CardContent className="p-8 sm:p-10 space-y-5">
              <div className="w-16 h-16 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Payment Received
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Your Stripe payment was submitted successfully and is currently being processed by the system. Webhooks may take a moment to finalize.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Your account will be upgraded automatically as soon as Stripe webhook confirmation arrives.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={handleManualRetry}
                  variant="outline"
                  className="w-full sm:w-auto rounded-full text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Check Status Again
                </Button>
                <Link
                  href="/dashboard/vendor"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full sm:w-auto rounded-full text-xs"
                  )}
                >
                  Return to Dashboard
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 4. ERROR STATE */}
        {pollState === "error" && (
          <Card className="border-destructive/30 bg-destructive/5 shadow-md text-center">
            <CardContent className="p-8 sm:p-10 space-y-5">
              <div className="w-16 h-16 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Unable to Verify Session
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {errorMessage || "An error occurred while confirming your transaction."}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {sessionId && (
                  <Button
                    onClick={handleManualRetry}
                    variant="outline"
                    className="w-full sm:w-auto rounded-full text-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    Retry Verification
                  </Button>
                )}
                <Link
                  href="/dashboard/vendor/subscription"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full sm:w-auto rounded-full text-xs"
                  )}
                >
                  Back to Subscription
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-8 space-y-4">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </Card>
        </div>
      }
    >
      <PaymentSuccessContent />
    </React.Suspense>
  )
}
