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
          title="Browse by Specialty"
          subtitle="Discover experienced artisans across six core categories with transparent pricing and direct booking inquiries."
        />

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
