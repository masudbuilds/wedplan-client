"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Service } from "@/types"
import { getServices } from "@/lib/api"
import { SectionHeading } from "@/components/section-heading"
import { ServiceCard } from "@/components/service-card"
import { ServiceCardSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion-wrapper"
import { ServiceFilterBar } from "@/components/services/service-filter-bar"

function ServicesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize filter state from URL query parameters
  const initialCategory = searchParams.get("category") || "all"
  const initialSearch = searchParams.get("search") || ""
  const initialLocation = searchParams.get("location") || "all"
  const initialSort = searchParams.get("sort") || "default"

  const [category, setCategory] = React.useState<string>(initialCategory)
  const [search, setSearch] = React.useState<string>(initialSearch)
  const [location, setLocation] = React.useState<string>(initialLocation)
  const [sort, setSort] = React.useState<string>(initialSort)

  const [services, setServices] = React.useState<Service[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)

  // Sync state to URL query string so reloads preserve all active filters
  const updateQueryParams = (
    newCategory: string,
    newSearch: string,
    newLocation: string,
    newSort: string
  ) => {
    const params = new URLSearchParams()
    if (newCategory && newCategory !== "all") params.set("category", newCategory)
    if (newSearch && newSearch.trim() !== "") params.set("search", newSearch.trim())
    if (newLocation && newLocation !== "all") params.set("location", newLocation)
    if (newSort && newSort !== "default") params.set("sort", newSort)

    const query = params.toString()
    router.replace(query ? `/services?${query}` : "/services", { scroll: false })
  }

  // Fetch services when filters or refreshTrigger change
  React.useEffect(() => {
    let active = true

    getServices({
      category,
      search,
      location,
      sort,
    })
      .then((data) => {
        if (active) {
          setServices(data)
          setError(null)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setError("Failed to load wedding services. Please check your connection and try again.")
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [category, search, location, sort, refreshTrigger])

  const handleCategoryChange = (val: string) => {
    setLoading(true)
    setCategory(val)
    updateQueryParams(val, search, location, sort)
  }

  const handleSearchChange = (val: string) => {
    setLoading(true)
    setSearch(val)
    updateQueryParams(category, val, location, sort)
  }

  const handleLocationChange = (val: string) => {
    setLoading(true)
    setLocation(val)
    updateQueryParams(category, search, val, sort)
  }

  const handleSortChange = (val: string) => {
    setLoading(true)
    setSort(val)
    updateQueryParams(category, search, location, val)
  }

  const handleClearFilters = () => {
    setLoading(true)
    setCategory("all")
    setSearch("")
    setLocation("all")
    setSort("default")
    updateQueryParams("all", "", "all", "default")
  }

  return (
    <div className="container mx-auto px-4 py-10 sm:py-14 max-w-7xl space-y-8">
      {/* 1. Header */}
      <FadeIn>
        <SectionHeading
          eyebrow="Marketplace Directory"
          title="Browse Wedding Services"
          subtitle="Discover curated photographers, venues, florists, caterers, and bridal stylists for your celebration."
        />
      </FadeIn>

      {/* 2. Responsive Filter Bar */}
      <FadeIn delay={0.1}>
        <ServiceFilterBar
          search={search}
          category={category}
          location={location}
          sort={sort}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onLocationChange={handleLocationChange}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
        />
      </FadeIn>

      {/* 3. Result Count & Active Filter Indicator */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground px-1">
        <span>
          {loading
            ? "Searching services..."
            : `Showing ${services.length} ${services.length === 1 ? "service" : "services"}`}
        </span>
        {category !== "all" && (
          <span className="font-medium text-foreground">
            Category: <span className="text-primary">{category}</span>
          </span>
        )}
      </div>

      {/* 4. Error State */}
      {error && !loading && (
        <div className="p-8 sm:p-12 text-center border border-destructive/20 rounded-2xl bg-destructive/5 space-y-4">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-foreground font-medium">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true)
              setRefreshTrigger((prev) => prev + 1)
            }}
            className="rounded-full"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Try Again
          </Button>
        </div>
      )}

      {/* 5. Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <ServiceCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* 6. Empty State */}
      {!loading && !error && services.length === 0 && (
        <EmptyState
          title="No Matching Services Found"
          description="We couldn't find any wedding services matching your current filters. Try expanding your search or clearing active filters."
          actionLabel="Clear all filters"
          onAction={handleClearFilters}
        />
      )}

      {/* 7. Responsive Service Card Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
      {!loading && !error && services.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <FadeIn key={service.id} delay={index * 0.05}>
              <ServiceCard service={service} isVendorPremium={index % 2 === 0} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ServicesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="container mx-auto px-4 py-12 max-w-7xl space-y-6">
          <div className="h-10 w-48 bg-muted rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ServicesPageContent />
    </React.Suspense>
  )
}
