"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useAuth } from "@/lib/auth-context"
import { PremiumBadge } from "@/components/premium-badge"
import { CheckCircle, AlertTriangle, Info } from "lucide-react"

// Interactive Auth Role Bar
export function AuthSwitcher() {
  const { user, logout } = useAuth()

  return (
    <Card className="border-primary/20 bg-blush/30 shadow-xs mb-10">
      <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Better Auth Session Status
          </p>
          <p className="text-sm text-foreground">
            Current session:{" "}
            <span className="font-bold capitalize">
              {user ? `${user.role} (${user.name})` : "Logged Out (Guest)"}
            </span>
          </p>
          {user?.businessName && (
            <p className="text-xs text-muted-foreground">
              Business: {user.businessName}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-center">
          {user ? (
            <>
              <Link
                href={`/dashboard/${user.role}`}
                className={cn(buttonVariants({ variant: "default", size: "sm" }), "rounded-full text-xs")}
              >
                Go to {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={logout}
                className="rounded-full text-xs"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full text-xs")}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={cn(buttonVariants({ variant: "default", size: "sm" }), "rounded-full text-xs")}
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Color Tokens & Swatches
export function TokenSwatches() {
  const swatches = [
    { name: "Background", hex: "#FBF8F4", class: "bg-[#FBF8F4] text-[#2A2327] border" },
    { name: "Primary Rose", hex: "#B4566B", class: "bg-[#B4566B] text-white" },
    { name: "Accent Gold", hex: "#C9A66B", class: "bg-[#C9A66B] text-white" },
    { name: "Foreground", hex: "#2A2327", class: "bg-[#2A2327] text-white" },
    { name: "Muted Text", hex: "#6F666B", class: "bg-[#6F666B] text-white" },
    { name: "Blush", hex: "#F6E6E4", class: "bg-[#F6E6E4] text-[#2A2327]" },
    { name: "Sage", hex: "#E7EDE4", class: "bg-[#E7EDE4] text-[#2A2327]" },
    { name: "Border", hex: "#EBE3DD", class: "bg-[#EBE3DD] text-[#2A2327]" },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {swatches.map((item) => (
        <div key={item.name} className="flex flex-col items-center">
          <div
            className={`w-full h-14 rounded-xl shadow-xs border border-border/60 ${item.class} flex items-center justify-center font-bold text-xs`}
          >
            Aa
          </div>
          <span className="text-xs font-medium text-foreground mt-1.5 truncate">
            {item.name}
          </span>
          <span className="text-[10px] text-muted-foreground">{item.hex}</span>
        </div>
      ))}
    </div>
  )
}

// Interactive ShadCN Primitives & Toasts
export function PrimitivesDemo() {
  const [dialogOpen, setDialogOpen] = React.useState(false)

  return (
    <div className="space-y-8">
      {/* Buttons & Toast Triggers */}
      <Card className="p-5">
        <h4 className="font-serif font-bold text-base mb-3">Button Variants & Toast Notifications</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => toast.success("Booking request submitted successfully!")}>
            <CheckCircle className="w-4 h-4 mr-1.5" />
            Toast Success
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error("Booking conflict: Date already reserved.")}
          >
            <AlertTriangle className="w-4 h-4 mr-1.5" />
            Toast Error
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.info("Your service draft has been saved.")}
          >
            <Info className="w-4 h-4 mr-1.5" />
            Toast Info
          </Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive</Button>
          <PremiumBadge />
        </div>
      </Card>

      {/* Form Controls & Dialog */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <h4 className="font-serif font-bold text-base">Form Controls</h4>
          <div className="space-y-1.5">
            <Label htmlFor="preview-name">Full Name</Label>
            <Input id="preview-name" placeholder="e.g. Eleanor Vance" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="preview-category">Service Category</Label>
            <Select>
              <SelectTrigger id="preview-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photo">Photography & Videography</SelectItem>
                <SelectItem value="venue">Wedding Venues</SelectItem>
                <SelectItem value="florist">Decoration & Florist</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="preview-notes">Event Notes</Label>
            <Textarea id="preview-notes" placeholder="Describe your wedding vision..." rows={3} />
          </div>
        </Card>

        <Card className="p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="font-serif font-bold text-base mb-2">Dialog / Modal Component</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Accessible modals for booking requests, confirmations, and vendor moderation.
            </p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger render={<Button variant="outline" className="rounded-full" />}>
                Open Sample Booking Modal
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl">Confirm Booking Request</DialogTitle>
                  <DialogDescription>
                    Send an event inquiry to Julian & Co. Photography.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2 text-sm text-muted-foreground">
                  <p>• Date: October 14, 2026</p>
                  <p>• Location: Brooklyn, New York</p>
                  <p>• Estimated Investment: $3,200</p>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setDialogOpen(false)
                      toast.success("Inquiry sent to vendor!")
                    }}
                  >
                    Confirm & Send
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tabs Demo */}
          <div className="pt-4 border-t border-border">
            <h5 className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-2">
              Tab Navigation
            </h5>
            <Tabs defaultValue="overview">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="services" className="flex-1">Services</TabsTrigger>
                <TabsTrigger value="pricing" className="flex-1">Pricing</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-2 text-xs text-muted-foreground">
                High-level operational stats and booking trends.
              </TabsContent>
              <TabsContent value="services" className="pt-2 text-xs text-muted-foreground">
                List of active wedding packages and portfolios.
              </TabsContent>
              <TabsContent value="pricing" className="pt-2 text-xs text-muted-foreground">
                Free vs Premium tier management.
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>

      {/* Table Demo */}
      <Card className="overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-border/60">
          <CardTitle className="font-serif text-lg">Sample Booking Records Table</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Editorial Photography</TableCell>
                <TableCell>Eleanor Vance</TableCell>
                <TableCell>Oct 14, 2026</TableCell>
                <TableCell className="text-primary font-semibold">$3,200</TableCell>
                <TableCell>
                  <Badge className="bg-sage text-[#244229] border-none">Accepted</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Grand Conservatory</TableCell>
                <TableCell>James & Sarah</TableCell>
                <TableCell>Nov 02, 2026</TableCell>
                <TableCell className="text-primary font-semibold">$8,500</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-amber-600 border-amber-300">
                    Pending
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
