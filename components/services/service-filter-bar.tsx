"use client"

import * as React from "react"
import { Search, RotateCcw, Tag, MapPin, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SERVICE_CATEGORIES, ServiceCategory } from "@/types"

const LOCATIONS = [
  "All Locations",
  "New York, NY",
  "Brooklyn, NY",
  "Manhattan, NY",
  "SoHo, NY",
  "Hudson Valley, NY",
  "Finger Lakes, NY",
  "Greenwich, CT",
  "Philadelphia, PA",
]

interface ServiceFilterBarProps {
  search: string
  category: string
  location: string
  sort: string
  categories?: ServiceCategory[]
  onSearchChange: (val: string) => void
  onCategoryChange: (val: string) => void
  onLocationChange: (val: string) => void
  onSortChange: (val: string) => void
  onClearFilters: () => void
}

const SORT_LABELS: Record<string, string> = {
  default: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
}

// Responsive filter bar for searching, categorizing, and sorting wedding services
export function ServiceFilterBar({
  search,
  category,
  location,
  sort,
  categories = SERVICE_CATEGORIES,
  onSearchChange,
  onCategoryChange,
  onLocationChange,
  onSortChange,
  onClearFilters,
}: ServiceFilterBarProps) {
  const hasActiveFilters =
    search !== "" || category !== "all" || location !== "all" || sort !== "default"

  return (
    <div className="w-full bg-card border border-border rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
        {/* 1. Name & Keyword Search */}
        <div className="lg:col-span-4 space-y-1.5">
          <label
            htmlFor="service-search"
            className="text-[11px] font-medium text-muted-foreground block pl-0.5"
          >
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="service-search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search service name or keyword..."
              className="pl-9 bg-background/60 border-border h-10 rounded-md text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* 2. Category Dropdown */}
        <div className="lg:col-span-3 space-y-1.5">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 pl-0.5">
            <Tag className="w-3 h-3 text-primary-text" />
            Category
          </span>
          <Select
            value={category}
            onValueChange={(val) => onCategoryChange(val ?? "all")}
          >
            <SelectTrigger className="bg-background/60 border-border h-10 rounded-md w-full text-xs sm:text-sm">
              <SelectValue placeholder="All Categories">
                {(val: string | null) =>
                  !val || val === "all" ? "All Categories" : val
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectSeparator />
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 3. Location Dropdown */}
        <div className="lg:col-span-3 space-y-1.5">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 pl-0.5">
            <MapPin className="w-3 h-3 text-primary-text" />
            Location
          </span>
          <Select
            value={location}
            onValueChange={(val) => onLocationChange(val ?? "all")}
          >
            <SelectTrigger className="bg-background/60 border-border h-10 rounded-md w-full text-xs sm:text-sm">
              <SelectValue placeholder="All Locations">
                {(val: string | null) =>
                  !val || val === "all" ? "All Locations" : val
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectSeparator />
              {LOCATIONS.filter((loc) => loc !== "All Locations").map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 4. Price Sort Dropdown */}
        <div className="lg:col-span-2 space-y-1.5">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 pl-0.5">
            <ArrowUpDown className="w-3 h-3 text-primary-text" />
            Sort by
          </span>
          <Select
            value={sort}
            onValueChange={(val) => onSortChange(val ?? "default")}
          >
            <SelectTrigger className="bg-background/60 border-border h-10 rounded-md w-full text-xs sm:text-sm">
              <SelectValue placeholder="Featured">
                {(val: string | null) =>
                  (val && SORT_LABELS[val]) || "Featured"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/70">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted-foreground mr-1">Active:</span>
            {search !== "" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-muted text-foreground font-medium">
                &ldquo;{search}&rdquo;
              </span>
            )}
            {category !== "all" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blush text-primary-text font-medium">
                {category}
              </span>
            )}
            {location !== "all" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-muted text-foreground font-medium">
                {location}
              </span>
            )}
            {sort !== "default" && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-muted text-foreground font-medium">
                {SORT_LABELS[sort] || sort}
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-primary-text hover:text-primary-text hover:bg-blush/50 h-8 rounded-full px-3 cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}
