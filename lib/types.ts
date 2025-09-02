// lib/types.ts
// Frontend-shared types. Keep fields optional for backend compatibility.

export type Difficulty = "easy" | "medium" | "hard";

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
    exploration?: number;       // 0..1 (optional)
    shortTermFocus?: number;    // 0..1 (optional)
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
