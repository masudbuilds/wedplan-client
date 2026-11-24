import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Privacy Policy | WedPlan",
  description: "How WedPlan handles your account details and inquiries.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-medium text-primary-text">Privacy notice</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Last updated: February 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-lg text-foreground">
            Information We Collect
          </h2>
          <p className="text-muted-foreground">
            When you create an account on WedPlan, we store your name, email address, profile image, and account role (Customer or Vendor). If you register as a Vendor, we also store your business name. When you submit a booking request, we store the event date, guest count, location, and notes you provide so the vendor can respond.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-lg text-foreground">
            How We Use Your Details
          </h2>
          <p className="text-muted-foreground">
            Your details are used solely to facilitate vendor inquiries, maintain your user dashboard, and process subscription payments via Stripe. We do not sell your personal data to third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-lg text-foreground">
            Third-Party Services
          </h2>
          <p className="text-muted-foreground">
            Authentication is powered by Better Auth. Payment transactions are processed directly by Stripe; we never store your credit card numbers on our servers. Images you upload are securely hosted on ImgBB.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-lg text-foreground">
            Account Management & Contact
          </h2>
          <p className="text-muted-foreground">
            You can review and update your profile details anytime from your dashboard. If you have questions about your data, contact our team at concierge@wedplan.com.
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
