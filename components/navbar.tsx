"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Heart, LogOut, LayoutDashboard, Settings, ChevronDown } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, role, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "vendor"
      ? "/dashboard/vendor"
      : "/dashboard/customer"

  const profileHref =
    role === "vendor"
      ? "/dashboard/vendor/profile"
      : role === "admin"
      ? "/dashboard/admin"
      : "/dashboard/customer/profile"

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Services", href: "/services" },
  ]

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "WP"

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-full bg-blush flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <Heart className="w-4 h-4 fill-current" />
          </span>
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            WedPlan
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-full p-0.5 pr-2 border border-border/70 bg-card hover:border-primary/40 hover:bg-muted/40 transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary/30 cursor-pointer">
                <Avatar className="w-8 h-8 border border-border">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="bg-blush text-primary-text text-xs font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl space-y-1">
                <DropdownMenuLabel className="font-normal p-2.5 rounded-lg bg-background/70 border border-border/60">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="w-9 h-9 border border-border shrink-0">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-blush text-primary-text text-xs font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <p className="text-sm font-semibold text-foreground truncate leading-none">
                          {user.name}
                        </p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize bg-blush text-primary-text shrink-0">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate leading-snug">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={() => router.push(dashboardHref)}
                  className="cursor-pointer flex items-center gap-2.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(profileHref)}
                  className="cursor-pointer flex items-center gap-2.5"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={logout}
                  className="cursor-pointer flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/signin"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "rounded-full text-foreground hover:text-primary"
                )}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "rounded-full px-4 shadow-xs"
                )}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Sheet */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="rounded-full" />}>
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80 p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <SheetHeader className="text-left">
                  <SheetTitle className="font-serif text-2xl font-bold flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary fill-primary" />
                    WedPlan
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "py-2 text-base transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user && (
                    <>
                      <Link
                        href={dashboardHref}
                        onClick={() => setMobileOpen(false)}
                        className="py-2 text-base text-muted-foreground hover:text-primary flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        href={profileHref}
                        onClick={() => setMobileOpen(false)}
                        className="py-2 text-base text-muted-foreground hover:text-primary flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Profile Settings
                      </Link>
                    </>
                  )}
                </nav>
              </div>

              {/* Mobile Auth Bottom Action */}
              <div className="pt-6 border-t border-border space-y-3">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 border border-border">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="bg-blush text-primary text-xs font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="truncate">
                        <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-destructive border-destructive/30"
                      onClick={() => {
                        logout()
                        setMobileOpen(false)
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/signin"
                      onClick={() => setMobileOpen(false)}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "text-center")}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileOpen(false)}
                      className={cn(buttonVariants({ size: "sm" }), "text-center")}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
