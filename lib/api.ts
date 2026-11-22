// WedPlan API Client
// Centralized data access layer for services, bookings, and auth
// Replace mock data returns with real fetch calls when backend is connected

import { Service, ServiceCategory, Booking } from "@/types"
import { MOCK_SERVICES, MOCK_CATEGORIES, MOCK_BOOKINGS } from "@/lib/mock-data"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Generic fetch wrapper with standard headers
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "An unexpected error occurred",
        error: data?.error,
      }
    }

    return {
      success: true,
      data: (data?.data ?? data) as T,
      message: data?.message,
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to connect to the server"

    return {
      success: false,
      message: errorMessage,
    }
  }
}

// ---------------------------------------------------------------------------
// Service Data Fetching (Mocked for now, easily swappable with backend API)
// ---------------------------------------------------------------------------

// Fetches 6 approved and active services for the homepage
export async function getFeaturedServices(): Promise<Service[]> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return MOCK_SERVICES.filter(
    (service) => service.status === "approved" && service.isAvailable !== false
  ).slice(0, 6)
}

// Fetches all available service categories
export async function getCategories(): Promise<ServiceCategory[]> {
  return MOCK_CATEGORIES
}

export interface GetServicesFilters {
  search?: string
  category?: string
  location?: string
  sort?: string // "default" | "price-asc" | "price-desc"
}

// Fetches approved & active services with search, category, location, and price sorting
export async function getServices(
  filters: GetServicesFilters = {}
): Promise<Service[]> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 250))

  // Only approved and active services are visible publicly
  let results = MOCK_SERVICES.filter(
    (item) => item.status === "approved" && item.isAvailable !== false
  )

  // 1. Filter by Category
  if (filters.category && filters.category !== "all") {
    const targetCat = filters.category.toLowerCase().trim()
    results = results.filter(
      (item) => item.category.toLowerCase().trim() === targetCat
    )
  }

  // 2. Filter by Search Query (Service Name, Description, or Vendor)
  if (filters.search && filters.search.trim() !== "") {
    const q = filters.search.toLowerCase().trim()
    results = results.filter(
      (item) =>
        item.serviceName.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.vendorName && item.vendorName.toLowerCase().includes(q))
    )
  }

  // 3. Filter by Location
  if (filters.location && filters.location !== "all" && filters.location.trim() !== "") {
    const loc = filters.location.toLowerCase().trim()
    results = results.filter((item) =>
      item.location.toLowerCase().includes(loc)
    )
  }

  // 4. Sort by Price
  if (filters.sort === "price-asc") {
    results = [...results].sort((a, b) => a.price - b.price)
  } else if (filters.sort === "price-desc") {
    results = [...results].sort((a, b) => b.price - a.price)
  }

  return results
}

// Fetches a single service by ID
export async function getServiceById(id: string): Promise<Service | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const service = MOCK_SERVICES.find(
    (item) => item.id === id && item.status === "approved"
  )
  return service || null
}

// ---------------------------------------------------------------------------
// Booking Submission (Mocked with rule checks)
// ---------------------------------------------------------------------------

export interface CreateBookingInput {
  serviceId: string
  serviceName: string
  vendorId: string
  customerId: string
  customerName: string
  customerEmail: string
  eventDate: string
  eventLocation: string
  message?: string
}

export async function createBooking(
  input: CreateBookingInput
): Promise<ApiResponse<Booking>> {
  await new Promise((resolve) => setTimeout(resolve, 350))

  // PDF Rule: Prevent duplicate active booking requests for the same service and event date
  const isDuplicate = MOCK_BOOKINGS.some(
    (b) =>
      b.serviceId === input.serviceId &&
      b.eventDate === input.eventDate &&
      b.status !== "cancelled" &&
      b.status !== "rejected"
  )

  if (isDuplicate) {
    return {
      success: false,
      message:
        "This service is already requested or booked for the selected event date. Please choose another date.",
    }
  }

  const newBooking: Booking = {
    id: `book-${Date.now()}`,
    serviceId: input.serviceId,
    serviceName: input.serviceName,
    vendorId: input.vendorId,
    customerId: input.customerId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    eventDate: input.eventDate,
    eventLocation: input.eventLocation,
    message: input.message,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  MOCK_BOOKINGS.push(newBooking)

  return {
    success: true,
    data: newBooking,
    message: "Your booking request has been sent to the vendor!",
  }
}
