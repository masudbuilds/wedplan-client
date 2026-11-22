import Link from "next/link"
import { ArrowRight, Sparkles, Heart, ShieldCheck, Palette } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { FadeIn } from "@/components/motion-wrapper"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      {/* Hero Welcome Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24 text-center max-w-4xl space-y-8">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush/80 border border-primary/20 text-xs font-medium text-primary mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phase 1: Foundation & Design System Ready</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight leading-tight sm:leading-none">
            Where Wedding Dreams Find Their Perfect Artisans
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Welcome to <span className="font-semibold text-foreground">WedPlan</span> — the editorial role-based wedding planning platform connecting couples, curated vendors, and administrators.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/design-preview"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-8 shadow-xs gap-2"
              )}
            >
              <Palette className="w-4 h-4" />
              <span>Open Design System Preview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/design-preview#tokens"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-8"
              )}
            >
              <span>View Design Tokens</span>
            </Link>
          </div>
        </FadeIn>

        {/* Feature Highlights Grid */}
        <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-card border border-border/80 card-hover-lift">
            <span className="w-10 h-10 rounded-xl bg-blush flex items-center justify-center text-primary mb-4">
              <Heart className="w-5 h-5 fill-current" />
            </span>
            <h3 className="font-serif font-bold text-lg text-foreground mb-1">
              Editorial Aesthetic
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Warm ivory, dusty rose accents, gold badges, and Playfair Display typography.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 card-hover-lift">
            <span className="w-10 h-10 rounded-xl bg-sage/60 flex items-center justify-center text-[#2E4A34] mb-4">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="font-serif font-bold text-lg text-foreground mb-1">
              Role-Based Architecture
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dedicated workflows for Couples, Vendors (Free & Premium), and Platform Admins.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/80 card-hover-lift">
            <span className="w-10 h-10 rounded-xl bg-[#C9A66B]/15 flex items-center justify-center text-[#9A6E2E] mb-4">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="font-serif font-bold text-lg text-foreground mb-1">
              ShadCN + Motion
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Accessible ShadCN UI primitives with subtle Framer Motion scroll and hover transitions.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
