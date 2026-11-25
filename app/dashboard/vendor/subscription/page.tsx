"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  Crown,
  Check,
  Minus,
  Sparkles,
  Receipt,
  AlertCircle,
  RefreshCw,
  Loader2,
  XCircle,
  CheckCircle2,
  Clock,
  Calendar,
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
          <Badge className="bg-sage text-sage-foreground border border-sage-foreground/15 hover:bg-sage inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5">
            <CheckCircle2 className="w-3 h-3" />
            Paid
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30 hover:bg-amber-500/15 inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5">
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
        <div className="space-y-8 max-w-5xl">
          {/* Error State */}
          {error && !loading && (
            <div className="p-8 text-center border border-destructive/25 rounded-2xl bg-card space-y-3">
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
              <Skeleton className="h-24 rounded-2xl" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-96 rounded-2xl" />
                <Skeleton className="h-96 rounded-2xl" />
              </div>
              <Skeleton className="h-56 rounded-2xl" />
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Current Membership Summary Bar */}
              <section
                className={cn(
                  "rounded-2xl border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                  isPremium && cancelAtPeriodEnd
                    ? "border-amber-300/80 bg-amber-50/70 dark:bg-amber-950/20"
                    : isPremium
                    ? "border-[#C9A66B]/60 bg-linear-to-r from-[#C9A66B]/10 via-card to-card"
                    : "border-border bg-card"
                )}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isPremium ? (
                      <PremiumBadge size="sm" label="Premium Vendor" />
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-muted text-foreground">
                        Free Starter
                      </span>
                    )}
                    {isPremium && cancelAtPeriodEnd ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 dark:text-amber-300">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Cancellation Scheduled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sage-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Active
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-foreground font-medium pt-0.5">
                    {isPremium && cancelAtPeriodEnd ? (
                      <>
                        Your Premium benefits remain active until{" "}
                        <strong className="font-semibold">{formatDate(expiresAt)}</strong>. You will not be charged again.
                      </>
                    ) : isPremium ? (
                      <>
                        Active billing cycle · Next renewal on{" "}
                        <strong className="font-semibold">{formatDate(expiresAt)}</strong>.
                      </>
                    ) : (
                      "Complimentary tier · Up to 3 active wedding service listings included."
                    )}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  {isPremium && !cancelAtPeriodEnd && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCancellingModalOpen(true)}
                      className="rounded-full text-xs text-destructive border-destructive/30 hover:bg-destructive/10 cursor-pointer"
                    >
                      Cancel Subscription
                    </Button>
                  )}
                  {isPremium && cancelAtPeriodEnd && (
                    <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 bg-white/80 dark:bg-card/80 border border-amber-300/60 px-3 py-1.5 rounded-full">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Ends {formatDate(expiresAt)}</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Plans Comparison Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* 1. Free Starter Tier */}
                <div
                  className={cn(
                    "rounded-2xl border bg-card p-6 sm:p-7 flex flex-col justify-between transition-colors",
                    !isPremium
                      ? "border-primary/45 shadow-xs"
                      : "border-border"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 min-h-6">
                      <span className="text-xs font-medium text-muted-foreground">
                        Standard Partner
                      </span>
                      {!isPremium && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blush text-primary-text">
                          Current Plan
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-foreground mt-3">
                      Free Starter
                    </h2>

                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className="font-serif text-4xl font-bold tracking-tight text-foreground">
                        $0
                      </span>
                      <span className="text-xs text-muted-foreground">
                        / month forever
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Ideal for new wedding businesses testing the waters.
                    </p>

                    <div className="my-6 border-t border-border" />

                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2.5 text-foreground">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Maximum of 3 active wedding service listings</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-foreground">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Receive booking inquiries from prospective couples</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-foreground">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Standard directory catalog search results</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-muted-foreground">
                        <Minus className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                        <span>Unlimited active listings</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-muted-foreground">
                        <Minus className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                        <span>Gold Premium badge</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border/70">
                    {!isPremium ? (
                      <Button
                        disabled
                        variant="outline"
                        className="w-full rounded-full text-xs h-10"
                      >
                        Active Plan
                      </Button>
                    ) : (
                      <p className="text-center text-xs text-muted-foreground">
                        Included as default fallback tier.
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Premium Vendor Tier */}
                <div
                  className={cn(
                    "rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-colors",
                    isPremium
                      ? "border-[#C9A66B] bg-linear-to-b from-[#C9A66B]/[0.07] via-card to-card shadow-xs"
                      : "border-[#C9A66B]/70 bg-card shadow-xs"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 min-h-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-text">
                        <Crown className="w-3.5 h-3.5 text-[#C9A66B]" />
                        Professional Partner
                      </span>
                      {isPremium ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#C9A66B]/15 text-gold-text border border-[#C9A66B]/40">
                          Current Plan
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#C9A66B]/15 text-gold-text border border-[#C9A66B]/40">
                          Recommended
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2.5 flex-wrap">
                      <h2 className="font-serif text-2xl font-bold text-foreground">
                        Premium Vendor
                      </h2>
                      <PremiumBadge size="sm" label="PRO" />
                    </div>

                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className="font-serif text-4xl font-bold tracking-tight text-foreground">
                        {VENDOR_PREMIUM_PLAN.priceDisplay}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {VENDOR_PREMIUM_PLAN.billingInterval} {VENDOR_PREMIUM_PLAN.billingDetails}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      Designed for active studios ready to scale bookings.
                    </p>

                    <div className="my-6 border-t border-[#C9A66B]/25" />

                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2.5 text-foreground font-medium">
                        <Sparkles className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                        <span>Unlimited active wedding packages & services</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-foreground font-medium">
                        <Sparkles className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                        <span>Gold Premium badge on all cards and profile</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-foreground font-medium">
                        <Sparkles className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                        <span>Priority placement at top of catalog and searches</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-foreground">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Unlimited high-resolution photo uploads per package</span>
                      </li>
                      <li className="flex items-start gap-2.5 text-foreground">
                        <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <span>Direct client booking inquiry pipeline</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-[#C9A66B]/20 space-y-3">
                    {!isPremium ? (
                      <Button
                        onClick={handleUpgrade}
                        disabled={checkingOut}
                        className="w-full rounded-full text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs font-medium h-10 cursor-pointer"
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
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Billing Cycle</span>
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
                            className="w-full rounded-full text-xs text-destructive border-destructive/30 hover:bg-destructive/10 h-9 cursor-pointer"
                          >
                            Cancel Subscription
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </section>

              {/* Transactions Ledger */}
              <section className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-foreground">
                      Transaction History
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Read-only record of your payments and billing charges.
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                    {(subData?.transactions?.length ?? 0)}{" "}
                    {(subData?.transactions?.length ?? 0) === 1
                      ? "transaction"
                      : "transactions"}
                  </span>
                </div>

                {(!subData?.transactions || subData.transactions.length === 0) ? (
                  <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-2">
                    <Receipt className="w-8 h-8 text-muted-foreground/70 mx-auto" />
                    <p className="text-sm font-semibold text-foreground">
                      No Billing Transactions Yet
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      When you upgrade your subscription via Stripe Checkout, payment receipts and transaction records will appear here.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Transactions Table */}
                    <div className="hidden sm:block bg-card rounded-2xl border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                              Date
                            </TableHead>
                            <TableHead className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                              Plan
                            </TableHead>
                            <TableHead className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                              Amount
                            </TableHead>
                            <TableHead className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                              Status
                            </TableHead>
                            <TableHead className="px-5 py-3.5 text-xs font-medium text-muted-foreground text-right">
                              Transaction ID
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subData.transactions.map((tx) => (
                            <TableRow key={tx.id} className="border-border/70">
                              <TableCell className="px-5 py-4 text-sm font-medium text-foreground">
                                {formatDate(tx.createdAt)}
                              </TableCell>
                              <TableCell className="px-5 py-4 text-sm capitalize text-foreground">
                                {tx.plan || "Premium"}
                              </TableCell>
                              <TableCell className="px-5 py-4 text-sm font-semibold tabular-nums text-foreground">
                                ${(tx.amount / 100).toFixed(2)}{" "}
                                {tx.currency?.toUpperCase() || "USD"}
                              </TableCell>
                              <TableCell className="px-5 py-4">
                                {renderTransactionStatus(tx.status)}
                              </TableCell>
                              <TableCell className="px-5 py-4 text-right text-xs font-mono text-muted-foreground">
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
                    <div className="sm:hidden space-y-3">
                      {subData.transactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="rounded-2xl border border-border bg-card p-4 space-y-2.5 text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-sm capitalize text-foreground">
                              {tx.plan ? `${tx.plan} Plan` : "Premium Plan"}
                            </span>
                            {renderTransactionStatus(tx.status)}
                          </div>
                          <div className="flex items-center justify-between pt-1 text-muted-foreground">
                            <span>{formatDate(tx.createdAt)}</span>
                            <span className="font-semibold tabular-nums text-foreground text-sm">
                              ${(tx.amount / 100).toFixed(2)}{" "}
                              {tx.currency?.toUpperCase() || "USD"}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>Transaction ID</span>
                            <span className="font-mono">
                              {tx.stripeSessionId
                                ? `${tx.stripeSessionId.slice(0, 14)}...`
                                : tx.id}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
            </>
          )}
        </div>

        {/* Cancel Subscription Confirmation Modal */}
        <Dialog
          open={cancellingModalOpen}
          onOpenChange={(open) => !open && !cancelling && setCancellingModalOpen(false)}
        >
          <DialogContent className="sm:max-w-md rounded-2xl">
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
                className="rounded-full text-xs cursor-pointer"
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="rounded-full text-xs cursor-pointer"
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
