"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Calendar,
  MapPin,
  Heart,
  Eye,
  XCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Clock,
  MessageSquare,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { getMyBookings, cancelBooking, ApiError } from "@/lib/api"
import { Booking, NavItem } from "@/types"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const CUSTOMER_NAV_ITEMS: NavItem[] = [
  { title: "Dashboard Overview", href: "/dashboard/customer", icon: "overview" },
  { title: "My Bookings", href: "/dashboard/customer/bookings", icon: "bookings" },
  { title: "Profile Settings", href: "/dashboard/customer/profile", icon: "profile" },
]

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  // Modals state
  const [detailBooking, setDetailBooking] = React.useState<Booking | null>(null)
  const [cancelTarget, setCancelTarget] = React.useState<Booking | null>(null)
  const [cancelling, setCancelling] = React.useState<boolean>(false)

  // 1. Fetch bookings
  React.useEffect(() => {
    let active = true

    getMyBookings()
      .then((data) => {
        if (active) {
          setBookings(data)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const msg =
            err instanceof Error ? err.message : "Failed to load bookings."
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

  // 2. Cancellation handler
  const handleConfirmCancel = async () => {
    if (!cancelTarget) return

    setCancelling(true)
    try {
      const res = await cancelBooking(cancelTarget.id)
      toast.success(res.message || "Booking request cancelled successfully.")
      setCancelTarget(null)
      handleRefresh()
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to cancel booking."
      toast.error(msg)
      // If 409 conflict (e.g. vendor already accepted/rejected/cancelled), refresh list
      if (err instanceof ApiError && err.status === 409) {
        setCancelTarget(null)
        handleRefresh()
      }
    } finally {
      setCancelling(false)
    }
  }

  // Counts for tabs
  const pendingCount = bookings.filter((b) => b.status === "pending").length
  const acceptedCount = bookings.filter((b) => b.status === "accepted").length
  const rejectedCount = bookings.filter((b) => b.status === "rejected").length
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length

  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter)

  const renderStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-sage text-sage-foreground border border-sage-foreground/15 hover:bg-sage text-[11px] font-medium px-2.5 py-0.5">
            Accepted
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30 hover:bg-amber-500/15 text-[11px] font-medium px-2.5 py-0.5">
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="text-[11px] font-medium px-2.5 py-0.5">
            Rejected
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-muted-foreground text-[11px] font-medium px-2.5 py-0.5">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      const d = new Date(dateString)
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return dateString
    }
  }

  return (
    <RoleGuard allowedRoles={["customer"]}>
      <DashboardShell
        navItems={CUSTOMER_NAV_ITEMS}
        title="My Booking Inquiries"
        subtitle="Track the status of all your wedding vendor booking requests in one place."
      >
        <div className="space-y-6 max-w-6xl">
          {/* Status Filter Bar */}
          <section className="rounded-2xl border border-border bg-card p-3 sm:px-5 sm:py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <Tabs
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="w-full lg:w-auto"
            >
              <TabsList className="h-auto flex-wrap justify-start bg-muted/70 p-1 rounded-xl gap-1 w-full lg:w-auto">
                <TabsTrigger value="all" className="text-xs px-3 rounded-lg">
                  All ({bookings.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs px-3 rounded-lg">
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="accepted" className="text-xs px-3 rounded-lg">
                  Accepted ({acceptedCount})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="text-xs px-3 rounded-lg">
                  Rejected ({rejectedCount})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="text-xs px-3 rounded-lg">
                  Cancelled ({cancelledCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Link
              href="/services"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-full text-xs h-9 px-4 self-start lg:self-auto shrink-0"
              )}
            >
              <Heart className="w-3.5 h-3.5 mr-1.5 fill-current text-primary-text" />
              Browse More Services
            </Link>
          </section>

          {/* Error State */}
          {error && !loading && (
            <div className="p-8 text-center border border-destructive/25 rounded-2xl bg-card space-y-3">
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
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredBookings.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-blush text-primary-text flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-foreground">
                  {statusFilter === "all"
                    ? "No Booking Requests Yet"
                    : `No ${statusFilter} bookings found`}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  {statusFilter === "all"
                    ? "Discover independent wedding photographers, venues, and caterers, then send your inquiry."
                    : "Try switching to another tab or browse services to submit new inquiries."}
                </p>
              </div>
              {statusFilter === "all" ? (
                <Link
                  href="/services"
                  className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6 text-xs h-9")}
                >
                  <Heart className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  Browse Services
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                  className="rounded-full text-xs h-9 px-4 cursor-pointer"
                >
                  View All Bookings
                </Button>
              )}
            </div>
          )}

          {/* Desktop Table View (Hidden on mobile) */}
          {!loading && !error && filteredBookings.length > 0 && (
            <div className="hidden md:block bg-card rounded-2xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="px-5 py-3.5 w-[280px] text-xs font-medium text-muted-foreground">
                      Service
                    </TableHead>
                    <TableHead className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                      Vendor
                    </TableHead>
                    <TableHead className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                      Event Details
                    </TableHead>
                    <TableHead className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                      Request Date
                    </TableHead>
                    <TableHead className="px-5 py-3.5 text-xs font-medium text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="px-5 py-3.5 text-xs font-medium text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((b) => {
                    const vendorName =
                      b.vendorName ||
                      b.vendor?.businessName ||
                      b.vendor?.name ||
                      "WedPlan Partner"

                    return (
                      <TableRow key={b.id} className="border-border/70">
                        {/* Service Name & Image */}
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/70">
                              {b.serviceImage ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={b.serviceImage}
                                  alt={b.serviceName || "Service"}
                                  className="block w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                                  WP
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-foreground truncate">
                                {b.serviceName || "Service no longer available"}
                              </p>
                              {b.serviceId && (
                                <Link
                                  href={`/services/${b.serviceId}`}
                                  className="text-[11px] text-primary-text hover:underline"
                                >
                                  View listing
                                </Link>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Vendor Info */}
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="w-7 h-7 border border-border">
                              <AvatarImage src={b.vendorImage || b.vendor?.image} />
                              <AvatarFallback className="bg-blush text-primary-text text-[10px]">
                                {vendorName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-foreground truncate max-w-[140px]">
                              {vendorName}
                            </span>
                          </div>
                        </TableCell>

                        {/* Event Date & Location */}
                        <TableCell className="px-5 py-4">
                          <div className="space-y-0.5 text-xs">
                            <p className="font-semibold flex items-center gap-1.5 text-foreground">
                              <Calendar className="w-3.5 h-3.5 text-primary-text" />
                              {b.eventDate}
                            </p>
                            <p className="text-muted-foreground flex items-center gap-1.5 text-[11px] truncate max-w-[180px]">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                              <span className="truncate">{b.eventLocation}</span>
                            </p>
                          </div>
                        </TableCell>

                        {/* Request Date */}
                        <TableCell className="px-5 py-4 text-xs text-muted-foreground">
                          {formatDate(b.createdAt)}
                        </TableCell>

                        {/* Status Badge */}
                        <TableCell className="px-5 py-4">{renderStatusBadge(b.status)}</TableCell>

                        {/* Actions */}
                        <TableCell className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDetailBooking(b)}
                              className="h-8 px-2.5 text-xs cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Details
                            </Button>
                            {b.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCancelTarget(b)}
                                className="h-8 px-2.5 text-xs rounded-full text-destructive border-destructive/30 hover:bg-destructive/10 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Mobile Cards View (Visible only on small screens) */}
          {!loading && !error && filteredBookings.length > 0 && (
            <div className="md:hidden space-y-3">
              {filteredBookings.map((b) => {
                const vendorName =
                  b.vendorName ||
                  b.vendor?.businessName ||
                  b.vendor?.name ||
                  "WedPlan Partner"

                return (
                  <div
                    key={b.id}
                    className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/70">
                          {b.serviceImage ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={b.serviceImage}
                              alt={b.serviceName || "Service"}
                              className="block w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                              WP
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground leading-snug truncate">
                            {b.serviceName || "Service no longer available"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            Vendor: <span className="text-foreground">{vendorName}</span>
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">{renderStatusBadge(b.status)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-muted/40 border border-border/60">
                      <div>
                        <span className="text-[11px] text-muted-foreground block">Event Date</span>
                        <span className="font-medium text-foreground">{b.eventDate}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-muted-foreground block">Location</span>
                        <span className="font-medium text-foreground truncate block">
                          {b.eventLocation}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-border/70">
                      <span className="text-[11px] text-muted-foreground">
                        Sent: {formatDate(b.createdAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDetailBooking(b)}
                          className="h-8 px-3 text-xs rounded-full cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Details
                        </Button>
                        {b.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCancelTarget(b)}
                            className="h-8 px-3 text-xs rounded-full text-destructive border-destructive/30 cursor-pointer"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 1. View Details Modal */}
        <Dialog open={!!detailBooking} onOpenChange={(open) => !open && setDetailBooking(null)}>
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold">
                Booking Inquiry Details
              </DialogTitle>
              <DialogDescription>
                Full records and inquiry notes for this reservation.
              </DialogDescription>
            </DialogHeader>

            {detailBooking && (
              <div className="space-y-4 py-2">
                {/* Status banner */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-blush/40 border border-primary/15">
                  <span className="text-xs text-muted-foreground">Current Booking Status</span>
                  {renderStatusBadge(detailBooking.status)}
                </div>

                {/* Service Details */}
                <div className="space-y-2.5 text-xs">
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-border">
                    <div>
                      <span className="text-muted-foreground block">Wedding Service</span>
                      <span className="font-semibold text-foreground text-sm">
                        {detailBooking.serviceName || "Service no longer available"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Vendor Specialist</span>
                      <span className="font-semibold text-foreground text-sm">
                        {detailBooking.vendorName ||
                          detailBooking.vendor?.businessName ||
                          detailBooking.vendor?.name ||
                          "WedPlan Partner"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Event Date</span>
                      <span className="font-semibold text-foreground">
                        {detailBooking.eventDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Request Submitted</span>
                      <span className="font-semibold text-foreground">
                        {formatDate(detailBooking.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border space-y-1">
                    <span className="text-muted-foreground block">Event Venue / Location</span>
                    <span className="font-medium text-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary-text" />
                      {detailBooking.eventLocation}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-border space-y-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-primary-text" />
                      Customer Inquiry Notes
                    </span>
                    <p className="p-3 rounded-lg bg-muted/40 text-foreground italic text-xs leading-relaxed">
                      {detailBooking.message || "No custom message or special notes provided."}
                    </p>
                  </div>
                </div>

                <DialogFooter className="pt-2 gap-2">
                  {detailBooking.status === "pending" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const target = detailBooking
                        setDetailBooking(null)
                        setCancelTarget(target)
                      }}
                      className="text-destructive border-destructive/30 rounded-full text-xs cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Cancel Inquiry
                    </Button>
                  )}
                  <Button
                    onClick={() => setDetailBooking(null)}
                    className="rounded-full text-xs cursor-pointer"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 2. Cancel Confirmation Modal */}
        <Dialog open={!!cancelTarget} onOpenChange={(open) => !open && !cancelling && setCancelTarget(null)}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold text-destructive">
                Cancel Booking Inquiry?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
                Are you sure you want to withdraw your inquiry for{" "}
                <span className="font-semibold text-foreground">{cancelTarget?.serviceName}</span> on{" "}
                <span className="font-semibold text-foreground">{cancelTarget?.eventDate}</span>?
                This action is immediate and cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 pt-3">
              <Button
                variant="outline"
                disabled={cancelling}
                onClick={() => setCancelTarget(null)}
                className="rounded-full text-xs cursor-pointer"
              >
                Keep Booking
              </Button>
              <Button
                variant="destructive"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="rounded-full text-xs cursor-pointer"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Yes, Cancel Booking
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
