"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import {
  Package,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Mail,
  MapPin,
  Tag,
  DollarSign,
  Building,
  MoreHorizontal,
  Sparkles,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import {
  getAdminServices,
  getAdminService,
  updateServiceStatus,
  deleteAdminService,
  ApiError,
} from "@/lib/api"
import { Service, SERVICE_CATEGORIES, ServiceCategory } from "@/types"
import { ADMIN_NAV_ITEMS } from "@/lib/admin-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { PremiumBadge } from "@/components/premium-badge"
import { cn } from "@/lib/utils"

function AdminServicesContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Read URL query params
  const initialSearch = searchParams.get("search") || ""
  const initialStatus = searchParams.get("status") || "all"
  const initialCategory = searchParams.get("category") || "all"
  const initialPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10))

  const [searchInput, setSearchInput] = React.useState(initialSearch)
  const [statusFilter, setStatusFilter] = React.useState<string>(initialStatus)
  const [categoryFilter, setCategoryFilter] = React.useState<string>(initialCategory)
  const [page, setPage] = React.useState<number>(initialPage)
  const limit = 10

  const [services, setServices] = React.useState<Service[]>([])
  const [total, setTotal] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)

  // Details Modal
  const [selectedService, setSelectedService] = React.useState<Service | null>(null)
  const [loadingDetails, setLoadingDetails] = React.useState<boolean>(false)
  const [detailsData, setDetailsData] = React.useState<Service | null>(null)

  // Status Change State
  const [statusTarget, setStatusTarget] = React.useState<{
    service: Service
    status: "approved" | "rejected" | "pending"
  } | null>(null)
  const [updatingStatus, setUpdatingStatus] = React.useState<boolean>(false)

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = React.useState<Service | null>(null)
  const [deleting, setDeleting] = React.useState<boolean>(false)

  // Debounced Search Synchronization
  React.useEffect(() => {
    const handler = setTimeout(() => {
      const currentQuery = searchParams.get("search") || ""
      if (searchInput.trim() !== currentQuery) {
        updateQueryParams({ search: searchInput.trim(), page: 1 })
      }
    }, 400)

    return () => clearTimeout(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  // Helper to sync state changes with URL query params
  const updateQueryParams = (updates: {
    search?: string
    status?: string
    category?: string
    page?: number
  }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (updates.search !== undefined) {
      if (updates.search) {
        params.set("search", updates.search)
      } else {
        params.delete("search")
      }
    }

    if (updates.status !== undefined) {
      if (updates.status && updates.status !== "all") {
        params.set("status", updates.status)
      } else {
        params.delete("status")
      }
    }

    if (updates.category !== undefined) {
      if (updates.category && updates.category !== "all") {
        params.set("category", updates.category)
      } else {
        params.delete("category")
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
  }

  // 1. Fetch Services on query param or refresh trigger change
  React.useEffect(() => {
    let active = true

    const currentSearch = searchParams.get("search") || ""
    const currentStatus = searchParams.get("status") || "all"
    const currentCategory = searchParams.get("category") || "all"
    const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10))

    setPage(currentPage)
    setStatusFilter(currentStatus)
    setCategoryFilter(currentCategory)

    getAdminServices({
      search: currentSearch || undefined,
      status: currentStatus !== "all" ? currentStatus : undefined,
      category: currentCategory !== "all" ? currentCategory : undefined,
      page: currentPage,
      limit,
    })
      .then((res) => {
        if (active) {
          setServices(res.services || [])
          setTotal(res.total || 0)
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
  }, [searchParams, refreshTrigger])

  const handleRefresh = () => {
    setLoading(true)
    setError(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  // 2. Open Details Dialog
  const handleOpenDetails = async (service: Service) => {
    setSelectedService(service)
    setLoadingDetails(true)
    try {
      const detailed = await getAdminService(service.id)
      setDetailsData(detailed)
    } catch {
      setDetailsData(service)
    } finally {
      setLoadingDetails(false)
    }
  }

  // 3. Update Service Status
  const handleConfirmStatusChange = async () => {
    if (!statusTarget) return

    setUpdatingStatus(true)
    const { service, status } = statusTarget

    try {
      const res = await updateServiceStatus(service.id, status)
      toast.success(
        res.message ||
          `Service status updated to ${status} successfully.`
      )
      setStatusTarget(null)
      if (selectedService?.id === service.id) {
        setSelectedService(null)
        setDetailsData(null)
      }
      handleRefresh()
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 409) {
        toast.info(err.message || `Service status is already ${status}.`)
        setStatusTarget(null)
        handleRefresh()
      } else {
        const msg =
          err instanceof Error ? err.message : "Failed to update service status."
        toast.error(msg)
      }
    } finally {
      setUpdatingStatus(false)
    }
  }

  // 4. Delete Service
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    setDeleting(true)
    try {
      const res = await deleteAdminService(deleteTarget.id)
      toast.success(res.message || "Service deleted successfully.")
      setDeleteTarget(null)
      if (selectedService?.id === deleteTarget.id) {
        setSelectedService(null)
        setDetailsData(null)
      }
      handleRefresh()
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete service."
      toast.error(msg)
    } finally {
      setDeleting(false)
    }
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
      })
    } catch {
      return dateStr
    }
  }

  const renderStatusBadge = (status: Service["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-600 text-white border-none flex items-center gap-1 text-[11px] w-fit">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-300 flex items-center gap-1 text-[11px] w-fit font-semibold">
            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
            Pending Review
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="flex items-center gap-1 text-[11px] w-fit">
            <XCircle className="w-3 h-3" />
            Rejected
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
        title="Manage Wedding Services"
        subtitle="Review submitted packages, verify vendor authenticity, approve or reject listings, and remove inappropriate content."
      >
        <div className="space-y-6">
          {/* Filter Bar */}
          <Card className="border-border/80 shadow-xs">
            <CardContent className="p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by package name..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-9 text-xs h-9 rounded-xl"
                  />
                </div>

                {/* Status Select Filter */}
                <div className="w-full sm:w-44">
                  <Select
                    value={statusFilter}
                    onValueChange={(val) => {
                      const selected = val || "all"
                      setStatusFilter(selected)
                      updateQueryParams({ status: selected, page: 1 })
                    }}
                  >
                    <SelectTrigger className="w-full text-xs h-9 rounded-xl">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Select Filter */}
                <div className="w-full sm:w-56">
                  <Select
                    value={categoryFilter}
                    onValueChange={(val) => {
                      const selected = val || "all"
                      setCategoryFilter(selected)
                      updateQueryParams({ category: selected, page: 1 })
                    }}
                  >
                    <SelectTrigger className="w-full text-xs h-9 rounded-xl">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {SERVICE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset Filters */}
                {(searchInput || statusFilter !== "all" || categoryFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchInput("")
                      setStatusFilter("all")
                      setCategoryFilter("all")
                      updateQueryParams({
                        search: "",
                        status: "all",
                        category: "all",
                        page: 1,
                      })
                    }}
                    className="text-xs h-9 px-2 text-muted-foreground hover:text-foreground shrink-0"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing {services.length > 0 ? (page - 1) * limit + 1 : 0} –{" "}
              {Math.min(page * limit, total)} of <strong>{total}</strong> services
            </span>
            <span>
              Page {page} of {totalPages}
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
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
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
                  <h3 className="font-serif text-lg font-bold">No Services Found</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {searchInput || statusFilter !== "all" || categoryFilter !== "all"
                      ? "No wedding services match your current search, status, or category filter."
                      : "There are currently no wedding service packages submitted in the system."}
                  </p>
                </div>
                {(searchInput || statusFilter !== "all" || categoryFilter !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchInput("")
                      setStatusFilter("all")
                      setCategoryFilter("all")
                      updateQueryParams({
                        search: "",
                        status: "all",
                        category: "all",
                        page: 1,
                      })
                    }}
                    className="rounded-full text-xs"
                  >
                    Clear Filter Criteria
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Desktop Table View */}
          {!loading && !error && services.length > 0 && (
            <div className="hidden lg:block bg-card rounded-2xl border border-border/80 overflow-hidden shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[280px]">Package</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((s) => {
                    const isPending = s.status === "pending"
                    const coverPhoto = s.images?.[0]
                    const vendorName =
                      s.vendor?.businessName ||
                      s.vendor?.name ||
                      s.vendorName ||
                      "Vendor Partner"

                    return (
                      <TableRow
                        key={s.id}
                        className={cn(
                          isPending && "bg-amber-500/5 hover:bg-amber-500/10 transition-colors"
                        )}
                      >
                        {/* Package Thumbnail & Name */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/60">
                              {coverPhoto ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={coverPhoto}
                                  alt={s.serviceName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                                  WP
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-xs text-foreground truncate">
                                {s.serviceName}
                              </p>
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-primary shrink-0" />
                                <span className="truncate max-w-[150px]">{s.location}</span>
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Category */}
                        <TableCell>
                          <span className="text-xs font-medium text-foreground">
                            {s.category}
                          </span>
                        </TableCell>

                        {/* Price */}
                        <TableCell>
                          <span className="text-xs font-serif font-bold text-foreground">
                            ${s.price.toLocaleString()}
                          </span>
                        </TableCell>

                        {/* Vendor info */}
                        <TableCell>
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-xs text-foreground truncate max-w-[140px]">
                                {vendorName}
                              </p>
                              {s.vendor?.isPremium && (
                                <PremiumBadge size="sm" label="PRO" className="text-[9px] px-1.5 py-0" />
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                              {s.vendor?.email || "No email"}
                            </p>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>{renderStatusBadge(s.status)}</TableCell>

                        {/* Availability */}
                        <TableCell>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              s.isActive ? "text-emerald-600" : "text-muted-foreground"
                            )}
                          >
                            {s.isActive ? "Active" : "Inactive"}
                          </span>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDetails(s)}
                              className="h-8 px-2 text-xs"
                              title="View full package details"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Details
                            </Button>

                            {/* Quick Moderation for Pending */}
                            {isPending ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setStatusTarget({ service: s, status: "approved" })
                                  }
                                  className="h-8 px-2 text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-100"
                                  title="Approve service package"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setStatusTarget({ service: s, status: "rejected" })
                                  }
                                  className="h-8 px-2 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                                  title="Reject service package"
                                >
                                  <XCircle className="w-3.5 h-3.5 mr-1" />
                                  Reject
                                </Button>
                              </>
                            ) : (
                              /* Status change dropdown for published/rejected services */
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  render={
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-2 text-xs"
                                    />
                                  }
                                >
                                  <span>Change Status</span>
                                  <MoreHorizontal className="w-3.5 h-3.5 ml-1" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="text-xs">
                                  <DropdownMenuLabel className="text-[11px] text-muted-foreground">
                                    Set Status to:
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {s.status !== "approved" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setStatusTarget({ service: s, status: "approved" })
                                      }
                                      className="text-emerald-700 cursor-pointer"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                      Set as Approved
                                    </DropdownMenuItem>
                                  )}
                                  {s.status !== "rejected" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setStatusTarget({ service: s, status: "rejected" })
                                      }
                                      className="text-destructive cursor-pointer"
                                    >
                                      <XCircle className="w-3.5 h-3.5 mr-1.5" />
                                      Set as Rejected
                                    </DropdownMenuItem>
                                  )}
                                  {s.status !== "pending" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setStatusTarget({ service: s, status: "pending" })
                                      }
                                      className="text-amber-700 cursor-pointer"
                                    >
                                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                                      Set as Pending Review
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}

                            {/* Delete button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(s)}
                              className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                              title="Delete service permanently"
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

          {/* Mobile / Tablet Cards View */}
          {!loading && !error && services.length > 0 && (
            <div className="lg:hidden space-y-3">
              {services.map((s) => {
                const isPending = s.status === "pending"
                const coverPhoto = s.images?.[0]
                const vendorName =
                  s.vendor?.businessName ||
                  s.vendor?.name ||
                  s.vendorName ||
                  "Vendor Partner"

                return (
                  <Card
                    key={s.id}
                    className={cn(
                      "border-border/80 shadow-xs overflow-hidden",
                      isPending && "border-amber-300 bg-amber-500/5 ring-1 ring-amber-300/40"
                    )}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/60">
                            {coverPhoto ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={coverPhoto}
                                alt={s.serviceName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                WP
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-xs leading-snug">
                              {s.serviceName}
                            </p>
                            <span className="text-xs font-serif font-bold text-foreground">
                              ${s.price.toLocaleString()}
                            </span>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {s.category}
                            </p>
                          </div>
                        </div>

                        {renderStatusBadge(s.status)}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-muted/40">
                        <div>
                          <span className="text-muted-foreground block">Vendor:</span>
                          <span className="font-medium text-foreground truncate block">
                            {vendorName}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Location:</span>
                          <span className="font-medium text-foreground truncate block">
                            {s.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                        <span className="text-[11px] text-muted-foreground">
                          {s.isActive ? "Live in catalog" : "Inactive / Hidden"}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetails(s)}
                            className="h-7 px-2 text-xs"
                          >
                            Details
                          </Button>

                          {isPending ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setStatusTarget({ service: s, status: "approved" })
                                }
                                className="h-7 px-2 text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setStatusTarget({ service: s, status: "rejected" })
                                }
                                className="h-7 px-2 text-xs text-destructive border-destructive/30"
                              >
                                Reject
                              </Button>
                            </>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                  />
                                }
                              >
                                <span>Status</span>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="text-xs">
                                {s.status !== "approved" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setStatusTarget({ service: s, status: "approved" })
                                    }
                                  >
                                    Set Approved
                                  </DropdownMenuItem>
                                )}
                                {s.status !== "rejected" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setStatusTarget({ service: s, status: "rejected" })
                                    }
                                  >
                                    Set Rejected
                                  </DropdownMenuItem>
                                )}
                                {s.status !== "pending" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setStatusTarget({ service: s, status: "pending" })
                                    }
                                  >
                                    Set Pending
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(s)}
                            className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
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

        {/* 1. View Service Details Modal */}
        <Dialog
          open={!!selectedService}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedService(null)
              setDetailsData(null)
            }
          }}
        >
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold">
                {selectedService?.serviceName}
              </DialogTitle>
              <DialogDescription>
                Full package submission, photo assets, and vendor contact info.
              </DialogDescription>
            </DialogHeader>

            {loadingDetails ? (
              <div className="space-y-3 py-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            ) : detailsData ? (
              <div className="space-y-4 py-2 text-xs">
                {/* Photo gallery */}
                {detailsData.images && detailsData.images.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="font-medium text-muted-foreground">
                      Package Photos ({detailsData.images.length}):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {detailsData.images.map((imgUrl, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-xl overflow-hidden border border-border/80 bg-muted"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgUrl}
                            alt={`${detailsData.serviceName} photo ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status & Availability row */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/80">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Moderation Status:</span>
                    {renderStatusBadge(detailsData.status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Availability:</span>
                    <Badge variant={detailsData.isActive ? "default" : "outline"}>
                      {detailsData.isActive ? "Active in directory" : "Hidden by vendor"}
                    </Badge>
                  </div>
                </div>

                {/* Pricing & Category info */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border border-border/80">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Category:</span>
                    <span className="font-semibold text-foreground text-sm">
                      {detailsData.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Starting Price:</span>
                    <span className="font-serif font-bold text-foreground text-sm">
                      ${detailsData.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground block text-[11px]">Coverage Location:</span>
                    <span className="font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {detailsData.location}
                    </span>
                  </div>
                </div>

                {/* Vendor Contact Information (Visible to Admins) */}
                <div className="p-3 rounded-xl border border-border/80 space-y-2 bg-card">
                  <span className="text-muted-foreground block font-medium">Vendor Specialist:</span>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {detailsData.vendor?.businessName ||
                          detailsData.vendor?.name ||
                          detailsData.vendorName ||
                          "WedPlan Partner"}
                      </p>
                      {detailsData.vendor?.name && detailsData.vendor?.businessName && (
                        <p className="text-[11px] text-muted-foreground">
                          Contact: {detailsData.vendor.name}
                        </p>
                      )}
                    </div>
                    {detailsData.vendor?.isPremium && (
                      <PremiumBadge size="sm" label="Premium Vendor" />
                    )}
                  </div>

                  {detailsData.vendor?.email && (
                    <a
                      href={`mailto:${detailsData.vendor.email}`}
                      className="text-primary hover:underline flex items-center gap-1 pt-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {detailsData.vendor.email}
                    </a>
                  )}
                </div>

                {/* Description */}
                <div className="p-3 rounded-xl border border-border/80 space-y-1">
                  <span className="text-muted-foreground block font-medium">Package Description:</span>
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {detailsData.description}
                  </p>
                </div>

                <DialogFooter className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {detailsData.status === "pending" ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const target = detailsData
                            setStatusTarget({ service: target, status: "rejected" })
                          }}
                          className="rounded-full text-xs text-destructive border-destructive/30"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => {
                            const target = detailsData
                            setStatusTarget({ service: target, status: "approved" })
                          }}
                          className="rounded-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Approve
                        </Button>
                      </>
                    ) : (
                      <>
                        {detailsData.status !== "approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const target = detailsData
                              setStatusTarget({ service: target, status: "approved" })
                            }}
                            className="rounded-full text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            Approve
                          </Button>
                        )}
                        {detailsData.status !== "rejected" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const target = detailsData
                              setStatusTarget({ service: target, status: "rejected" })
                            }}
                            className="rounded-full text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Reject
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const target = detailsData
                            setStatusTarget({ service: target, status: "pending" })
                          }}
                          className="rounded-full text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
                        >
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          Mark Pending
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const target = detailsData
                        setDeleteTarget(target)
                      }}
                      className="rounded-full text-xs text-destructive hover:bg-destructive/10 ml-auto sm:ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedService(null)
                      setDetailsData(null)
                    }}
                    className="rounded-full text-xs w-full sm:w-auto"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>

        {/* 2. Status Change Confirmation Modal */}
        <Dialog
          open={!!statusTarget}
          onOpenChange={(open) => !open && !updatingStatus && setStatusTarget(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold">
                {statusTarget?.status === "approved"
                  ? "Approve Service Package?"
                  : statusTarget?.status === "rejected"
                  ? "Reject Service Package?"
                  : "Mark as Pending Review?"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
                Are you sure you want to change the status of{" "}
                <strong className="text-foreground">
                  {statusTarget?.service.serviceName}
                </strong>{" "}
                to <strong className="capitalize">{statusTarget?.status}</strong>?
                {statusTarget?.status === "approved" &&
                  " It will become visible on the public wedding directory for couples."}
                {statusTarget?.status === "rejected" &&
                  " It will be hidden from customer search results and directory catalogs."}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 pt-3">
              <Button
                variant="outline"
                disabled={updatingStatus}
                onClick={() => setStatusTarget(null)}
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button
                disabled={updatingStatus}
                onClick={handleConfirmStatusChange}
                className={cn(
                  "rounded-full text-xs",
                  statusTarget?.status === "approved" &&
                    "bg-emerald-600 hover:bg-emerald-700 text-white",
                  statusTarget?.status === "rejected" &&
                    "bg-destructive hover:bg-destructive/90 text-white"
                )}
              >
                {updatingStatus ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Confirm Status Change
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 3. Delete Confirmation Modal */}
        <Dialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && !deleting && setDeleteTarget(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold text-destructive">
                Delete Service Package?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <strong className="text-foreground">
                  {deleteTarget?.serviceName}
                </strong>
                ? This will remove the package and photo records from the platform permanently. Any existing client reservations will retain booking records marked as inactive.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-2 pt-3">
              <Button
                variant="outline"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-full text-xs"
              >
                Keep Service
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

export default function AdminServicesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8">
          <Skeleton className="h-10 w-48 rounded-xl mb-4" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <AdminServicesContent />
    </React.Suspense>
  )
}
