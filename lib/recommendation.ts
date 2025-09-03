import type { Recipe } from "./types"
import type { RecommendationSettings } from "./types"

export type ScoredRecipe = Recipe & {
  score: number
  scoreBreakdown?: {
    health: number
    time: number
    popularity: number
    personal: number
    diversity: number
  }
}

export function rank(recipes: Recipe[], settings: RecommendationSettings): ScoredRecipe[] {
  // Filter recipes based on constraints
  const filtered = recipes.filter((recipe) => {
    // Diet restrictions
    if (settings.diets.length > 0) {
      const recipeDiets =
        recipe.tags?.filter((tag) => settings.diets.some((diet) => tag.toLowerCase().includes(diet.toLowerCase()))) ||
        []
      if (recipeDiets.length === 0) return false
    }

    // Allergen restrictions
    if (settings.allergens.length > 0) {
      const hasAllergen = recipe.tags?.some((tag) =>
        settings.allergens.some((allergen) => tag.toLowerCase().includes(allergen.toLowerCase())),
      )
      if (hasAllergen) return false
    }

    // Time constraints
    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
    if (totalTime < settings.timeRangeMinMax[0] || totalTime > settings.timeRangeMinMax[1]) {
      return false
    }

    return true
  })

  // Score each recipe
  const scored: ScoredRecipe[] = filtered.map((recipe) => {
    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)

    // Normalize scores to 0-1 range
    const healthScore = calculateHealthScore(recipe, settings)
    const timeScore = calculateTimeScore(totalTime, settings)
    const popularityScore = calculatePopularityScore(recipe)
    const personalScore = calculatePersonalScore(recipe, settings)
    const diversityScore = 1 // Will be calculated after initial scoring

    // Apply weights
    const weights =
    settings.advanced?.weights ?? {
      health: 1,
      time: 1,
      popularity: 1,
      personal: 1,
      diversity: 1,
    }
    const totalWeight = weights.health + weights.time + weights.popularity + weights.personal + weights.diversity

    const score =
      (weights.health / totalWeight) * healthScore +
      (weights.time / totalWeight) * timeScore +
      (weights.popularity / totalWeight) * popularityScore +
      (weights.personal / totalWeight) * personalScore +
      (weights.diversity / totalWeight) * diversityScore

    return {
      ...recipe,
      score,
      scoreBreakdown: {
        health: healthScore,
        time: timeScore,
        popularity: popularityScore,
        personal: personalScore,
        diversity: diversityScore,
      },
    }
  })

  // Sort by score (highest first)
  return scored.sort((a, b) => b.score - a.score)
}

function calculateHealthScore(recipe: Recipe, settings: RecommendationSettings): number {
  let score = 0.5 // Base score

  // Calorie target matching
  if (settings.calorieTarget && recipe.nutrition?.calories) {
    const calorieDistance = Math.abs(recipe.nutrition.calories - settings.calorieTarget)
    const maxDistance = settings.calorieTarget * 0.5 // Allow 50% variance
    score += 0.3 * Math.max(0, 1 - calorieDistance / maxDistance)
  }

  // Macro balance
  if (recipe.nutrition) {
    const { protein = 0, carbs = 0, fat = 0 } = recipe.nutrition
    const totalMacros = protein * 4 + carbs * 4 + fat * 9 // Calories from macros

    if (totalMacros > 0) {
      const proteinRatio = (protein * 4) / totalMacros
      const carbRatio = (carbs * 4) / totalMacros
      const fatRatio = (fat * 9) / totalMacros

      const targetProtein = settings.macroWeights.protein / 100
      const targetCarbs = settings.macroWeights.carbs / 100
      const targetFat = settings.macroWeights.fat / 100

      const macroScore =
        1 -
        (Math.abs(proteinRatio - targetProtein) + Math.abs(carbRatio - targetCarbs) + Math.abs(fatRatio - targetFat)) /
          2

      score += 0.2 * Math.max(0, macroScore)
    }
  }

  return Math.min(1, Math.max(0, score))
}

function calculateTimeScore(totalTime: number, settings: RecommendationSettings): number {
  const [minTime, maxTime] = settings.timeRangeMinMax
  const midpoint = (minTime + maxTime) / 2

  // Prefer recipes closer to the midpoint of the time range
  const distance = Math.abs(totalTime - midpoint)
  const maxDistance = (maxTime - minTime) / 2

  return Math.max(0, 1 - distance / maxDistance)
}

function calculatePopularityScore(recipe: Recipe): number {
  // Normalize difficulty and default to "medium" if missing
  const d = (recipe.difficulty ?? "medium").toString().toLowerCase();
  // easier = more popular
  const difficultyScore = d === "easy" ? 1 : d === "medium" ? 0.7 : 0.4;
  // Add some randomness to simulate popularity
  const mockPopularity = Math.random() * 0.3 + 0.7;
  return (difficultyScore + mockPopularity) / 2;
}

function calculatePersonalScore(recipe: Recipe, settings: RecommendationSettings): number {
  const personalization = settings.personalization ?? {
    diversityBias: 0,
    avoidRecentlyViewedHours: 0,
  }
  const useHistory = (personalization.avoidRecentlyViewedHours ?? 0) > 0
  if (!useHistory) return 0.5

  // Mock personalization based on recipe tags and user preferences
  let score = 0.5

  // Boost score for preferred cuisines
  if (settings.cuisines.length > 0 && recipe.tags) {
    const matchingCuisines = recipe.tags.filter((tag) =>
      settings.cuisines.some((cuisine) => tag.toLowerCase().includes(cuisine.toLowerCase())),
    )
    score += (matchingCuisines.length / settings.cuisines.length) * 0.3
  }

  // Penalize for disliked ingredients
  if (settings.dislikes.length > 0 && recipe.tags) {
    const dislikedIngredients = recipe.tags.filter((tag) =>
      settings.dislikes.some((dislike) => tag.toLowerCase().includes(dislike.toLowerCase())),
    )
    score -= (dislikedIngredients.length / settings.dislikes.length) * 0.4
  }

  return Math.min(1, Math.max(0, score))
}

export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0
  return (value - min) / (max - min)
}

export function macroDistance(
  actual: { protein: number; carbs: number; fat: number },
  target: { protein: number; carbs: number; fat: number },
): number {
  const proteinDiff = Math.abs(actual.protein - target.protein) / 100
  const carbsDiff = Math.abs(actual.carbs - target.carbs) / 100
  const fatDiff = Math.abs(actual.fat - target.fat) / 100

  return (proteinDiff + carbsDiff + fatDiff) / 3
}

export function timeCloseness(actualTime: number, targetRange: [number, number]): number {
  const [min, max] = targetRange
  if (actualTime >= min && actualTime <= max) return 1

  const distanceFromRange = actualTime < min ? min - actualTime : actualTime - max
  const maxDistance = Math.max(min, 120 - max) // Assume max possible time is 120

  return Math.max(0, 1 - distanceFromRange / maxDistance)
}

export function similarity(recipe1: Recipe, recipe2: Recipe): number {
  // Simple similarity based on shared tags
  const tags1 = new Set(recipe1.tags || [])
  const tags2 = new Set(recipe2.tags || [])

  const intersection = new Set([...tags1].filter((tag) => tags2.has(tag)))
  const union = new Set([...tags1, ...tags2])

  return union.size > 0 ? intersection.size / union.size : 0
}
