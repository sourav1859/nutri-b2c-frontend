import type { Recipe } from "./types"

export async function apiGetFeed(): Promise<Recipe[]> {
  const res = await fetch("/api/v1/feed", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to load feed")
  return res.json()
}

export async function apiSearchRecipes(params: { q?: string; filters?: unknown }): Promise<Recipe[]> {
  const url = new URL("/api/v1/recipes", window.location.origin)
  if (params.q) url.searchParams.set("q", params.q)
  if (params.filters) url.searchParams.set("filters", JSON.stringify(params.filters))
  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to search recipes")
  return res.json()
}

export async function apiGetRecipe(id: string) {
  const res = await fetch(`/api/v1/recipes/${id}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Not found")
  return res.json()
}

export async function apiToggleSave(id: string): Promise<{ isSaved: boolean }> {
  const res = await fetch(`/api/v1/recipes/${id}/save`, { method: "POST" })
  if (!res.ok) throw new Error("Failed to save")
  return res.json()
}

export async function apiGetSaved(): Promise<Recipe[]> {
  const res = await fetch(`/api/v1/me/saved`, { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to load saved")
  return res.json()
}
