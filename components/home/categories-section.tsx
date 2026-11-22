"use client"

import * as React from "react"
import { ServiceCategory } from "@/types"
import { getCategories } from "@/lib/api"
import { SectionHeading } from "@/components/section-heading"
import { CategoryTile } from "@/components/category-tile"
import { FadeIn } from "@/components/motion-wrapper"

// Category counts for editorial realism
const CATEGORY_COUNTS: Record<ServiceCategory, number> = {
  "Photography & Videography": 24,
  "Wedding Venues": 18,
  "Decoration & Florist": 32,
  "Catering Services": 15,
  "Makeup & Styling": 28,
  "Wedding Fashion": 19,
}

// Section 3: Wedding Service Categories
export function CategoriesSection() {
  const [categories, setCategories] = React.useState<ServiceCategory[]>([])

  React.useEffect(() => {
    getCategories().then((data) => setCategories(data))
  }, [])

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-blush/20 border-y border-border/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <FadeIn>
          <SectionHeading
            eyebrow="Explore By Speciality"
            title="Browse Wedding Categories"
            subtitle="Find the exact experts you need to bring every dimension of your dream celebration to life."
          />
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {categories.map((category, index) => (
            <FadeIn key={category} delay={index * 0.06}>
              <CategoryTile
                name={category}
                itemCount={CATEGORY_COUNTS[category] ?? 12}
                href={`/services?category=${encodeURIComponent(category)}`}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
