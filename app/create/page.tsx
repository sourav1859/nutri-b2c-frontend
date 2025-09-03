"use client"
import * as React from "react"
import RecipeCreateForm from "@/components/recipe-builder-simple/form"
import RecipeDetailsPanel from "@/components/recipe/recipe-details-panel"
import { estimateNutrition } from "@/lib/nutrition"
import { makeUserRecipeId, saveUserRecipe } from "@/lib/recipes"

export default function CreateRecipePage() {
  const [preview, setPreview] = React.useState<any | null>(null)

  if (preview) {
    return (
      <div className="mx-auto max-w-4xl p-4 space-y-6">
        <h1 className="text-2xl font-semibold">Create Recipe</h1>
        <RecipeDetailsPanel
          recipe={preview}
          mode="preview"
          onBack={() => setPreview(null)}
          onSave={() => {
            const id = makeUserRecipeId()
            const saved = { ...preview, id, createdAt: Date.now(), type: "user" }
            saveUserRecipe(saved)
            setPreview({ ...saved }) // keep showing saved result
          }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Create Recipe</h1>
      <RecipeCreateForm
        onSubmit={(draft) => {
          const nutrition = estimateNutrition(draft.ingredients, draft.servings)
          setPreview({ ...draft, nutrition }) // preview only; not saved yet
        }}
      />
    </div>
  )
}
