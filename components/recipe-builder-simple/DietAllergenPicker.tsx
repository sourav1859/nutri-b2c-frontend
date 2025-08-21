"use client"
import { DIETS, ALLERGENS } from "@/lib/taxonomy"

type Props = {
  diets: string[]
  allergens: string[]
  onChange: (next: { diets: string[]; allergens: string[] }) => void
}

export default function DietAllergenPicker({ diets, allergens, onChange }: Props) {
  const chip =
    "px-3 py-1.5 rounded-full border text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"

  const toggle = (arr: string[], k: string) => (arr.includes(k) ? arr.filter((x) => x !== k) : [...arr, k])
  const setDiet = (k: string) => onChange({ diets: toggle(diets, k), allergens })
  const setAllergen = (k: string) => onChange({ diets, allergens: toggle(allergens, k) })

  // show simple conflicts as helper text
  const conflict =
    diets.includes("gluten_free") && allergens.includes("wheat")
      ? "Gluten-Free conflicts with Wheat."
      : diets.includes("vegan") && ["milk", "egg", "fish", "crustacean_shellfish"].some((a) => allergens.includes(a))
      ? "Vegan conflicts with one or more animal-based allergens."
      : ""

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-sm font-medium">Diets</div>
        <div className="flex flex-wrap gap-2">
          {DIETS.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => setDiet(d.key)}
              className={`${chip} ${diets.includes(d.key) ? "bg-secondary" : ""}`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium">Allergens (contains)</div>
        <div className="flex flex-wrap gap-2">
          {ALLERGENS.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => setAllergen(a.key)}
              className={`${chip} ${allergens.includes(a.key) ? "bg-amber-500/20 border-amber-500" : ""}`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {conflict && <p className="text-sm text-amber-600">{conflict}</p>}
    </div>
  )
}
