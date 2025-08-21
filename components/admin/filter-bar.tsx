// components/admin/filter-bar.tsx
"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterOption {
  key: string
  label: string
  options: { value: string; label: string }[]
}

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters: Record<string, string>
  onFilterChange: (key: string, value: string) => void
  filterOptions: FilterOption[]
  onClearFilters: () => void
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  filterOptions,
  onClearFilters,
}: FilterBarProps) {
  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.map((filter) => (
            <Select
              key={filter.key}
              value={filters[filter.key] || ""}
              onValueChange={(value) => onFilterChange(filter.key, value)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
