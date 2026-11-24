"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Mail,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { getVendorBookings, updateBookingStatus, ApiError } from "@/lib/api"
import { Booking, BookingStatus } from "@/types"
import { VENDOR_NAV_ITEMS } from "@/lib/vendor-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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

export default function VendorBookingsPage() {
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  // Modals state
  const [detailBooking, setDetailBooking] = React.useState<Booking | null>(null)
  const [actionTarget, setActionTarget] = React.useState<{
    booking: Booking
    action: "accepted" | "rejected"
  } | null>(null)
  const [updating, setUpdating] = React.useState<boolean>(false)

  // 1. Fetch vendor bookings
  React.useEffect(() => {
    let active = true

    getVendorBookings()
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

  // 2. Accept or Reject booking
  const handleConfirmAction = async () => {
    if (!actionTarget) return

    setUpdating(true)
    const { booking, action } = actionTarget

    try {
      const res = await updateBookingStatus(booking.id, action)
      toast.success(
        res.message ||
          `Booking request ${action === "accepted" ? "accepted" : "rejected"} successfully.`
      )
      setActionTarget(null)
      if (detailBooking?.id === booking.id) {
        setDetailBooking(null)
      }
      handleRefresh()
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 409) {
        toast.error(
          err.message ||
            "This booking request has already been updated or cancelled by the client."
        )
        setActionTarget(null)
        if (detailBooking?.id === booking.id) {
          setDetailBooking(null)
        }
        handleRefresh()
      } else {
        const msg =
          err instanceof Error
            ? err.message
            : `Failed to ${action === "accepted" ? "accept" : "decline"} booking.`
        toast.error(msg)
      }
    } finally {
      setUpdating(false)
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

  const renderStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-emerald-600 text-white border-none flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3 h-3" />
            Accepted
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-300 flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1 text-[11px]">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-muted-foreground text-[11px]">
            Cancelled by client
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
    <RoleGuard allowedRoles={["vendor"]}>
      <DashboardShell
        navItems={VENDOR_NAV_ITEMS}
        title="Booking Requests"
        subtitle="Review, accept, or reject wedding date inquiries received from prospective customers."
      >
        <div className="space-y-6">
          {/* Status Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Tabs
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                <TabsTrigger value="all" className="text-xs">
                  All ({bookings.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs">
                  Pending ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="accepted" className="text-xs">
                  Accepted ({acceptedCount})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="text-xs">
                  Rejected ({rejectedCount})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="text-xs">
                  Cancelled ({cancelledCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <span className="text-xs text-muted-foreground self-start sm:self-auto">
              Pending Action: <strong className="text-accent">{pendingCount}</strong>
            </span>
          </div>

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
            <Card className="border-border/80 shadow-xs">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blush text-primary flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold">
                    {statusFilter === "all"
                      ? "No Booking Requests Yet"
                      : `No ${statusFilter} booking requests found`}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {statusFilter === "all"
                      ? "When couples submit inquiries for your packages, they will show up here for your confirmation."
                      : "Switch back to the All tab to review all booking inquiries."}
                  </p>
                </div>
                {statusFilter !== "all" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                    className="rounded-full text-xs"
                  >
                    View All Inquiries
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Desktop Table View */}
          {!loading && !error && filteredBookings.length > 0 && (
            <div className="hidden lg:block bg-card rounded-2xl border border-border/80 overflow-hidden shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[240px]">Customer</TableHead>
                    <TableHead className="w-[220px]">Requested Package</TableHead>
                    <TableHead>Event Date & Location</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((b) => {
                    const customerName =
                      b.customerName ||
                      b.customer?.name ||
                      "Prospective Couple"
                    const customerEmail =
                      b.customerEmail || b.customer?.email || ""
                    const customerPhoto =
                      b.customerImage || b.customer?.image

                    const isPending = b.status === "pending"

                    return (
                      <TableRow key={b.id}>
                        {/* Customer Info */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 border border-border shrink-0">
                              <AvatarImage src={customerPhoto} />
                              <AvatarFallback className="bg-blush text-primary text-xs">
                                {customerName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-semibold text-xs text-foreground truncate">
                                {customerName}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {customerEmail}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Service Package */}
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/60">
                              {b.serviceImage ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={b.serviceImage}
                                  alt={b.serviceName || "Service"}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                                  WP
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-xs truncate">
                                {b.serviceName || "Service Package"}
                              </p>
                              {b.serviceId && (
                                <Link
                                  href={`/services/${b.serviceId}`}
                                  target="_blank"
                                  className="text-[10px] text-primary hover:underline"
                                >
                                  View catalog listing
                                </Link>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Event Details */}
                        <TableCell>
                          <div className="space-y-0.5 text-xs">
                            <p className="font-semibold flex items-center gap-1 text-foreground">
                              <Calendar className="w-3.5 h-3.5 text-primary" />
                              {b.eventDate}
                            </p>
                            <p className="text-muted-foreground flex items-center gap-1 text-[11px] truncate max-w-[160px]">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                              {b.eventLocation}
                            </p>
                          </div>
                        </TableCell>

                        {/* Received Date */}
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(b.createdAt)}
                        </TableCell>

                        {/* Status */}
                        <TableCell>{renderStatusBadge(b.status)}</TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDetailBooking(b)}
                              className="h-8 px-2 text-xs"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Details
                            </Button>

                            {isPending && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setActionTarget({ booking: b, action: "accepted" })
                                  }
                                  className="h-8 px-2.5 text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-100"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setActionTarget({ booking: b, action: "rejected" })
                                  }
                                  className="h-8 px-2.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                                >
                                  <XCircle className="w-3.5 h-3.5 mr-1" />
                                  Reject
                                </Button>
                              </>
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

          {/* Mobile / Tablet Cards View */}
          {!loading && !error && filteredBookings.length > 0 && (
            <div className="lg:hidden space-y-3">
              {filteredBookings.map((b) => {
                const customerName =
                  b.customerName ||
                  b.customer?.name ||
                  "Prospective Couple"
                const customerEmail =
                  b.customerEmail || b.customer?.email || ""
                const customerPhoto =
                  b.customerImage || b.customer?.image

                const isPending = b.status === "pending"

                return (
                  <Card key={b.id} className="border-border/80 shadow-xs overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      {/* Customer & Status Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-10 h-10 border border-border shrink-0">
                            <AvatarImage src={customerPhoto} />
                            <AvatarFallback className="bg-blush text-primary text-xs">
                              {customerName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-xs leading-snug">
                              {customerName}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {customerEmail}
                            </p>
                          </div>
                        </div>
                        {renderStatusBadge(b.status)}
                      </div>

                      {/* Service thumbnail and name */}
                      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/60">
                          {b.serviceImage ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={b.serviceImage}
                              alt={b.serviceName || "Service"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                              WP
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-muted-foreground block">
                            Requested Package:
                          </span>
                          <p className="font-semibold text-xs truncate">
                            {b.serviceName || "Service"}
                          </p>
                        </div>
                      </div>

                      {/* Event Details Grid */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-card border border-border/60">
                        <div>
                          <span className="text-muted-foreground block">Event Date:</span>
                          <span className="font-medium text-foreground">{b.eventDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Location:</span>
                          <span className="font-medium text-foreground truncate block">
                            {b.eventLocation}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDetailBooking(b)}
                          className="h-7 px-2.5 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Details
                        </Button>

                        {isPending && (
                          <div className="flex items-center gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setActionTarget({ booking: b, action: "accepted" })
                              }
                              className="h-7 px-2.5 text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setActionTarget({ booking: b, action: "rejected" })
                              }
                              className="h-7 px-2.5 text-xs text-destructive border-destructive/30"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* 1. View Details Modal */}
        <Dialog open={!!detailBooking} onOpenChange={(open) => !open && setDetailBooking(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold">
                Booking Request Details
              </DialogTitle>
              <DialogDescription>
                Full records, client contact info, and special inquiry notes.
              </DialogDescription>
            </DialogHeader>

            {detailBooking && (
              <div className="space-y-4 py-2">
                {/* Status banner */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-blush/40 border border-primary/15">
                  <span className="text-xs text-muted-foreground">Inquiry Status:</span>
                  {renderStatusBadge(detailBooking.status)}
                </div>

                {/* Customer Info Card */}
                <div className="p-3 rounded-xl border border-border/80 space-y-2 text-xs">
                  <span className="text-muted-foreground block font-medium">Customer Information:</span>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-border">
                      <AvatarImage
                        src={
                          detailBooking.customerImage ||
                          detailBooking.customer?.image
                        }
                      />
                      <AvatarFallback className="bg-blush text-primary text-xs">
                        {(detailBooking.customerName || detailBooking.customer?.name || "WP").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground">
                        {detailBooking.customerName ||
                          detailBooking.customer?.name ||
                          "Prospective Couple"}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        {detailBooking.customerEmail ||
                          detailBooking.customer?.email ||
                          "No email provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service & Event Details */}
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-border/80">
                    <div>
                      <span className="text-muted-foreground block">Service Package:</span>
                      <span className="font-semibold text-foreground text-sm">
                        {detailBooking.serviceName || "Package"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Requested Event Date:</span>
                      <span className="font-semibold text-foreground text-sm flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {detailBooking.eventDate}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block">Event Venue / Location:</span>
                      <span className="font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {detailBooking.eventLocation}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground block">Request Submitted:</span>
                      <span className="font-semibold text-foreground">
                        {formatDate(detailBooking.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Customer Message */}
                  <div className="p-3 rounded-xl border border-border/80 space-y-1.5">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-primary" />
                      Inquiry Notes from Couple:
                    </span>
                    <p className="p-2.5 rounded-lg bg-muted/40 text-foreground italic text-xs leading-relaxed">
                      {detailBooking.message || "No custom message or special notes provided."}
                    </p>
                  </div>
                </div>

                <DialogFooter className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                  {detailBooking.status === "pending" ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const target = detailBooking
                          setDetailBooking(null)
                          setActionTarget({ booking: target, action: "rejected" })
                        }}
                        className="rounded-full text-xs text-destructive border-destructive/30"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => {
                          const target = detailBooking
                          setDetailBooking(null)
                          setActionTarget({ booking: target, action: "accepted" })
                        }}
                        className="rounded-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Accept Booking
                      </Button>
                    </div>
                  ) : (
                    <div />
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setDetailBooking(null)}
                    className="rounded-full text-xs w-full sm:w-auto"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 2. Action Confirmation Modal (Accept or Decline) */}
        <Dialog
          open={!!actionTarget}
          onOpenChange={(open) => !open && !updating && setActionTarget(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle
                className={cn(
                  "font-serif text-xl font-bold",
                  actionTarget?.action === "accepted" ? "text-emerald-600" : "text-destructive"
                )}
              >
                {actionTarget?.action === "accepted"
                  ? "Confirm & Accept Booking?"
                  : "Decline Booking Request?"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                {actionTarget?.action === "accepted" ? (
                  <>
                    Are you sure you want to accept the wedding reservation for{" "}
                    <strong className="text-foreground">
                      {actionTarget.booking.customerName || "this client"}
                    </strong>{" "}
                    for{" "}
                    <strong className="text-foreground">
                      {actionTarget.booking.serviceName}
                    </strong>{" "}
                    on{" "}
                    <strong className="text-foreground">
                      {actionTarget.booking.eventDate}
                    </strong>
                    ? This confirms your availability with the couple.
                  </>
                ) : (
                  <>
                    Are you sure you want to decline this booking request from{" "}
                    <strong className="text-foreground">
                      {actionTarget?.booking.customerName || "this client"}
                    </strong>{" "}
                    for{" "}
                    <strong className="text-foreground">
                      {actionTarget?.booking.eventDate}
                    </strong>
                    ? The couple will be notified that the date is unavailable.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 pt-3">
              <Button
                variant="outline"
                disabled={updating}
                onClick={() => setActionTarget(null)}
                className="rounded-full text-xs"
              >
                Go Back
              </Button>
              <Button
                variant={actionTarget?.action === "accepted" ? "default" : "destructive"}
                disabled={updating}
                onClick={handleConfirmAction}
                className={cn(
                  "rounded-full text-xs",
                  actionTarget?.action === "accepted" && "bg-emerald-600 hover:bg-emerald-700 text-white"
                )}
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Updating...
                  </>
                ) : actionTarget?.action === "accepted" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Confirm Acceptance
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-1.5" />
                    Confirm Decline
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
