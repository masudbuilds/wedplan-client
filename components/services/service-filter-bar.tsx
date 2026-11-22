"use client"

import * as React from "react"
import { Search, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MOCK_CATEGORIES } from "@/lib/mock-data"

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
  onSearchChange: (val: string) => void
  onCategoryChange: (val: string) => void
  onLocationChange: (val: string) => void
  onSortChange: (val: string) => void
  onClearFilters: () => void
}

// Responsive filter bar for searching, categorizing, and sorting wedding services
export function ServiceFilterBar({
  search,
  category,
  location,
  sort,
  onSearchChange,
  onCategoryChange,
  onLocationChange,
  onSortChange,
  onClearFilters,
}: ServiceFilterBarProps) {
  const hasActiveFilters =
    search !== "" || category !== "all" || location !== "all" || sort !== "default"

  return (
    <div className="w-full bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Name & Keyword Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search service name or keyword..."
            className="pl-9 bg-background h-10 rounded-xl"
          />
        </div>

        {/* 2. Category Dropdown */}
        <div>
          <Select
            value={category}
            onValueChange={(val) => onCategoryChange(val ?? "all")}
          >
            <SelectTrigger className="bg-background h-10 rounded-xl w-full">
              <SelectValue placeholder="Category: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {MOCK_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 3. Location Dropdown */}
        <div>
          <Select
            value={location}
            onValueChange={(val) => onLocationChange(val ?? "all")}
          >
            <SelectTrigger className="bg-background h-10 rounded-xl w-full">
              <SelectValue placeholder="Location: All" />
            </SelectTrigger>
            <SelectContent>
              {LOCATIONS.map((loc) => (
                <SelectItem
                  key={loc}
                  value={loc === "All Locations" ? "all" : loc}
                >
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 4. Price Sort Dropdown */}
        <div>
          <Select
            value={sort}
            onValueChange={(val) => onSortChange(val ?? "default")}
          >
            <SelectTrigger className="bg-background h-10 rounded-xl w-full">
              <SelectValue placeholder="Sort: Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default Order</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clear Filters Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center justify-end pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-primary h-8"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}
