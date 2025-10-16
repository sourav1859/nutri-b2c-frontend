"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Flame, Soup, Heart, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Difficulty } from "@/lib/types"
import { DEFAULT_RECIPE_IMAGE } from "@/lib/constants"

export type RecipeCardProps = {
  id: string
  href?: string 
  title?: string
  imageUrl?: string | null
  prepTime?: number
  cookTime?: number
  servings?: number
  difficulty?: Difficulty
  isSaved?: boolean
  onSave: (id: string) => void
  tags?: string[]
  score?: number
}

export function RecipeCard({
  id,
  title = "Untitled",
  imageUrl = "/placeholder.svg",
  prepTime = 0,
  cookTime = 0,
  servings = 1,
  difficulty = "easy",
  isSaved = false,
  onSave,
  tags = [],
  score,
  href,
}: RecipeCardProps) {
  const totalTime = prepTime + cookTime
  const shown = tags.slice(0, 3)
  const rest = tags.length - shown.length
  const linkHref = href ?? `/recipes/${id}`;

  return (
    <Card className="overflow-hidden group focus-within:ring-2 focus-within:ring-ring">
      <Link href={linkHref} prefetch={false} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={DEFAULT_RECIPE_IMAGE}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
            priority={false}
          />
          {score !== undefined && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/70 text-white border-0 text-xs">
                <Star className="w-3 h-3 mr-1" />
                {Math.round(score * 100)}
              </Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-3">
        <h3 className="line-clamp-1 font-semibold">{title}</h3>
        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {totalTime}m
          </span>
          <span className="inline-flex items-center gap-1">
            <Soup className="h-4 w-4" aria-hidden="true" />
            {servings}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 capitalize",
              difficulty === "easy"
                ? "text-green-600 dark:text-green-500"
                : difficulty === "medium"
                  ? "text-amber-600 dark:text-amber-500"
                  : "text-red-600 dark:text-red-500",
            )}
          >
            <Flame className="h-4 w-4" aria-hidden="true" />
            {difficulty}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {shown.map((t) => (
            <Badge key={t} variant="secondary" className="rounded">
              {t}
            </Badge>
          ))}
          {rest > 0 && (
            <Badge variant="outline" className="rounded">
              +{rest}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button
          aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
          variant="ghost"
          size="sm"
          className={cn("ml-auto hover:text-rose-600", isSaved && "text-rose-600")}
          onClick={() => onSave(id)}
        >
          <Heart className={cn("h-5 w-5", isSaved && "fill-rose-600")} />
        </Button>
      </CardFooter>
    </Card>
  )
}
