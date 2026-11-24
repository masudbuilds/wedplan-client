import * as React from "react"
import Link from "next/link"
import { CalendarCheck2, CreditCard, LayoutDashboard, MessageSquare } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PRINCIPLES = [
  {
    icon: CalendarCheck2,
    title: "Direct booking inquiries",
    description: "Submit date inquiries directly to vendors with your location, schedule, and guest count without middleman delays.",
  },
  {
    icon: CreditCard,
    title: "Upfront pricing and inclusions",
    description: "Clear package breakdowns and transparent pricing so you understand exactly what each service covers.",
  },
  {
    icon: MessageSquare,
    title: "Honest communication",
    description: "Review vendor details and event notes directly from your account, keeping every detail organized in one place.",
  },
  {
    icon: LayoutDashboard,
    title: "Dedicated dashboards",
    description: "Couples track event inquiries in a private planner, while vendors manage service portfolios and booking requests.",
  },
]

// Section 4: Why Choose WedPlan — Editorial Two-Column Layout
export function WhyChooseSection() {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight leading-snug">
              A Calm, Direct Way to Plan Your Wedding
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              WedPlan connects couples directly with independent wedding specialists. No hidden commissions, no third-party markups, and no opaque price quotes.
            </p>
            <div className="pt-2">
              <Link
                href="/services"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "rounded-full px-6 text-sm bg-card hover:bg-muted border-border/80"
                )}
              >
                Browse All Services
              </Link>
            </div>
          </div>

          {/* Right Column: Divided Editorial List */}
          <div className="lg:col-span-7 divide-y divide-border/80">
            {PRINCIPLES.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="py-6 first:pt-0 last:pb-0 flex items-start gap-4 sm:gap-5">
                  <div className="w-10 h-10 rounded-xl bg-blush/60 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-serif font-semibold text-base sm:text-lg text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
