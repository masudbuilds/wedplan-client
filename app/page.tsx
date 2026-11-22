import { HeroSection } from "@/components/home/hero-section"
import { FeaturedServicesSection } from "@/components/home/featured-services-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { WhyChooseSection } from "@/components/home/why-choose-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { CtaSection } from "@/components/home/cta-section"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Banner / Hero */}
      <HeroSection />

      {/* 2. Featured Wedding Services (dynamic) */}
      <FeaturedServicesSection />

      {/* 3. Wedding Service Categories (dynamic) */}
      <CategoriesSection />

      {/* 4. Why Choose WedPlan? */}
      <WhyChooseSection />

      {/* 5. How WedPlan Works */}
      <HowItWorksSection />

      {/* 6. Final Call-to-Action Band */}
      <CtaSection />
    </div>
  )
}
