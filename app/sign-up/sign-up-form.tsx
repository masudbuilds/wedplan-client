"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, EyeOff, Check, X, Loader2, Sparkles, User, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/image-upload"
import { GoogleButton } from "@/components/auth/google-button"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialRole = searchParams.get("role") === "vendor" ? "vendor" : "customer"

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [role, setRole] = React.useState<"customer" | "vendor">(initialRole)
  const [businessName, setBusinessName] = React.useState("")
  const [image, setImage] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")

  // Password rules check
  const hasMinLength = password.length >= 6
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const isPasswordValid = hasMinLength && hasUpper && hasLower

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!name.trim()) {
      setErrorMsg("Please enter your full name.")
      return
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.")
      return
    }

    if (!isPasswordValid) {
      setErrorMsg("Please meet all password requirements before submitting.")
      return
    }

    if (role === "vendor" && !businessName.trim()) {
      setErrorMsg("Please provide your business or studio name.")
      return
    }

    setIsLoading(true)

    try {
      type SignUpPayload = Parameters<typeof authClient.signUp.email>[0] & {
        role?: string
        businessName?: string
      }
      const signUpFn = authClient.signUp.email as (
        data: SignUpPayload
      ) => ReturnType<typeof authClient.signUp.email>

      const res = await signUpFn({
        name: name.trim(),
        email: email.trim(),
        password,
        image: image || undefined,
        role,
        businessName: role === "vendor" ? businessName.trim() : undefined,
      })

      if (res.error) {
        setErrorMsg(res.error.message || "Failed to create account.")
        toast.error(res.error.message || "Sign up failed")
        setIsLoading(false)
        return
      }

      toast.success("Welcome to WedPlan! Your account has been created.")
      const destination = role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer"
      router.push(destination)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong during sign up."
      setErrorMsg(msg)
      toast.error(msg)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Role Selection Tabs */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Account Type
        </Label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted/60 rounded-xl">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={cn(
              "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer",
              role === "customer"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole("vendor")}
            className={cn(
              "flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer",
              role === "vendor"
                ? "bg-card text-foreground shadow-xs font-semibold text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Vendor</span>
          </button>
        </div>
      </div>

      {/* Google Quick Sign-Up */}
      <div className="space-y-3">
        <GoogleButton label="Sign up with Google" callbackURL="/dashboard" />
        <div className="relative flex items-center justify-center text-xs text-muted-foreground">
          <div className="w-full border-t border-border" />
          <span className="bg-card px-3 relative">or continue with email</span>
          <div className="w-full border-t border-border" />
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 text-xs rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
            {errorMsg}
          </div>
        )}

        {/* Profile Image (Optional) */}
        <div className="space-y-1.5">
          <Label className="text-xs">Profile Photo (Optional)</Label>
          <ImageUpload
            value={image}
            onChange={(url) => setImage(url)}
            label="Upload Avatar Photo"
            disabled={isLoading}
          />
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-name" className="text-xs">
            Full Name <span className="text-primary">*</span>
          </Label>
          <Input
            id="signup-name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
            className="h-10"
          />
        </div>

        {/* Business Name (Vendors only) */}
        {role === "vendor" && (
          <div className="space-y-1.5 animate-fadeIn">
            <Label htmlFor="signup-business" className="text-xs">
              Business / Studio Name <span className="text-primary">*</span>
            </Label>
            <Input
              id="signup-business"
              type="text"
              placeholder="Enter your studio or business name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              disabled={isLoading}
              required
              className="h-10 border-primary/40 focus-visible:border-primary"
            />
            <p className="text-[11px] text-muted-foreground">
              This name will be displayed on all your public wedding service listings.
            </p>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-email" className="text-xs">
            Email Address <span className="text-primary">*</span>
          </Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="h-10"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="signup-password" className="text-xs">
            Password <span className="text-primary">*</span>
          </Label>
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="h-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Inline Password Rules Indicator */}
          <div className="grid grid-cols-3 gap-1 pt-1.5 text-[11px]">
            <span
              className={cn(
                "flex items-center gap-1",
                hasMinLength ? "text-emerald-600 font-medium" : "text-muted-foreground"
              )}
            >
              {hasMinLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              6+ chars
            </span>
            <span
              className={cn(
                "flex items-center gap-1",
                hasUpper ? "text-emerald-600 font-medium" : "text-muted-foreground"
              )}
            >
              {hasUpper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              1 uppercase
            </span>
            <span
              className={cn(
                "flex items-center gap-1",
                hasLower ? "text-emerald-600 font-medium" : "text-muted-foreground"
              )}
            >
              {hasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              1 lowercase
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !isPasswordValid}
          className="w-full h-11 rounded-full font-medium shadow-xs mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Creating Account...
            </>
          ) : (
            role === "vendor" ? "Register as Vendor" : "Create Customer Account"
          )}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary font-medium hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}
