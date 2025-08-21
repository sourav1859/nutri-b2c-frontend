import { NextResponse } from "next/server"
import data from "@/app/_mock/barcodes.json"
export async function GET() { return NextResponse.json(data) }
