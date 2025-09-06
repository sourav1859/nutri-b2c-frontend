"use client"

import { useMemo, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { RecipeCard } from "@/components/recipe-card"
import { Button } from "@/components/ui/button"
import { apiGetFeed, apiSearchRecipes, apiToggleSave } from "@/lib/api"
import { useFilters } from "@/hooks/use-filters"
import { FilterPanel, type FiltersFormValues } from "@/components/filter-panel"
import { useUser } from "@/hooks/use-user"
import { cn } from "@/lib/utils"
import type { Recipe } from "@/lib/types"

const QUICK_FILTERS = [
  { label: "Breakfast", q: "breakfast" },
  { label: "Lunch", q: "lunch" },
  { label: "Dinner", q: "dinner" },
  { label: "Vegan", q: "vegan", diet: "Vegan" },
  { label: "Keto", q: "keto", diet: "Keto" },
]

export default function HomePage() {
  const { user } = useUser()
  const { filters, setFilters, resetFilters } = useFilters()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false) // tied to same panel for simplicity
  const qc = useQueryClient()

  const queryKey = useMemo(() => ["recipes", filters], [filters])

  const { data: items = [], isLoading } = useQuery({
    queryKey,
    queryFn: async (): Promise<Recipe[]> => {
      const hasAny =
        !!filters.q ||
        filters.dietaryRestrictions.length > 0 ||
        filters.allergens.length > 0 ||
        filters.cuisines.length > 0 ||
        filters.calories[0] > 0 ||
        filters.calories[1] < 1200 ||
        filters.proteinMin > 0 ||
        filters.carbsMin > 0 ||
        filters.fatMin > 0 ||
        filters.maxTime < 120
      if (hasAny) {
        return apiSearchRecipes({ q: filters.q, filters })
      }
      return apiGetFeed()
    },
  })

  const toggleSave = useMutation({
    mutationFn: (id: string) => apiToggleSave(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey })
      qc.invalidateQueries({ queryKey: ["saved"] })
    },
  })

  function handleApply(values: FiltersFormValues) {
    setFilters(values)
  }

  function handleQuickFilterClick(item: (typeof QUICK_FILTERS)[number]) {
    const next = { ...filters, q: item.q }
    if (item.diet) {
      next.dietaryRestrictions = [item.diet]
    }
    setFilters(next)
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <section aria-label="Hero">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome{user ? `, ${user.name}` : ""}!</h1>
        <p className="text-muted-foreground">Discover recipes tailored to your dietary needs.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.label}
              className={cn(
                "rounded-full border px-3 py-1 text-sm hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                filters.q === f.q ? "bg-accent" : undefined,
              )}
              onClick={() => handleQuickFilterClick(f)}
            >
              {f.label}
            </button>
          ))}
          <Button variant="outline" size="sm" onClick={() => setFiltersOpen(true)}>
            Filters
          </Button>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Recommended for You</h2>
        </div>
      </section>

      <section aria-label="Recipe grid">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-60 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border p-6 text-center">
            <p className="mb-2 font-medium">No recipes found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
            <div className="mt-3">
              <Button
                variant="outline"
                onClick={() => {
                  resetFilters()
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => {
              const r = (item as any)?.recipe ?? item; // supports both feed shapes
              return (
                <RecipeCard
                  key={`${r.id ?? 'no-id'}-${i}`}                   // i is defined
                  id={r.id}
                  title={r.title ?? r.name ?? 'Untitled'}
                  imageUrl={r.image_url ?? r.imageUrl ?? '/placeholder.svg'}
                  // If your card uses one time field, keep the best you have:
                  prepTime={r.prep_time_minutes ?? r.time_minutes ?? r.total_time_minutes ?? 0}
                  cookTime={r.cook_time_minutes ?? undefined}
                  servings={r.servings ?? undefined}
                  difficulty={String(r.difficulty ?? 'easy').toLowerCase() as any}
                  isSaved={Boolean(r.is_saved ?? r.isSaved)}
                  tags={r.diet_tags ?? r.tags ?? []}
                  onSave={(id) => toggleSave.mutate(id)}
                />
              );
            })}
          </div>
        )}
      </section>

      <FilterPanel
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        initialValues={{
          dietaryRestrictions: filters.dietaryRestrictions,
          allergens: filters.allergens,
          calories: filters.calories,
          proteinMin: filters.proteinMin,
          carbsMin: filters.carbsMin,
          fatMin: filters.fatMin,
          fiberMin: filters.fiberMin,      // ✅ new
          sugarMax: filters.sugarMax,      // ✅ new
          sodiumMax: filters.sodiumMax,    // ✅ new
          maxTime: filters.maxTime,
          cuisines: filters.cuisines,
          majorConditions: filters.majorConditions, // ✅ new
          q: filters.q,
        }}
        onApply={handleApply}
        onReset={() => resetFilters()}
      />
    </div>
  )
}
