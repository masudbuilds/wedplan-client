import * as React from "react"
import { Suspense } from "react"
import { FramedPhoto } from "@/components/framed-photo"
import { SignInForm } from "./sign-in-form"

export default function SignInPage() {
  return (
    <div className="w-full min-h-[calc(100vh-5rem)] bg-background flex items-center py-10 sm:py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Form Column */}
          <div className="lg:col-span-6 max-w-md mx-auto lg:mx-0 w-full space-y-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-foreground tracking-tight break-words">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                Sign in to manage your wedding bookings or vendor portfolio.
              </p>
            </div>

            <Suspense
              fallback={
                <div className="h-48 flex items-center justify-center text-muted-foreground text-xs">
                  Loading sign-in...
                </div>
              }
            >
              <SignInForm />
            </Suspense>
          </div>

          {/* Editorial Photo Column */}
          <div className="hidden lg:block lg:col-span-6 relative">
            <FramedPhoto
              src="/images/auth.webp"
              alt="Bride and groom celebrating their wedding in natural light"
              priority
              sizes="(max-width: 1200px) 50vw, 40vw"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
