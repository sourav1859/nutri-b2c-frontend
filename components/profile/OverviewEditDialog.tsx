"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagsInput } from "@/components/ui/tags-input"; // <-- NEW

const schema = z.object({
  display_name: z.string().max(120).optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  country: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  target_calories: z.preprocess(Number, z.number().int().nonnegative().optional()),
  target_protein_g: z.preprocess(Number, z.number().nonnegative().optional()),
  target_carbs_g: z.preprocess(Number, z.number().nonnegative().optional()),
  target_fat_g: z.preprocess(Number, z.number().nonnegative().optional()),
  profile_diets: z.array(z.string()).optional(),
  profile_allergens: z.array(z.string()).optional(),
  preferred_cuisines: z.array(z.string()).optional(),
});

export function OverviewEditDialog({
  open,
  onOpenChange,
  initial,
  onSaved,
}: {
  open: boolean;
  onOpenChange(v: boolean): void;
  initial: any;
  onSaved(): void;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as unknown as Resolver<z.infer<typeof schema>>, // <-- cast clears 2719
    defaultValues: {
      ...initial,
      profile_diets: initial?.profile_diets ?? [],
      profile_allergens: initial?.profile_allergens ?? [],
      preferred_cuisines: initial?.preferred_cuisines ?? [],
    },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    const { apiUpdateOverview } = await import("@/lib/api");
    await apiUpdateOverview(values);
    onSaved();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Overview</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <Input placeholder="Display name" {...form.register("display_name")} />
          <Input placeholder="Image URL" {...form.register("image_url")} />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Phone" {...form.register("phone")} />
            <Input placeholder="Country" {...form.register("country")} />
            <Input placeholder="Email" {...form.register("email")} />
            <Input placeholder="Full name" {...form.register("name")} />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <Input type="number" placeholder="Target Calories" {...form.register("target_calories")} />
            <Input type="number" placeholder="Protein (g)" {...form.register("target_protein_g")} />
            <Input type="number" placeholder="Carbs (g)" {...form.register("target_carbs_g")} />
            <Input type="number" placeholder="Fat (g)" {...form.register("target_fat_g")} />
          </div>

          <TagsInput
            label="Diets"
            value={form.watch("profile_diets") ?? []}
            onChange={(v: string[]) => form.setValue("profile_diets", v)}
          />
          <TagsInput
            label="Allergens"
            value={form.watch("profile_allergens") ?? []}
            onChange={(v: string[]) => form.setValue("profile_allergens", v)}
          />
          <TagsInput
            label="Preferred cuisines"
            value={form.watch("preferred_cuisines") ?? []}
            onChange={(v: string[]) => form.setValue("preferred_cuisines", v)}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
