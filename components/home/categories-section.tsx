"use client"

import * as React from "react"
import { AlertCircle, RotateCcw } from "lucide-react"
import { ServiceCategory } from "@/types"
import { getCategories } from "@/lib/api"
import { SectionHeading } from "@/components/section-heading"
import { CategoryTile } from "@/components/category-tile"
import { FadeIn } from "@/components/motion-wrapper"
import { Button } from "@/components/ui/button"

const CATEGORY_COUNTS: Record<string, number> = {
  "Photography & Videography": 24,
  "Wedding Venues": 18,
  "Decoration & Florist": 32,
  "Catering Services": 15,
  "Makeup & Styling": 28,
  "Wedding Fashion": 19,
}

// Section 3: Wedding Service Categories from real backend API
export function CategoriesSection() {
  const [categories, setCategories] = React.useState<ServiceCategory[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)

  React.useEffect(() => {
    let active = true

    getCategories()
      .then((data) => {
        if (active) {
          setCategories(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (active) {
          const msg =
            err instanceof Error ? err.message : "Failed to load categories."
          setError(msg)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [refreshTrigger])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-blush/20 border-y border-border/50">
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        <FadeIn>
          <SectionHeading
            eyebrow="Explore By Speciality"
            title="Browse Wedding Categories"
            subtitle="Find the exact experts you need to bring every dimension of your dream celebration to life."
          />
        </FadeIn>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-card/60 animate-pulse border border-border/60"
              />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="p-6 text-center border border-destructive/20 rounded-2xl bg-destructive/5 space-y-3 max-w-md mx-auto">
            <AlertCircle className="w-6 h-6 text-destructive mx-auto" />
            <p className="text-xs font-medium text-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="rounded-full text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && (
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
        )}
      </div>
    </section>
  )
}
