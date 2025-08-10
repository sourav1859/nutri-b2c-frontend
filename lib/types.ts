export type Difficulty = "easy" | "medium" | "hard"

export type Nutrition = {
  calories: number
  protein: number
  carbs: number
  fat: number
  allergens: string[]
}

export type Ingredient = {
  id: string
  name: string
  amount?: string
}

export type Recipe = {
  id: string
  title: string
  imageUrl?: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: import("./types").Difficulty | Difficulty // avoid runtime import conflicts
  tags: string[] // dietary badges
  cuisines: string[]
  nutrition: Nutrition
  ingredients: Ingredient[]
  instructions: string[]
  isSaved?: boolean
}
