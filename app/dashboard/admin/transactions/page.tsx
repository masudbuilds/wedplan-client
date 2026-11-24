"use client"

import * as React from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
  Receipt,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Mail,
  Lock,
  Sparkles,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { getAdminTransactions } from "@/lib/api"
import { Transaction, TransactionStatus } from "@/types"
import { ADMIN_NAV_ITEMS } from "@/lib/admin-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

function AdminTransactionsContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentStatus = searchParams.get("status") || "all"
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = 10

  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [total, setTotal] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)

  // Sync state changes with URL query parameters
  const updateQueryParams = React.useCallback(
    (updates: { status?: string; page?: number }) => {
      const params = new URLSearchParams(searchParams.toString())

      if (updates.status !== undefined) {
        if (updates.status && updates.status !== "all") {
          params.set("status", updates.status)
        } else {
          params.delete("status")
        }
      }

      if (updates.page !== undefined) {
        if (updates.page > 1) {
          params.set("page", String(updates.page))
        } else {
          params.delete("page")
        }
      }

      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, pathname, router]
  )

  // 1. Fetch Transactions on param change
  React.useEffect(() => {
    let active = true

    getAdminTransactions({
      status: currentStatus !== "all" ? currentStatus : undefined,
      page,
      limit,
    })
      .then((res) => {
        if (active) {
          setTransactions(res.transactions || [])
          setTotal(res.total || 0)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to load payment transactions."
          setError(msg)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [currentStatus, page, refreshTrigger])

  const handleRefresh = () => {
    setLoading(true)
    setError(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  const totalPages = Math.ceil(total / limit) || 1

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A"
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    } catch {
      return dateStr
    }
  }

  const formatAmount = (cents: number, currency: string = "usd") => {
    const formatted = (cents / 100).toFixed(2)
    return `$${formatted} ${currency.toUpperCase()}`
  }

  const renderStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-emerald-600 text-white border-none flex items-center gap-1 text-[11px] w-fit">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-300 flex items-center gap-1 text-[11px] w-fit">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="flex items-center gap-1 text-[11px] w-fit">
            <XCircle className="w-3 h-3" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <DashboardShell
        navItems={ADMIN_NAV_ITEMS}
        title="Payment Transactions"
        subtitle="Review platform billing charges, Stripe webhook events, and vendor subscription settlements."
      >
        <div className="space-y-6">
          {/* Read Only Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 flex items-center justify-between gap-3 text-xs text-muted-foreground shadow-xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary shrink-0" />
              <span>
                <strong>Audit Ledger:</strong> Payment records are read only. Transactions reflect confirmed Stripe events.
              </span>
            </div>
            <Badge variant="outline" className="text-[10px] text-muted-foreground hidden sm:inline-flex">
              Immutable Records
            </Badge>
          </div>

          {/* Filter Bar */}
          <Card className="border-border/80 shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
                <Select
                  value={currentStatus}
                  onValueChange={(val) => {
                    const selected = val || "all"
                    updateQueryParams({ status: selected, page: 1 })
                  }}
                >
                  <SelectTrigger className="w-full sm:w-48 text-xs h-9 rounded-xl">
                    <SelectValue placeholder="All Transaction Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                {currentStatus !== "all" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      updateQueryParams({ status: "all", page: 1 })
                    }}
                    className="text-xs h-9 px-2 text-muted-foreground hover:text-foreground"
                  >
                    Reset
                  </Button>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                Showing {transactions.length > 0 ? (page - 1) * limit + 1 : 0} –{" "}
                {Math.min(page * limit, total)} of <strong>{total}</strong> records
              </div>
            </CardContent>
          </Card>

          {/* Error State */}
          {error && !loading && (
            <div className="p-8 text-center border border-destructive/20 rounded-2xl bg-destructive/5 space-y-3">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
              <p className="text-sm font-medium text-foreground">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="rounded-full text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Try Again
              </Button>
            </div>
          )}

          {/* Loading Skeletons */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && transactions.length === 0 && (
            <Card className="border-border/80 shadow-xs">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blush text-primary flex items-center justify-center mx-auto">
                  <Receipt className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold">No Transactions Found</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {currentStatus !== "all"
                      ? `No payment transactions match the "${currentStatus}" status filter.`
                      : "There are currently no billing transactions recorded on the platform."}
                  </p>
                </div>
                {currentStatus !== "all" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateQueryParams({ status: "all", page: 1 })
                    }}
                    className="rounded-full text-xs"
                  >
                    View All Transactions
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Desktop Table View */}
          {!loading && !error && transactions.length > 0 && (
            <div className="hidden lg:block bg-card rounded-2xl border border-border/80 overflow-hidden shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[280px]">Vendor</TableHead>
                    <TableHead>Subscription Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead className="text-right">Stripe Session / ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => {
                    const vendorDisplayName =
                      tx.vendor?.businessName ||
                      tx.vendor?.name ||
                      tx.vendorName ||
                      "WedPlan Vendor"
                    const vendorEmail =
                      tx.vendor?.email || tx.vendorEmail || ""

                    return (
                      <TableRow key={tx.id}>
                        {/* Vendor Name & Email */}
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="font-semibold text-xs text-foreground truncate">
                              {vendorDisplayName}
                            </p>
                            {vendorEmail ? (
                              <a
                                href={`mailto:${vendorEmail}`}
                                className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                              >
                                <Mail className="w-3 h-3 text-primary" />
                                {vendorEmail}
                              </a>
                            ) : (
                              <span className="text-[11px] text-muted-foreground italic">
                                No email recorded
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Plan */}
                        <TableCell>
                          <span className="text-xs font-semibold text-[#9A6E2E] dark:text-[#E2C38C] inline-flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#C9A66B]" />
                            <span className="capitalize">{tx.plan || "Premium"}</span>
                          </span>
                        </TableCell>

                        {/* Amount */}
                        <TableCell>
                          <span className="text-xs font-serif font-bold text-foreground">
                            {formatAmount(tx.amount, tx.currency)}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell>{renderStatusBadge(tx.status)}</TableCell>

                        {/* Date */}
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(tx.createdAt)}
                        </TableCell>

                        {/* Session / ID */}
                        <TableCell className="text-right text-xs font-mono text-muted-foreground">
                          {tx.stripeSessionId ? (
                            <span title={tx.stripeSessionId}>
                              {tx.stripeSessionId.slice(0, 16)}...
                            </span>
                          ) : (
                            tx.id
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Mobile / Tablet Cards View */}
          {!loading && !error && transactions.length > 0 && (
            <div className="lg:hidden space-y-3">
              {transactions.map((tx) => {
                const vendorDisplayName =
                  tx.vendor?.businessName ||
                  tx.vendor?.name ||
                  tx.vendorName ||
                  "WedPlan Vendor"
                const vendorEmail =
                  tx.vendor?.email || tx.vendorEmail || ""

                return (
                  <Card key={tx.id} className="border-border/80 shadow-xs">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-foreground truncate">
                            {vendorDisplayName}
                          </p>
                          {vendorEmail && (
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3 text-primary" />
                              {vendorEmail}
                            </p>
                          )}
                        </div>
                        {renderStatusBadge(tx.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-muted/40">
                        <div>
                          <span className="text-muted-foreground block">Plan:</span>
                          <span className="font-semibold text-foreground capitalize flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#C9A66B]" />
                            {tx.plan || "Premium"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Amount:</span>
                          <span className="font-serif font-bold text-foreground text-sm">
                            {formatAmount(tx.amount, tx.currency)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px] text-muted-foreground">
                        <span>{formatDate(tx.createdAt)}</span>
                        <span className="font-mono text-[10px]">
                          {tx.stripeSessionId
                            ? `${tx.stripeSessionId.slice(0, 12)}...`
                            : tx.id}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => updateQueryParams({ page: page - 1 })}
                className="rounded-full text-xs h-8 px-3"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Previous
              </Button>
              <span className="text-xs text-muted-foreground px-2">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => updateQueryParams({ page: page + 1 })}
                className="rounded-full text-xs h-8 px-3"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}

export default function AdminTransactionsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8">
          <Skeleton className="h-10 w-48 rounded-xl mb-4" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <AdminTransactionsContent />
    </React.Suspense>
  )
}
