// lib/api.ts
"use client";

import { account } from "./appwrite";
import type { Recipe } from "./types";

// If NEXT_PUBLIC_API_BASE_URL is set, use it (direct to backend).
// Otherwise call relative /api/v1/* so Next proxies handle it.
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim();
// Ensure absolute URL w/ protocol; strip trailing slash
const API_BASE = RAW_BASE
  ? (/^https?:\/\//i.test(RAW_BASE) ? RAW_BASE : `https://${RAW_BASE}`).replace(/\/+$/, "")
  : "";
type FetchOpts = Omit<RequestInit, "headers"> & { headers?: HeadersInit };
let cachedJwt: { token: string; exp: number } | null = null;

type SearchInput =
  | string
  | {
      q?: string
      sort?: string
      filters?: {
        dietaryRestrictions?: string[]   // -> diets
        allergens?: string[]             // -> allergens_exclude
        cuisines?: string[]              // -> cuisines
        calories?: [number, number]      // -> cal_min, cal_max
        proteinMin?: number              // -> protein_min
        carbsMin?: number                // -> carbs_min
        fatMin?: number                  // -> fat_min
        fiberMin?: number                // -> fiber_min
        sugarMax?: number                // -> sugar_max
        sodiumMax?: number               // -> sodium_max
        maxTime?: number                 // -> time_max
      }
    }

const toInt = (v: any): number | null =>
  v === null || v === undefined || v === '' ? null : Number.parseInt(String(v), 10);

const toNum = (v: any): number | null =>
  v === null || v === undefined || v === '' ? null : Number.parseFloat(String(v));

type NormalizedRecipe = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  source_url: string | null;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  saturated_fat_g: number | null;
  sodium_mg: number | null;
  servings: number | null;
  difficulty: string | null;
  meal_type: string | null;
  cuisines: string[];
  diet_tags: string[];
  allergens: string[];
  flags: string[];
  ingredients: string[] | any[];
  instructions: string[] | any[];
  notes: string | null;
  market_country: string | null;
  status?: string;
  total_time_minutes: number | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  published_at?: string | null;
};

function makeIdemKey() {
  try { return crypto.randomUUID(); } catch { return `${Date.now()}-${Math.random().toString(36).slice(2)}`; }
}

function toRecipe(raw: any): Recipe {
  const r = raw?.recipe ?? raw
  return {
    id: r.id,
    title: r.title ?? "Untitled",
    imageUrl: r.image_url ?? r.imageUrl ?? null,
    // keep what your Recipe type expects; here are common ones:
    time_minutes: r.time_minutes ?? r.total_time_minutes ?? r.prep_time_minutes ?? 0,
    prepTime: r.prep_time_minutes ?? r.time_minutes ?? r.total_time_minutes ?? 0,
    cookTime: r.cook_time_minutes ?? undefined,
    servings: r.servings ?? undefined,
    difficulty: (String(r.difficulty ?? "easy").toLowerCase()),
    isSaved: Boolean(r.is_saved ?? r.isSaved),
    tags: r.diet_tags ?? r.tags ?? [],
  } as Recipe
}

async function getJwt(): Promise<string | null> {
  try {
    const now = Math.floor(Date.now() / 1000);
    if (cachedJwt && cachedJwt.exp - now > 60) return cachedJwt.token;
    const { jwt } = await account.createJWT();
    const exp = (() => {
      try {
        const payload = JSON.parse(atob(jwt.split(".")[1] ?? ""));
        return typeof payload.exp === "number" ? payload.exp : now + 15 * 60;
      } catch {
        return now + 15 * 60;
      }
    })();
    cachedJwt = { token: jwt, exp };
    return jwt;
  } catch {
    return null;
  }
}

async function authFetch(path: string, opts: FetchOpts = {}) {
  const DIRECT_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
  const url = DIRECT_BASE ? `${DIRECT_BASE}${path}` : path;
  const jwt = await getJwt();

  const method = (opts.method ?? 'GET').toUpperCase();
  // BEFORE you call fetch:
  const base = new Headers(opts?.headers as HeadersInit);

  // Only set content-type if caller didn't already set it AND a body exists
  if (opts?.body && !base.has("content-type")) {
    base.set("content-type", "application/json");
  }
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
    ...(jwt ? { "X-Appwrite-JWT": jwt } : {}),
    ...(method !== 'GET' ? { "Idempotency-Key": makeIdemKey() } : {}),
  };
  const res = await fetch(url, { ...opts, headers, cache: "no-store", credentials: "omit" });
  if (!res.ok) throw new Error((await res.text().catch(() => "")) || `Request failed ${res.status}`);
  return res;
}

/* ---- Public ---- */
function normalizeRecipeFromApi(d: any): NormalizedRecipe {
  return {
    id: d.id,
    title: d.title ?? '',
    description: d.description ?? null,
    // API sends camelCase; UI expects snake_case names below
    image_url: d.imageUrl ?? null,
    source_url: d.sourceUrl ?? null,

    calories: toInt(d.calories),
    protein_g: toNum(d.proteinG),
    carbs_g: toNum(d.carbsG),
    fat_g: toNum(d.fatG),
    fiber_g: toNum(d.fiberG),
    saturated_fat_g: toNum(d.saturatedFatG),
    sodium_mg: toInt(d.sodiumMg),

    servings: toInt(d.servings),
    difficulty: d.difficulty ?? null,
    meal_type: d.mealType ?? null,

    cuisines: Array.isArray(d.cuisines) ? d.cuisines : [],
    diet_tags: Array.isArray(d.dietTags) ? d.dietTags : [],
    allergens: Array.isArray(d.allergens) ? d.allergens : [],
    flags: Array.isArray(d.flags) ? d.flags : [],

    ingredients: Array.isArray(d.ingredients) ? d.ingredients : [],
    instructions: Array.isArray(d.instructions) ? d.instructions : [],
    notes: d.notes ?? null,

    market_country: (d.marketCountry ?? d.market_country ?? null),

    status: d.status,

    // time fields (convert any casing your API may return)
    total_time_minutes: toInt(d.totalTimeMinutes ?? d.time_minutes ?? d.timeMinutes),
    prep_time_minutes: toInt(d.prepTimeMinutes ?? d.prep_time_minutes),
    cook_time_minutes: toInt(d.cookTimeMinutes ?? d.cook_time_minutes),

    created_at: d.createdAt ?? null,
    updated_at: d.updatedAt ?? null,
    published_at: d.publishedAt ?? null,
  };
}

export async function apiGetFeed(): Promise<Recipe[]> {
  const res = await authFetch(`/api/v1/feed`);
  const data = await res.json().catch(() => []);
  const arr = Array.isArray(data) ? data : [];
  return arr.map((it: any) => it?.recipe ?? it);
}


export async function apiSearchRecipes(args: { q?: string; filters: any; sort?: string }): Promise<Recipe[]> {
  const { q, filters, sort } = args;
  const p = new URLSearchParams();

  if (q && q.trim()) p.set("q", q.trim());

  // arrays
  if (filters?.dietaryRestrictions?.length) p.set("diets", filters.dietaryRestrictions.join(","));
  if (filters?.cuisines?.length) p.set("cuisines", filters.cuisines.join(","));
  if (filters?.allergens?.length) p.set("allergens_exclude", filters.allergens.join(","));

  // calories range: only send if stricter than [0, 1200]
  const [calMin = 0, calMax = 1200] = Array.isArray(filters?.calories) ? filters.calories : [0, 1200];
  if (Number.isFinite(calMin) && calMin > 0) p.set("cal_min", String(calMin));
  if (Number.isFinite(calMax) && calMax < 1200) p.set("cal_max", String(calMax));

  // mins: send only if > 0
  if (Number.isFinite(filters?.proteinMin) && filters.proteinMin > 0) p.set("protein_min", String(filters.proteinMin));
  if (Number.isFinite(filters?.fiberMin) && filters.fiberMin > 0) p.set("fiber_min", String(filters.fiberMin));

  // sat fat: if you want a default “no limit”, either omit or guard like the others
  if (Number.isFinite(filters?.satfatMax)) p.set("satfat_max", String(filters.satfatMax));

  // ✅ the three you asked about — send only if stricter than baseline
  if (Number.isFinite(filters?.sugarMax)  && filters.sugarMax  < 100)  p.set("sugar_max",  String(filters.sugarMax));
  if (Number.isFinite(filters?.sodiumMax) && filters.sodiumMax < 4000) p.set("sodium_max", String(filters.sodiumMax));
  if (Number.isFinite(filters?.maxTime)   && filters.maxTime   < 120)  p.set("time_max",   String(filters.maxTime));

  // enums
  if (filters?.difficulty) p.set("difficulty", String(filters.difficulty));
  if (filters?.mealType)   p.set("meal_type",  String(filters.mealType));

  if (sort) p.set("sort", sort);

  const res = await authFetch(`/api/v1/recipes?${p.toString()}`);
  const data = await res.json().catch(() => []);
  return (Array.isArray(data) ? data : []).map(toRecipe);
}

// export async function apiGetRecipe(id: string) {
//   const res = await authFetch(`/api/v1/recipes/${id}`);
//   if (!res.ok) throw new Error(`Failed to load recipe ${id}`);
//   return res.json();
// }

export async function apiGetRecipe(id: string) {
  const res = await authFetch(`/api/v1/recipes/${id}`);
  const json = await res.json();
  return normalizeRecipeFromApi(json);
}

/* ---- Auth-required ---- */
export async function apiToggleSave(id: string): Promise<{ isSaved: boolean }> {
  return (await authFetch(`/api/v1/recipes/${id}/save`, { method: "POST" })).json();
}
export async function apiGetSaved() {
  const res = await authFetch(`/api/v1/me/saved`);
  const data = await res.json().catch(() => null);

  // Coerce to a Recipe[]
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.recipes)) return data.recipes;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && typeof data === "object") return Object.values(data); // key/value map fallback
  return [];
}


// ---------- Recipe Analyzer types ----------

/** Base nutrition shape used across the app (per serving). */
export interface Nutrition {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  /** optional saturated fat grams if you surface it */
  saturatedFat?: number;
}

/** Parsed ingredient line with optional match metadata. */
export interface AnalyzedIngredient {
  qty?: number;
  unit?: string;
  item: string;
  /** true if matched to an internal DB entry */
  matched?: boolean;
}

/** Attributes inferred from the parsed text/ingredients. */
export interface InferredAttributes {
  allergens?: string[];
  diets?: string[];
  cuisines?: string[];
  /** Taste tags list used by TasteProfileCard */
  taste?: string[];
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

  /** Structured ingredients (after parsing). */
  ingredients?: AnalyzedIngredient[];

  /** Simple list of instruction steps, if available. */
  steps?: string[];

  /** Inferred tags like allergens/diets/cuisines/taste. */
  inferred?: InferredAttributes;

  /** Per-serving nutrition; UI maps this to result.nutrition. */
  nutritionPerServing?: NutritionPerServing;

  /** Optional suggestions shown in SuggestionsCard. */
  suggestions?: string[];

  /** Optional freeform tags/categories. */
  tags?: string[];
}

// ---------- Supabase Connection ----------

// Add appwriteUserId to the payloads we send to the backend.
// Callers will pass the Appwrite account id (user.$id).
export async function syncProfile(
  profile: {
    displayName?: string | null;
    imageUrl?: string | null;
    phone?: string | null;
    country?: string | null;
  },
  appwriteUserId: string
) {
  return authFetch("/api/v1/sync/profile", {
    method: "POST",
    body: JSON.stringify({ appwriteUserId, profile }),
  });
}

export async function syncHealth(
  health: {
    dateOfBirth?: string | null;
    sex?: string | null;
    activityLevel?: string | null;
    goal?: string | null;
    diets?: string[] | null;
    allergens?: string[] | null;
    intolerances?: string[] | null;
    dislikedIngredients?: string[] | null;
    onboardingComplete?: boolean | null;
    height?: { value: number; unit: "cm" | "ft" } | string | null;
    weight?: { value: number; unit: "kg" | "lb" } | string | null;
  },
  appwriteUserId: string
) {
  return authFetch("/api/v1/sync/health", {
    method: "POST",
    body: JSON.stringify({ appwriteUserId, health }),
  });
}