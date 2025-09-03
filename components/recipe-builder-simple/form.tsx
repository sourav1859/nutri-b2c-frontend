"use client"
import * as React from "react"
import IngredientRowCmp, { type IngredientRow } from "./row"
import DietAllergenPicker from "./DietAllergenPicker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function RecipeCreateForm({ onSubmit }: { onSubmit: (draft: any) => void }) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [imageUrl, setImageUrl] = React.useState("")
  const [servings, setServings] = React.useState(2)
  const [prepMin, setPrepMin] = React.useState(10)
  const [cookMin, setCookMin] = React.useState(10)
  const [cuisine, setCuisine] = React.useState("")
  const [course, setCourse] = React.useState("")
  const [difficulty, setDifficulty] = React.useState("easy")
  const [diets, setDiets] = React.useState<string[]>([])
  const [allergens, setAllergens] = React.useState<string[]>([])
  const [ingredients, setIngredients] = React.useState<IngredientRow[]>([
    { id: crypto.randomUUID(), qty: "", unit: "", item: "" },
  ])
  const [steps, setSteps] = React.useState<string[]>([""])

  function addIngredient() {
    setIngredients((arr) => [...arr, { id: crypto.randomUUID(), qty: "", unit: "", item: "" }])
  }
  function updateRow(id: string, next: IngredientRow) {
    setIngredients((arr) => arr.map((r) => (r.id === id ? next : r)))
  }
  function removeRow(id: string) {
    setIngredients((arr) => arr.filter((r) => r.id !== id))
  }

  const addStep = () => setSteps((a) => [...a, ""])
  const updateStep = (i: number, v: string) => setSteps((a) => a.map((s, idx) => (idx === i ? v : s)))
  const removeStep = (i: number) => setSteps((a) => a.filter((_, idx) => idx !== i))

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          id: `draft_${Date.now()}`,
          title,
          description,
          imageUrl,
          servings,
          time: { prepMin, cookMin },
          cuisine,
          course,
          difficulty,
          tags: { diets, allergens },
          ingredients: ingredients.map(({ qty, unit, item }) => ({ qty: qty === "" ? 0 : qty, unit, item })),
          steps: steps.filter((s) => s.trim() !== ""),
        })
      }}
    >
      <div className="rounded-lg border p-4 space-y-4">
        <h2 className="font-semibold">Basics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          <div className="grid grid-cols-3 gap-2">
            <Input placeholder="Cuisine" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
            <Input placeholder="Course (e.g., Main)" value={course} onChange={(e) => setCourse(e.target.value)} />
            <select className="rounded-md border bg-background px-3 py-2 text-sm" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {["easy","medium","hard"].map((d)=> <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h2 className="font-semibold">Servings & Time</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input type="number" min={1} value={servings} onChange={(e)=>setServings(Number(e.target.value)||1)} placeholder="Servings" />
          <Input type="number" min={0} value={prepMin} onChange={(e)=>setPrepMin(Number(e.target.value)||0)} placeholder="Prep (min)" />
          <Input type="number" min={0} value={cookMin} onChange={(e)=>setCookMin(Number(e.target.value)||0)} placeholder="Cook (min)" />
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <h2 className="font-semibold">Diet & Allergens</h2>
        <DietAllergenPicker
          diets={diets}
          allergens={allergens}
          onChange={({ diets, allergens }) => { setDiets(diets); setAllergens(allergens) }}
        />
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Ingredients</h2>
          <Button type="button" size="sm" onClick={addIngredient}>Add ingredient</Button>
        </div>
        <div className="space-y-2">
          {ingredients.map((row) => (
            <IngredientRowCmp
              key={row.id}
              row={row}
              onChange={(next) => updateRow(row.id, next)}
              onRemove={() => removeRow(row.id)}
            />
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Steps</h2>
          <Button type="button" size="sm" onClick={addStep}>Add step</Button>
        </div>
        <div className="space-y-2">
          {steps.map((s, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <Textarea className="col-span-11" placeholder={`Step ${i+1}`} value={s} onChange={(e)=>updateStep(i, e.target.value)} />
              <Button type="button" variant="ghost" className="col-span-1" onClick={()=>removeStep(i)}>Remove</Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={()=>{ setTitle(""); setDescription(""); setImageUrl(""); setIngredients([{id: crypto.randomUUID(), qty:"", unit:"", item:""}]); setSteps([""]) }}>Cancel</Button>
        <Button type="submit">Save & Next</Button>
      </div>
    </form>
  )
}
