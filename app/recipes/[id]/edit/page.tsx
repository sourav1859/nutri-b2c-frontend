"use client";
import { useEffect, useState } from "react";
import { fetchRecipe, updateRecipe, type UserRecipe } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import RecipeForm from "@/components/recipe-builder-simple/form";
import { useParams } from "next/navigation";

export default function EditRecipePage() {
  const { user } = useUser();
  const uid = user?.$id;
  const params = useParams<{ id: string }>();
  const [initial, setInitial] = useState<Partial<UserRecipe> | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(()=> {
    (async ()=>{
      if (!uid || !params?.id) return;
      const r = await fetchRecipe(uid, params.id);
      setInitial(r);
    })();
  }, [uid, params?.id]);

  async function onSubmit(patch: Partial<UserRecipe>) {
    if (!uid || !params?.id) return;
    setBusy(true);
    try {
      await updateRecipe(uid, params.id, patch);
      // Keep UI simple: stay on page
    } finally { setBusy(false); }
  }

  if (!initial) return <div>Loading…</div>;
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Edit Recipe</h1>
      <RecipeForm initial={initial} onSubmit={onSubmit} busy={busy} />
    </div>
  );
}
