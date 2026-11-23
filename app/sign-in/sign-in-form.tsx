"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleButton } from "@/components/auth/google-button"
import { authClient } from "@/lib/auth-client"

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get("redirect")

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")

  const getSafeRedirectUrl = (role?: string) => {
    // Open redirect guard: must strictly start with "/" and not "//"
    if (
      redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("//") &&
      !redirectParam.includes("://")
    ) {
      return redirectParam
    }

    if (role === "vendor") return "/dashboard/vendor"
    if (role === "admin") return "/dashboard/admin"
    return "/dashboard/customer"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email and password.")
      return
    }

    setIsLoading(true)

    try {
      const res = await authClient.signIn.email({
        email: email.trim(),
        password,
      })

      if (res.error) {
        const errorText =
          res.error.message ||
          "Invalid email or password. Please verify your credentials."
        setErrorMsg(errorText)
        toast.error(errorText)
        setIsLoading(false)
        return
      }

      toast.success("Signed in successfully! Welcome back.")

      // Role check from response or session
      const userRecord = res.data?.user as Record<string, unknown> | undefined
      const userRole = (userRecord?.role as string) || "customer"
      const targetUrl = getSafeRedirectUrl(userRole)
      router.push(targetUrl)
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to sign in. Please try again."
      setErrorMsg(msg)
      toast.error(msg)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Google Quick Sign-In */}
      <div className="space-y-3">
        <GoogleButton
          label="Sign in with Google"
          callbackURL={getSafeRedirectUrl()}
        />
        <div className="relative flex items-center justify-center text-xs text-muted-foreground">
          <div className="w-full border-t border-border" />
          <span className="bg-card px-3 relative">or sign in with email</span>
          <div className="w-full border-t border-border" />
        </div>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 text-xs rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="signin-email" className="text-xs">
            Email Address
          </Label>
          <Input
            id="signin-email"
            type="email"
            placeholder="alexandra@wedplan.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signin-password" className="text-xs">
            Password
          </Label>
          <div className="relative">
            <Input
              id="signin-password"
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
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-full font-medium shadow-xs mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Signing In...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </>
          )}
        </Button>
      </form>

      {/* Footer Link */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/sign-up"
          className="text-primary font-medium hover:underline"
        >
          Create Account
        </Link>
      </div>
    </div>
  )
}
