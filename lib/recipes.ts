const STORAGE_KEY = "user_recipes_v1"

export function makeUserRecipeId() {
  return `user_${Date.now()}`
}

export function loadUserRecipes(): any[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") } catch { return [] }
}

export function saveUserRecipe(r: any) {
  const all = loadUserRecipes()
  const idx = all.findIndex((x) => x.id === r.id)
  if (idx >= 0) all[idx] = r
  else all.unshift(r)
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all.slice(0, 500))) } catch {}
}
