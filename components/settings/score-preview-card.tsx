"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Props = {
  weights: {
    health: number
    time: number
    popularity: number
    personal: number
    diversity: number
  }
}

export function ScorePreviewCard({ weights }: Props) {
  // Mock recipe for demonstration
  const mockRecipe = {
    title: "Mediterranean Quinoa Bowl",
    health: 0.85,
    time: 0.7,
    popularity: 0.6,
    personal: 0.9,
    diversity: 0.4,
  }

  const totalWeight = weights.health + weights.time + weights.popularity + weights.personal + weights.diversity

  const normalizedWeights = {
    health: weights.health / totalWeight,
    time: weights.time / totalWeight,
    popularity: weights.popularity / totalWeight,
    personal: weights.personal / totalWeight,
    diversity: weights.diversity / totalWeight,
  }

  const finalScore =
    normalizedWeights.health * mockRecipe.health +
    normalizedWeights.time * mockRecipe.time +
    normalizedWeights.popularity * mockRecipe.popularity +
    normalizedWeights.personal * mockRecipe.personal +
    normalizedWeights.diversity * mockRecipe.diversity

  const components = [
    { name: "Health", value: mockRecipe.health, weight: normalizedWeights.health, color: "bg-green-500" },
    { name: "Time", value: mockRecipe.time, weight: normalizedWeights.time, color: "bg-blue-500" },
    { name: "Popularity", value: mockRecipe.popularity, weight: normalizedWeights.popularity, color: "bg-purple-500" },
    { name: "Personal", value: mockRecipe.personal, weight: normalizedWeights.personal, color: "bg-orange-500" },
    { name: "Diversity", value: mockRecipe.diversity, weight: normalizedWeights.diversity, color: "bg-pink-500" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Score Preview</CardTitle>
        <p className="text-sm text-muted-foreground">Example: {mockRecipe.title}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold">{(finalScore * 100).toFixed(0)}</div>
          <div className="text-xs text-muted-foreground">Final Score</div>
        </div>

        <div className="space-y-2">
          {components.map((component) => {
            const contribution = component.value * component.weight
            return (
              <div key={component.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{component.name}</span>
                  <span>{(contribution * 100).toFixed(0)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${component.color}`} />
                  <Progress value={contribution * 100} className="flex-1 h-2" />
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Formula:</p>
          <p>
            Score = W<sub>h</sub>×H + W<sub>t</sub>×T + W<sub>p</sub>×P + W<sub>r</sub>×R + W<sub>d</sub>×D
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
