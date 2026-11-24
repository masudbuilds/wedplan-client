"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Crown,
  Check,
  Sparkles,
  Receipt,
  AlertCircle,
  RefreshCw,
  Loader2,
  XCircle,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { PremiumBadge } from "@/components/premium-badge"
import { VENDOR_PREMIUM_PLAN } from "@/lib/constants"
import {
  getVendorSubscription,
  createCheckoutSession,
  cancelSubscription,
  ApiError,
} from "@/lib/api"
import { VendorSubscription, Transaction } from "@/types"
import { VENDOR_NAV_ITEMS } from "@/lib/vendor-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function VendorSubscriptionPage() {
  const [subData, setSubData] = React.useState<VendorSubscription | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)

  // Actions state
  const [checkingOut, setCheckingOut] = React.useState<boolean>(false)
  const [cancellingModalOpen, setCancellingModalOpen] = React.useState<boolean>(false)
  const [cancelling, setCancelling] = React.useState<boolean>(false)

  // 1. Fetch vendor subscription data
  React.useEffect(() => {
    let active = true

    getVendorSubscription()
      .then((data) => {
        if (active) {
          setSubData(data)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const msg =
            err instanceof Error ? err.message : "Failed to load subscription details."
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

  const handleRefresh = () => {
    setLoading(true)
    setError(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  // 2. Stripe Checkout session redirect
  const handleUpgrade = async () => {
    setCheckingOut(true)
    try {
      const res = await createCheckoutSession()
      if (res.url) {
        toast.info("Redirecting to secure Stripe Checkout...")
        window.location.href = res.url
      } else {
        throw new Error("Stripe checkout URL missing from response.")
      }
    } catch (err: unknown) {
      setCheckingOut(false)
      if (err instanceof ApiError && err.status === 409) {
        toast.info(err.message || "You are already enrolled in the Premium plan.")
        handleRefresh()
      } else {
        const msg =
          err instanceof Error ? err.message : "Unable to initiate Stripe checkout."
        toast.error(msg)
      }
    }
  }

  // 3. Cancel Subscription
  const handleConfirmCancel = async () => {
    setCancelling(true)
    try {
      const res = await cancelSubscription()
      toast.success(
        res.message || "Your subscription has been scheduled for cancellation."
      )
      setCancellingModalOpen(false)
      handleRefresh()
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to cancel subscription."
      toast.error(msg)
    } finally {
      setCancelling(false)
    }
  }

  const isPremium = subData?.isPremium ?? false
  const expiresAt = subData?.subscriptionExpiresAt
  const cancelAtPeriodEnd = subData?.cancelAtPeriodEnd ?? false

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A"
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  const renderTransactionStatus = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-600 text-white border-none flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3 h-3" />
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-300 flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="flex items-center gap-1 text-[11px]">
            <XCircle className="w-3 h-3" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <RoleGuard allowedRoles={["vendor"]}>
      <DashboardShell
        navItems={VENDOR_NAV_ITEMS}
        title="Subscription & Billing"
        subtitle="Manage your vendor tier, Stripe checkout billing, and view payment transaction history."
      >
        <div className="space-y-8">
          {/* Error State */}
          {error && !loading && (
            <div className="p-8 text-center border border-destructive/20 rounded-2xl bg-destructive/5 space-y-3">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
              <p className="text-sm font-medium text-foreground">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="rounded-full"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Try Again
              </Button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-80 rounded-2xl" />
                <Skeleton className="h-80 rounded-2xl" />
              </div>
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Cancellation Scheduled Notice */}
              {isPremium && cancelAtPeriodEnd && (
                <div className="p-4 rounded-2xl border border-amber-300/60 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">
                        Subscription Cancellation Scheduled
                      </p>
                      <p className="text-muted-foreground mt-0.5">
                        Your Premium benefits remain active until{" "}
                        <strong>{formatDate(expiresAt)}</strong>. You will not be charged again.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Plans Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Free Starter Tier */}
                <Card
                  className={cn(
                    "border rounded-2xl transition-all shadow-xs relative flex flex-col justify-between",
                    !isPremium
                      ? "border-primary/50 bg-primary/5 ring-1 ring-primary/30"
                      : "border-border/80 bg-card"
                  )}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Standard Partner
                      </span>
                      {!isPremium && (
                        <Badge variant="outline" className="text-[11px] border-primary/30 text-primary">
                          Current Plan
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="font-serif text-2xl font-bold pt-1">
                      Free Starter
                    </CardTitle>
                    <div className="pt-2">
                      <span className="font-serif text-3xl font-bold text-foreground">
                        $0
                      </span>
                      <span className="text-xs text-muted-foreground ml-1.5">
                        / month forever
                      </span>
                    </div>
                    <CardDescription className="text-xs pt-1">
                      Ideal for new wedding businesses testing the waters.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3 pt-2 border-t border-border/60 text-xs">
                      <div className="flex items-center gap-2.5 text-foreground">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Maximum of 3 active wedding service listings</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-foreground">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Receive booking inquiries from prospective couples</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-foreground">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Standard directory catalog search results</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-muted-foreground line-through">
                        <Check className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                        <span>Unlimited active listings</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-muted-foreground line-through">
                        <Check className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                        <span>Gold Premium badge</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      {!isPremium ? (
                        <Button
                          disabled
                          variant="outline"
                          className="w-full rounded-full text-xs"
                        >
                          Active Plan
                        </Button>
                      ) : (
                        <p className="text-center text-xs text-muted-foreground italic">
                          Included as default fallback tier.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* 2. Premium Vendor Tier */}
                <Card
                  className={cn(
                    "border rounded-2xl transition-all shadow-md relative flex flex-col justify-between overflow-hidden",
                    isPremium
                      ? "border-[#C9A66B]/50 bg-gradient-to-b from-[#C9A66B]/10 to-card ring-1 ring-[#C9A66B]/40"
                      : "border-accent/40 bg-card hover:border-accent"
                  )}
                >
                  {/* Top highlight ribbon */}
                  <div className="absolute top-0 right-0 bg-[#C9A66B] text-white text-[10px] font-semibold px-3 py-1 rounded-bl-xl tracking-wide uppercase">
                    Recommended
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#9A6E2E] dark:text-[#E2C38C] uppercase tracking-wider flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 text-[#C9A66B]" />
                        Professional Partner
                      </span>
                      {isPremium && (
                        <Badge className="bg-[#C9A66B] text-white border-none text-[11px]">
                          Current Plan
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="font-serif text-2xl font-bold pt-1 flex items-center gap-2">
                      Premium Vendor
                      <PremiumBadge size="sm" label="PRO" />
                    </CardTitle>
                    <div className="pt-2">
                      <span className="font-serif text-3xl font-bold text-foreground">
                        {VENDOR_PREMIUM_PLAN.priceDisplay}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1.5">
                        {VENDOR_PREMIUM_PLAN.billingInterval} {VENDOR_PREMIUM_PLAN.billingDetails}
                      </span>
                    </div>
                    <CardDescription className="text-xs pt-1">
                      Designed for active studios ready to scale bookings.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3 pt-2 border-t border-border/60 text-xs">
                      <div className="flex items-center gap-2.5 text-foreground font-medium">
                        <Sparkles className="w-4 h-4 text-[#C9A66B] shrink-0" />
                        <span>Unlimited active wedding packages & services</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-foreground font-medium">
                        <Sparkles className="w-4 h-4 text-[#C9A66B] shrink-0" />
                        <span>Gold Premium badge on all cards and profile</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-foreground font-medium">
                        <Sparkles className="w-4 h-4 text-[#C9A66B] shrink-0" />
                        <span>Priority placement at top of catalog and searches</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-foreground">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Unlimited high-resolution photo uploads per package</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-foreground">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Direct client booking inquiry pipeline</span>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      {!isPremium ? (
                        <Button
                          onClick={handleUpgrade}
                          disabled={checkingOut}
                          className="w-full rounded-full text-xs bg-[#C9A66B] hover:bg-[#B39158] text-white shadow-md font-semibold h-10"
                        >
                          {checkingOut ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Connecting to Stripe...
                            </>
                          ) : (
                            <>
                              <Crown className="w-4 h-4 mr-2" />
                              Upgrade to Premium via Stripe
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <div className="p-3 rounded-xl bg-card/80 border border-border/60 text-xs text-muted-foreground flex items-center justify-between">
                            <span>Billing Cycle:</span>
                            <span className="font-medium text-foreground">
                              {cancelAtPeriodEnd
                                ? `Expires ${formatDate(expiresAt)}`
                                : `Renews ${formatDate(expiresAt)}`}
                            </span>
                          </div>

                          {!cancelAtPeriodEnd && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCancellingModalOpen(true)}
                              className="w-full rounded-full text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                            >
                              Cancel Subscription
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Transactions Ledger */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground">
                      Transaction History
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Read-only record of your payments and billing charges.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {(subData?.transactions?.length ?? 0)} transaction(s)
                  </Badge>
                </div>

                {(!subData?.transactions || subData.transactions.length === 0) ? (
                  <Card className="border-border/80 shadow-xs">
                    <CardContent className="p-8 text-center space-y-2">
                      <Receipt className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-sm font-semibold">No Billing Transactions Yet</p>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        When you upgrade your subscription via Stripe Checkout, payment receipts and transaction records will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Desktop Transactions Table */}
                    <div className="hidden sm:block bg-card rounded-2xl border border-border/80 overflow-hidden shadow-xs">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Transaction ID</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subData.transactions.map((tx) => (
                            <TableRow key={tx.id}>
                              <TableCell className="text-xs font-medium">
                                {formatDate(tx.createdAt)}
                              </TableCell>
                              <TableCell className="text-xs capitalize font-medium text-foreground">
                                {tx.plan || "Premium"}
                              </TableCell>
                              <TableCell className="text-xs font-bold font-serif text-foreground">
                                ${(tx.amount / 100).toFixed(2)} {tx.currency?.toUpperCase() || "USD"}
                              </TableCell>
                              <TableCell>{renderTransactionStatus(tx.status)}</TableCell>
                              <TableCell className="text-right text-xs font-mono text-muted-foreground">
                                {tx.stripeSessionId
                                  ? `${tx.stripeSessionId.slice(0, 14)}...`
                                  : tx.id}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Transactions Cards */}
                    <div className="sm:hidden space-y-2.5">
                      {subData.transactions.map((tx) => (
                        <Card key={tx.id} className="border-border/80 shadow-xs">
                          <CardContent className="p-3.5 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">
                                {tx.plan ? `${tx.plan} Plan` : "Premium Plan"}
                              </span>
                              {renderTransactionStatus(tx.status)}
                            </div>
                            <div className="flex items-center justify-between pt-1 text-muted-foreground">
                              <span>{formatDate(tx.createdAt)}</span>
                              <span className="font-bold font-serif text-foreground text-sm">
                                ${(tx.amount / 100).toFixed(2)} {tx.currency?.toUpperCase() || "USD"}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Cancel Subscription Confirmation Modal */}
        <Dialog
          open={cancellingModalOpen}
          onOpenChange={(open) => !open && !cancelling && setCancellingModalOpen(false)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold text-destructive">
                Cancel Premium Subscription?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
                Your Premium benefits will remain active until the end of your current billing cycle on{" "}
                <strong className="text-foreground">{formatDate(expiresAt)}</strong>.
                After that date, your account will revert to the Free Starter tier (max 3 active listings). You will not be charged again.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 pt-3">
              <Button
                variant="outline"
                disabled={cancelling}
                onClick={() => setCancellingModalOpen(false)}
                className="rounded-full text-xs"
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="rounded-full text-xs"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Confirm Cancellation
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardShell>
    </RoleGuard>
  )
}
