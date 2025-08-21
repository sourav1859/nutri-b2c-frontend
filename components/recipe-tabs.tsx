"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { NutritionFactsPanel } from "@/components/nutrition-facts-panel"
import type { Recipe } from "@/lib/types"

interface RecipeTabsProps {
  recipe: Recipe
}

export function RecipeTabs({ recipe }: RecipeTabsProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({})

  // Group ingredients by category
  const groupedIngredients = recipe.ingredients.reduce(
    (acc, ingredient) => {
      const category = ingredient.category || "Other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(ingredient)
      return acc
    },
    {} as Record<string, typeof recipe.ingredients>,
  )

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
                  <div className="text-2xl font-bold text-primary">{recipe.nutrition.calories}</div>
                  <div className="text-muted-foreground">Calories</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded">
                  <div className="text-2xl font-bold text-primary">{recipe.nutrition.protein}g</div>
                  <div className="text-muted-foreground">Protein</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded">
                  <div className="text-2xl font-bold text-primary">{recipe.nutrition.carbs}g</div>
                  <div className="text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded">
                  <div className="text-2xl font-bold text-primary">{recipe.nutrition.fat}g</div>
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
              {recipe.nutrition.allergens.length === 0 ? (
                <p className="text-muted-foreground">No common allergens detected.</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-destructive">Contains:</p>
                  <div className="flex flex-wrap gap-2">
                    {recipe.nutrition.allergens.map((allergen) => (
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
        <NutritionFactsPanel nutrition={recipe.nutrition} servings={recipe.servings} />
      </TabsContent>

      <TabsContent value="ingredients" className="mt-6">
        <div className="space-y-6">
          {Object.entries(groupedIngredients).map(([category, ingredients]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {ingredients.map((ingredient) => {
                    const checked = !!checkedIngredients[ingredient.id]
                    return (
                      <li key={ingredient.id} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) => setCheckedIngredients((prev) => ({ ...prev, [ingredient.id]: !!v }))}
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
      </TabsContent>

      <TabsContent value="steps" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Cooking Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.instructions.map((step, idx) => (
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
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
