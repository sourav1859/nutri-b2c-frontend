import type { RecommendationSettings } from "./types"
import { ALL_CUISINES, ALL_DIETS, ALL_ALLERGENS } from "./data"

const STORAGE_KEY = "nutri_settings_v1"

export const DEFAULT_SETTINGS: RecommendationSettings = {
  units: "US",
  cuisines: ["Italian", "American", "Mediterranean"],
  dislikes: [],
  timeRangeMinMax: [0, 120],
  diets: [],
  allergens: [],
  calorieTarget: 2000,
  macroWeights: { protein: 30, carbs: 40, fat: 30 },
  caps: { sodiumMax: 2300, addedSugarMax: 50 },
  behavior: {
    exploreExploit: 50,
    diversity: 50,
    healthEmphasis: 50,
    personalization: 50,
    defaultSort: "time",
    showScoreBadge: false,
  },
  personalization: { useHistory: true },
  notifications: {
    tryNew: "weekly",
    grocery: "weekly",
    mealPrep: "none",
  },
  advanced: {
    algorithm: "hybrid",
    weights: { health: 25, time: 20, popularity: 15, personal: 20, diversity: 20 },
  },
  version: 1,
}

export function loadSettings(): RecommendationSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_SETTINGS

    const parsed = JSON.parse(stored)
    return { ...DEFAULT_SETTINGS, ...parsed }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: RecommendationSettings): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error("Failed to save settings:", error)
  }
}

export function resetSettings(): RecommendationSettings {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
  return DEFAULT_SETTINGS
}

export function downloadSettingsJson(settings: RecommendationSettings): void {
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "nutrifind-settings.json"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export { ALL_CUISINES, ALL_DIETS, ALL_ALLERGENS }
