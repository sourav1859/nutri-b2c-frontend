"use client"

import { useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ALL_ALLERGENS, ALL_CUISINES, ALL_DIETS } from "@/lib/data"
import { CuisineMultiSelect } from "./cuisine-multi-select"

const schema = z.object({
  dietaryRestrictions: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  calories: z.tuple([z.number().min(0), z.number().max(2000)]).default([0, 1200]),
  proteinMin: z.number().min(0).max(200).default(0),
  carbsMin: z.number().min(0).max(300).default(0),
  fatMin: z.number().min(0).max(200).default(0),
  maxTime: z.number().min(0).max(240).default(120),
  cuisines: z.array(z.string()).default([]),
  q: z.string().optional().default(""),
})

export type FiltersFormValues = z.infer<typeof schema>

export function FilterPanel({
  open,
  onOpenChange,
  initialValues,
  onApply,
  onReset,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialValues: FiltersFormValues
  onApply: (values: FiltersFormValues) => void
  onReset: () => void
}) {
  const form = useForm<FiltersFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: "onChange",
  })

  useEffect(() => {
    form.reset(initialValues)
  }, [open])

  function handleApply() {
    const values = form.getValues()
    onApply(values)
    onOpenChange(false)
  }

  function handleReset() {
    form.reset({
      dietaryRestrictions: [],
      allergens: [],
      calories: [0, 1200],
      proteinMin: 0,
      carbsMin: 0,
      fatMin: 0,
      maxTime: 120,
      cuisines: [],
      q: "",
    })
    onReset()
  }

  const watchCalories = form.watch("calories")
  const watchProtein = form.watch("proteinMin")
  const watchCarbs = form.watch("carbsMin")
  const watchFat = form.watch("fatMin")
  const watchMaxTime = form.watch("maxTime")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine recipes by diet, nutrition, time, and cuisine.</SheetDescription>
        </SheetHeader>

        <div className="mt-4 grid gap-6">
          <section>
            <h3 className="font-semibold mb-2">Dietary Restrictions</h3>
            <div className="grid grid-cols-2 gap-2">
              {ALL_DIETS.map((diet) => {
                const checked = form.watch("dietaryRestrictions").includes(diet)
                return (
                  <label
                    key={diet}
                    className="flex items-center gap-2 rounded border p-2 [&:has(:checked)]:bg-muted cursor-pointer"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => {
                        const current = form.getValues("dietaryRestrictions")
                        form.setValue("dietaryRestrictions", v ? [...current, diet] : current.filter((d) => d !== diet))
                      }}
                    />
                    <span>{diet}</span>
                  </label>
                )
              })}
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Allergens to avoid</h3>
            <div className="grid grid-cols-2 gap-2">
              {ALL_ALLERGENS.map((a) => {
                const checked = form.watch("allergens").includes(a)
                return (
                  <label
                    key={a}
                    className="flex items-center gap-2 rounded border p-2 [&:has(:checked)]:bg-muted cursor-pointer"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => {
                        const current = form.getValues("allergens")
                        form.setValue("allergens", v ? [...current, a] : current.filter((x) => x !== a))
                      }}
                    />
                    <span>{a}</span>
                  </label>
                )
              })}
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold mb-2">Nutrition</h3>
            <div className="space-y-3">
              <div>
                <Label>
                  Calories: {watchCalories[0]} - {watchCalories[1]} kcal
                </Label>
                <Slider
                  min={0}
                  max={2000}
                  step={50}
                  value={watchCalories}
                  onValueChange={(v) => form.setValue("calories", [v[0], v[1]] as [number, number])}
                />
              </div>
              <div>
                <Label>Protein min: {watchProtein} g</Label>
                <Slider
                  min={0}
                  max={200}
                  step={5}
                  value={[watchProtein]}
                  onValueChange={(v) => form.setValue("proteinMin", v[0])}
                />
              </div>
              <div>
                <Label>Carbs min: {watchCarbs} g</Label>
                <Slider
                  min={0}
                  max={300}
                  step={5}
                  value={[watchCarbs]}
                  onValueChange={(v) => form.setValue("carbsMin", v[0])}
                />
              </div>
              <div>
                <Label>Fat min: {watchFat} g</Label>
                <Slider
                  min={0}
                  max={200}
                  step={5}
                  value={[watchFat]}
                  onValueChange={(v) => form.setValue("fatMin", v[0])}
                />
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="font-semibold mb-2">Cooking Time</h3>
            <Label>Max total time: {watchMaxTime} minutes</Label>
            <Slider
              min={0}
              max={240}
              step={5}
              value={[watchMaxTime]}
              onValueChange={(v) => form.setValue("maxTime", v[0])}
            />
          </section>

          <section>
            <h3 className="font-semibold mb-2">Cuisine Type</h3>
            <CuisineMultiSelect
              options={ALL_CUISINES}
              value={form.watch("cuisines")}
              onChange={(next) => form.setValue("cuisines", next)}
            />
          </section>

          <div className="flex items-center gap-2 pt-2">
            <Button className="flex-1" onClick={handleApply}>
              Apply Filters
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
