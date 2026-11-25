import Link from "next/link"
import { Heart, Mail, Phone, MapPin } from "lucide-react"
import { SOCIAL_LINKS } from "@/lib/constants"

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 max-w-7xl py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Logo & Platform Mission */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="w-8 h-8 rounded-full bg-blush flex items-center justify-center text-primary-text group-hover:bg-primary group-hover:text-white transition-colors">
                <Heart className="w-4 h-4 fill-current" />
              </span>
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                WedPlan
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
              An editorial wedding planning marketplace connecting couples directly with premier wedding photographers, venues, florists, and artisans.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-1 text-muted-foreground">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center hover:text-primary-text hover:border-primary/40 hover:bg-blush/40 transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center hover:text-primary-text hover:border-primary/40 hover:bg-blush/40 transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={SOCIAL_LINKS.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center hover:text-primary-text hover:border-primary/40 hover:bg-blush/40 transition-colors"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Official Categories (matching server exact names) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-serif font-bold text-foreground text-base">
              Explore Specialties
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/services?category=Photography%20%26%20Videography" className="hover:text-primary-text transition-colors">
                  Photography & Videography
                </Link>
              </li>
              <li>
                <Link href="/services?category=Wedding%20Venues" className="hover:text-primary-text transition-colors">
                  Wedding Venues
                </Link>
              </li>
              <li>
                <Link href="/services?category=Decoration%20%26%20Florist" className="hover:text-primary-text transition-colors">
                  Decoration & Florist
                </Link>
              </li>
              <li>
                <Link href="/services?category=Catering%20Services" className="hover:text-primary-text transition-colors">
                  Catering Services
                </Link>
              </li>
              <li>
                <Link href="/services?category=Makeup%20%26%20Styling" className="hover:text-primary-text transition-colors">
                  Makeup & Styling
                </Link>
              </li>
              <li>
                <Link href="/services?category=Wedding%20Fashion" className="hover:text-primary-text transition-colors">
                  Wedding Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Roles */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="font-serif font-bold text-foreground text-base">
              Platform & Roles
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/services" className="hover:text-primary-text transition-colors">
                  Browse All Services
                </Link>
              </li>
              <li>
                <Link href="/sign-up?role=vendor" className="hover:text-primary-text transition-colors">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/sign-up?role=customer" className="hover:text-primary-text transition-colors">
                  Join as a Customer
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor/subscription" className="hover:text-primary-text transition-colors">
                  Vendor Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="font-serif font-bold text-foreground text-base">
              Contact & Support
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground">
              <p className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blush/60 text-primary-text flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <span>contact@wedplan.com</span>
              </p>
              <p className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blush/60 text-primary-text flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <span>+880 1752*****</span>
              </p>
              <p className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blush/60 text-primary-text flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </span>
                <span>Dhaka, Bangladesh</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Divider & Real Policy Links */}
        <div className="mt-12 pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} WedPlan Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacy" className="hover:text-primary-text transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary-text transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-primary-text transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
