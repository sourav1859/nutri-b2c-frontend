"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

export type Filters = {
  dietaryRestrictions: string[]
  allergens: string[]
  calories: [number, number]
  proteinMin: number
  carbsMin: number
  fatMin: number
  maxTime: number
  cuisines: string[]
  q?: string
}

const defaultFilters: Filters = {
  dietaryRestrictions: [],
  allergens: [],
  calories: [0, 1200],
  proteinMin: 0,
  carbsMin: 0,
  fatMin: 0,
  maxTime: 120,
  cuisines: [],
  q: "",
}

type FiltersContextValue = {
  filters: Filters
  setFilters: (next: Filters) => void
  resetFilters: () => void
}

const FiltersContext = createContext<FiltersContextValue | undefined>(undefined)

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const value = useMemo(
    () => ({
      filters,
      setFilters,
      resetFilters: () => setFilters(defaultFilters),
    }),
    [filters],
  )

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
}

export function useFilters() {
  const ctx = useContext(FiltersContext)
  if (!ctx) throw new Error("useFilters must be used within FiltersProvider")
  return ctx
}
