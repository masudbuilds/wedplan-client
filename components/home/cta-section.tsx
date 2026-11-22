import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { FadeIn } from "@/components/motion-wrapper"
import { cn } from "@/lib/utils"

// Section 6: Final Call-to-Action Band
export function CtaSection() {
  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-background to-blush/40 border-t border-border/60">
      <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush border border-primary/20 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Begin Your Wedding Journey</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight">
            Ready to Plan Your Perfect Day?
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
            Whether you are a couple searching for master artisans or a wedding vendor ready to showcase your artistry to thousands, WedPlan is your home.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <Link
              href="/services"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-8 py-6 text-base shadow-sm hover:shadow-md transition-all gap-2"
              )}
            >
              <span>Browse Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/sign-up?role=vendor"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-8 py-6 text-base bg-card hover:bg-muted border-border/80"
              )}
            >
              <span>Become a Vendor</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
