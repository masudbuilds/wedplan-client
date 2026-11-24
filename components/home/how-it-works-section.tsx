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

// Section 5: How WedPlan Works — Calm sequence with authentic numbers
export function HowItWorksSection() {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 bg-blush/20 border-t border-border/60">
      <div className="container mx-auto px-4 max-w-7xl space-y-10">
        <SectionHeading
          eyebrow="Process"
          title="How WedPlan Works"
          subtitle="Three straightforward steps from your initial discovery to vendor confirmation."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {STEPS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.step}
                className="relative p-6 sm:p-8 rounded-xl bg-card border border-border/80 shadow-xs flex flex-col items-start space-y-4"
              >
                <div className="w-full flex items-center justify-between">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-primary-text/40">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blush text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif font-semibold text-lg text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
