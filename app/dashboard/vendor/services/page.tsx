"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Package,
  PlusCircle,
  Eye,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import {
  getVendorServices,
  setServiceAvailability,
  deleteService,
  ApiError,
} from "@/lib/api"
import { Service } from "@/types"
import { VENDOR_NAV_ITEMS } from "@/lib/vendor-nav"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function VendorServicesPage() {
  const [services, setServices] = React.useState<Service[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)

  // Modals state
  const [detailService, setDetailService] = React.useState<Service | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Service | null>(null)
  const [deleting, setDeleting] = React.useState(false)
  const [togglingId, setTogglingId] = React.useState<string | null>(null)

  // 1. Fetch vendor's services
  React.useEffect(() => {
    let active = true

    getVendorServices()
      .then((data) => {
        if (active) {
          setServices(data)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const msg =
            err instanceof Error ? err.message : "Failed to load services."
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

  // 2. Toggle service availability (isActive)
  const handleToggleActive = async (service: Service, newActive: boolean) => {
    if (service.status === "rejected") {
      toast.error("Rejected services cannot be made active.")
      return
    }

    setTogglingId(service.id)
    try {
      await setServiceAvailability(service.id, newActive)
      toast.success(
        `Service is now ${newActive ? "active and visible" : "hidden"}.`
      )
      // Update local state
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, isActive: newActive } : s))
      )
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 403) {
        toast.error(
          err.message ||
            "Cannot activate service: Free plan limit reached (3 active services max)."
        )
      } else {
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to update service availability."
        toast.error(msg)
      }
    } finally {
      setTogglingId(null)
    }
  }

  // 3. Confirm Delete handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      const res = await deleteService(deleteTarget.id)
      toast.success(res.message || "Service deleted successfully.")
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete service."
      toast.error(msg)
    } finally {
      setDeleting(false)
    }
  }

  const renderStatusBadge = (status: Service["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-600 text-white border-none flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-300 flex items-center gap-1 text-[11px]">
            <Clock className="w-3 h-3" />
            Pending Review
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1 text-[11px]">
            <XCircle className="w-3 h-3" />
            Rejected
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
        title="My Wedding Services"
        subtitle="View, edit, and manage all your package offerings and availability."
      >
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Total Services: <strong className="text-foreground">{services.length}</strong>
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-xs text-muted-foreground">
                Active: <strong className="text-primary">{services.filter((s) => s.isActive).length}</strong>
              </span>
            </div>

            <Link
              href="/dashboard/vendor/services/new"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "rounded-full text-xs shadow-xs self-start sm:self-auto"
              )}
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              Add New Service
            </Link>
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
          {!loading && !error && services.length === 0 && (
            <Card className="border-border/80 shadow-xs">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blush text-primary flex items-center justify-center mx-auto">
                  <Package className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold">
                    No Wedding Services Listed Yet
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Create your first wedding service package with descriptions, pricing, and high-resolution photos.
                  </p>
                </div>
                <Link
                  href="/dashboard/vendor/services/new"
                  className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6 text-xs")}
                >
                  <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                  Create First Service
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Desktop Table View */}
          {!loading && !error && services.length > 0 && (
            <div className="hidden md:block bg-card rounded-2xl border border-border/80 overflow-hidden shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Service Package</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Approval</TableHead>
                    <TableHead>Live Availability</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => {
                    const isRejected = service.status === "rejected"
                    const isPending = service.status === "pending"
                    const coverPhoto = service.images?.[0]

                    return (
                      <TableRow key={service.id}>
                        {/* Service Photo & Name */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/60">
                              {coverPhoto ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={coverPhoto}
                                  alt={service.serviceName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                                  WP
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate">
                                {service.serviceName}
                              </p>
                              <span className="text-[11px] text-muted-foreground">
                                {service.images?.length || 0} photo(s)
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Category */}
                        <TableCell>
                          <span className="text-xs font-medium text-foreground">
                            {service.category}
                          </span>
                        </TableCell>

                        {/* Price */}
                        <TableCell>
                          <span className="text-xs font-bold text-foreground font-serif">
                            ${service.price.toLocaleString()}
                          </span>
                        </TableCell>

                        {/* Location */}
                        <TableCell>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 truncate max-w-[150px]">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" />
                            {service.location}
                          </span>
                        </TableCell>

                        {/* Status Badge */}
                        <TableCell>
                          <div className="space-y-1">
                            {renderStatusBadge(service.status)}
                            {isPending && (
                              <p className="text-[10px] text-muted-foreground">
                                Visible to couples after approval
                              </p>
                            )}
                            {isRejected && (
                              <p className="text-[10px] text-destructive">
                                Rejected services are not visible
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Live Availability Switch */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={service.isActive}
                              disabled={isRejected || togglingId === service.id}
                              onCheckedChange={(checked) =>
                                handleToggleActive(service, checked)
                              }
                            />
                            <span className="text-xs text-muted-foreground font-medium">
                              {service.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDetailService(service)}
                              className="h-8 px-2 text-xs"
                              title="View details"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              View
                            </Button>
                            <Link
                              href={`/dashboard/vendor/services/${service.id}/edit`}
                              className={cn(
                                buttonVariants({ variant: "ghost", size: "sm" }),
                                "h-8 px-2 text-xs"
                              )}
                              title="Edit service"
                            >
                              <Edit2 className="w-3.5 h-3.5 mr-1 text-primary" />
                              Edit
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(service)}
                              className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                              title="Delete service"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Mobile Cards View */}
          {!loading && !error && services.length > 0 && (
            <div className="md:hidden space-y-3">
              {services.map((service) => {
                const isRejected = service.status === "rejected"
                const isPending = service.status === "pending"
                const coverPhoto = service.images?.[0]

                return (
                  <Card key={service.id} className="border-border/80 shadow-xs overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/60">
                            {coverPhoto ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={coverPhoto}
                                alt={service.serviceName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                WP
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm leading-snug">
                              {service.serviceName}
                            </p>
                            <span className="text-xs font-bold text-foreground font-serif">
                              ${service.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {renderStatusBadge(service.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-muted/40">
                        <div>
                          <span className="text-muted-foreground block">Category:</span>
                          <span className="font-medium text-foreground">{service.category}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Location:</span>
                          <span className="font-medium text-foreground truncate block">
                            {service.location}
                          </span>
                        </div>
                      </div>

                      {/* Availability row */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/60">
                        <span className="text-xs font-medium text-foreground">
                          Live Availability:
                        </span>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={service.isActive}
                            disabled={isRejected || togglingId === service.id}
                            onCheckedChange={(checked) =>
                              handleToggleActive(service, checked)
                            }
                          />
                          <span className="text-xs text-muted-foreground">
                            {service.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>

                      {isPending && (
                        <p className="text-[11px] text-muted-foreground">
                          * Visible to couples once reviewed by admin.
                        </p>
                      )}
                      {isRejected && (
                        <p className="text-[11px] text-destructive">
                          * Rejected services are not visible to customers.
                        </p>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDetailService(service)}
                          className="h-7 px-2.5 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View
                        </Button>
                        <Link
                          href={`/dashboard/vendor/services/${service.id}/edit`}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                            "h-7 px-2.5 text-xs"
                          )}
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteTarget(service)}
                          className="h-7 px-2.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* 1. View Service Details Modal */}
        <Dialog open={!!detailService} onOpenChange={(open) => !open && setDetailService(null)}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold">
                {detailService?.serviceName}
              </DialogTitle>
              <DialogDescription>
                Full details and photo gallery for this wedding package.
              </DialogDescription>
            </DialogHeader>

            {detailService && (
              <div className="space-y-4 py-2">
                {/* Photo gallery preview */}
                {detailService.images && detailService.images.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Photos ({detailService.images.length}):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {detailService.images.map((imgUrl, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-xl overflow-hidden border border-border/80 bg-muted"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUrl}
                            alt={`${detailService.serviceName} photo ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status & Availability row */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Approval Status:</span>
                    {renderStatusBadge(detailService.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Availability:</span>
                    <Badge variant={detailService.isActive ? "default" : "outline"}>
                      {detailService.isActive ? "Live / Active" : "Inactive / Hidden"}
                    </Badge>
                  </div>
                </div>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-border/80 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Category:</span>
                    <span className="font-semibold text-foreground text-sm">
                      {detailService.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Starting Price:</span>
                    <span className="font-bold text-foreground text-sm font-serif">
                      ${detailService.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground block">Location / Coverage:</span>
                    <span className="font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {detailService.location}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="p-3 rounded-xl border border-border/80 space-y-1 text-xs">
                  <span className="text-muted-foreground block font-medium">Package Description:</span>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {detailService.description}
                  </p>
                </div>

                <DialogFooter className="pt-2 gap-2">
                  <Link
                    href={`/dashboard/vendor/services/${detailService.id}/edit`}
                    className={cn(buttonVariants({ variant: "outline" }), "rounded-full text-xs")}
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1 text-primary" />
                    Edit Package
                  </Link>
                  <Button
                    onClick={() => setDetailService(null)}
                    className="rounded-full text-xs"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* 2. Delete Confirmation Modal */}
        <Dialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && !deleting && setDeleteTarget(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold text-destructive">
                Delete Service Package?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                Are you sure you want to permanently delete{" "}
                <strong className="text-foreground">{deleteTarget?.serviceName}</strong>?
                This listing and its associated photo records will be removed. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 pt-3">
              <Button
                variant="outline"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-full text-xs"
              >
                Keep Listing
              </Button>
              <Button
                variant="destructive"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="rounded-full text-xs"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Yes, Delete Package
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
