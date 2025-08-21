// components/analyzer/result-panel.tsx
"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Wrench, FileText } from "lucide-react"
import type { AnalyzeResult } from "@/lib/types"

// result cards (absolute paths so TS resolves consistently)
import { NutritionCard } from "@/components/analyzer/result-cards/nutrition-card"
import { AllergensCard } from "@/components/analyzer/result-cards/allergens-card"
import { TasteProfileCard } from "@/components/analyzer/result-cards/taste-profile-card"
import { TagsCard } from "@/components/analyzer/result-cards/tags-card"
import { SummaryCard } from "@/components/analyzer/result-cards/summary-card"
import { SuggestionsCard } from "@/components/analyzer/result-cards/suggestions-card"
import { IngredientsCard } from "@/components/analyzer/result-cards/ingredients-card"

interface Props {
  result?: AnalyzeResult
  loading?: boolean
  onEdit?: (r: AnalyzeResult) => void
  onExport?: () => void
  onOpenInBuilder?: () => void
}

export function ResultPanel({
  result,
  loading = false,
  onEdit,
  onExport,
  onOpenInBuilder,
}: Props) {
  if (loading) {
    return (
      <div className="h-full p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-40" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-28" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="h-full p-6 grid place-items-center text-center text-sm text-muted-foreground">
        <div className="space-y-2">
          <FileText className="mx-auto h-10 w-10 opacity-60" />
          <div>No Analysis Yet</div>
          <div>Provide content on the left, then click “Analyze Recipe”.</div>
        </div>
      </div>
    )
  }

  // ---- Normalize fields for the cards (typed + safe) ----
  const mapped = {
    ...result,
    // Prefer nutritionPerServing. (We do NOT reference a non-existent 'nutrition' key.)
    nutrition: result.nutritionPerServing ?? {},
    allergens: result.inferred?.allergens ?? [],
    diets: result.inferred?.diets ?? [],
    cuisines: result.inferred?.cuisines ?? [],
    tasteList: result.inferred?.taste ?? [],
  }

  return (
    <div className="h-full p-6 space-y-4">
      <div className="flex items-center justify-end gap-2">
        {onOpenInBuilder && (
          <Button variant="secondary" onClick={onOpenInBuilder}>
            <Wrench className="h-4 w-4 mr-2" />
            Open in Builder
          </Button>
        )}
        {onExport && (
          <Button onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard result={mapped as any} onEdit={onEdit} />
        <NutritionCard result={mapped as any} onEdit={onEdit} />
        <IngredientsCard result={mapped as any} onEdit={onEdit} />
        <AllergensCard result={mapped as any} onEdit={onEdit} />
        <TagsCard result={mapped as any} onEdit={onEdit} />
        <TasteProfileCard result={mapped as any} onEdit={onEdit} />
        <SuggestionsCard result={mapped as any} onEdit={onEdit} />
      </div>
    </div>
  )
}

// Provide both named and default exports (some setups prefer one or the other)
export default ResultPanel
