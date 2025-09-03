import db from "@/app/_mock/ingredients-db.json"
import { convertToGrams } from "./units"

type Row = { qty: number | ""; unit: string; item: string }

function matchIngredient(name: string) {
  const q = name.toLowerCase().trim()
  const exact = db.find((r) => r.name === q)
  if (exact) return exact as any
  return db.find((r: any) => r.name.includes(q) || r.aliases?.some((a: string) => q.includes(a))) as any
}

/** very rough estimate using per-100g nutrition × weight */
export function estimateNutrition(rows: Row[], servings: number) {
  const totals = {
    calories: 0, protein: 0, carbs: 0, fat: 0,
    sodium: 0, sugars: 0, fiber: 0, potassium: 0, iron: 0, calcium: 0, vitaminD: 0,
  }

  for (const r of rows) {
    if (r.qty === "" || !r.item) continue
    const rec = matchIngredient(r.item) || {}
    const grams = convertToGrams(Number(r.qty), r.unit || "g", r.item)
    const mul = grams / 100 // db values are per 100g
    totals.calories += (rec.calories || 0) * mul
    totals.protein  += (rec.protein  || 0) * mul
    totals.carbs    += (rec.carbs    || 0) * mul
    totals.fat      += (rec.fat      || 0) * mul
    totals.sodium   += (rec.sodium   || 0) * mul
    totals.sugars   += (rec.sugars   || 0) * mul
    totals.fiber    += (rec.fiber    || 0) * mul
    totals.potassium+= (rec.potassium|| 0) * mul
    totals.iron     += (rec.iron     || 0) * mul
    totals.calcium  += (rec.calcium  || 0) * mul
    totals.vitaminD += (rec.vitaminD || 0) * mul
  }

  const per = Math.max(1, servings || 1)
  const perServing = Object.fromEntries(
    Object.entries(totals).map(([k, v]) => [k, Math.round((v / per) * 10) / 10])
  )

  return perServing
}
