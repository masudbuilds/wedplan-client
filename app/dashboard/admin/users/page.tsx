"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import {
  Users,
  Search,
  Filter,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Mail,
  Calendar,
  Building,
  Sparkles,
  Lock,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { getAdminUsers, getAdminUser, blockUser, unblockUser, ApiError } from "@/lib/api"
import { AdminUser, UserRole } from "@/types"
import { ADMIN_NAV_ITEMS } from "@/lib/admin-nav"
import { useAuth } from "@/lib/auth-context"
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
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function AdminUsersContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user: currentUser } = useAuth()

  // Read URL query params
  const initialSearch = searchParams.get("search") || ""
  const initialRole = searchParams.get("role") || "all"
  const initialPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10))

  const [searchInput, setSearchInput] = React.useState(initialSearch)
  const [roleFilter, setRoleFilter] = React.useState<string>(initialRole)
  const [page, setPage] = React.useState<number>(initialPage)
  const limit = 10

  const [users, setUsers] = React.useState<AdminUser[]>([])
  const [total, setTotal] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)

  // Details Modal
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null)
  const [loadingDetails, setLoadingDetails] = React.useState<boolean>(false)
  const [detailsData, setDetailsData] = React.useState<AdminUser | null>(null)

  // Block/Unblock Confirmation Modal
  const [blockTarget, setBlockTarget] = React.useState<{
    user: AdminUser
    action: "block" | "unblock"
  } | null>(null)
  const [actionLoading, setActionLoading] = React.useState<boolean>(false)

  // Debounced Search synchronization
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
    role?: string
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

    if (updates.role !== undefined) {
      if (updates.role && updates.role !== "all") {
        params.set("role", updates.role)
      } else {
        params.delete("role")
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

  // 1. Fetch Users on param or trigger change
  React.useEffect(() => {
    let active = true

    const currentSearch = searchParams.get("search") || ""
    const currentRole = searchParams.get("role") || "all"
    const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10))

    setPage(currentPage)
    setRoleFilter(currentRole)

    getAdminUsers({
      search: currentSearch || undefined,
      role: currentRole !== "all" ? currentRole : undefined,
      page: currentPage,
      limit,
    })
      .then((res) => {
        if (active) {
          setUsers(res.users || [])
          setTotal(res.total || 0)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const msg =
            err instanceof Error ? err.message : "Failed to load platform users."
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

  // 2. Fetch User Details for modal
  const handleOpenDetails = async (u: AdminUser) => {
    setSelectedUser(u)
    setLoadingDetails(true)
    try {
      const detailed = await getAdminUser(u.id)
      setDetailsData(detailed)
    } catch {
      // Fallback to table data
      setDetailsData(u)
    } finally {
      setLoadingDetails(false)
    }
  }

  // 3. Handle Block / Unblock action
  const handleConfirmAction = async () => {
    if (!blockTarget) return

    const { user: target, action } = blockTarget

    // Safety checks against blocking self or fellow admins
    if (action === "block") {
      if (target.id === currentUser?.id) {
        toast.error("Administrators cannot block their own account.")
        setBlockTarget(null)
        return
      }
      if (target.role === "admin") {
        toast.error("Administrator accounts cannot be blocked.")
        setBlockTarget(null)
        return
      }
    }

    setActionLoading(true)

    try {
      if (action === "block") {
        const res = await blockUser(target.id)
        toast.success(res.message || `User "${target.name}" has been blocked.`)
      } else {
        const res = await unblockUser(target.id)
        toast.success(res.message || `User "${target.name}" has been unblocked.`)
      }
      setBlockTarget(null)
      handleRefresh()
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        toast.error(err.message)
      } else {
        const msg =
          err instanceof Error
            ? err.message
            : `Failed to ${action} user account.`
        toast.error(msg)
      }
      // Refresh list to stay in sync with server state
      handleRefresh()
    } finally {
      setActionLoading(false)
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

  const renderRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-foreground text-background border-none font-medium text-[11px]">
            Admin
          </Badge>
        )
      case "vendor":
        return (
          <Badge className="bg-primary text-white border-none font-medium text-[11px]">
            Vendor
          </Badge>
        )
      case "customer":
      default:
        return (
          <Badge variant="outline" className="text-[11px] text-muted-foreground border-border">
            Customer
          </Badge>
        )
    }
  }

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <DashboardShell
        navItems={ADMIN_NAV_ITEMS}
        title="User Management"
        subtitle="Inspect registered customer, vendor, and administrator accounts across the WedPlan ecosystem."
      >
        <div className="space-y-6">
          {/* Filter Bar */}
          <Card className="border-border/80 shadow-xs">
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by user name or email address..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 text-xs h-9 rounded-xl"
                />
              </div>

              {/* Role Select Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
                <Select
                  value={roleFilter}
                  onValueChange={(val) => {
                    const selected = val || "all"
                    setRoleFilter(selected)
                    updateQueryParams({ role: selected, page: 1 })
                  }}
                >
                  <SelectTrigger className="w-full sm:w-44 text-xs h-9 rounded-xl">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="customer">Customers</SelectItem>
                    <SelectItem value="vendor">Vendors</SelectItem>
                    <SelectItem value="admin">Administrators</SelectItem>
                  </SelectContent>
                </Select>

                {(searchInput || roleFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchInput("")
                      setRoleFilter("all")
                      updateQueryParams({ search: "", role: "all", page: 1 })
                    }}
                    className="text-xs h-9 px-2 text-muted-foreground hover:text-foreground"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Counter */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing {users.length > 0 ? (page - 1) * limit + 1 : 0} –{" "}
              {Math.min(page * limit, total)} of <strong>{total}</strong> users
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
                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && users.length === 0 && (
            <Card className="border-border/80 shadow-xs">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blush text-primary flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-bold">No Users Found</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {searchInput || roleFilter !== "all"
                      ? "No registered accounts match your active search or role criteria."
                      : "There are currently no registered users in the database."}
                  </p>
                </div>
                {(searchInput || roleFilter !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchInput("")
                      setRoleFilter("all")
                      updateQueryParams({ search: "", role: "all", page: 1 })
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
          {!loading && !error && users.length > 0 && (
            <div className="hidden md:block bg-card rounded-2xl border border-border/80 overflow-hidden shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[280px]">User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Plan / Business</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => {
                    const isSelf = currentUser?.id === u.id
                    const isAdmin = u.role === "admin"
                    const canBlock = !isSelf && !isAdmin

                    return (
                      <TableRow key={u.id}>
                        {/* Avatar & Name & Email */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 border border-border shrink-0">
                              <AvatarImage src={u.image} />
                              <AvatarFallback className="bg-blush text-primary text-xs font-semibold">
                                {u.name.slice(0, 2).toUpperCase() || "WP"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-xs text-foreground truncate">
                                  {u.name || "Nameless User"}
                                </p>
                                {isSelf && (
                                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded font-medium">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Role */}
                        <TableCell>{renderRoleBadge(u.role)}</TableCell>

                        {/* Plan / Business */}
                        <TableCell>
                          <div className="space-y-0.5 text-xs">
                            {u.role === "vendor" ? (
                              <>
                                <p className="font-medium text-foreground truncate max-w-[150px]">
                                  {u.businessName || "Vendor Business"}
                                </p>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  {u.subscriptionPlan === "premium" ? (
                                    <span className="text-[#9A6E2E] dark:text-[#E2C38C] font-semibold flex items-center gap-1">
                                      <Sparkles className="w-3 h-3 text-[#C9A66B]" /> Premium
                                    </span>
                                  ) : (
                                    "Free Tier"
                                  )}
                                </span>
                              </>
                            ) : (
                              <span className="text-muted-foreground text-xs">—</span>
                            )}
                          </div>
                        </TableCell>

                        {/* Status (Blocked / Active) */}
                        <TableCell>
                          {u.isBlocked ? (
                            <Badge variant="destructive" className="flex items-center gap-1 text-[11px] w-fit">
                              <Ban className="w-3 h-3" />
                              Blocked
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 flex items-center gap-1 text-[11px] w-fit">
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </Badge>
                          )}
                        </TableCell>

                        {/* Joined Date */}
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(u.createdAt)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDetails(u)}
                              className="h-8 px-2 text-xs"
                              title="View user details"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Details
                            </Button>

                            {/* Block / Unblock Button */}
                            {canBlock ? (
                              u.isBlocked ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setBlockTarget({ user: u, action: "unblock" })
                                  }
                                  className="h-8 px-2.5 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                                  Unblock
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setBlockTarget({ user: u, action: "block" })
                                  }
                                  className="h-8 px-2.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                                >
                                  <Ban className="w-3.5 h-3.5 mr-1" />
                                  Block
                                </Button>
                              )
                            ) : (
                              <span
                                className="text-[11px] text-muted-foreground/60 italic px-2 flex items-center gap-1"
                                title={
                                  isSelf
                                    ? "Cannot block your own active administrator account"
                                    : "Administrator accounts cannot be blocked"
                                }
                              >
                                <Lock className="w-3 h-3" /> Protected
                              </span>
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

          {/* Mobile Cards View */}
          {!loading && !error && users.length > 0 && (
            <div className="md:hidden space-y-3">
              {users.map((u) => {
                const isSelf = currentUser?.id === u.id
                const isAdmin = u.role === "admin"
                const canBlock = !isSelf && !isAdmin

                return (
                  <Card key={u.id} className="border-border/80 shadow-xs overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-10 h-10 border border-border shrink-0">
                            <AvatarImage src={u.image} />
                            <AvatarFallback className="bg-blush text-primary text-xs font-semibold">
                              {u.name.slice(0, 2).toUpperCase() || "WP"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-semibold text-xs leading-snug">
                                {u.name || "Nameless User"}
                              </p>
                              {isSelf && (
                                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.2 rounded font-medium">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              {u.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          {renderRoleBadge(u.role)}
                          {u.isBlocked ? (
                            <span className="text-[10px] font-semibold text-destructive">
                              Blocked
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-medium">
                              Active
                            </span>
                          )}
                        </div>
                      </div>

                      {u.role === "vendor" && (
                        <div className="text-[11px] p-2 rounded-lg bg-muted/40 flex items-center justify-between">
                          <span className="text-muted-foreground">Business:</span>
                          <span className="font-medium text-foreground">
                            {u.businessName || "Vendor"} ({u.subscriptionPlan || "free"})
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                        <span className="text-[11px] text-muted-foreground">
                          Joined {formatDate(u.createdAt)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetails(u)}
                            className="h-7 px-2 text-xs"
                          >
                            Details
                          </Button>
                          {canBlock ? (
                            u.isBlocked ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setBlockTarget({ user: u, action: "unblock" })
                                }
                                className="h-7 px-2 text-xs text-emerald-700 border-emerald-300"
                              >
                                Unblock
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setBlockTarget({ user: u, action: "block" })
                                }
                                className="h-7 px-2 text-xs text-destructive border-destructive/30"
                              >
                                Block
                              </Button>
                            )
                          ) : (
                            <span className="text-[10px] text-muted-foreground/60 italic">
                              Protected
                            </span>
                          )}
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

        {/* 1. View User Details Modal */}
        <Dialog
          open={!!selectedUser}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedUser(null)
              setDetailsData(null)
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl font-bold">
                User Account Details
              </DialogTitle>
              <DialogDescription>
                System records, role assignments, and platform engagement counts.
              </DialogDescription>
            </DialogHeader>

            {loadingDetails ? (
              <div className="space-y-3 py-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            ) : detailsData ? (
              <div className="space-y-4 py-2 text-xs">
                {/* Header profile info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/80">
                  <Avatar className="w-12 h-12 border border-border">
                    <AvatarImage src={detailsData.image} />
                    <AvatarFallback className="bg-blush text-primary font-semibold">
                      {detailsData.name.slice(0, 2).toUpperCase() || "WP"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {detailsData.name}
                      </p>
                      {renderRoleBadge(detailsData.role)}
                    </div>
                    <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-primary" /> {detailsData.email}
                    </p>
                  </div>
                </div>

                {/* Status & Subscription row */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl border border-border/80">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Account Status:</span>
                    <span className="font-semibold text-foreground">
                      {detailsData.isBlocked ? (
                        <span className="text-destructive font-bold">Blocked Account</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">Active Account</span>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Registered Date:</span>
                    <span className="font-medium text-foreground">
                      {formatDate(detailsData.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Vendor specific info */}
                {detailsData.role === "vendor" && (
                  <div className="p-3 rounded-xl border border-border/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Business Name:</span>
                        <span className="font-semibold text-foreground text-sm">
                          {detailsData.businessName || "Not configured"}
                        </span>
                      </div>
                      <Badge variant="outline" className="capitalize text-xs">
                        {detailsData.subscriptionPlan || "free"} plan
                      </Badge>
                    </div>
                    <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                      <span className="text-muted-foreground">Submitted Packages:</span>
                      <strong className="text-primary font-serif text-sm">
                        {detailsData.serviceCount ?? 0} service(s)
                      </strong>
                    </div>
                  </div>
                )}

                {/* Customer specific info */}
                {detailsData.role === "customer" && (
                  <div className="p-3 rounded-xl border border-border/80 flex items-center justify-between">
                    <span className="text-muted-foreground">Submitted Booking Inquiries:</span>
                    <strong className="text-primary font-serif text-sm">
                      {detailsData.bookingCount ?? 0} booking(s)
                    </strong>
                  </div>
                )}

                <DialogFooter className="pt-2">
                  <Button
                    onClick={() => {
                      setSelectedUser(null)
                      setDetailsData(null)
                    }}
                    className="w-full rounded-full text-xs"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>

        {/* 2. Block / Unblock Confirmation Modal */}
        <Dialog
          open={!!blockTarget}
          onOpenChange={(open) => !open && !actionLoading && setBlockTarget(null)}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle
                className={cn(
                  "font-serif text-xl font-bold",
                  blockTarget?.action === "block" ? "text-destructive" : "text-emerald-700"
                )}
              >
                {blockTarget?.action === "block" ? "Block User Account?" : "Unblock User Account?"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
                {blockTarget?.action === "block" ? (
                  <>
                    Are you sure you want to block this user account?
                    This user will immediately be logged out of all active sessions and prevented from signing in or creating bookings.
                  </>
                ) : (
                  <>
                    Are you sure you want to unblock this user account?
                    They will regain access to log in and use their account normally.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            {blockTarget?.user && (
              <div className="p-3 my-1 rounded-xl bg-muted/40 border border-border/70 flex items-center gap-3">
                <Avatar className="w-10 h-10 border border-border shrink-0">
                  <AvatarImage src={blockTarget.user.image} />
                  <AvatarFallback className="bg-blush text-primary text-xs font-semibold">
                    {blockTarget.user.name.slice(0, 2).toUpperCase() || "WP"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-xs text-foreground truncate">
                      {blockTarget.user.name}
                    </p>
                    {renderRoleBadge(blockTarget.user.role)}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {blockTarget.user.email}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 pt-3">
              <Button
                variant="outline"
                disabled={actionLoading}
                onClick={() => setBlockTarget(null)}
                className="rounded-full text-xs"
              >
                Cancel
              </Button>
              <Button
                variant={blockTarget?.action === "block" ? "destructive" : "default"}
                disabled={actionLoading}
                onClick={handleConfirmAction}
                className={cn(
                  "rounded-full text-xs",
                  blockTarget?.action === "unblock" &&
                    "bg-emerald-600 hover:bg-emerald-700 text-white"
                )}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Updating...
                  </>
                ) : blockTarget?.action === "block" ? (
                  <>
                    <Ban className="w-4 h-4 mr-1.5" />
                    Confirm Block
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-1.5" />
                    Confirm Unblock
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

export default function AdminUsersPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8">
          <Skeleton className="h-10 w-48 rounded-xl mb-4" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      }
    >
      <AdminUsersContent />
    </React.Suspense>
  )
}
