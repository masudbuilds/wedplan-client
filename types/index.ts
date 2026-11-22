// WedPlan Type Definitions
// Derived directly from the WedPlan Assignment Specification and Server API Contract

export type UserRole = "customer" | "vendor" | "admin"

export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: UserRole
  isBlocked?: boolean
  businessName?: string
  subscriptionPlan?: "free" | "premium"
  subscriptionExpiresAt?: string | null
  createdAt?: string
}

export type ServiceCategory =
  | "Photography & Videography"
  | "Wedding Venues"
  | "Decoration & Florist"
  | "Catering Services"
  | "Makeup & Styling"
  | "Wedding Fashion"

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
]

export type ServiceStatus = "pending" | "approved" | "rejected"

export interface VendorPreview {
  name: string
  businessName: string
  image: string
  isPremium?: boolean
}

export interface Service {
  id: string
  _id?: string
  vendorId: string
  vendorName?: string
  vendorImage?: string
  vendor?: VendorPreview
  isPremium?: boolean
  serviceName: string
  category: ServiceCategory
  description: string
  price: number
  location: string
  images: string[]
  status: ServiceStatus
  isActive?: boolean
  isAvailable?: boolean
  createdAt: string
  updatedAt?: string
}

export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled"

export interface Booking {
  id: string
  _id?: string
  serviceId: string
  vendorId: string
  customerId: string
  customerName?: string
  customerEmail?: string
  customerImage?: string
  eventDate: string
  eventLocation: string
  message?: string
  status: BookingStatus
  createdAt: string
  serviceName?: string
  serviceImage?: string
  vendor?: {
    name: string
    businessName: string
    image: string
  }
  vendorName?: string
  vendorImage?: string
  service?: {
    id?: string
    serviceName: string
    category?: string
    price?: number
    location?: string
    images?: string[]
  }
  customer?: {
    name: string
    email: string
    image?: string
  }
}

export interface CustomerStats {
  totalBookings: number
  pending: number
  accepted: number
  rejected: number
  cancelled: number
}

export interface VendorStats {
  totalServices: number
  activeServices: number
  pendingBookings: number
  acceptedBookings: number
  subscriptionPlan: "free" | "premium"
  isPremium: boolean
  subscriptionExpiresAt: string | null
}

export interface ServicesResponse {
  services: Service[]
  total: number
  page: number
  limit: number
}

export type TransactionStatus = "pending" | "completed" | "failed"

export interface Transaction {
  id: string
  vendorId: string
  vendorName?: string
  vendorEmail?: string
  vendor?: {
    name: string
    businessName: string
    email: string
  }
  plan: "premium" | string
  amount: number
  currency: string
  stripeSessionId?: string | null
  stripeSubscriptionId?: string | null
  status: TransactionStatus
  createdAt: string
}

export interface VendorSubscription {
  plan: "free" | "premium"
  isPremium: boolean
  subscriptionExpiresAt: string | null
  cancelAtPeriodEnd: boolean
  transactions: Transaction[]
}

export interface SessionStatusResponse {
  paymentStatus: string
  isPremium: boolean
  subscriptionExpiresAt: string | null
}

export interface CreateServiceInput {
  serviceName: string
  category: ServiceCategory
  description: string
  price: number
  location: string
  images: string[]
}

export interface UpdateServiceInput {
  serviceName?: string
  category?: ServiceCategory
  description?: string
  price?: number
  location?: string
  images?: string[]
}

export interface NavItem {
  title: string
  href: string
  icon?: string
  badge?: string | number
}

// Admin Types
export interface AdminStats {
  totalUsers: number
  totalVendors: number
  totalCustomers: number
  totalServices: number
  pendingServices: number
  totalTransactions: number
}

export interface AdminUser {
  id: string
  name: string
  email: string
  image?: string
  role: UserRole
  isBlocked: boolean
  businessName?: string
  subscriptionPlan?: "free" | "premium"
  subscriptionExpiresAt?: string | null
  createdAt?: string
  serviceCount?: number
  bookingCount?: number
}

export interface AdminUsersResponse {
  success: boolean
  total: number
  page: number
  limit: number
  users: AdminUser[]
}

export interface AdminServicesResponse {
  success: boolean
  total: number
  page: number
  limit: number
  services: Service[]
}

export interface AdminTransactionsResponse {
  success: boolean
  total: number
  page: number
  limit: number
  transactions: Transaction[]
}

