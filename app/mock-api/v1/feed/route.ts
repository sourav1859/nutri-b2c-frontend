import { NextResponse } from "next/server"
import { listRecipes } from "@/lib/data"

export async function GET() {
  // For now, "personalized" feed is the full list
  return NextResponse.json(listRecipes())
}
