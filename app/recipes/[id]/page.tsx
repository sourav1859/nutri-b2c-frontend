"use client"

import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiGetRecipe, apiToggleSave } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, Users, Flame, Heart, Share2 } from "lucide-react"
import { StartCookingOverlay } from "@/components/start-cooking-overlay"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { AppHeader } from "@/components/app-header"

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const qc = useQueryClient()
  const { toast } = useToast()

  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => apiGetRecipe(id),
  })

  const toggleSave = useMutation({
    mutationFn: () => apiToggleSave(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["recipe", id] })
      qc.invalidateQueries({ queryKey: ["recipes"] })
      qc.invalidateQueries({ queryKey: ["saved"] })
    },
  })

  const [cookingOpen, setCookingOpen] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({})

  if (isLoading || !recipe) {
    return (
      <div>
        <AppHeader />
        <div className="container p-4">
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  const totalTime = recipe.prepTime + recipe.cookTime

  async function share() {
    const shareData = {
      title: recipe.title,
      text: `Check out this recipe: ${recipe.title}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData as any)
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url || "")
        toast({ title: "Link copied", description: "Recipe link copied to clipboard." })
      } catch {
        // ignore
      }
    }
  }

  return (
    <div className="pb-24">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="container flex h-12 items-center gap-2 px-4">
          <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="flex-1 truncate font-semibold">{recipe.title}</h1>
          <Button
            variant="ghost"
            size="icon"
            aria-label={recipe.isSaved ? "Unsave recipe" : "Save recipe"}
            onClick={() => toggleSave.mutate()}
          >
            <Heart className={"h-5 w-5" + (recipe.isSaved ? " fill-rose-600 text-rose-600" : "")} />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Share recipe" onClick={share}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="relative w-full">
        <Image
          src={recipe.imageUrl || "/placeholder.svg?height=720&width=1280&query=recipe%20hero"}
          alt={recipe.title}
          width={1280}
          height={720}
          className="w-full aspect-[16/9] object-cover"
          priority
        />
      </div>

      <main className="container px-4 py-4 space-y-6">
        <section aria-label="Recipe metadata" className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 text-sm">
          <div className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4" /> Prep {recipe.prepTime}m
          </div>
          <div className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4" /> Cook {recipe.cookTime}m
          </div>
          <div className="inline-flex items-center gap-2">
            <Users className="h-4 w-4" /> Servings {recipe.servings}
          </div>
          <div className="inline-flex items-center gap-2 capitalize">
            <Flame className="h-4 w-4" /> {recipe.difficulty}
          </div>
          <div className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4" /> Total {totalTime}m
          </div>
        </section>

        <Tabs defaultValue="ingredients" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients" className="pt-4">
            <ul className="grid gap-2">
              {recipe.ingredients.map((ing) => {
                const checked = !!checkedIngredients[ing.id]
                return (
                  <li key={ing.id} className="flex items-start gap-3 rounded border p-2">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => setCheckedIngredients((prev) => ({ ...prev, [ing.id]: !!v }))}
                      aria-label={`Mark ${ing.name} as acquired`}
                    />
                    <div>
                      <div className={checked ? "line-through text-muted-foreground" : ""}>{ing.name}</div>
                      {ing.amount && <div className="text-xs text-muted-foreground">{ing.amount}</div>}
                    </div>
                  </li>
                )
              })}
            </ul>
          </TabsContent>
          <TabsContent value="instructions" className="pt-4">
            <ol className="list-decimal pl-6 space-y-3">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </TabsContent>
          <TabsContent value="nutrition" className="pt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded border p-4">
                <h3 className="font-semibold mb-2">Macros</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Calories</div>
                  <div className="justify-self-end">{recipe.nutrition.calories} kcal</div>
                  <div>Protein</div>
                  <div className="justify-self-end">{recipe.nutrition.protein} g</div>
                  <div>Carbs</div>
                  <div className="justify-self-end">{recipe.nutrition.carbs} g</div>
                  <div>Fat</div>
                  <div className="justify-self-end">{recipe.nutrition.fat} g</div>
                </div>
              </div>
              <div className="rounded border p-4">
                <h3 className="font-semibold mb-2">Allergens</h3>
                {recipe.nutrition.allergens.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No common allergens.</p>
                ) : (
                  <ul className="list-disc pl-5 text-sm">
                    {recipe.nutrition.allergens.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Separator />

      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6">
        <Button size="lg" onClick={() => setCookingOpen(true)} className="shadow-lg">
          Start Cooking
        </Button>
      </div>

      <StartCookingOverlay open={cookingOpen} onOpenChange={setCookingOpen} steps={recipe.instructions} />
    </div>
  )
}
