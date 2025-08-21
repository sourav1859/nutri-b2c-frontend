import type { Recipe } from "./types"

const savedIds = new Set<string>()

export function getSavedIds() {
  return savedIds
}

export function toggleSave(id: string) {
  if (savedIds.has(id)) {
    savedIds.delete(id)
    return false
  } else {
    savedIds.add(id)
    return true
  }
}

export const ALL_DIETS = ["Vegan", "Vegetarian", "Keto", "Paleo", "Gluten-Free", "Dairy-Free"]
export const ALL_ALLERGENS = ["Peanuts", "Tree Nuts", "Dairy", "Eggs", "Gluten", "Shellfish", "Soy"]
export const ALL_CUISINES = ["Italian", "Mexican", "Indian", "Thai", "American", "Mediterranean", "Japanese"]

export const recipes: Recipe[] = [
  {
    id: "r1",
    title: "Vegan Buddha Bowl with Roasted Chickpeas",
    imageUrl: "/vegan-buddha-bowl.png",
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    difficulty: "easy",
    tags: ["Vegan", "Gluten-Free"],
    cuisines: ["Mediterranean"],
    nutrition: { calories: 520, protein: 22, carbs: 65, fat: 18, allergens: [] },
    ingredients: [
      { id: "i1", name: "Chickpeas", amount: "1 can" },
      { id: "i2", name: "Quinoa", amount: "1 cup cooked" },
      { id: "i3", name: "Avocado", amount: "1/2 sliced" },
    ],
    instructions: [
      "Rinse and roast chickpeas with spices at 400°F for 20 minutes.",
      "Cook quinoa per package instructions.",
      "Assemble bowl with veggies, quinoa, and chickpeas. Drizzle tahini.",
    ],
  },
  {
    id: "r2",
    title: "Keto Garlic Butter Salmon with Asparagus",
    imageUrl: "/garlic-butter-salmon-asparagus.png",
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    difficulty: "easy",
    tags: ["Keto"],
    cuisines: ["American"],
    nutrition: { calories: 480, protein: 35, carbs: 6, fat: 34, allergens: ["Fish"] },
    ingredients: [
      { id: "i1", name: "Salmon fillets", amount: "2" },
      { id: "i2", name: "Asparagus", amount: "1 bunch" },
      { id: "i3", name: "Butter", amount: "2 tbsp" },
    ],
    instructions: [
      "Season salmon and sear in butter.",
      "Add asparagus to the pan and sauté until tender-crisp.",
      "Finish with lemon juice and parsley.",
    ],
  },
  {
    id: "r3",
    title: "Gluten-Free Chicken Alfredo with Zoodles",
    imageUrl: "/chicken-alfredo-zoodles.png",
    prepTime: 20,
    cookTime: 20,
    servings: 3,
    difficulty: "medium",
    tags: ["Gluten-Free"],
    cuisines: ["Italian"],
    nutrition: { calories: 610, protein: 38, carbs: 18, fat: 42, allergens: ["Dairy"] },
    ingredients: [
      { id: "i1", name: "Chicken breast", amount: "2" },
      { id: "i2", name: "Zucchini", amount: "3 spiralized" },
      { id: "i3", name: "Parmesan", amount: "1/2 cup" },
    ],
    instructions: [
      "Cook chicken until browned.",
      "Prepare Alfredo sauce with butter, cream, and parmesan.",
      "Toss with zoodles and serve.",
    ],
  },
  {
    id: "r4",
    title: "Mediterranean Quinoa Salad",
    imageUrl: "/mediterranean-quinoa-salad.png",
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: "easy",
    tags: ["Vegetarian"],
    cuisines: ["Mediterranean"],
    nutrition: { calories: 450, protein: 15, carbs: 60, fat: 14, allergens: ["Dairy"] },
    ingredients: [
      { id: "i1", name: "Quinoa", amount: "1 cup dry" },
      { id: "i2", name: "Cucumber", amount: "1 diced" },
      { id: "i3", name: "Feta", amount: "1/2 cup" },
    ],
    instructions: [
      "Cook quinoa and cool.",
      "Combine with chopped veggies and feta.",
      "Dress with olive oil and lemon.",
    ],
  },
  {
    id: "r5",
    title: "Spicy Thai Basil Stir-Fry (Pad Kra Pao)",
    imageUrl: "/thai-basil-stir-fry.png",
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: "easy",
    tags: [],
    cuisines: ["Thai"],
    nutrition: { calories: 560, protein: 32, carbs: 55, fat: 23, allergens: ["Soy"] },
    ingredients: [
      { id: "i1", name: "Ground chicken", amount: "300g" },
      { id: "i2", name: "Thai basil", amount: "1 cup" },
      { id: "i3", name: "Chilies & garlic", amount: "to taste" },
    ],
    instructions: [
      "Pound chilies and garlic.",
      "Stir-fry meat, add sauce, finish with basil.",
      "Serve with rice and fried egg.",
    ],
  },
  {
    id: "r6",
    title: "Paleo Beef Lettuce Wraps",
    imageUrl: "/placeholder-zhhbx.png",
    prepTime: 15,
    cookTime: 15,
    servings: 3,
    difficulty: "easy",
    tags: ["Paleo", "Dairy-Free"],
    cuisines: ["American"],
    nutrition: { calories: 500, protein: 28, carbs: 20, fat: 32, allergens: [] },
    ingredients: [
      { id: "i1", name: "Ground beef", amount: "400g" },
      { id: "i2", name: "Lettuce leaves", amount: "12" },
      { id: "i3", name: "Bell pepper", amount: "1 diced" },
    ],
    instructions: ["Brown beef with spices.", "Add veggies and cook until tender.", "Serve in lettuce leaves."],
  },
  {
    id: "r7",
    title: "Vegetarian Breakfast Burrito",
    imageUrl: "/vegetarian-breakfast-burrito.png",
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: "easy",
    tags: ["Vegetarian"],
    cuisines: ["Mexican"],
    nutrition: { calories: 650, protein: 24, carbs: 70, fat: 26, allergens: ["Eggs", "Dairy", "Gluten"] },
    ingredients: [
      { id: "i1", name: "Eggs", amount: "4" },
      { id: "i2", name: "Tortillas", amount: "2 large" },
      { id: "i3", name: "Beans & salsa", amount: "to taste" },
    ],
    instructions: ["Scramble eggs and warm tortillas.", "Fill with beans, eggs, and salsa.", "Roll tightly and serve."],
  },
  {
    id: "r8",
    title: "Sushi Bowl with Salmon and Avocado",
    imageUrl: "/sushi-bowl-salmon-avocado.png",
    prepTime: 20,
    cookTime: 10,
    servings: 2,
    difficulty: "medium",
    tags: ["Dairy-Free"],
    cuisines: ["Japanese"],
    nutrition: { calories: 700, protein: 38, carbs: 72, fat: 26, allergens: ["Fish", "Soy"] },
    ingredients: [
      { id: "i1", name: "Sushi rice", amount: "1 cup cooked" },
      { id: "i2", name: "Salmon", amount: "200g" },
      { id: "i3", name: "Avocado & cucumber", amount: "as desired" },
    ],
    instructions: [
      "Prepare sushi rice.",
      "Slice toppings and arrange over rice.",
      "Add soy sauce and wasabi to taste.",
    ],
  },
]

export function listRecipes() {
  return recipes.map((r) => ({ ...r, isSaved: getSavedIds().has(r.id) }))
}

export function findRecipe(id: string) {
  const r = recipes.find((x) => x.id === id)
  if (!r) return null
  return { ...r, isSaved: getSavedIds().has(r.id) }
}

export function searchRecipesData(
  q: string,
  filters?: Partial<{
    dietaryRestrictions: string[]
    allergens: string[]
    calories: [number, number]
    proteinMin: number
    carbsMin: number
    fatMin: number
    maxTime: number
    cuisines: string[]
  }>,
) {
  const query = q?.trim().toLowerCase()
  const items = listRecipes().filter((r) => {
    let ok = true
    if (query) {
      ok = r.title.toLowerCase().includes(query) || r.cuisines.join(" ").toLowerCase().includes(query)
    }
    if (ok && filters?.dietaryRestrictions?.length) {
      ok = filters.dietaryRestrictions.every((d) => r.tags.includes(d))
    }
    if (ok && filters?.allergens?.length) {
      ok = !filters.allergens.some((a) => r.nutrition.allergens.includes(a))
    }
    if (ok && filters?.calories) {
      const [min, max] = filters.calories
      ok = r.nutrition.calories >= min && r.nutrition.calories <= max
    }
    if (ok && typeof filters?.proteinMin === "number") {
      ok = r.nutrition.protein >= (filters.proteinMin ?? 0)
    }
    if (ok && typeof filters?.carbsMin === "number") {
      ok = r.nutrition.carbs >= (filters.carbsMin ?? 0)
    }
    if (ok && typeof filters?.fatMin === "number") {
      ok = r.nutrition.fat >= (filters.fatMin ?? 0)
    }
    if (ok && typeof filters?.maxTime === "number") {
      ok = r.prepTime + r.cookTime <= (filters.maxTime ?? 999)
    }
    if (ok && filters?.cuisines?.length) {
      ok = filters.cuisines.some((c) => r.cuisines.includes(c))
    }
    return ok
  })
  return items
}
