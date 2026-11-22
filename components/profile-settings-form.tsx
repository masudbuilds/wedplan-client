"use client"

import * as React from "react"
import { toast } from "sonner"
import { Loader2, Save, User as UserIcon, Mail, Briefcase, Shield } from "lucide-react"
import { User } from "@/types"
import { updateUser } from "@/lib/auth-client"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"

interface ProfileSettingsFormProps {
  user: User
  className?: string
}

export function ProfileSettingsForm({ user, className }: ProfileSettingsFormProps) {
  const { refreshUser } = useAuth()

  const [name, setName] = React.useState(user.name || "")
  const [image, setImage] = React.useState(user.image || "")
  const [businessName, setBusinessName] = React.useState(user.businessName || "")
  const [saving, setSaving] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const isVendor = user.role === "vendor"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage("Full name is required.")
      return
    }

    if (isVendor && !businessName.trim()) {
      setErrorMessage("Business name is required for vendor accounts.")
      return
    }

    setSaving(true)

    try {
      const payload: { name: string; image?: string; businessName?: string } = {
        name: name.trim(),
        image: image || undefined,
      }

      if (isVendor) {
        payload.businessName = businessName.trim()
      }

      // 1. Submit update via Better Auth client
      type UpdatePayload = Parameters<typeof updateUser>[0] & { businessName?: string }
      const updateFn = updateUser as (data: UpdatePayload) => ReturnType<typeof updateUser>

      const res = await updateFn(payload)

      if (res.error) {
        throw new Error(res.error.message || "Failed to update profile settings.")
      }

      // 2. Immediately refresh user in AuthContext so Navbar and Sidebar reflect updates
      await refreshUser()
      toast.success("Profile updated successfully!")
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile settings."
      setErrorMessage(msg)
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Account Profile Settings</CardTitle>
        <CardDescription>
          Update your public profile details and profile picture.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="p-3 text-xs rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
              {errorMessage}
            </div>
          )}

          {/* Profile Photo Upload */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Profile Photo</Label>
            <div className="flex items-center gap-4">
              <ImageUpload
                value={image}
                onChange={(url) => setImage(url)}
                disabled={saving}
                label="Change Profile Photo"
              />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Avatar Image</p>
                <p>This image is displayed in the navigation bar and on your reviews.</p>
                <p className="text-[11px] text-muted-foreground/80">
                  Recommended: Square JPG, PNG, or WebP up to 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-name" className="text-xs font-semibold">
                Full Name <span className="text-primary">*</span>
              </Label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={saving}
                  placeholder="e.g. Eleanor Vance"
                  className="pl-9 h-10"
                  required
                />
              </div>
            </div>

            {/* Read-Only Email */}
            <div className="space-y-1.5">
              <Label htmlFor="profile-email" className="text-xs font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="profile-email"
                  value={user.email}
                  disabled
                  className="pl-9 h-10 bg-muted/50 cursor-not-allowed opacity-80"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Email cannot be modified directly.
              </p>
            </div>
          </div>

          {/* Vendor Business Name (Only visible for Vendors) */}
          {isVendor && (
            <div className="space-y-1.5">
              <Label htmlFor="profile-business" className="text-xs font-semibold">
                Business / Studio Name <span className="text-primary">*</span>
              </Label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  id="profile-business"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={saving}
                  placeholder="e.g. Julian & Co. Photography"
                  className="pl-9 h-10 border-primary/30"
                  required
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Displayed as the headline organization on your wedding service cards.
              </p>
            </div>
          )}

          {/* Read-Only Account Security & Role Status */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>
                Account Role:{" "}
                <strong className="text-foreground capitalize">{user.role}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs capitalize">
                {user.role === "customer" ? "Couple Account" : `${user.role} Account`}
              </Badge>
              {user.subscriptionPlan && (
                <Badge className="bg-blush text-primary border-primary/20 text-xs capitalize">
                  {user.subscriptionPlan} Plan
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="rounded-full px-6 shadow-xs"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
