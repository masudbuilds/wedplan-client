import { Search, Send, PartyPopper } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { FadeIn } from "@/components/motion-wrapper"

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Browse & Discover",
    description: "Explore curated wedding specialists across photography, venues, florals, and attire with upfront pricing and real portfolios.",
  },
  {
    step: "02",
    icon: Send,
    title: "Request a Booking",
    description: "Select your service, choose your desired date and location, and submit your event booking inquiry in seconds.",
  },
  {
    step: "03",
    icon: PartyPopper,
    title: "Celebrate with Confidence",
    description: "Receive vendor confirmation, manage details from your private dashboard, and celebrate your milestone flawlessly.",
  },
]

// Section 5: How WedPlan Works
export function HowItWorksSection() {
  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-blush/20 border-t border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <FadeIn>
          <SectionHeading
            eyebrow="Simple & Seamless"
            title="How WedPlan Works"
            subtitle="Three straightforward steps from your first inspiration to your walk down the aisle."
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, index) => {
            const Icon = item.icon
            return (
              <FadeIn key={item.step} delay={index * 0.1}>
                <div className="relative p-6 sm:p-8 rounded-2xl bg-card border border-border/70 card-hover-lift shadow-xs flex flex-col items-center text-center space-y-4">
                  {/* Step Number Badge */}
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-primary/30">
                    {item.step}
                  </span>

                  {/* Icon Circle */}
                  <div className="w-14 h-14 rounded-2xl bg-blush flex items-center justify-center text-primary shadow-2xs">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="font-serif font-bold text-xl text-foreground">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
