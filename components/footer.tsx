import Link from "next/link"
import { Heart, Mail, Phone, MapPin } from "lucide-react"

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/80 bg-card mt-auto">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Platform Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-blush flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Heart className="w-4 h-4 fill-current" />
              </span>
              <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                WedPlan
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An editorial wedding planning marketplace connecting couples directly with premier wedding photographers, venues, florists, and artisans.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2 text-muted-foreground">
              <a
                href="https://github.com/masudbuilds"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/masudbuilds"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/masudbuilds"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Official Categories (matching server exact names) */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-foreground text-sm">
              Explore Specialties
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/services?category=Photography%20%26%20Videography" className="hover:text-primary transition-colors">
                  Photography & Videography
                </Link>
              </li>
              <li>
                <Link href="/services?category=Wedding%20Venues" className="hover:text-primary transition-colors">
                  Wedding Venues
                </Link>
              </li>
              <li>
                <Link href="/services?category=Decoration%20%26%20Florist" className="hover:text-primary transition-colors">
                  Decoration & Florist
                </Link>
              </li>
              <li>
                <Link href="/services?category=Catering%20Services" className="hover:text-primary transition-colors">
                  Catering Services
                </Link>
              </li>
              <li>
                <Link href="/services?category=Makeup%20%26%20Styling" className="hover:text-primary transition-colors">
                  Makeup & Styling
                </Link>
              </li>
              <li>
                <Link href="/services?category=Wedding%20Fashion" className="hover:text-primary transition-colors">
                  Wedding Fashion
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Roles */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-foreground text-sm">
              Platform & Roles
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Browse All Services
                </Link>
              </li>
              <li>
                <Link href="/sign-up?role=vendor" className="hover:text-primary transition-colors">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/sign-up?role=customer" className="hover:text-primary transition-colors">
                  Join as a Customer
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor/subscription" className="hover:text-primary transition-colors">
                  Vendor Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-foreground text-sm">
              Contact & Support
            </h4>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>concierge@wedplan.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+1 (212) 555-0199</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>450 Lexington Avenue, Suite 1400, New York, NY 10017</span>
              </p>
            </div>
          </div>
        </div>

        {/* Real Policy Links */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} WedPlan Inc. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-primary transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
