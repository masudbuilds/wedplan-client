"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Heart,
  Menu,
  LogOut,
  LayoutDashboard,
  CalendarCheck,
  Package,
  PlusCircle,
  CreditCard,
  Users,
  Layers,
  Receipt,
  Settings,
  LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { NavItem } from "@/types"
import { cn } from "@/lib/utils"

// Icon registry for dashboard items
const ICON_MAP: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  services: Package,
  "add-service": PlusCircle,
  bookings: CalendarCheck,
  subscription: CreditCard,
  users: Users,
  moderation: Layers,
  transactions: Receipt,
  profile: Settings,
}

interface DashboardShellProps {
  navItems: NavItem[]
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export function DashboardShell({
  navItems,
  title,
  subtitle,
  children,
}: DashboardShellProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const renderNavLinks = (onClick?: () => void) => (
    <div className="space-y-1">
      {navItems.map((item) => {
        const Icon = (item.icon && ICON_MAP[item.icon]) || LayoutDashboard
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-blush/50 hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{item.title}</span>
            {item.badge !== undefined && (
              <span
                className={cn(
                  "ml-auto text-xs px-2 py-0.5 rounded-full font-medium",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card shrink-0 p-5 justify-between">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blush flex items-center justify-center text-primary">
              <Heart className="w-4 h-4 fill-current" />
            </span>
            <span className="font-serif text-xl font-bold text-foreground">
              WedPlan
            </span>
          </Link>

          <nav>{renderNavLinks()}</nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="pt-4 border-t border-border space-y-3">
          <div className="flex items-center gap-2.5">
            <Avatar className="w-9 h-9 border border-border">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="bg-blush text-primary text-xs">
                {user?.name?.slice(0, 2).toUpperCase() || "WP"}
              </AvatarFallback>
            </Avatar>
            <div className="truncate">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.name || "Guest User"}
              </p>
              <p className="text-[11px] text-muted-foreground capitalize">
                {user?.role || "Preview Mode"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Navigation Header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-16 border-b border-border bg-card">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-current" />
            <span className="font-serif text-lg font-bold">WedPlan</span>
          </Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-5 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="font-serif text-xl font-bold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary fill-current" />
                  WedPlan
                </div>
                {renderNavLinks(() => setMobileOpen(false))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout()
                  setMobileOpen(false)
                }}
                className="w-full text-destructive border-destructive/30"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </SheetContent>
          </Sheet>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {(title || subtitle) && (
            <div className="border-b border-border/60 pb-5">
              {title && (
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
