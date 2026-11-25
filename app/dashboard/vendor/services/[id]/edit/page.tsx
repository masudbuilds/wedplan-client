"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Loader2,
  Save,
  AlertCircle,
  DollarSign,
  MapPin,
  Tag,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { MultiImageUpload } from "@/components/multi-image-upload"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getVendorService, updateService, ApiError } from "@/lib/api"
import { SERVICE_CATEGORIES, ServiceCategory, Service } from "@/types"
import { VENDOR_NAV_ITEMS } from "@/lib/vendor-nav"
import { cn } from "@/lib/utils"

interface EditServicePageProps {
  params: Promise<{ id: string }>
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const router = useRouter()
  const resolvedParams = React.use(params)
  const serviceId = resolvedParams.id

  const [loadingInitial, setLoadingInitial] = React.useState(true)
  const [initialError, setInitialError] = React.useState<string | null>(null)
  const [currentService, setCurrentService] = React.useState<Service | null>(null)

  const [serviceName, setServiceName] = React.useState("")
  const [category, setCategory] = React.useState<ServiceCategory | "">("")
  const [description, setDescription] = React.useState("")
  const [price, setPrice] = React.useState<string>("")
  const [location, setLocation] = React.useState("")
  const [images, setImages] = React.useState<string[]>([])

  const [submitting, setSubmitting] = React.useState(false)
  const [clientErrors, setClientErrors] = React.useState<Record<string, string>>({})
  const [serverError, setServerError] = React.useState<string | null>(null)

  // 1. Fetch existing service data
  React.useEffect(() => {
    let active = true

    getVendorService(serviceId)
      .then((data) => {
        if (active) {
          setCurrentService(data)
          setServiceName(data.serviceName || "")
          setCategory(data.category || "")
          setDescription(data.description || "")
          setPrice(String(data.price || ""))
          setLocation(data.location || "")
          setImages(data.images || [])
          setInitialError(null)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          const msg =
            err instanceof Error ? err.message : "Failed to load service."
          setInitialError(msg)
        }
      })
      .finally(() => {
        if (active) setLoadingInitial(false)
      })

    return () => {
      active = false
    }
  }, [serviceId])

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
      errors.images = "Please keep or upload at least 1 photo for your service."
    }

    setClientErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    if (!validate()) {
      toast.error("Please fill in all required fields properly.")
      return
    }

    setSubmitting(true)

    try {
      await updateService(serviceId, {
        serviceName: serviceName.trim(),
        category: category as ServiceCategory,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        images,
      })

      toast.success("Service package updated successfully.")
      router.push("/dashboard/vendor/services")
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setServerError(err.message || "Failed to update service listing.")
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

  const renderStatusBadge = (status?: Service["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-sage text-sage-foreground border border-sage-foreground/15 hover:bg-sage inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-400/30 hover:bg-amber-500/15 inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5">
            <Clock className="w-3 h-3" />
            Pending Review
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <RoleGuard allowedRoles={["vendor"]}>
      <DashboardShell
        navItems={VENDOR_NAV_ITEMS}
        title="Edit Wedding Service"
        subtitle="Update pricing, coverage details, or photos for this service package."
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

          {/* Loading Initial Skeleton */}
          {loadingInitial && (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full rounded-2xl" />
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          )}

          {/* Initial Fetch Error */}
          {initialError && !loadingInitial && (
            <div className="p-8 text-center border border-destructive/25 rounded-2xl bg-card space-y-3">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
              <p className="text-sm font-medium text-foreground">{initialError}</p>
              <Link
                href="/dashboard/vendor/services"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full text-xs")}
              >
                Return to Services List
              </Link>
            </div>
          )}

          {!loadingInitial && !initialError && currentService && (
            <>
              {/* Status Bar */}
              <div className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">
                    Moderation Status
                  </span>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {renderStatusBadge(currentService.status)}
                    <span className="text-xs text-muted-foreground">
                      {currentService.status === "approved"
                        ? "Currently live on public directory."
                        : currentService.status === "pending"
                        ? "Awaiting admin moderation."
                        : "Rejected by admin moderation."}
                    </span>
                  </div>
                </div>
                <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
                  <span className="text-xs text-muted-foreground block">Availability</span>
                  <Badge variant={currentService.isActive ? "default" : "outline"} className="text-[11px] font-medium px-2.5 py-0.5">
                    {currentService.isActive ? "Active" : "Hidden"}
                  </Badge>
                </div>
              </div>

              {/* General Server Error */}
              {serverError && (
                <div className="p-4 rounded-2xl border border-destructive/25 bg-destructive/5 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
                <div className="space-y-1 pb-5 border-b border-border">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                    Edit Package Details
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Modifications are saved immediately to your listing.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 1. Service Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="serviceName" className="text-xs font-medium text-foreground">
                      Service Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="serviceName"
                      value={serviceName}
                      onChange={(e) => {
                        setServiceName(e.target.value)
                        if (clientErrors.serviceName) {
                          setClientErrors((prev) => ({ ...prev, serviceName: "" }))
                        }
                      }}
                      className={cn("h-10 rounded-xl", clientErrors.serviceName && "border-destructive")}
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
                      <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-primary-text" />
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
                        <SelectTrigger className={cn("w-full h-10 rounded-xl", clientErrors.category && "border-destructive")}>
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
                      <Label htmlFor="price" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-primary-text" />
                        Starting Price ($ USD) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        min="1"
                        step="1"
                        value={price}
                        onChange={(e) => {
                          setPrice(e.target.value)
                          if (clientErrors.price) {
                            setClientErrors((prev) => ({ ...prev, price: "" }))
                          }
                        }}
                        className={cn("h-10 rounded-xl", clientErrors.price && "border-destructive")}
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
                    <Label htmlFor="location" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary-text" />
                      Location / Service Area <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value)
                        if (clientErrors.location) {
                          setClientErrors((prev) => ({ ...prev, location: "" }))
                        }
                      }}
                      className={cn("h-10 rounded-xl", clientErrors.location && "border-destructive")}
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
                    <Label htmlFor="description" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-primary-text" />
                      Service Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value)
                        if (clientErrors.description) {
                          setClientErrors((prev) => ({ ...prev, description: "" }))
                        }
                      }}
                      className={cn("rounded-xl", clientErrors.description && "border-destructive")}
                      disabled={submitting}
                    />
                    {clientErrors.description && (
                      <p className="text-[11px] text-destructive">
                        {clientErrors.description}
                      </p>
                    )}
                  </div>

                  {/* 5. Photos */}
                  <div className="space-y-2.5 pt-4 border-t border-border">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-medium text-foreground">
                        Service Photos (1 to 5) <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-[11px] text-muted-foreground">
                        Manage existing images or add new ones.
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
                  <div className="pt-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-border">
                    <Link
                      href="/dashboard/vendor/services"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full sm:w-auto rounded-full text-xs h-10 px-5"
                      )}
                    >
                      Cancel
                    </Link>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto rounded-full text-xs shadow-xs h-10 px-6 cursor-pointer"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1.5" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </DashboardShell>
    </RoleGuard>
  )
}
