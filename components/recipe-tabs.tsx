"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { NutritionFactsPanel } from "@/components/nutrition-facts-panel"
import type { Recipe, Nutrition } from "@/lib/types"

// ----- local types & helpers -----

type IngredientObj = {
  id: string
  name: string
  amount?: string
  category?: string
}

type ExtendedNutrition = Nutrition & {
  totalSugars?: number
  allergens?: string[]
  transFat?: number
}

const n = (v?: number) => (typeof v === "number" ? v : 0)

function normalizeIngredients(recipe: any): IngredientObj[] {
  const src: unknown =
    recipe?.ingredients ??
    recipe?.ingredientLines ?? // sometimes used by parsers
    []

  if (!Array.isArray(src)) return []

  // strings -> objects
  if (src.length > 0 && typeof src[0] === "string") {
    return (src as string[]).map((line, i) => ({
      id: `ing-${i}`,
      name: line,
      category: "Ingredients",
    }))
  }

  // analyzer style: { item, qty, unit }
  const asObjs = src as any[]
  if (asObjs.length > 0 && "item" in asObjs[0]) {
    return asObjs.map((g, i) => ({
      id: g.id ?? `ing-${i}`,
      name: String(g.item ?? "").trim(),
      amount:
        g.qty != null || g.unit
          ? `${g.qty ?? ""}${g.unit ? ` ${g.unit}` : ""}`.trim()
          : undefined,
      category: g.category ?? "Ingredients",
    }))
  }

  // already like { name, amount?, category? }
  return asObjs.map((g, i) => ({
    id: g.id ?? `ing-${i}`,
    name: String(g.name ?? g.title ?? "").trim(),
    amount: g.amount ? String(g.amount) : undefined,
    category: g.category ?? "Ingredients",
  }))
}

function toExtendedNutrition(nut?: Nutrition): ExtendedNutrition {
  const base: ExtendedNutrition = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    saturatedFat: 0,
    cholesterol: 0,
    sodium: 0,
    fiber: 0,
    addedSugars: 0,
    vitaminD: 0,
    calcium: 0,
    iron: 0,
    potassium: 0,
    // optional extensions
    totalSugars: (n as any)?.sugar ?? 0,
    allergens: [],
    transFat: 0,
  }
  return { ...base, ...(nut ?? {}) }
}

function toSteps(instructions: unknown): string[] {
  if (Array.isArray(instructions)) return instructions.filter((s): s is string => typeof s === "string")
  if (typeof instructions === "string") {
    return instructions
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
  }
  return []
}

// ----- component -----

interface RecipeTabsProps {
  recipe: Recipe
}

export function RecipeTabs({ recipe }: RecipeTabsProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({})

  // normalize data defensively
  const ingredients = useMemo(() => normalizeIngredients(recipe), [recipe])
  const servings = recipe?.servings ?? 1
  const nutrition = useMemo<ExtendedNutrition>(() => toExtendedNutrition((recipe as any).nutrition), [recipe])
  const steps = useMemo(() => toSteps((recipe as any).instructions), [recipe])

  // Group ingredients by category (typed)
  const groupedIngredients = useMemo(() => {
    return ingredients.reduce<Record<string, IngredientObj[]>>((acc, ingredient) => {
      const category = ingredient.category || "Ingredients"
      if (!acc[category]) acc[category] = []
      acc[category].push(ingredient)
      return acc
    }, {})
  }, [ingredients])

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
        <TabsTrigger value="steps">Steps</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Nutrition Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-muted/50 rounded">
                  <div className="text-2xl font-bold text-primary">{n(nutrition.calories)}</div>
                  <div className="text-muted-foreground">Calories</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded">
                  <div className="text-2xl font-bold text-primary">{n(nutrition.protein)}g</div>
                  <div className="text-muted-foreground">Protein</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded">
                  <div className="text-2xl font-bold text-primary">{n(nutrition.carbs)}g</div>
                  <div className="text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded">
                  <div className="text-2xl font-bold text-primary">{n(nutrition.fat)}g</div>
                  <div className="text-muted-foreground">Fat</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Allergens */}
          <Card>
            <CardHeader>
              <CardTitle>Allergen Information</CardTitle>
            </CardHeader>
            <CardContent>
              {!(nutrition.allergens && nutrition.allergens.length) ? (
                <p className="text-muted-foreground">No common allergens detected.</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-destructive">Contains:</p>
                  <div className="flex flex-wrap gap-2">
                    {nutrition.allergens!.map((allergen) => (
                      <Badge key={allergen} variant="destructive" className="text-xs">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="nutrition" className="mt-6">
        <NutritionFactsPanel nutrition={nutrition} servings={servings} />
      </TabsContent>

      <TabsContent value="ingredients" className="mt-6">
        {ingredients.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">No ingredients listed.</CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedIngredients).map(([category, items]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {items.map((ingredient) => {
                      const checked = !!checkedIngredients[ingredient.id]
                      return (
                        <li key={ingredient.id} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(v) =>
                              setCheckedIngredients((prev) => ({ ...prev, [ingredient.id]: !!v }))
                            }
                            aria-label={`Mark ${ingredient.name} as acquired`}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className={checked ? "line-through text-muted-foreground" : "font-medium"}>
                              {ingredient.name}
                            </div>
                            {ingredient.amount && (
                              <div className="text-sm text-muted-foreground">{ingredient.amount}</div>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="steps" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Cooking Instructions</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardContent>
            {steps.length === 0 ? (
              <p className="text-sm text-muted-foreground">No instructions provided.</p>
            ) : (
              <ol className="space-y-4">
                {steps.map((step, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="leading-relaxed">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
