"use client"

import * as React from "react"
import Link from "next/link"
import { XCircle, RotateCcw, ShieldCheck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-border/80 shadow-md text-center">
        <CardContent className="p-8 sm:p-10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Payment Cancelled
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              Your Stripe checkout session was cancelled. No charges were made to your payment method, and your current plan remains unchanged.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs text-muted-foreground inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>You can upgrade at any time to unlock unlimited service listings.</span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard/vendor/subscription"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full sm:w-auto rounded-full px-6 text-xs shadow-xs"
              )}
            >
              Try Again
            </Link>
            <Link
              href="/dashboard/vendor"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full sm:w-auto rounded-full text-xs"
              )}
            >
              Return to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
