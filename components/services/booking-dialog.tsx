"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Calendar, MapPin, Loader2, Send, CheckCircle2, ArrowRight } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Service, User } from "@/types"
import { createBooking, ApiError } from "@/lib/api"
import { cn } from "@/lib/utils"

interface BookingDialogProps {
  service: Service
  user: User
  triggerLabel?: string
}

export function BookingDialog({
  service,
  user,
  triggerLabel = "Request Booking",
}: BookingDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [eventDate, setEventDate] = React.useState("")
  const [eventLocation, setEventLocation] = React.useState("")
  const [message, setMessage] = React.useState("")

  const [errors, setErrors] = React.useState<{ date?: string; location?: string; general?: string }>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  // Today's date string YYYY-MM-DD for min date restriction
  const todayString = new Date().toISOString().split("T")[0]

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset form on close
      setTimeout(() => {
        setIsSuccess(false)
        setErrors({})
      }, 200)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { date?: string; location?: string; general?: string } = {}
    if (!eventDate) {
      newErrors.date = "Event date is required."
    } else if (eventDate < todayString) {
      newErrors.date = "Event date must be today or in the future."
    }

    if (!eventLocation.trim()) {
      newErrors.location = "Event location is required."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setSubmitting(true)

    try {
      await createBooking({
        serviceId: service.id,
        eventDate,
        eventLocation: eventLocation.trim(),
        message: message.trim(),
      })

      toast.success("Booking inquiry submitted successfully!")
      setIsSuccess(true)
      setEventDate("")
      setEventLocation("")
      setMessage("")
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit booking request."
      toast.error(msg)

      if (err instanceof ApiError && err.status === 409) {
        setErrors({
          date: msg,
          general: "A booking inquiry already exists for this date. Please pick another date.",
        })
      } else {
        setErrors({ general: msg })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size="lg" className="w-full rounded-full text-sm font-semibold shadow-xs" />
        }
      >
        <Calendar className="w-4 h-4 mr-2" />
        {triggerLabel}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        {isSuccess ? (
          <div className="py-6 px-2 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="font-serif text-2xl font-bold">
                Inquiry Sent Successfully!
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your booking request for{" "}
                <span className="font-semibold text-foreground">{service.serviceName}</span> has
                been sent to the vendor. You can monitor confirmation and replies in your dashboard.
              </DialogDescription>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row justify-center gap-2.5">
              <Link
                href="/dashboard/customer/bookings"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "default" }), "rounded-full px-6")}
              >
                <span>View in My Bookings</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-full px-5"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl font-bold">
                Request Service Booking
              </DialogTitle>
              <DialogDescription>
                Send a direct inquiry to {service.vendorName || "the vendor"} for {service.serviceName}.
              </DialogDescription>
            </DialogHeader>

            {/* Read-Only Summary Context */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-blush/40 border border-primary/10 text-xs">
              <div>
                <span className="text-muted-foreground block">Customer:</span>
                <span className="font-semibold text-foreground">{user.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Package Investment:</span>
                <span className="font-semibold text-primary">
                  ${service.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Inline General Error Banner */}
            {errors.general && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {errors.general}
              </div>
            )}

            {/* Form Controls */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {/* Event Date */}
              <div className="space-y-1.5">
                <Label htmlFor="booking-date" className="text-xs font-semibold">
                  Event Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="booking-date"
                  type="date"
                  min={todayString}
                  value={eventDate}
                  onChange={(e) => {
                    setEventDate(e.target.value)
                    if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }))
                  }}
                  className="h-10"
                />
                {errors.date && (
                  <p className="text-xs text-destructive font-medium">{errors.date}</p>
                )}
              </div>

              {/* Event Location */}
              <div className="space-y-1.5">
                <Label htmlFor="booking-location" className="text-xs font-semibold">
                  Event Location / Venue <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="booking-location"
                    placeholder="e.g. Brooklyn Botanic Garden, New York"
                    value={eventLocation}
                    onChange={(e) => {
                      setEventLocation(e.target.value)
                      if (errors.location) setErrors((prev) => ({ ...prev, location: undefined }))
                    }}
                    className="pl-9 h-10"
                  />
                </div>
                {errors.location && (
                  <p className="text-xs text-destructive font-medium">{errors.location}</p>
                )}
              </div>

              {/* Additional Message */}
              <div className="space-y-1.5">
                <Label htmlFor="booking-message" className="text-xs font-semibold">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="booking-message"
                  placeholder="Tell the vendor about your timeline, guest count, or special vision..."
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={submitting}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full px-6 shadow-xs"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
