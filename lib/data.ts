// lib/data.ts
import type { Recipe } from "./types";

/** Vocab lists used by filters & settings — export as mutable string[] */
export const ALL_CUISINES: string[] = [
  "American",
  "Italian",
  "Mexican",
  "Indian",
  "Chinese",
  "Japanese",
  "Thai",
  "Mediterranean",
  "Middle Eastern",
  "French",
  "Spanish",
  "Greek",
  "Korean",
  "Vietnamese",
  "Caribbean",
  "African",
  "Other",
];

export const ALL_DIETS: string[] = [
  "vegetarian",
  "vegan",
  "keto",
  "paleo",
  "gluten-free",
  "dairy-free",
  "low-carb",
  "low-fat",
  "high-protein",
  "pescatarian",
  "halal",
  "kosher",
  "none",
];

export const ALL_ALLERGENS: string[] = [
  "peanuts",
  "tree-nuts",
  "milk",
  "eggs",
  "soy",
  "wheat",
  "gluten",
  "fish",
  "shellfish",
  "sesame",
  "mustard",
  "sulfites",
  "lupin",
  "celery",
  "none",
];

export const ALL_MAJOR_CONDITIONS: string[] = [
  "Diabetes (Type 1)",
  "Diabetes (Type 2)",
  "Hypertension",
  "High Cholesterol",
  "Celiac Disease",
  "Irritable Bowel Syndrome",
  "GERD/Acid Reflux",
  "PCOS",
  "Hypothyroidism",
  "Hyperthyroidism",
  "Kidney Disease",
  "Liver Disease",
  "Heart Disease",
  "Gout",
  "Anemia",
  "Food Allergy (Other)",
  "Pregnancy",
];

/** Loose filter shape to keep callers happy until backend is wired */
export type SearchFilters = {
  q?: string;
  dietaryRestrictions?: string[];
  allergens?: string[];
  cuisines?: string[];
  calories?: [number, number];
  proteinMin?: number;
  carbsMin?: number;
  fatMin?: number;
  fiberMin?: number;
  sugarMax?: number;
  sodiumMax?: number;
  maxTime?: number;
};

/* ----------------------- Backend placeholder shims ----------------------- */
/* These keep the mock API routes compiling while you connect a real backend. */

/** Search placeholder – signature matches current mock route usage */
export async function searchRecipesData(
  q: string = "",
  filters?: Partial<SearchFilters>
): Promise<Recipe[]> {
  void q;
  void filters;
  return [];
}

/** Feed placeholder: full list (empty until backend is added) */
export async function listRecipes(): Promise<Recipe[]> {
  return [];
}

/** Find recipe by id placeholder */
export async function findRecipe(id: string): Promise<Recipe | null> {
  void id;
  return null;
}

/** Return saved ids for current user (empty until backend is added) */
export async function getSavedIds(): Promise<string[]> {
  return [];
}

/**
 * Toggle save placeholder.
 * Second argument optional so calls like toggleSave(id) still compile.
 */
export async function toggleSave(
  id: string,
  saved?: boolean
): Promise<{ ok: true }> {
  void id;
  void saved;
  return { ok: true };
}

export type { Recipe };
