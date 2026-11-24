"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { FadeIn } from "@/components/motion-wrapper"
import { cn } from "@/lib/utils"

// Section 1: Editorial Split Hero with Integrated Search & Gold Hairline Frame
export function HeroSection() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState("")

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      router.push("/services")
    }
  }

  return (
    <section className="relative w-full bg-background pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <FadeIn duration={0.6}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Editorial Headline, Honest Copy & Direct Search */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-primary-text">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>Curated wedding marketplace</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight leading-[1.12]">
                Where Exceptional Celebrations Begin
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Discover premier photographers, fairytale venues, bespoke florists, and wedding artisans. Connect directly, view transparent pricing, and request your date with complete clarity.
              </p>

              {/* Direct Search Bar linking to /services?search=... */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-2 p-1.5 sm:p-2 rounded-full bg-card border border-border/80 shadow-xs focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all max-w-lg"
              >
                <div className="pl-3 sm:pl-4 text-muted-foreground">
                  <Search className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search photography, venues, florals, styling..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 outline-hidden px-2 py-1.5"
                />
                <button
                  type="submit"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "rounded-full px-5 text-xs font-medium cursor-pointer shrink-0"
                  )}
                >
                  Search
                </button>
              </form>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ size: "default" }),
                    "rounded-full px-6 py-2.5 text-sm shadow-xs"
                  )}
                >
                  Explore Services
                </Link>
                <Link
                  href="/sign-up?role=vendor"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "rounded-full px-6 py-2.5 text-sm bg-card hover:bg-muted border-border/80"
                  )}
                >
                  Join as a Vendor
                </Link>
              </div>
            </div>

            {/* Right Column: Editorial Photo in Soft Gold Hairline Frame */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-none">
                {/* Gold Hairline Offset Background Accent */}
                <div className="absolute -inset-2 rounded-2xl border border-[#C9A66B]/50 transform translate-x-2 translate-y-2 pointer-events-none" />

                {/* Main Photo Frame */}
                <div className="relative rounded-2xl overflow-hidden bg-card border border-border shadow-md aspect-4/5">
                  <Image
                    src="/images/hero.jpg"
                    alt="Bride and groom sharing an intimate wedding celebration moment"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Editorial Photo Caption */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-card/90 backdrop-blur-xs border border-border/60 text-left">
                    <p className="font-serif font-semibold text-xs sm:text-sm text-foreground">
                      Bespoke Celebrations & Artistry
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Connecting couples with verified wedding specialists across six specialties
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
