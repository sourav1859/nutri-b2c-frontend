"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiGetSaved, apiToggleSave } from "@/lib/api"
import { RecipeCard } from "@/components/recipe-card"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import type { Recipe } from "@/lib/types"

export default function SavedPage() {
  const qc = useQueryClient()
  const { data: items = [] } = useQuery<Recipe[]>({ queryKey: ["saved"], queryFn: apiGetSaved })
  const toggleSave = useMutation({
    mutationFn: (id: string) => apiToggleSave(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saved"] })
      qc.invalidateQueries({ queryKey: ["recipes"] })
    },
  })

  return (
    <div className="pb-16 md:pb-0">
      <AppHeader />
      <main className="container px-4 py-4 space-y-4">
        <h1 className="text-2xl font-bold">Saved Recipes</h1>
        {items.length === 0 ? (
          <p className="text-muted-foreground">You haven&apos;t saved any recipes yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((r: Recipe) => (
              <RecipeCard
                key={r.id}
                id={r.id}
                title={r.title}
                imageUrl={r.imageUrl}
                prepTime={r.prepTime}
                cookTime={r.cookTime}
                servings={r.servings}
                difficulty={r.difficulty}
                isSaved={!!r.isSaved}
                tags={r.tags ?? []}
                onSave={(id) => toggleSave.mutate(id)}
              />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
