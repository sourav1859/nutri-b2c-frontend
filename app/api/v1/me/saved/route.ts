import { NextResponse } from "next/server"
import { getSavedIds, listRecipes } from "@/lib/data"

export async function GET() {
  const ids = getSavedIds()
  const all = listRecipes()
  const saved = all.filter((r) => ids.has(r.id))
  return NextResponse.json(saved)
}
