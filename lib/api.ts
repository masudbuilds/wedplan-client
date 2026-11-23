// WedPlan Centralized API Client
// Handles public service listings, bookings, vendor services/analytics, payments, and JWT authentication

import {
  Service,
  ServiceCategory,
  Booking,
  CustomerStats,
  VendorStats,
  VendorSubscription,
  SessionStatusResponse,
  CreateServiceInput,
  UpdateServiceInput,
  ServicesResponse,
  AdminStats,
  AdminUser,
  AdminUsersResponse,
  AdminServicesResponse,
  AdminTransactionsResponse,
} from "@/types"
import { toast } from "sonner"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Custom API Error carrying HTTP status code and server error message
export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

// Single fetch wrapper: automatically attaches JWT Bearer token for authenticated calls
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  // Client-side: Automatically retrieve & attach JWT token if available
  if (typeof window !== "undefined" && !headers["Authorization"]) {
    try {
      const { authClient } = await import("@/lib/auth-client")
      const { data } = await authClient.token()
      if (data?.token) {
        headers["Authorization"] = `Bearer ${data.token}`
      }
    } catch {
      // Proceed without token if not signed in
    }
  }

  let res: Response
  try {
    res = await fetch(url, {
      ...options,
      headers,
    })
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Failed to connect to the server."
    throw new ApiError(0, msg)
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message =
      data?.message || data?.error || `Request failed with status ${res.status}`

    // 401 Unauthorized: Redirect to sign-in with current path as redirect query
    if (res.status === 401 && typeof window !== "undefined") {
      const currentPath = window.location.pathname + window.location.search
      if (!window.location.pathname.startsWith("/sign-in")) {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = `/sign-in?redirect=${encodeURIComponent(currentPath)}`
      }
    }

    // 403 Forbidden with suspended/blocked message: Force sign-out and alert user
    if (
      res.status === 403 &&
      typeof window !== "undefined" &&
      typeof message === "string" &&
      (message.toLowerCase().includes("block") ||
        message.toLowerCase().includes("suspend"))
    ) {
      toast.error(message)
      try {
        const { authClient } = await import("@/lib/auth-client")
        await authClient.signOut()
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/sign-in"
      } catch {
        // Ignore
      }
    }

    throw new ApiError(res.status, message)
  }

  return data as T
}

// ---------------------------------------------------------------------------
// Public Services & Categories API
// ---------------------------------------------------------------------------

// Fetches 6 approved and active featured services for the home page
export async function getFeaturedServices(): Promise<Service[]> {
  const res = await apiFetch<{ success: boolean; services: Service[] }>(
    "/services/featured"
  )
  return res.services || []
}

// Fetches the 6 wedding categories from the server
export async function getCategories(): Promise<ServiceCategory[]> {
  const res = await apiFetch<{
    success: boolean
    categories: ServiceCategory[]
  }>("/categories")
  return res.categories || []
}

export interface GetServicesFilters {
  search?: string
  category?: string
  location?: string
  sort?: string // "default" | "price-asc" | "price-desc" | "price_asc" | "price_desc"
  page?: number
  limit?: number
}

// Fetches services with search, category, location, price sort, and pagination
export async function getServices(
  filters: GetServicesFilters = {}
): Promise<ServicesResponse> {
  const params = new URLSearchParams()

  if (filters.search && filters.search.trim()) {
    params.set("search", filters.search.trim())
  }
  if (
    filters.category &&
    filters.category.trim() &&
    filters.category.toLowerCase() !== "all"
  ) {
    params.set("category", filters.category.trim())
  }
  if (
    filters.location &&
    filters.location.trim() &&
    filters.location.toLowerCase() !== "all"
  ) {
    params.set("location", filters.location.trim())
  }

  if (filters.sort === "price-asc" || filters.sort === "price_asc") {
    params.set("sort", "price_asc")
  } else if (filters.sort === "price-desc" || filters.sort === "price_desc") {
    params.set("sort", "price_desc")
  }

  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page))
  }
  if (filters.limit) {
    params.set("limit", String(filters.limit))
  }

  const query = params.toString() ? `?${params.toString()}` : ""
  const res = await apiFetch<{
    success: boolean
    total: number
    page: number
    limit: number
    services: Service[]
  }>(`/services${query}`)

  return {
    services: res.services || [],
    total: res.total || 0,
    page: res.page || 1,
    limit: res.limit || 12,
  }
}

// Fetches a single approved & active service by ID
export async function getServiceById(id: string): Promise<Service> {
  const res = await apiFetch<{ success: boolean; service: Service }>(
    `/services/${id}`
  )
  return res.service
}

// ---------------------------------------------------------------------------
// Customer Bookings API
// ---------------------------------------------------------------------------

export interface CreateBookingInput {
  serviceId: string
  eventDate: string
  eventLocation: string
  message?: string
}

// Customer submits a booking inquiry
export async function createBooking(
  input: CreateBookingInput
): Promise<Booking> {
  const res = await apiFetch<{
    success: boolean
    message: string
    booking: Booking
  }>("/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  })
  return res.booking
}

// Customer fetches their own booking history
export async function getMyBookings(): Promise<Booking[]> {
  const res = await apiFetch<{
    success: boolean
    count: number
    bookings: Booking[]
  }>("/bookings/my")
  return res.bookings || []
}

// Fetches a single booking details (customer or vendor owner)
export async function getBookingById(id: string): Promise<Booking> {
  const res = await apiFetch<{ success: boolean; booking: Booking }>(
    `/bookings/${id}`
  )
  return res.booking
}

// Customer cancels a pending booking
export async function cancelBooking(
  id: string
): Promise<{ success: boolean; message: string }> {
  return await apiFetch<{ success: boolean; message: string }>(
    `/bookings/${id}/cancel`,
    {
      method: "PATCH",
    }
  )
}

// ---------------------------------------------------------------------------
// Customer Dashboard Statistics API
// ---------------------------------------------------------------------------

// Fetches customer booking metrics
export async function getCustomerStats(): Promise<CustomerStats> {
  const res = await apiFetch<{ success: boolean; stats: CustomerStats }>(
    "/customer/stats"
  )
  return res.stats
}

// ---------------------------------------------------------------------------
// Vendor Services & Management API
// ---------------------------------------------------------------------------

// Fetches vendor dashboard statistics
export async function getVendorStats(): Promise<VendorStats> {
  const res = await apiFetch<{ success: boolean; stats: VendorStats }>(
    "/vendor/stats"
  )
  return res.stats
}

// Fetches all services owned by the vendor (all statuses)
export async function getVendorServices(): Promise<Service[]> {
  const res = await apiFetch<{
    success: boolean
    count: number
    services: Service[]
  }>("/vendor/services")
  return res.services || []
}

// Fetches a single service owned by the vendor
export async function getVendorService(id: string): Promise<Service> {
  const res = await apiFetch<{ success: boolean; service: Service }>(
    `/vendor/services/${id}`
  )
  return res.service
}

// Creates a new vendor service
export async function createService(
  input: CreateServiceInput
): Promise<Service> {
  const res = await apiFetch<{
    success: boolean
    message: string
    service: Service
  }>("/vendor/services", {
    method: "POST",
    body: JSON.stringify(input),
  })
  return res.service
}

// Updates an existing vendor service
export async function updateService(
  id: string,
  input: UpdateServiceInput
): Promise<Service> {
  const res = await apiFetch<{
    success: boolean
    message: string
    service: Service
  }>(`/vendor/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  })
  return res.service
}

// Toggles vendor service availability
export async function setServiceAvailability(
  id: string,
  isActive: boolean
): Promise<Service> {
  const res = await apiFetch<{
    success: boolean
    message: string
    service: Service
  }>(`/vendor/services/${id}/availability`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  })
  return res.service
}

// Deletes a vendor service
export async function deleteService(
  id: string
): Promise<{ success: boolean; message: string }> {
  return await apiFetch<{ success: boolean; message: string }>(
    `/vendor/services/${id}`,
    {
      method: "DELETE",
    }
  )
}

// ---------------------------------------------------------------------------
// Vendor Bookings API
// ---------------------------------------------------------------------------

// Fetches received bookings for the vendor
export async function getVendorBookings(status?: string): Promise<Booking[]> {
  const query = status && status !== "all" ? `?status=${encodeURIComponent(status)}` : ""
  const res = await apiFetch<{
    success: boolean
    count: number
    bookings: Booking[]
  }>(`/vendor/bookings${query}`)
  return res.bookings || []
}

// Updates booking status (accepted or rejected)
export async function updateBookingStatus(
  id: string,
  status: "accepted" | "rejected"
): Promise<{ success: boolean; message: string }> {
  return await apiFetch<{ success: boolean; message: string }>(
    `/vendor/bookings/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  )
}

// ---------------------------------------------------------------------------
// Vendor Subscription & Stripe Payments API
// ---------------------------------------------------------------------------

// Fetches vendor subscription status, expiry, and past transactions
export async function getVendorSubscription(): Promise<VendorSubscription> {
  return await apiFetch<VendorSubscription>("/vendor/subscription")
}

// Creates Stripe Checkout session for Premium upgrade
export async function createCheckoutSession(): Promise<{ url: string }> {
  return await apiFetch<{ success: boolean; url: string }>(
    "/payments/create-checkout-session",
    {
      method: "POST",
    }
  )
}

// Queries payment session status during polling on success page
export async function getSessionStatus(
  sessionId: string
): Promise<SessionStatusResponse> {
  return await apiFetch<SessionStatusResponse>(
    `/payments/session-status?session_id=${encodeURIComponent(sessionId)}`
  )
}

// Schedules subscription cancellation at end of period
export async function cancelSubscription(): Promise<{
  success: boolean
  message: string
  subscriptionExpiresAt: string
  cancelAtPeriodEnd: boolean
}> {
  return await apiFetch<{
    success: boolean
    message: string
    subscriptionExpiresAt: string
    cancelAtPeriodEnd: boolean
  }>("/payments/cancel-subscription", {
    method: "POST",
  })
}

// ---------------------------------------------------------------------------
// Admin Dashboard & Moderation API
// ---------------------------------------------------------------------------

// Fetches platform overview metrics for admin dashboard
export async function getAdminStats(): Promise<AdminStats> {
  const res = await apiFetch<{ success: boolean; stats: AdminStats }>(
    "/admin/stats"
  )
  return res.stats
}

// Lists platform users with search, role filter, and pagination
export async function getAdminUsers(params: {
  search?: string
  role?: string
  page?: number
  limit?: number
} = {}): Promise<AdminUsersResponse> {
  const query = new URLSearchParams()
  if (params.search) query.set("search", params.search)
  if (params.role && params.role !== "all") query.set("role", params.role)
  if (params.page) query.set("page", String(params.page))
  if (params.limit) query.set("limit", String(params.limit))

  const qs = query.toString() ? `?${query.toString()}` : ""
  return await apiFetch<AdminUsersResponse>(`/admin/users${qs}`)
}

// Fetches user details with activity counts (serviceCount, bookingCount)
export async function getAdminUser(id: string): Promise<AdminUser> {
  const res = await apiFetch<{ success: boolean; user: AdminUser }>(
    `/admin/users/${id}`
  )
  return res.user
}

// Blocks a user and invalidates their active sessions
export async function blockUser(
  id: string
): Promise<{ success: boolean; message: string; user: AdminUser }> {
  return await apiFetch<{ success: boolean; message: string; user: AdminUser }>(
    `/admin/users/${id}/block`,
    {
      method: "PATCH",
    }
  )
}

// Unblocks a previously blocked user
export async function unblockUser(
  id: string
): Promise<{ success: boolean; message: string; user: AdminUser }> {
  return await apiFetch<{ success: boolean; message: string; user: AdminUser }>(
    `/admin/users/${id}/unblock`,
    {
      method: "PATCH",
    }
  )
}

// Lists all platform services with search, status, category, and pagination
export async function getAdminServices(params: {
  search?: string
  status?: string
  category?: string
  page?: number
  limit?: number
} = {}): Promise<AdminServicesResponse> {
  const query = new URLSearchParams()
  if (params.search) query.set("search", params.search)
  if (params.status && params.status !== "all") query.set("status", params.status)
  if (params.category && params.category !== "all") query.set("category", params.category)
  if (params.page) query.set("page", String(params.page))
  if (params.limit) query.set("limit", String(params.limit))

  const qs = query.toString() ? `?${query.toString()}` : ""
  return await apiFetch<AdminServicesResponse>(`/admin/services${qs}`)
}

// Fetches a single service with full metadata and vendor contact details
export async function getAdminService(id: string): Promise<Service> {
  const res = await apiFetch<{ success: boolean; service: Service }>(
    `/admin/services/${id}`
  )
  return res.service
}

// Moderates service status ("approved", "rejected", "pending")
export async function updateServiceStatus(
  id: string,
  status: "approved" | "rejected" | "pending"
): Promise<{ success: boolean; message: string; service: Service }> {
  return await apiFetch<{
    success: boolean
    message: string
    service: Service
  }>(`/admin/services/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

// Permanently deletes an inappropriate service
export async function deleteAdminService(
  id: string
): Promise<{ success: boolean; message: string }> {
  return await apiFetch<{ success: boolean; message: string }>(
    `/admin/services/${id}`,
    {
      method: "DELETE",
    }
  )
}

// Lists platform billing transactions (strictly READ ONLY - no edit endpoints)
export async function getAdminTransactions(params: {
  status?: string
  page?: number
  limit?: number
} = {}): Promise<AdminTransactionsResponse> {
  const query = new URLSearchParams()
  if (params.status && params.status !== "all") query.set("status", params.status)
  if (params.page) query.set("page", String(params.page))
  if (params.limit) query.set("limit", String(params.limit))

  const qs = query.toString() ? `?${query.toString()}` : ""
  return await apiFetch<AdminTransactionsResponse>(`/admin/transactions${qs}`)
}

