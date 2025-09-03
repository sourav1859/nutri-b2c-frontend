"use client"

import { useParams, useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiGetRecipe, apiToggleSave } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { StartCookingOverlay } from "@/components/start-cooking-overlay"
import { RecipeHero } from "@/components/recipe-hero"
import { RecipeTabs } from "@/components/recipe-tabs"
import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { useFavorites } from "@/hooks/use-favorites"
import { useHistory } from "@/hooks/use-history"

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const qc = useQueryClient()
  const { toast } = useToast()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { addToHistory } = useHistory()

  const addedToHistoryRef = useRef<string | null>(null)

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => apiGetRecipe(id),
    retry: 2,
  })

  useEffect(() => {
    if (recipe && addedToHistoryRef.current !== recipe.id) {
      addToHistory(recipe.id)
      addedToHistoryRef.current = recipe.id
    }
  }, [recipe, addToHistory]) // Depend on recipe object instead of recipe.id

  const toggleSave = useMutation({
    mutationFn: () => apiToggleSave(id),
    onSuccess: () => {
      toggleFavorite(id)
      qc.invalidateQueries({ queryKey: ["recipe", id] })
      qc.invalidateQueries({ queryKey: ["recipes"] })
      qc.invalidateQueries({ queryKey: ["saved"] })
      toast({
        title: isFavorite(id) ? "Recipe unsaved" : "Recipe saved",
        description: isFavorite(id) ? "Removed from your favorites" : "Added to your favorites",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update recipe. Please try again.",
        variant: "destructive",
      })
    },
  })

  const [cookingOpen, setCookingOpen] = useState(false)

  const handleShare = async () => {
    const shareData = {
      title: recipe?.title || "Recipe",
      text: `Check out this recipe: ${recipe?.title}`,
      url: typeof window !== "undefined" ? window.location.href : "",
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData as any)
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url || "")
        toast({ title: "Link copied", description: "Recipe link copied to clipboard." })
      } catch {
        toast({
          title: "Error",
          description: "Failed to copy link to clipboard.",
          variant: "destructive",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="aspect-[16/9] bg-muted animate-pulse rounded-lg" />
          <div className="space-y-2">
            <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="container px-4 py-6 max-w-4xl">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Recipe not found</h1>
          <p className="text-muted-foreground">The recipe you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const steps: string[] =
  Array.isArray((recipe as any)?.instructions)
    ? (recipe as any).instructions
    : Array.isArray((recipe as any)?.steps)
    ? (recipe as any).steps
    : [];

  return (
    <div className="container px-4 py-6 max-w-4xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="pl-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to recipes
        </Button>
      </div>

      <div className="space-y-8">
        {/* Recipe Hero */}
        <RecipeHero recipe={recipe} onToggleSave={() => toggleSave.mutate()} onShare={handleShare} />

        {/* Recipe Tabs */}
        <RecipeTabs recipe={recipe} />

        {/* Start Cooking Button */}
        <div className="flex justify-center pt-4">
          <Button size="lg" onClick={() => setCookingOpen(true)} className="shadow-lg">
            Start Cooking
          </Button>
        </div>
      </div>

      {/* Cooking Overlay */}
      <StartCookingOverlay
        open={cookingOpen}
        onOpenChange={setCookingOpen}
        steps={steps}
        recipeTitle={recipe.title}
      />
    </div>
  )
}
