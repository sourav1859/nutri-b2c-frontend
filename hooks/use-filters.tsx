// hooks/use-filters.tsx
"use client"

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"

export type Tab = "recipes" | "products" | "customers" | "jobs"

export type Filters = {
  // Always present
  q: string

  // Home/FilterPanel fields
  dietaryRestrictions: string[]   // aka diets
  allergens: string[]
  cuisines: string[]
  majorConditions: string[];   // New field for major health conditions
  calories: [number, number]      // [min, max] kcal
  proteinMin: number              // g
  carbsMin: number                // g
  fatMin: number                  // g
  fiberMin: number                // g
  sugarMax: number                // g
  sodiumMax: number               // mg
  maxTime: number                 // minutes

  // New: meal type filter (breakfast, lunch, dinner, snack)
  mealType?: string | null

  // Optional / legacy
  tab?: Tab
  customerTag?: string | null
}

type Ctx = {
  state: Filters
  setState: Dispatch<SetStateAction<Filters>>
  setQuery: (q: string) => void
  setTab: (t: Tab) => void
  reset: () => void

  // Back-compat aliases
  filters: Filters
  setFilters: Dispatch<SetStateAction<Filters>>
  resetFilters: () => void
}

const DEFAULTS: Filters = {
  q: "",
  dietaryRestrictions: [],
  allergens: [],
  cuisines: [],
  majorConditions: [],
  calories: [0, 1200], // page treats >0 / <1200 as "active"
  proteinMin: 0,
  carbsMin: 0,
  fatMin: 0,
  fiberMin: 0,
  sugarMax: 100,
  sodiumMax: 4000,
  maxTime: 120,        // page treats <120 as "active"
  mealType: null,
  tab: "recipes",
  customerTag: null,
}

const FiltersContext = createContext<Ctx | null>(null)

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Filters>(DEFAULTS)

  const value = useMemo<Ctx>(
    () => ({
      state,
      setState,
      setQuery: (q) => setState((s) => ({ ...s, q })),
      setTab: (t) => setState((s) => ({ ...s, tab: t })),
      reset: () => setState(DEFAULTS),

      // aliases
      filters: state,
      setFilters: setState,
      resetFilters: () => setState(DEFAULTS),
    }),
    [state]
  )

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
}

export function useFilters() {
  const ctx = useContext(FiltersContext)
  if (!ctx) throw new Error("useFilters must be used within FiltersProvider")
  return ctx
}
