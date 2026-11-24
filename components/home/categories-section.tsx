import * as React from "react"
import { SERVICE_CATEGORIES } from "@/types"
import { SectionHeading } from "@/components/section-heading"
import { CategoryTile } from "@/components/category-tile"

// Section 3: Wedding Service Categories using official assignment categories
export function CategoriesSection() {
  return (
    <section className="w-full py-14 sm:py-16 md:py-20 bg-background border-y border-border/60">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        <SectionHeading
          eyebrow="Specialties"
          title="Browse by Specialty"
          subtitle="Discover experienced artisans across six core categories with transparent pricing and direct booking inquiries."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {SERVICE_CATEGORIES.map((category) => (
            <CategoryTile
              key={category}
              name={category}
              href={`/services?category=${encodeURIComponent(category)}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
