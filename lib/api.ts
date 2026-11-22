// WedPlan API Client
// Simple fetch wrapper for backend communication

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Helper to make fetch requests with standard headers
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
