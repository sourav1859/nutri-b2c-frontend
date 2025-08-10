import { NextResponse } from "next/server"
import { findRecipe } from "@/lib/data"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const recipe = findRecipe(params.id)
  if (!recipe) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json(recipe)
}
