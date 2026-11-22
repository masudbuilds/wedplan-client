import { ShieldCheck, CalendarCheck2, CreditCard, LayoutDashboard } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Card, CardContent } from "@/components/ui/card"
import { FadeIn } from "@/components/motion-wrapper"

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Vetted Wedding Artisans",
    description: "Every vendor portfolio undergoes rigorous review to guarantee top artistry and exceptional customer care.",
    color: "bg-blush text-primary",
  },
  {
    icon: CalendarCheck2,
    title: "Direct Booking Inquiries",
    description: "Request dates directly with chosen vendors and receive prompt confirmations without confusing intermediaries.",
    color: "bg-sage/50 text-[#283928] dark:text-[#A8C5AE]",
  },
  {
    icon: CreditCard,
    title: "Transparent & Protected",
    description: "Honest pricing, clear package breakdowns, and secure Stripe payments give you complete financial peace of mind.",
    color: "bg-[#C9A66B]/15 text-[#9A6E2E] dark:text-[#E2C38C]",
  },
  {
    icon: LayoutDashboard,
    title: "Unified Planning Hub",
    description: "Manage inquiries, vendor communications, and status updates through an intuitive role-specific dashboard.",
    color: "bg-muted text-muted-foreground",
  },
]

// Section 4: Why Choose WedPlan
export function WhyChooseSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <FadeIn>
          <SectionHeading
            eyebrow="The WedPlan Distinction"
            title="Why Choose WedPlan?"
            subtitle="Designed thoughtfully to replace wedding planning chaos with calm, confidence, and curated quality."
          />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((item, index) => {
            const Icon = item.icon
            return (
              <FadeIn key={item.title} delay={index * 0.08}>
                <Card className="h-full border border-border/70 bg-card card-hover-lift shadow-xs">
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
