import { HeroSection } from "@/components/home/hero-section"
import { FeaturedServicesSection } from "@/components/home/featured-services-section"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Banner / Hero */}
      <HeroSection />

      {/* 2. Featured Wedding Services (dynamic) */}
      <FeaturedServicesSection />
    </div>
  )
}
