import { NavItem } from "@/types"

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { title: "Overview", href: "/dashboard/admin", icon: "overview" },
  { title: "Manage Users", href: "/dashboard/admin/users", icon: "users" },
  { title: "Manage Services", href: "/dashboard/admin/services", icon: "moderation" },
  { title: "Transactions", href: "/dashboard/admin/transactions", icon: "transactions" },
]
