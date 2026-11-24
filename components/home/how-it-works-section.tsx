import * as React from "react"
import { Search, Send, CalendarCheck } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Explore specialties",
    description: "Browse independent artisans across six categories, review transparent package pricing, and view real work.",
  },
  {
    step: "02",
    icon: Send,
    title: "Submit your inquiry",
    description: "Select your celebration date, guest count, and event notes to send a direct inquiry to the vendor.",
  },
  {
    step: "03",
    icon: CalendarCheck,
    title: "Confirm and plan",
    description: "Receive vendor confirmation, manage details from your private dashboard, and prepare with confidence.",
  },
]

// Section 5: How WedPlan Works — Horizontal connected sequence
export function HowItWorksSection() {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 bg-blush/20 border-t border-border/60">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        <SectionHeading
          title="How WedPlan Works"
          subtitle="Three straightforward steps from your initial discovery to vendor confirmation."
        />

        <div className="relative">
          {/* Horizontal connecting hairline for desktop */}
          <div className="hidden md:block absolute top-6 left-12 right-12 h-px bg-border/80 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative z-10">
            {STEPS.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.step} className="flex flex-col items-start space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-full bg-background border border-border/80 flex items-center justify-center font-serif text-lg font-bold text-primary shadow-xs shrink-0">
                      {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blush/60 text-primary flex items-center justify-center md:hidden">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-foreground pt-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
