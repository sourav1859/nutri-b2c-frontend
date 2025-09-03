// lib/api.ts
"use client";

import { account } from "./appwrite";
import type { Recipe } from "./types";

// If NEXT_PUBLIC_API_BASE_URL is set, use it (direct to backend).
// Otherwise call relative /api/v1/* so Next proxies handle it.
const DIRECT_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/+$/, "");
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
  const url = DIRECT_BASE ? `${DIRECT_BASE}${path}` : path; // '/api/v1/*' when proxied
  const jwt = await getJwt();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
    ...(jwt ? { "X-Appwrite-JWT": jwt } : {}),
  };
  const res = await fetch(url, { ...opts, headers, cache: "no-store", credentials: "omit" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed ${res.status}`);
  }
  return res;
}

/* ---- Public ---- */
export async function apiGetFeed(): Promise<Recipe[]> {
  return (await authFetch(`/api/v1/feed`)).json();
}

export async function apiSearchRecipes(input?: SearchInput): Promise<Recipe[]> {
  const qs = new URLSearchParams()

  if (typeof input === "string") {
    if (input) qs.set("q", input)
  } else if (input && typeof input === "object") {
    const { q, sort, filters } = input
    if (q) qs.set("q", q)
    if (sort) qs.set("sort", sort)

    if (filters) {
      const f = filters
      if (f.dietaryRestrictions?.length) qs.set("diets", f.dietaryRestrictions.join(","))
      if (f.allergens?.length) qs.set("allergens_exclude", f.allergens.join(","))   // << fixed
      if (f.cuisines?.length) qs.set("cuisines", f.cuisines.join(","))
      if (Array.isArray(f.calories) && f.calories.length === 2) {
        qs.set("cal_min", String(f.calories[0]))                                    // << fixed
        qs.set("cal_max", String(f.calories[1]))                                    // << fixed
      }
      if (f.proteinMin != null) qs.set("protein_min", String(f.proteinMin))
      if (f.carbsMin  != null) qs.set("carbs_min",   String(f.carbsMin))
      if (f.fatMin    != null) qs.set("fat_min",     String(f.fatMin))
      if (f.fiberMin  != null) qs.set("fiber_min",   String(f.fiberMin))
      if (f.sugarMax  != null) qs.set("sugar_max",   String(f.sugarMax))
      if (f.sodiumMax != null) qs.set("sodium_max",  String(f.sodiumMax))
      if (f.maxTime   != null) qs.set("time_max",    String(f.maxTime))
    }
  }

  const query = qs.toString()
  const path = `/api/v1/recipes${query ? `?${query}` : ""}`
  const res = await authFetch(path)
  return res.json()
}

export async function apiGetRecipe(id: string): Promise<Recipe> {
  return (await authFetch(`/api/v1/recipes/${id}`)).json();
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
