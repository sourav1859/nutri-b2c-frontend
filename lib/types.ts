// lib/types.ts
// Frontend-shared types. Keep fields optional for backend compatibility.

export type Difficulty = "easy" | "medium" | "hard";

export type SortOption = "time" | "relevance" | "popular";

/** Nutrition label values (per serving). */
export interface Nutrition {
  calories?: number;
  fat?: number;
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  carbs?: number;
  fiber?: number;
  sugars?: number;
  addedSugars?: number;
  protein?: number;
  vitaminD?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  totalSugars?: number;   // sometimes provided as sugar/totalSugars
  allergens?: string[];   // optional list like ["nuts","soy"]
}

/** Core recipe model (UI-friendly, backend-agnostic). */
export interface Recipe {
  id: string;

  // Names (varies by backend)
  name?: string;
  title?: string;

  description?: string;

  // Images
  images?: string[];      // canonical list
  imageUrl?: string;      // convenience alias (usually images?.[0])

  // Timing
  time_minutes?: number;  // canonical total time (if provided)
  prepTime?: number;      // convenience field (mins)
  cookTime?: number;      // convenience field (mins)

  // Servings & difficulty
  servings?: number;
  difficulty?: Difficulty;

  // Tags / taxonomies
  cuisines?: string[];
  diet_tags?: string[];
  flag_tags?: string[];
  allergens?: string[];
  tags?: string[];        // convenience union

  // Nutrition (per serving, optional)
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  nutrition?: Nutrition;

  rating?: number;
  reviewCount?: number;
  imageAlt?: string;
  instructions?: string[];  // <-- add
  steps?: string[];         // <-- optional alias for compatibility

  // Personalization & metadata
  isSaved?: boolean;
  reasons?: string[];
  score?: number;         // ranking score (0..1)
  updated_at?: string;    // ISO date
}

/** Minimal product model used by the scanner UI. */
export interface Product {
  id?: string;
  title: string;
  brand?: string;
  imageUrl?: string;
  tags?: string[];
  allergens?: string[];
  nutrition?: Nutrition;
}

/** Base nutrition shape used across the app (per serving). */
export interface Nutrition {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  saturatedFat?: number; // optional
}

/** Parsed ingredient line with optional match metadata. */
export interface AnalyzedIngredient {
  qty?: number;
  unit?: string;
  item: string;
  matched?: boolean; // true if matched to an internal DB entry
}

/** Attributes inferred from parsed text/ingredients. */
export interface InferredAttributes {
  allergens?: string[];
  diets?: string[];
  cuisines?: string[];
  taste?: string[]; // used by TasteProfileCard
}

/** Per-serving nutrition used by the analyzer; extends the base Nutrition. */
export interface NutritionPerServing extends Nutrition {
  potassium?: number;
  iron?: number;
  calcium?: number;
  vitaminD?: number;
}

/** End-to-end result returned by analyzeRecipe(...). */
export interface AnalyzeResult {
  title?: string;
  summary?: string;
  servings?: number;

  // Structured ingredients (after parsing)
  ingredients?: AnalyzedIngredient[];

  // Simple list of instruction steps
  steps?: string[];

  // Inferred tags like allergens/diets/cuisines/taste
  inferred?: InferredAttributes;

  // Per-serving nutrition; UI maps this to result.nutrition
  nutritionPerServing?: NutritionPerServing;

  // Optional suggestions shown in SuggestionsCard
  suggestions?: string[];

  // Optional freeform tags/categories
  tags?: string[];
}

/** App-wide recommendation settings used across settings + ranking. */
export interface RecommendationSettings {
  units: "US" | "Metric";
  cuisines: string[];
  dislikes: string[];

  // global constraints / ranges
  timeRangeMinMax: [number, number];
  diets: string[];
  allergens: string[];

  calorieTarget: number;
  macroWeights: { protein: number; carbs: number; fat: number };
  caps: { sodiumMax: number; addedSugarMax: number };

  // UX behavior flags
  behavior: {
    showScoreBadge?: boolean;
    exploration?: number;
    shortTermFocus?: number;
    defaultSort?: SortOption;   // <-- add this line
  };

  // personalization knobs
  personalization?: {
    diversityBias?: number;           // 0..1
    avoidRecentlyViewedHours?: number;
  };

  // advanced ranking + filters
  advanced?: {
    weights: {
      health: number;
      time: number;
      popularity: number;
      personal: number;
      diversity: number;
    };
    filters?: {
      calories?: [number, number];
      proteinMin?: number;
      carbsMin?: number;
      fatMin?: number;
      fiberMin?: number;
      sugarMax?: number;
      sodiumMax?: number;
      maxTime?: number;
    };
  };

  // optional notifications section (UI references it)
  notifications?: {
    enableReminders?: boolean;
  };
}
