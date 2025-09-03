"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, ChefHat, Heart, Share2, Star } from "lucide-react"
import type { Recipe } from "@/lib/types"

interface RecipeHeroProps {
  recipe: Recipe
  onToggleSave: () => void
  onShare: () => void
}

export function RecipeHero({ recipe, onToggleSave, onShare }: RecipeHeroProps) {
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookTime ?? 0)
  const title = recipe.title ?? "Untitled"
  const src = recipe.imageUrl || "/placeholder.svg?height=720&width=1280&query=recipe%20hero"
  const imageAlt = recipe.imageAlt ?? recipe.title ?? "Recipe image";
  const rating = "rating" in recipe ? (recipe as any).rating ?? 0 : 0;
  const reviewCount =
    "reviewCount" in recipe ? (recipe as any).reviewCount ?? 0 : 0;
  const tags = recipe.tags ?? [];
  const cuisines = recipe.cuisines ?? [];

  return (
    <div className="space-y-4">
      {/* Hero Image */}
      <div className="relative w-full">
        <Image
          src={imageAlt || "/placeholder.svg?height=720&width=1280&query=recipe%20hero"}
          alt={title}
          width={1280}
          height={720}
          className="w-full aspect-[16/9] object-cover rounded-lg"
          priority
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/80 backdrop-blur"
            onClick={onToggleSave}
            aria-label={recipe.isSaved ? "Unsave recipe" : "Save recipe"}
          >
            <Heart className={`h-5 w-5 ${recipe.isSaved ? "fill-rose-600 text-rose-600" : ""}`} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/80 backdrop-blur"
            onClick={onShare}
            aria-label="Share recipe"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Recipe Title and Description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold leading-tight">{recipe.title}</h1>
        {recipe.description && <p className="text-muted-foreground text-lg leading-relaxed">{recipe.description}</p>}
      </div>

      {/* Rating and Reviews */}
      {rating && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="font-medium">{rating.toFixed(1)}</span>
          {reviewCount && <span className="text-muted-foreground">({reviewCount} reviews)</span>}
        </div>
      )}

      {/* Recipe Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">Prep Time</div>
            <div className="text-muted-foreground">{recipe.prepTime}m</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">Cook Time</div>
            <div className="text-muted-foreground">{recipe.cookTime}m</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">Servings</div>
            <div className="text-muted-foreground">{recipe.servings}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ChefHat className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">Difficulty</div>
            <div className="text-muted-foreground capitalize">{recipe.difficulty}</div>
          </div>
        </div>
      </div>

      {/* Tags and Cuisines */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
        {cuisines.map((cuisine) => (
          <Badge key={cuisine} variant="outline">
            {cuisine}
          </Badge>
        ))}
      </div>
    </div>
  )
}
