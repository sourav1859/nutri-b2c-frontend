// components/health-onboarding-wizard.tsx
"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ALL_MAJOR_CONDITIONS } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

type Step = 1 | 2 | 3 | 4
const toggleArray = (arr: string[], val: string) =>
  arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
const activityOptions = [
  { value: "sedentary", label: "Sedentary" },
  { value: "lightly_active", label: "Lightly active" },
  { value: "moderately_active", label: "Moderately active" },
  { value: "very_active", label: "Very active" },
  { value: "extremely_active", label: "Extremely active" },
] as const

const goalOptions = [
  { value: "lose_weight", label: "Lose weight" },
  { value: "maintain_weight", label: "Maintain weight" },
  { value: "gain_weight", label: "Gain weight" },
  { value: "build_muscle", label: "Build muscle" },
] as const

const dietChoices = ["Vegan", "Vegetarian", "Keto", "Paleo", "Gluten-Free", "Dairy-Free", "Low-Carb"]
const allergenChoices = [
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Soy",
  "Wheat",
  "Fish",
  "Shellfish",
  "Sesame",
]

export default function HealthOnboardingWizard() {
  const { user, updateUser } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  const [step, setStep] = useState<Step>(1)
  const [saving, setSaving] = useState(false)
  const [conditions, setConditions] = useState<string[]>([])

  // --- form state (accepts whatever the user enters; we normalize on save)
  const [dateOfBirth, setDateOfBirth] = useState<string>("")
  const [sex, setSex] = useState<"male" | "female" | "other" | "">("")
  const [heightValue, setHeightValue] = useState<string>("")
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm")
  const [weightValue, setWeightValue] = useState<string>("")
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg")
  const [activityLevel, setActivityLevel] = useState<typeof activityOptions[number]["value"] | "">("")
  const [goal, setGoal] = useState<typeof goalOptions[number]["value"] | "">("")
  const [diets, setDiets] = useState<string[]>([])
  const [allergens, setAllergens] = useState<string[]>([])
  const [disliked, setDisliked] = useState<string>("") // comma-separated

  const pct = useMemo(() => {
    const total = 4
    return Math.round(((step - 1) / total) * 100)
  }, [step])

  // toggleArray is defined at module scope to avoid re-creation on each render

  async function handleFinish() {
    if (!user) return
    setSaving(true)
    try {
      const dislikedIngredients = disliked
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      // Normalize for our hook’s accepted shapes
      const payload = {
        // allow empty DoB (wizard UI shows optional)
        ...(dateOfBirth ? { dateOfBirth } : {}),
        ...(sex ? { sex } : {}),
        ...(activityLevel ? { activityLevel } : {}),
        ...(goal ? { goal } : {}),
        ...(heightValue
          ? { height: { value: Number(heightValue), unit: heightUnit } as const }
          : {}),
        ...(weightValue
          ? { weight: { value: Number(weightValue), unit: weightUnit } as const }
          : {}),
        ...(diets.length ? { diets } : {}),
        ...(allergens.length ? { allergens } : {}),
        ...(dislikedIngredients.length ? { dislikedIngredients } : {}),
        ...(conditions.length ? { majorConditions: conditions } : {}),
        // ✅ important: mark onboarding completed
        onboardingComplete: true,
      }

      await updateUser(payload)
      toast({ title: "Profile saved", description: "Your recommendations are ready." })
      router.replace("/")
    } catch (e: any) {
      toast({ title: "Could not save profile", description: e?.message || "", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center">Welcome to NutriFind, {user?.name || "there"}!</h1>
      <p className="text-center text-muted-foreground mb-6">
        Let’s set up your health profile to get personalized recipe recommendations
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Tell us about yourself</CardDescription>
          <div className="mt-3 h-2 w-full rounded bg-secondary">
            <div
              className="h-2 rounded bg-primary transition-all"
              style={{ width: `${pct + 25}%` }} // 25%, 50%, 75%, 100%
            />
          </div>
          <div className="text-right text-xs text-muted-foreground mt-1">{pct + 25}% complete</div>
        </CardHeader>

        <CardContent className="space-y-8">
          {step === 1 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Sex</Label>
                <RadioGroup value={sex} onValueChange={(v) => setSex(v as any)} className="grid grid-cols-3 gap-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="male" value="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="female" value="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="other" value="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <div className="flex gap-2">
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={heightValue}
                      onChange={(e) => setHeightValue(e.target.value)}
                    />
                    <Select value={heightUnit} onValueChange={(v) => setHeightUnit(v as any)}>
                      <SelectTrigger className="w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="ft">ft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <div className="flex gap-2">
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={weightValue}
                      onChange={(e) => setWeightValue(e.target.value)}
                    />
                    <Select value={weightUnit} onValueChange={(v) => setWeightUnit(v as any)}>
                      <SelectTrigger className="w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lb">lb</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <Label>Activity Level</Label>
                <Select value={activityLevel} onValueChange={(v) => setActivityLevel(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Goal</Label>
                <Select value={goal} onValueChange={(v) => setGoal(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <Label>Dietary Preferences</Label>
                <div className="flex flex-wrap gap-2">
                  {dietChoices.map((d) => (
                    <Button
                      key={d}
                      type="button"
                      variant={diets.includes(d) ? "default" : "outline"}
                      onClick={() => setDiets((arr) => toggleArray(arr, d))}
                      className="rounded-full"
                      size="sm"
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Allergens</Label>
                <div className="flex flex-wrap gap-2">
                  {allergenChoices.map((a) => (
                    <Button
                      key={a}
                      type="button"
                      variant={allergens.includes(a) ? "default" : "outline"}
                      onClick={() => setAllergens((arr) => toggleArray(arr, a))}
                      className="rounded-full"
                      size="sm"
                    >
                      {a}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Major Health Conditions</Label>
                <div className="flex flex-wrap gap-2">
                  {ALL_MAJOR_CONDITIONS.map((c) => (
                    <Button
                      key={c}
                      type="button"
                      variant={conditions.includes(c) ? "default" : "outline"}
                      onClick={() => setConditions((arr) => toggleArray(arr, c))}
                      className="rounded-full"
                      size="sm"
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="disliked">Disliked Ingredients (comma-separated)</Label>
                <Input
                  id="disliked"
                  placeholder="e.g., cilantro, mushrooms"
                  value={disliked}
                  onChange={(e) => setDisliked(e.target.value)}
                />
              </div>
            </section>
          )}

          {/* nav */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
              disabled={step === 1 || saving}
            >
              Previous
            </Button>

            {step < 4 ? (
              <Button type="button" onClick={() => setStep((s) => ((s + 1) as Step))} disabled={saving}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleFinish} disabled={saving}>
                {saving ? "Saving…" : "Finish"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
