import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { FadeIn } from "@/components/motion-wrapper"
import { cn } from "@/lib/utils"

// Section 1: Hero Banner with romantic photography and ivory/blush overlay
export function HeroSection() {
  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Warm Wedding Photography */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85')`,
        }}
      />

      {/* Romantic Soft Ivory / Blush Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />

      {/* Hero Content Container */}
      <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center py-16 sm:py-24 space-y-6">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blush/90 border border-primary/20 text-xs font-semibold text-primary shadow-xs tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Wedding Marketplace</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground tracking-tight leading-[1.15]">
            Where Your Dream Wedding Begins with Exceptional Artisans
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover verified photographers, fairytale venues, bespoke florists, and wedding specialists dedicated to crafting unforgettable celebrations.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/services"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-8 py-6 text-base shadow-md hover:shadow-lg transition-all gap-2"
              )}
            >
              <span>Explore Wedding Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/sign-up?role=vendor"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-8 py-6 text-base bg-background/60 hover:bg-background border-border/80"
              )}
            >
              <span>Join as a Vendor</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
