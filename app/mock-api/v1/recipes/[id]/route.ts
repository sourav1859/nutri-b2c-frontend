import { NextResponse } from "next/server";
import { findRecipe } from "@/lib/data";

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const recipe = findRecipe(id);
  if (!recipe) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(recipe);
}
