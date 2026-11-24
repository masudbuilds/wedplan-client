import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Security Overview | WedPlan",
  description: "How WedPlan protects authentication, data, and sessions.",
}

export default function SecurityPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-medium text-primary-text">Platform security</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          Security Overview
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          How we safeguard accounts, sessions, and payments.
        </p>
      </div>

      <div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-lg text-foreground">
            Authentication & Role Protection
          </h2>
          <p className="text-muted-foreground">
            WedPlan uses Better Auth with cryptographically signed tokens (EdDSA JWKS) and HTTP-only session cookies with secure flags. Database hooks strictly enforce role restrictions so that administrator privileges cannot be claimed through public sign-up or profile updates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-lg text-foreground">
            Payment Processing
          </h2>
          <p className="text-muted-foreground">
            All subscription payments and upgrades are handled directly by Stripe. Credit card credentials, payment methods, and bank details never touch or pass through our application servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-semibold text-lg text-foreground">
            Image Upload Verification
          </h2>
          <p className="text-muted-foreground">
            Image uploads require an authenticated session and are validated server-side for supported image MIME types and file size limits before being hosted.
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
