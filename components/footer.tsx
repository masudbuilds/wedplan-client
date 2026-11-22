import Link from "next/link"
import { Heart, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Pin } from "lucide-react"

// Global platform footer with editorial typography and links
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/80 bg-card/60 mt-auto">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Description */}
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
              A curated role-based marketplace connecting couples with premier wedding photographers, venues, florists, and artisans.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-muted-foreground">
              <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Pinterest" className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
                <Pin className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-foreground text-sm uppercase tracking-wider">
              Explore Services
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
                  Florists & Decor
                </Link>
              </li>
              <li>
                <Link href="/services?category=Catering%20Services" className="hover:text-primary transition-colors">
                  Catering & Cakes
                </Link>
              </li>
              <li>
                <Link href="/services?category=Makeup%20%26%20Styling" className="hover:text-primary transition-colors">
                  Hair & Makeup
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Roles */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-foreground text-sm uppercase tracking-wider">
              Platform & Roles
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  Browse All Services
                </Link>
              </li>
              <li>
                <Link href="/signup?role=vendor" className="hover:text-primary transition-colors">
                  Become a Vendor
                </Link>
              </li>
              <li>
                <Link href="/signup?role=customer" className="hover:text-primary transition-colors">
                  Join as a Couple
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition-colors">
                  Vendor Subscriptions
                </Link>
              </li>
              <li>
                <Link href="/design-preview" className="hover:text-primary transition-colors">
                  Design System Preview
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-serif font-semibold text-foreground text-sm uppercase tracking-wider">
              Contact & Support
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>concierge@wedplan.com</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+1 (800) 555-PLAN</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>450 Grand Avenue, New York, NY 10001</span>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} WedPlan Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
