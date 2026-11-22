"use client"

import * as React from "react"
import { toast } from "sonner"
import { Calendar, MapPin, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { createBooking } from "@/lib/api"

interface BookingDialogProps {
  service: Service
  user: User
  triggerLabel?: string
}

// Accessible booking inquiry modal with client-side validation and toast feedback
export function BookingDialog({
  service,
  user,
  triggerLabel = "Request Booking",
}: BookingDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [eventDate, setEventDate] = React.useState("")
  const [eventLocation, setEventLocation] = React.useState("")
  const [message, setMessage] = React.useState("")

  const [errors, setErrors] = React.useState<{ date?: string; location?: string }>({})
  const [submitting, setSubmitting] = React.useState(false)

  // Today's date string YYYY-MM-DD for min date restriction
  const todayString = new Date().toISOString().split("T")[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: { date?: string; location?: string } = {}
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
      const res = await createBooking({
        serviceId: service.id,
        serviceName: service.serviceName,
        vendorId: service.vendorId,
        customerId: user.id,
        customerName: user.name,
        customerEmail: user.email,
        eventDate,
        eventLocation: eventLocation.trim(),
        message: message.trim(),
      })

      if (res.success) {
        toast.success(res.message || "Booking request sent successfully!")
        setOpen(false)
        setEventDate("")
        setEventLocation("")
        setMessage("")
      } else {
        toast.error(res.message || "Failed to submit booking request.")
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="lg" className="w-full rounded-full text-sm font-semibold shadow-xs" />
        }
      >
        <Calendar className="w-4 h-4 mr-2" />
        {triggerLabel}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
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
            <span className="font-semibold text-primary">${service.price.toLocaleString()}</span>
          </div>
        </div>

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
      </DialogContent>
    </Dialog>
  )
}
