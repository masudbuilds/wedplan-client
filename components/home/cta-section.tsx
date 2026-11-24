import * as React from "react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Section 6: Final Call-to-Action Band
export function CtaSection() {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 bg-card border-t border-border/70">
      <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">
          Ready to Plan Your Celebration?
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Whether you are looking for independent photographers and venues, or are a vendor ready to showcase your work, WedPlan offers a direct, calm planning experience.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/services"
            className={cn(
              buttonVariants({ size: "default" }),
              "rounded-full px-7 py-2.5 text-sm shadow-xs"
            )}
          >
            Browse Services
          </Link>

          <Link
            href="/sign-up?role=vendor"
            className={cn(
              buttonVariants({ variant: "outline", size: "default" }),
              "rounded-full px-7 py-2.5 text-sm bg-card hover:bg-muted border-border/80"
            )}
          >
            Join as a Vendor
          </Link>
        </div>
      </div>
    </section>
  )
}
