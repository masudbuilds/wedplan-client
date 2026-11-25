"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"
import { Service } from "@/types"
import { getServices } from "@/lib/api"
import { ServiceCard } from "@/components/service-card"
import { ServiceCardSkeleton } from "@/components/loading-skeleton"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/motion-wrapper"
import { ServiceFilterBar } from "@/components/services/service-filter-bar"

const ITEMS_PER_PAGE = 12

function ServicesPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize filter state from URL query parameters
  const initialCategory = searchParams.get("category") || "all"
  const initialSearch = searchParams.get("search") || ""
  const initialLocation = searchParams.get("location") || "all"
  const initialSort = searchParams.get("sort") || "default"
  const initialPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10))

  const [category, setCategory] = React.useState<string>(initialCategory)
  const [searchInput, setSearchInput] = React.useState<string>(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = React.useState<string>(initialSearch)
  const [location, setLocation] = React.useState<string>(initialLocation)
  const [sort, setSort] = React.useState<string>(initialSort)
  const [page, setPage] = React.useState<number>(initialPage)

  const [services, setServices] = React.useState<Service[]>([])
  const [total, setTotal] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = React.useState<number>(0)

  // 1. Debounce the search input by ~400ms
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  // 2. Sync filter state to URL query string
  const updateQueryParams = React.useCallback(
    (
      newCategory: string,
      newSearch: string,
      newLocation: string,
      newSort: string,
      newPage: number
    ) => {
      const params = new URLSearchParams()
      if (newCategory && newCategory !== "all") params.set("category", newCategory)
      if (newSearch && newSearch.trim() !== "") params.set("search", newSearch.trim())
      if (newLocation && newLocation !== "all") params.set("location", newLocation)
      if (newSort && newSort !== "default") params.set("sort", newSort)
      if (newPage > 1) params.set("page", String(newPage))

      const query = params.toString()
      router.replace(query ? `/services?${query}` : "/services", { scroll: false })
    },
    [router]
  )

  // 3. Fetch services from real backend API when filters or page change
  React.useEffect(() => {
    let active = true

    getServices({
      category,
      search: debouncedSearch,
      location,
      sort,
      page,
      limit: ITEMS_PER_PAGE,
    })
      .then((data) => {
        if (active) {
          setServices(data.services)
          setTotal(data.total)
          setError(null)
        }
      })
      .catch((err) => {
        if (active) {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to load wedding services. Please check connection."
          setError(msg)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [category, debouncedSearch, location, sort, page, refreshTrigger])

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))

  const handleCategoryChange = (val: string) => {
    setLoading(true)
    setCategory(val)
    setPage(1)
    updateQueryParams(val, debouncedSearch, location, sort, 1)
  }

  const handleSearchChange = (val: string) => {
    setSearchInput(val)
  }

  const handleLocationChange = (val: string) => {
    setLoading(true)
    setLocation(val)
    setPage(1)
    updateQueryParams(category, debouncedSearch, val, sort, 1)
  }

  const handleSortChange = (val: string) => {
    setLoading(true)
    setSort(val)
    setPage(1)
    updateQueryParams(category, debouncedSearch, location, val, 1)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setLoading(true)
    setPage(newPage)
    updateQueryParams(category, debouncedSearch, location, sort, newPage)
    window.scrollTo({ top: 120, behavior: "smooth" })
  }

  const handleClearFilters = () => {
    setLoading(true)
    setCategory("all")
    setSearchInput("")
    setDebouncedSearch("")
    setLocation("all")
    setSort("default")
    setPage(1)
    updateQueryParams("all", "", "all", "default", 1)
  }

  return (
    <div className="container mx-auto px-4 py-10 sm:py-14 max-w-7xl space-y-7">
      {/* 1. Editorial Page Header */}
      <FadeIn>
        <div className="max-w-2xl mx-auto text-center space-y-2.5">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
            Browse Wedding Services
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Discover curated photographers, venues, florists, caterers, and bridal stylists for your celebration.
          </p>
        </div>
      </FadeIn>

      {/* 2. Responsive Filter Bar */}
      <FadeIn delay={0.08}>
        <ServiceFilterBar
          search={searchInput}
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

      {/* 3. Result Count & Active Category Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground px-1 tabular-nums">
        <span>
          {loading
            ? "Searching services..."
            : `Showing ${services.length} of ${total} ${total === 1 ? "service" : "services"}`}
        </span>
        {category !== "all" && (
          <span className="font-medium text-foreground">
            Category: <span className="text-primary-text">{category}</span>
          </span>
        )}
      </div>

      {/* 4. Error State */}
      {error && !loading && (
        <div className="p-8 sm:p-12 text-center border border-destructive/25 rounded-2xl bg-card space-y-4">
          <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
          <p className="text-sm text-foreground font-medium">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true)
              setRefreshTrigger((prev) => prev + 1)
            }}
            className="rounded-full text-xs cursor-pointer"
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
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <FadeIn key={service.id} delay={index * 0.04}>
                <ServiceCard
                  service={service}
                  isVendorPremium={service.vendor?.isPremium || service.isPremium}
                />
              </FadeIn>
            ))}
          </div>

          {/* 8. Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-6 px-1">
              <p className="text-xs text-muted-foreground tabular-nums">
                Page <span className="font-semibold text-foreground">{page}</span> of{" "}
                <span className="font-semibold text-foreground">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || loading}
                  onClick={() => handlePageChange(page - 1)}
                  className="rounded-full h-9 px-4 text-xs cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || loading}
                  onClick={() => handlePageChange(page + 1)}
                  className="rounded-full h-9 px-4 text-xs cursor-pointer"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
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
