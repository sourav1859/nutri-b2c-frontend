"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import {
  apiGetMyOverview,
  apiGetMyHealth,
  apiDeleteProfileRows,
  apiDeleteAccount,
  apiUpdateOverview,
  apiUpdateHealth,
} from "@/lib/api";

// 👉 single source of truth lists
import {
  ALL_MAJOR_CONDITIONS,
  ALL_ALLERGENS,
  ALL_DIETS,
  ALL_CUISINES,
} from "@/lib/data";

/* If lib/data.ts already exports these, import them instead of defining here */
const activityOptions = [
  { value: "sedentary", label: "Sedentary" },
  { value: "lightly_active", label: "Lightly active" },
  { value: "moderately_active", label: "Moderately active" },
  { value: "very_active", label: "Very active" },
  { value: "extremely_active", label: "Extremely active" },
] as const;

const goalOptions = [
  { value: "lose_weight", label: "Lose weight" },
  { value: "maintain_weight", label: "Maintain weight" },
  { value: "gain_weight", label: "Gain weight" },
  { value: "build_muscle", label: "Build muscle" },
] as const;

// ---------- types ----------
type Overview = {
  display_name?: string | null;
  image_url?: string | null;
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  profile_diets?: string[] | null;
  profile_allergens?: string[] | null;
  preferred_cuisines?: string[] | null;
  target_calories?: number | null;
  target_protein_g?: number | null;
  target_carbs_g?: number | null;
  target_fat_g?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  [k: string]: any;
};

type Health = {
  date_of_birth?: string | null;
  sex?: "male" | "female" | "other" | null;
  activity_level?: string | null;
  goal?: string | null;
  diets?: string[] | null;
  allergies?: string[] | null;
  intolerances?: string[] | null;
  disliked_ingredients?: string[] | null;
  onboarding_complete?: boolean | null;
  height_display?: string | null;
  weight_display?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  majorConditions?: string[] | null;
  created_at?: string | null;
  updated_at?: string | null;
  [k: string]: any;
};

// ---------- helpers ----------
const show = (v: unknown, fallback = "Not set") =>
  v === null || v === undefined || v === "" ? fallback : String(v);

const list = (arr?: string[] | null, fallback = "None specified") =>
  arr && arr.length ? arr.join(", ") : fallback;

function normalizeOverview(row: any): Overview {
  if (!row) return {};
  return {
    display_name: row.display_name ?? row.displayName ?? null,
    image_url: row.image_url ?? row.imageUrl ?? null,
    email: row.email ?? null,
    phone: row.phone ?? null,
    country: row.country ?? null,
    profile_diets: row.profile_diets ?? row.profileDiets ?? [],
    profile_allergens: row.profile_allergens ?? row.profileAllergens ?? [],
    preferred_cuisines: row.preferred_cuisines ?? row.preferredCuisines ?? [],
    target_calories: row.target_calories ?? row.targetCalories ?? null,
    target_protein_g: row.target_protein_g ?? row.targetProteinG ?? null,
    target_carbs_g: row.target_carbs_g ?? row.targetCarbsG ?? null,
    target_fat_g: row.target_fat_g ?? row.targetFatG ?? null,
    created_at: row.created_at ?? row.createdAt ?? null,
    updated_at: row.updated_at ?? row.updatedAt ?? null,
  };
}

function normalizeHealth(row: any): Health {
  if (!row) return {};
  const height_display =
    row.height_display ?? row.heightDisplay ?? (row.height_cm ? `${row.height_cm} cm` : null);
  const weight_display =
    row.weight_display ?? row.weightDisplay ?? (row.weight_kg ? `${row.weight_kg} kg` : null);
  return {
    date_of_birth: row.date_of_birth ?? row.dateOfBirth ?? null,
    sex: row.sex ?? null,
    activity_level: row.activity_level ?? row.activityLevel ?? null,
    goal: row.goal ?? null,
    diets: row.diets ?? [],
    allergies: row.allergies ?? row.allergens ?? [],
    intolerances: row.intolerances ?? [],
    disliked_ingredients: row.disliked_ingredients ?? row.dislikedIngredients ?? [],
    onboarding_complete: (row.onboarding_complete ?? row.onboardingComplete) ?? null,
    height_display,
    weight_display,
    height_cm: row.height_cm ?? row.heightCm ?? null,
    weight_kg: row.weight_kg ?? row.weightKg ?? null,
    majorConditions: row.majorConditions ?? row.major_conditions ?? [],
    created_at: row.created_at ?? row.createdAt ?? null,
    updated_at: row.updated_at ?? row.updatedAt ?? null,
  };
}

function ageFromISO(iso?: string | null) {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}

function bmiFrom(heightCm?: number | null, weightKg?: number | null) {
  if (!heightCm || !weightKg) return undefined;
  const m = heightCm / 100;
  const bmi = weightKg / (m * m);
  return Math.round(bmi * 10) / 10;
}

// chip group used for multi-select lists
function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (item: string) =>
    onChange(value.includes(item) ? value.filter((x) => x !== item) : [...value, item]);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Button
          key={opt}
          type="button"
          variant={value.includes(opt) ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => toggle(opt)}
        >
          {opt}
        </Button>
      ))}
    </div>
  );
}

// ---------- page ----------
export default function ProfilePage() {
  const { toast } = useToast();

  const [loading, setLoading] = React.useState(true);
  const [overview, setOverview] = React.useState<Overview | null>(null);
  const [health, setHealth] = React.useState<Health | null>(null);

  const [editOverview, setEditOverview] = React.useState(false);
  const [editHealth, setEditHealth] = React.useState(false);

  // local editable copies (arrays, not CSV)
  const [ovForm, setOvForm] = React.useState<any>({});
  const [hpForm, setHpForm] = React.useState<any>({});

  async function load() {
    try {
      setLoading(true);
      const [ovRaw, hpRaw] = await Promise.all([apiGetMyOverview(), apiGetMyHealth()]);
      const ov = normalizeOverview(ovRaw);
      const hp = normalizeHealth(hpRaw);
      setOverview(ov);
      setHealth(hp);

      // seed edit state with arrays & scalars
      setOvForm({
        display_name: ov.display_name ?? "",
        image_url: ov.image_url ?? "",
        email: ov.email ?? "",
        phone: ov.phone ?? "",
        country: ov.country ?? "",
        preferred_cuisines: ov.preferred_cuisines ?? [],
        profile_allergens: ov.profile_allergens ?? [],
        profile_diets: ov.profile_diets ?? [],
        target_calories: ov.target_calories ?? "",
        target_protein_g: ov.target_protein_g ?? "",
        target_carbs_g: ov.target_carbs_g ?? "",
        target_fat_g: ov.target_fat_g ?? "",
      });
      setHpForm({
        date_of_birth: hp.date_of_birth ?? "",
        sex: hp.sex ?? "",
        activity_level: hp.activity_level ?? "",
        goal: hp.goal ?? "",
        height_display: hp.height_display ?? "",
        weight_display: hp.weight_display ?? "",
        height_cm: hp.height_cm ?? "",
        weight_kg: hp.weight_kg ?? "",
        diets: hp.diets ?? [],
        allergies: hp.allergies ?? [],
        intolerances: hp.intolerances ?? [],
        disliked_ingredients: hp.disliked_ingredients ?? [],
        major_conditions: hp.majorConditions ?? [],
        onboarding_complete: !!hp.onboarding_complete,
      });
    } catch (e) {
      console.error("profile load error", e);
      toast({ description: "Failed to load profile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  const completeness = React.useMemo(() => {
    const fields = [
      overview?.display_name,
      overview?.email,
      health?.height_display ?? health?.height_cm,
      health?.weight_display ?? health?.weight_kg,
      health?.activity_level,
      health?.goal,
    ];
    const have = fields.filter((f) => !(f === null || f === undefined || f === "")).length;
    return Math.round((have / fields.length) * 100) || 0;
  }, [overview, health]);

  async function onDeleteRows() {
    if (!confirm("Delete profile rows in Supabase (overview & health)?")) return;
    try {
      await apiDeleteProfileRows();
      await load();
      toast({ description: "Profile rows deleted." });
    } catch (e) {
      console.error(e);
      toast({ description: "Delete failed.", variant: "destructive" });
    }
  }

  async function onDeleteAccount() {
    if (!confirm("This permanently deletes your account and all data. Continue?")) return;
    try {
      await apiDeleteAccount();
      window.location.href = "/login";
    } catch (e) {
      console.error(e);
      toast({ description: "Delete account failed.", variant: "destructive" });
    }
  }

  // ----- saves (arrays, not CSV) -----
  async function saveOverviewInline() {
    try {
      const body = {
        displayName: ovForm.display_name || null,
        imageUrl: ovForm.image_url || null,
        email: ovForm.email || null,
        phone: ovForm.phone || null,
        country: ovForm.country || null,
        preferredCuisines: ovForm.preferred_cuisines || [],
        profileAllergens: ovForm.profile_allergens || [],
        profileDiets: ovForm.profile_diets || [],
        targetCalories: ovForm.target_calories === "" ? null : Number(ovForm.target_calories),
        targetProteinG: ovForm.target_protein_g === "" ? null : Number(ovForm.target_protein_g),
        targetCarbsG: ovForm.target_carbs_g === "" ? null : Number(ovForm.target_carbs_g),
        targetFatG: ovForm.target_fat_g === "" ? null : Number(ovForm.target_fat_g),
      };
      const r = await apiUpdateOverview(body);
      if (!r.ok) throw new Error(`overview save ${r.status}`);
      toast({ description: "Overview saved." });
      setEditOverview(false);
      await load();
    } catch (e) {
      console.error(e);
      toast({ description: "Failed to save overview.", variant: "destructive" });
    }
  }

  async function saveHealthInline() {
    try {
      const body = {
        dateOfBirth: hpForm.date_of_birth || null,
        sex: hpForm.sex || null,
        activityLevel: hpForm.activity_level || null,
        goal: hpForm.goal || null,
        heightDisplay: hpForm.height_display || null,
        weightDisplay: hpForm.weight_display || null,
        heightCm: hpForm.height_cm === "" ? null : Number(hpForm.height_cm),
        weightKg: hpForm.weight_kg === "" ? null : Number(hpForm.weight_kg),
        diets: hpForm.diets || [],
        allergens: hpForm.allergies || [],
        intolerances: hpForm.intolerances || [],
        dislikedIngredients: hpForm.disliked_ingredients || [],
        majorConditions: hpForm.major_conditions || [],
        onboardingComplete: !!hpForm.onboarding_complete,
      };
      const r = await apiUpdateHealth(body);
      if (!r.ok) throw new Error(`health save ${r.status}`);
      toast({ description: "Health saved." });
      setEditHealth(false);
      await load();
    } catch (e) {
      console.error(e);
      toast({ description: "Failed to save health.", variant: "destructive" });
    }
  }

  // derived display fallbacks
  const dietsDisplay = React.useMemo(() => {
    const fromOverview = overview?.profile_diets ?? [];
    return (fromOverview.length ? fromOverview : (health?.diets ?? [])) as string[];
  }, [overview?.profile_diets, health?.diets]);

  const allergiesDisplay = React.useMemo(() => {
    const fromOverview = overview?.profile_allergens ?? [];
    return (fromOverview.length ? fromOverview : (health?.allergies ?? [])) as string[];
  }, [overview?.profile_allergens, health?.allergies]);

  const cuisinesDisplay = React.useMemo(() => {
    return (overview?.preferred_cuisines ?? []) as string[];
  }, [overview?.preferred_cuisines]);

  const bmiEdit =
    hpForm && hpForm.height_cm && hpForm.weight_kg
      ? bmiFrom(Number(hpForm.height_cm), Number(hpForm.weight_kg))
      : undefined;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and health information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={editOverview ? "secondary" : "default"} onClick={() => setEditOverview((v) => !v)}>
            {editOverview ? "Cancel Overview" : "Edit Overview"}
          </Button>
          <Button variant={editHealth ? "secondary" : "default"} onClick={() => setEditHealth((v) => !v)}>
            {editHealth ? "Cancel Health" : "Edit Health"}
          </Button>
          <Button variant="destructive" onClick={onDeleteRows}>
            Delete Profile Rows
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* ---------------- Overview ---------------- */}
        <TabsContent value="overview">
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={(editOverview ? ovForm.image_url : overview?.image_url) || undefined}
                    alt={(overview?.display_name || "User")}
                  />
                  <AvatarFallback>
                    {(overview?.display_name || "U").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-semibold text-lg truncate">
                    {editOverview ? (ovForm.display_name || "") : show(overview?.display_name)}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {editOverview ? (ovForm.email || "") : show(overview?.email)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Profile Completeness</span>
                  <span className="text-muted-foreground">{completeness}%</span>
                </div>
                <Progress value={completeness} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>Age: {ageFromISO(health?.date_of_birth) ?? "Age not set"}</div>
                <div>Sex: {show(health?.sex, "Not Specified")}</div>
                <div>Height: {health?.height_display ?? (health?.height_cm ? `${health.height_cm} cm` : "Not set")}</div>
                <div>Weight: {health?.weight_display ?? (health?.weight_kg ? `${health.weight_kg} kg` : "Not set")}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Health Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  {(() => {
                    const bmi = bmiFrom(health?.height_cm, health?.weight_kg);
                    return bmi ? `BMI ${bmi}` : "Complete height and weight to see BMI";
                  })()}
                </div>
                <div>Activity Level: {show(health?.activity_level, "Not Set")}</div>
                <div>Goal: {show(health?.goal, "Not Set")}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dietary Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {!editOverview && (
                  <>
                    <div><span className="font-medium">Diets: </span>{list(dietsDisplay)}</div>
                    <div><span className="font-medium">Allergies: </span>{list(allergiesDisplay)}</div>
                    <div><span className="font-medium">Preferred cuisines: </span>{list(cuisinesDisplay)}</div>
                  </>
                )}
                {editOverview && (
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-1 block">Diets</Label>
                      <ChipGroup
                        options={ALL_DIETS}
                        value={ovForm.profile_diets || []}
                        onChange={(next) => setOvForm((s: any) => ({ ...s, profile_diets: next }))}
                      />
                    </div>
                    <div>
                      <Label className="mb-1 block">Allergies</Label>
                      <ChipGroup
                        options={ALL_ALLERGENS}
                        value={ovForm.profile_allergens || []}
                        onChange={(next) => setOvForm((s: any) => ({ ...s, profile_allergens: next }))}
                      />
                    </div>
                    <div>
                      <Label className="mb-1 block">Preferred cuisines</Label>
                      <ChipGroup
                        options={ALL_CUISINES}
                        value={ovForm.preferred_cuisines || []}
                        onChange={(next) => setOvForm((s: any) => ({ ...s, preferred_cuisines: next }))}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account & Targets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {!editOverview && (
                  <>
                    <div>Account Name: {show(overview?.display_name)}</div>
                    <div>Email: {show(overview?.email)}</div>
                    <div>Phone: {show(overview?.phone)}</div>
                    <div>Country: {show(overview?.country)}</div>
                    <div>Target Calories: {show(overview?.target_calories)}</div>
                    <div>Target Protein (g): {show(overview?.target_protein_g)}</div>
                    <div>Target Carbs (g): {show(overview?.target_carbs_g)}</div>
                    <div>Target Fat (g): {show(overview?.target_fat_g)}</div>
                  </>
                )}
                {editOverview && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="col-span-2">
                      <Label htmlFor="ov-display-name">Display name</Label>
                      <Input id="ov-display-name" value={ovForm.display_name} onChange={(e) => setOvForm((s: any) => ({...s, display_name: e.target.value}))} />
                    </div>
                    <div>
                      <Label htmlFor="ov-email">Email</Label>
                      <Input id="ov-email" type="email" value={ovForm.email} onChange={(e) => setOvForm((s: any) => ({...s, email: e.target.value}))} />
                    </div>
                    <div>
                      <Label htmlFor="ov-phone">Phone</Label>
                      <Input id="ov-phone" value={ovForm.phone} onChange={(e) => setOvForm((s: any) => ({...s, phone: e.target.value}))} />
                    </div>
                    <div>
                      <Label htmlFor="ov-country">Country</Label>
                      <Input id="ov-country" value={ovForm.country} onChange={(e) => setOvForm((s: any) => ({...s, country: e.target.value}))} />
                    </div>
                    <div>
                      <Label htmlFor="ov-img">Image URL</Label>
                      <Input id="ov-img" value={ovForm.image_url} onChange={(e) => setOvForm((s: any) => ({...s, image_url: e.target.value}))} />
                    </div>
                    <div>
                      <Label htmlFor="ov-cal">Target Calories</Label>
                      <Input id="ov-cal" type="number" value={ovForm.target_calories} onChange={(e) => setOvForm((s: any) => ({...s, target_calories: e.target.value}))} />
                    </div>
                    <div>
                      <Label htmlFor="ov-pro">Target Protein (g)</Label>
                      <Input id="ov-pro" type="number" value={ovForm.target_protein_g} onChange={(e) => setOvForm((s: any) => ({...s, target_protein_g: e.target.value}))} />
                    </div>
                    <div>
                      <Label htmlFor="ov-carbs">Target Carbs (g)</Label>
                      <Input id="ov-carbs" type="number" value={ovForm.target_carbs_g} onChange={(e) => setOvForm((s: any) => ({...s, target_carbs_g: e.target.value}))} />
                    </div>
                    <div>
                      <Label htmlFor="ov-fat">Target Fat (g)</Label>
                      <Input id="ov-fat" type="number" value={ovForm.target_fat_g} onChange={(e) => setOvForm((s: any) => ({...s, target_fat_g: e.target.value}))} />
                    </div>
                    <div className="col-span-2 flex gap-2">
                      <Button onClick={saveOverviewInline}>Save</Button>
                      <Button variant="secondary" onClick={() => (setEditOverview(false), load())}>Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---------------- Health ---------------- */}
        <TabsContent value="health">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {!editHealth && (
                  <>
                    <div>DOB: {show(health?.date_of_birth)}</div>
                    <div>Sex: {show(health?.sex, "Not Specified")}</div>
                    <div>Activity Level: {show(health?.activity_level, "Not Set")}</div>
                    <div>Goal: {show(health?.goal, "Not Set")}</div>
                  </>
                )}
                {editHealth && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="hp-dob">Date of Birth</Label>
                      <Input id="hp-dob" type="date" value={hpForm.date_of_birth} onChange={(e) => setHpForm((s: any) => ({...s, date_of_birth: e.target.value}))} />
                    </div>
                    <div>
                      <Label htmlFor="hp-sex">Sex</Label>
                      <Input id="hp-sex" placeholder="male | female | other" value={hpForm.sex} onChange={(e) => setHpForm((s: any) => ({...s, sex: e.target.value}))} />
                    </div>

                    <div>
                      <Label>Activity Level</Label>
                      <Select
                        value={hpForm.activity_level ?? ""}
                        onValueChange={(v) => setHpForm((s: any) => ({ ...s, activity_level: v }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          {activityOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Goal</Label>
                      <Select
                        value={hpForm.goal ?? ""}
                        onValueChange={(v) => setHpForm((s: any) => ({ ...s, goal: v }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select goal" />
                        </SelectTrigger>
                        <SelectContent>
                          {goalOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Measurements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {!editHealth && (
                  <>
                    <div>Height: {health?.height_display ?? (health?.height_cm ? `${health.height_cm} cm` : "Not set")}</div>
                    <div>Weight: {health?.weight_display ?? (health?.weight_kg ? `${health.weight_kg} kg` : "Not set")}</div>
                    <div>
                      BMI: {(() => {
                        const bmi = bmiFrom(health?.height_cm, health?.weight_kg);
                        return bmi ? bmi : "—";
                      })()}
                    </div>
                  </>
                )}
                {editHealth && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <Label htmlFor="hp-hdisp">Height (display)</Label>
                      <Input id="hp-hdisp" value={hpForm.height_display} onChange={(e) => setHpForm((s: any) => ({...s, height_display: e.target.value}))} />
                    </div>
                    <div>
                      <Label htmlFor="hp-wdisp">Weight (display)</Label>
                      <Input id="hp-wdisp" value={hpForm.weight_display} onChange={(e) => setHpForm((s: any) => ({...s, weight_display: e.target.value}))} />
                    </div>
                    <div>
                      <Label htmlFor="hp-hcm">Height (cm)</Label>
                      <Input id="hp-hcm" type="number" value={hpForm.height_cm} onChange={(e) => setHpForm((s: any) => ({...s, height_cm: e.target.value}))} />
                    </div>
                    <div>
                      <Label htmlFor="hp-wkg">Weight (kg)</Label>
                      <Input id="hp-wkg" type="number" value={hpForm.weight_kg} onChange={(e) => setHpForm((s: any) => ({...s, weight_kg: e.target.value}))} />
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground">
                      BMI (live): {bmiEdit ?? "—"}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Restrictions & Intolerances</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3 text-sm">
                {!editHealth && (
                  <>
                    <div>
                      <div className="font-medium">Major Health Conditions</div>
                      <div>{list(health?.majorConditions)}</div>
                    </div>
                    <div>
                      <div className="font-medium">Allergies</div>
                      <div>{list(health?.allergies)}</div>
                    </div>
                    <div>
                      <div className="font-medium">Intolerances</div>
                      <div>{list(health?.intolerances)}</div>
                    </div>
                    <div className="md:col-span-3">
                      <div className="font-medium">Disliked Ingredients</div>
                      <div>{list(health?.disliked_ingredients)}</div>
                    </div>
                  </>
                )}
                {editHealth && (
                  <>
                    <div className="md:col-span-3 space-y-2">
                      <Label>Major Health Conditions</Label>
                      <ChipGroup
                        options={ALL_MAJOR_CONDITIONS}
                        value={hpForm.major_conditions || []}
                        onChange={(next) => setHpForm((s: any) => ({ ...s, major_conditions: next }))}
                      />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <Label>Allergies</Label>
                      <ChipGroup
                        options={ALL_ALLERGENS}
                        value={hpForm.allergies || []}
                        onChange={(next) => setHpForm((s: any) => ({ ...s, allergies: next }))}
                      />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <Label>Intolerances (CSV quick entry)</Label>
                      <Input
                        placeholder="e.g., lactose, sorbitol"
                        value={(hpForm.intolerances || []).join(", ")}
                        onChange={(e) =>
                          setHpForm((s: any) => ({
                            ...s,
                            intolerances: e.target.value
                              .split(",")
                              .map((x) => x.trim())
                              .filter(Boolean),
                          }))
                        }
                      />
                    </div>
                    <div className="md:col-span-3 space-y-2">
                      <Label>Disliked Ingredients (CSV quick entry)</Label>
                      <Input
                        placeholder="e.g., cilantro, olives"
                        value={(hpForm.disliked_ingredients || []).join(", ")}
                        onChange={(e) =>
                          setHpForm((s: any) => ({
                            ...s,
                            disliked_ingredients: e.target.value
                              .split(",")
                              .map((x) => x.trim())
                              .filter(Boolean),
                          }))
                        }
                      />
                    </div>
                    <div className="md:col-span-3 flex items-center gap-2">
                      <Checkbox id="hp-onboard" checked={!!hpForm.onboarding_complete} onCheckedChange={(v) => setHpForm((s: any) => ({...s, onboarding_complete: !!v}))} />
                      <Label htmlFor="hp-onboard">Onboarding Complete</Label>
                    </div>
                    <div className="md:col-span-3 flex gap-2">
                      <Button onClick={saveHealthInline}>Save</Button>
                      <Button variant="secondary" onClick={() => (setEditHealth(false), load())}>Cancel</Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---------------- Security ---------------- */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data from Supabase and Appwrite.
              </p>
              <div>
                <Button variant="destructive" onClick={onDeleteAccount}>Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
    </div>
  );
}
