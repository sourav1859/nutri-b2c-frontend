import { NextResponse } from "next/server"
import { toggleSave, findRecipe } from "@/lib/data"

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const exists = findRecipe(params.id)
  if (!exists) return NextResponse.json({ message: "Not found" }, { status: 404 })
  const isSaved = toggleSave(params.id)
  return NextResponse.json({ isSaved })
}
