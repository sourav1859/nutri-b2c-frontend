"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export type IngredientRow = { id: string; qty: number | ""; unit: string; item: string; note?: string }

export default function IngredientRowCmp({
  row, onChange, onRemove,
}: {
  row: IngredientRow
  onChange: (next: IngredientRow) => void
  onRemove: () => void
}) {
  return (
    <div className="grid grid-cols-12 gap-2">
      <Input
        className="col-span-2"
        type="number"
        min={0}
        step="0.1"
        value={row.qty}
        onChange={(e) => onChange({ ...row, qty: e.target.value === "" ? "" : Number(e.target.value) })}
        placeholder="Qty"
      />
      <select
        className="col-span-2 rounded-md border bg-background px-3 py-2 text-sm"
        value={row.unit}
        onChange={(e) => onChange({ ...row, unit: e.target.value })}
      >
        {["", "g", "kg", "ml", "l", "tsp", "tbsp", "cup", "pcs"].map((u) => (
          <option key={u} value={u}>{u || "unit"}</option>
        ))}
      </select>
      <Input
        className="col-span-7"
        value={row.item}
        onChange={(e) => onChange({ ...row, item: e.target.value })}
        placeholder="Ingredient"
      />
      <Button type="button" variant="ghost" className="col-span-1" onClick={onRemove}>
        Remove
      </Button>
    </div>
  )
}
