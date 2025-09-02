import { NextResponse } from "next/server"
import { searchRecipesData } from "@/lib/data"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  const filtersStr = searchParams.get("filters")
  let filters: any = undefined
  if (filtersStr) {
    try {
      filters = JSON.parse(filtersStr)
    } catch {
      // ignore
    }
  }
  const results = searchRecipesData(q, filters)
  return NextResponse.json(results)
}
