import { NextResponse } from "next/server"
import barcodeData from "@/app/_mock/barcodes.json"

export async function GET() {
  return NextResponse.json(barcodeData)
}
