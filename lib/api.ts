// WedPlan API Client
// Centralized data access layer for services, bookings, and auth
// Replace mock data returns with real fetch calls when backend is connected

import { Service, ServiceCategory } from "@/types"
import { MOCK_SERVICES, MOCK_CATEGORIES } from "@/lib/mock-data"

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
  // Simulating async behavior
  await new Promise((resolve) => setTimeout(resolve, 150))
  return MOCK_SERVICES.filter(
    (service) => service.status === "approved" && service.isAvailable !== false
  ).slice(0, 6)
}

// Fetches all available service categories
export async function getCategories(): Promise<ServiceCategory[]> {
  return MOCK_CATEGORIES
}

// Fetches all approved services with optional category, search, and sorting
export async function getServices(params?: {
  category?: string
  search?: string
  sort?: "asc" | "desc"
}): Promise<Service[]> {
  let list = MOCK_SERVICES.filter((s) => s.status === "approved")

  if (params?.category) {
    list = list.filter((s) => s.category.toLowerCase() === params.category?.toLowerCase())
  }

  if (params?.search) {
    const q = params.search.toLowerCase()
    list = list.filter(
      (s) =>
        s.serviceName.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    )
  }

  if (params?.sort === "asc") {
    list = [...list].sort((a, b) => a.price - b.price)
  } else if (params?.sort === "desc") {
    list = [...list].sort((a, b) => b.price - a.price)
  }

  return list
}

// Fetches a single service by ID
export async function getServiceById(id: string): Promise<Service | null> {
  const service = MOCK_SERVICES.find((s) => s.id === id)
  return service || null
}
