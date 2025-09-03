import { NextResponse } from "next/server";
import { getSavedIds, listRecipes, toggleSave } from "@/lib/data";

export async function GET() {
  const savedIds = await getSavedIds();                 // string[]
  const all = await listRecipes();                      // Recipe[]
  const savedRecipes = all.filter(r => savedIds.includes(r.id));
  return NextResponse.json(savedRecipes);
}

export async function POST(req: Request) {
  const { id, saved } = await req.json();               // saved is boolean
  await toggleSave(id, saved);                          // our shim accepts optional 2nd arg too
  return NextResponse.json({ ok: true });
}
