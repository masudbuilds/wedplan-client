"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Loader2,
  PlusCircle,
  Crown,
  AlertCircle,
  DollarSign,
  MapPin,
  Tag,
  FileText,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { MultiImageUpload } from "@/components/multi-image-upload"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { createService, ApiError } from "@/lib/api"
import { SERVICE_CATEGORIES, ServiceCategory } from "@/types"
import { VENDOR_NAV_ITEMS } from "@/lib/vendor-nav"
import { cn } from "@/lib/utils"

export default function NewServicePage() {
  const router = useRouter()

  const [serviceName, setServiceName] = React.useState("")
  const [category, setCategory] = React.useState<ServiceCategory | "">("")
  const [description, setDescription] = React.useState("")
  const [price, setPrice] = React.useState<string>("")
  const [location, setLocation] = React.useState("")
  const [images, setImages] = React.useState<string[]>([])

  const [submitting, setSubmitting] = React.useState(false)
  const [clientErrors, setClientErrors] = React.useState<Record<string, string>>({})
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [isLimitReached, setIsLimitReached] = React.useState(false)

  const validate = (): boolean => {
    const errors: Record<string, string> = {}

    if (!serviceName.trim()) {
      errors.serviceName = "Service package name is required."
    }

    if (!category) {
      errors.category = "Please select a service category."
    }

    if (!description.trim()) {
      errors.description = "Please provide a detailed service description."
    } else if (description.trim().length < 20) {
      errors.description = "Description should be at least 20 characters."
    }

    const numPrice = Number(price)
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      errors.price = "Price must be a valid number greater than 0."
    }

    if (!location.trim()) {
      errors.location = "Service location or coverage area is required."
    }

    if (images.length === 0) {
      errors.images = "Please upload at least 1 photo for your service."
    }

    setClientErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)
    setIsLimitReached(false)

    if (!validate()) {
      toast.error("Please fill in all required fields properly.")
      return
    }

    setSubmitting(true)

    try {
      await createService({
        serviceName: serviceName.trim(),
        category: category as ServiceCategory,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        images,
      })

      toast.success("Service submitted. Waiting for admin approval.")
      router.push("/dashboard/vendor/services")
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          setIsLimitReached(true)
          setServerError(
            err.message ||
              "Free tier limit reached (maximum 3 active services). Please upgrade to Premium for unlimited listings."
          )
        } else {
          setServerError(err.message || "Failed to create service listing.")
        }
      } else {
        const msg =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while saving."
        setServerError(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <RoleGuard allowedRoles={["vendor"]}>
      <DashboardShell
        navItems={VENDOR_NAV_ITEMS}
        title="Create Wedding Service"
        subtitle="List a new wedding package. New listings are reviewed by admin moderation before going live."
      >
        <div className="max-w-3xl space-y-6">
          {/* Back button */}
          <div>
            <Link
              href="/dashboard/vendor/services"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to My Services
            </Link>
          </div>

          {/* Limit Reached 403 Banner */}
          {isLimitReached && (
            <Card className="border-accent/40 bg-accent/10 shadow-xs">
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold text-sm text-foreground">
                      Free Account Limit Reached
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {serverError}
                  </p>
                </div>
                <Link
                  href="/dashboard/vendor/subscription"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-full text-xs shadow-xs shrink-0"
                  )}
                >
                  <Crown className="w-3.5 h-3.5 mr-1.5" />
                  Upgrade to Premium
                </Link>
              </CardContent>
            </Card>
          )}

          {/* General Server Error */}
          {serverError && !isLimitReached && (
            <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <Card className="border-border/80 shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-xl font-bold">
                Package Details
              </CardTitle>
              <CardDescription>
                Provide detailed information and showcase high-quality images to attract couples.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Service Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="serviceName" className="text-xs font-medium">
                    Service Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="serviceName"
                    placeholder="e.g. Deluxe Bridal Photography Package"
                    value={serviceName}
                    onChange={(e) => {
                      setServiceName(e.target.value)
                      if (clientErrors.serviceName) {
                        setClientErrors((prev) => ({ ...prev, serviceName: "" }))
                      }
                    }}
                    className={cn(clientErrors.serviceName && "border-destructive")}
                    disabled={submitting}
                  />
                  {clientErrors.serviceName && (
                    <p className="text-[11px] text-destructive">
                      {clientErrors.serviceName}
                    </p>
                  )}
                </div>

                {/* 2. Category & Price (2 cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-primary" />
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={category}
                      onValueChange={(val) => {
                        setCategory(val as ServiceCategory)
                        if (clientErrors.category) {
                          setClientErrors((prev) => ({ ...prev, category: "" }))
                        }
                      }}
                      disabled={submitting}
                    >
                      <SelectTrigger className={cn(clientErrors.category && "border-destructive")}>
                        <SelectValue placeholder="Select wedding category" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {clientErrors.category && (
                      <p className="text-[11px] text-destructive">
                        {clientErrors.category}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <Label htmlFor="price" className="text-xs font-medium flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-primary" />
                      Starting Price ($ USD) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="e.g. 1500"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value)
                        if (clientErrors.price) {
                          setClientErrors((prev) => ({ ...prev, price: "" }))
                        }
                      }}
                      className={cn(clientErrors.price && "border-destructive")}
                      disabled={submitting}
                    />
                    {clientErrors.price && (
                      <p className="text-[11px] text-destructive">
                        {clientErrors.price}
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. Location */}
                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    Location / Service Area <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g. New York, NY (or Nationwide travel)"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value)
                      if (clientErrors.location) {
                        setClientErrors((prev) => ({ ...prev, location: "" }))
                      }
                    }}
                    className={cn(clientErrors.location && "border-destructive")}
                    disabled={submitting}
                  />
                  {clientErrors.location && (
                    <p className="text-[11px] text-destructive">
                      {clientErrors.location}
                    </p>
                  )}
                </div>

                {/* 4. Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs font-medium flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    Service Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Describe what is included in this wedding package (hours of coverage, deliverables, equipment, team size, etc.)..."
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                      if (clientErrors.description) {
                        setClientErrors((prev) => ({ ...prev, description: "" }))
                      }
                    }}
                    className={cn(clientErrors.description && "border-destructive")}
                    disabled={submitting}
                  />
                  {clientErrors.description && (
                    <p className="text-[11px] text-destructive">
                      {clientErrors.description}
                    </p>
                  )}
                </div>

                {/* 5. Images (1 to 5) */}
                <div className="space-y-2 pt-2 border-t border-border/70">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium">
                      Service Photos (1 to 5) <span className="text-destructive">*</span>
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      Upload high-resolution photos showcasing your previous wedding work.
                    </p>
                  </div>
                  <MultiImageUpload
                    values={images}
                    onChange={(newImages) => {
                      setImages(newImages)
                      if (newImages.length > 0 && clientErrors.images) {
                        setClientErrors((prev) => ({ ...prev, images: "" }))
                      }
                    }}
                    disabled={submitting}
                    maxImages={5}
                  />
                  {clientErrors.images && (
                    <p className="text-[11px] text-destructive">
                      {clientErrors.images}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-border/60">
                  <Link
                    href="/dashboard/vendor/services"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full sm:w-auto rounded-full text-xs"
                    )}
                  >
                    Cancel
                  </Link>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto rounded-full text-xs shadow-xs px-6"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting Service...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 mr-1.5" />
                        Publish Listing
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
