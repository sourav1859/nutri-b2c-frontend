import { NextResponse } from "next/server";
import { toggleSave, findRecipe } from "@/lib/data";

export async function POST(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const exists = findRecipe(id);
  if (!exists) return NextResponse.json({ message: "Not found" }, { status: 404 });
  const isSaved = toggleSave(id);
  return NextResponse.json({ isSaved });
}
