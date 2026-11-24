import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Terms of Service | WedPlan",
  description: "Terms governing use of the WedPlan platform.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-medium text-primary-text">Platform terms</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Last updated: February 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-lg text-foreground">
            Platform Role
          </h2>
          <p className="text-muted-foreground">
            WedPlan provides an editorial directory and communication tool connecting couples with independent wedding service providers. WedPlan is not a party to agreements, contracts, or payments made directly between couples and vendors outside of platform subscriptions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-lg text-foreground">
            User Responsibilities
          </h2>
          <p className="text-muted-foreground">
            Users must provide accurate information when registering and creating listings. Vendors are responsible for the pricing, availability, and delivery of their services. Accounts that engage in spam or fraudulent activity may be suspended by platform administrators.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-lg text-foreground">
            Vendor Subscriptions
          </h2>
          <p className="text-muted-foreground">
            Free vendor accounts may publish up to three active listings. Premium vendor subscriptions unlock unlimited listings and are billed monthly via Stripe. Subscriptions may be cancelled at any time through the Vendor Subscription portal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-lg text-foreground">
            Inquiries and Bookings
          </h2>
          <p className="text-muted-foreground">
            Booking requests submitted through WedPlan are inquiries until confirmed by the vendor. Either party may cancel pending requests through their respective dashboards.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-border/80">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full")}
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}
