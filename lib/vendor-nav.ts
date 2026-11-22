import { NavItem } from "@/types"

export const VENDOR_NAV_ITEMS: NavItem[] = [
  { title: "Overview", href: "/dashboard/vendor", icon: "overview" },
  { title: "My Services", href: "/dashboard/vendor/services", icon: "services" },
  { title: "Add Service", href: "/dashboard/vendor/services/new", icon: "add-service" },
  { title: "Booking Requests", href: "/dashboard/vendor/bookings", icon: "bookings" },
  { title: "Subscription", href: "/dashboard/vendor/subscription", icon: "subscription" },
  { title: "Profile Settings", href: "/dashboard/vendor/profile", icon: "profile" },
]
