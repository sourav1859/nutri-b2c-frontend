export type AnalyzeResult = {
  title?: string
  servings?: number
  ingredients: { qty?: number; unit?: string; item: string; matched?: boolean }[]
  steps?: string[]
  inferred: {
    allergens: string[]
    diets: string[]
    cuisines: string[]
    taste: string[]
  }
  nutritionPerServing?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    sodium?: number
    sugars?: number
    fiber?: number
    potassium?: number
    iron?: number
    calcium?: number
    vitaminD?: number
  }
  summary: string
  suggestions: string[]
}

export type Product = {
  upc: string
  title: string
  brand?: string
  imageUrl?: string
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    sodium?: number
    sugars?: number
    addedSugars?: number
    fiber?: number
    vitaminD?: number
    calcium?: number
    iron?: number
    potassium?: number
  }
}
