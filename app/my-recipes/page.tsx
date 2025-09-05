"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteRecipe, fetchMyRecipes, type UserRecipe } from "@/lib/api";
import { useUser } from "@/hooks/use-user"; // you already have this

export default function MyRecipesPage() {
  const { user } = useUser();
  const uid = user?.$id;
  const [items, setItems] = useState<UserRecipe[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!uid) return;
    setLoading(true);
    try {
      const res = await fetchMyRecipes(uid, { limit: 100 });
      setItems(res.items);
    } finally { setLoading(false); }
  }

  useEffect(()=>{ load(); /* eslint-disable-next-line */}, [uid]);

  async function onDelete(id: string) {
    if (!uid) return;
    if (!confirm("Delete this recipe?")) return;
    await deleteRecipe(uid, id);
    setItems(items.filter(x=>x.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">My Recipes</h1>
        <Link href="/recipes/new" className="btn-primary">Create Recipe</Link>
      </div>

      {loading ? <div>Loading…</div> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(r => (
            <div key={r.id} className="card p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{r.title}</h3>
                <span className="text-xs opacity-70">{r.visibility ?? "private"}</span>
              </div>
              {r.image_url ? <img src={r.image_url} alt={r.title} className="rounded" /> : null}
              <p className="text-sm opacity-80 line-clamp-2">{r.description}</p>
              <div className="flex gap-2 justify-end">
                <Link href={`/recipes/${r.id}/edit`} className="btn">Edit</Link>
                <button className="btn-secondary" onClick={()=>onDelete(r.id)}>Delete</button>
              </div>
            </div>
          ))}
          {!items.length && <div className="opacity-70">No recipes yet.</div>}
        </div>
      )}
    </div>
  );
}
