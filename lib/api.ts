// WedPlan Centralized API Client
// Handles public service listings, booking requests, customer statistics, and JWT authentication

import {
  Service,
  ServiceCategory,
  Booking,
  CustomerStats,
  ServicesResponse,
} from "@/types"
import { toast } from "sonner"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

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
