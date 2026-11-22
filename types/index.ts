// WedPlan Type Definitions
// Derived directly from the WedPlan Assignment Specification

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

export type ServiceStatus = "pending" | "approved" | "rejected"

export interface Service {
  id: string
  vendorId: string
  vendorName?: string
  vendorImage?: string
  serviceName: string
  category: ServiceCategory
  description: string
  price: number
  location: string
  images: string[]
  status: ServiceStatus
  isAvailable?: boolean
  createdAt: string
}

export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled"

export interface Booking {
  id: string
  serviceId: string
  serviceName?: string
  serviceImage?: string
  vendorId: string
  customerId: string
  customerName?: string
  customerEmail?: string
  eventDate: string
  eventLocation: string
  message?: string
  status: BookingStatus
  createdAt: string
}

export type TransactionStatus = "pending" | "completed" | "failed"

export interface Transaction {
  id: string
  vendorId: string
  vendorName?: string
  plan: "premium"
  amount: number
  currency: string
  stripeSessionId?: string
  stripeSubscriptionId?: string
  status: TransactionStatus
  createdAt: string
}

export interface NavItem {
  title: string
  href: string
  icon?: string
  badge?: string | number
}
