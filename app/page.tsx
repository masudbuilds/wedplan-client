import { HeroSection } from "@/components/home/hero-section"
import { FeaturedServicesSection } from "@/components/home/featured-services-section"
import { CategoriesSection } from "@/components/home/categories-section"

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Banner / Hero */}
      <HeroSection />

      {/* 2. Featured Wedding Services (dynamic) */}
      <FeaturedServicesSection />

      {/* 3. Wedding Service Categories (dynamic) */}
      <CategoriesSection />
    </div>
  )
}
