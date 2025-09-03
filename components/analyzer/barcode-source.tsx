"use client"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { ImageUploadScan } from "@/components/scan/image-upload-scan"
import { ManualCodeEntry } from "@/components/scan/manual-code-entry"
import type { SourceData } from "@/app/recipe-analyzer/page"
import type { BarcodeResult } from "@/lib/barcode"

export function BarcodeSource({ source, onChange }: { source: SourceData; onChange: (s: SourceData)=>void }) {
  const [lastScan, setLastScan] = useState<BarcodeResult | null>(null)

  const onDetected = (res: BarcodeResult) => {
    setLastScan(res)
    onChange({ ...source, barcode: res.value, rawText: source.rawText || "" })
  }

  return (
    <div className="space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>Upload a photo with a barcode, or enter the code manually.</AlertDescription>
      </Alert>

      <ImageUploadScan onDetected={onDetected} />
      <ManualCodeEntry onSubmit={(code, productName) => onChange({ ...source, barcode: code, rawText: productName ? `${productName}\n\nIngredients:\n(Add ingredients list here)` : (source.rawText || "") })} />

      <div className="space-y-2">
        <Label>Notes or ingredients (optional)</Label>
        <Textarea rows={6} placeholder="Add ingredients if the product is a component in a recipe…" value={source.rawText || ""} onChange={(e)=>onChange({ ...source, rawText: e.target.value })}/>
      </div>

      {lastScan && <p className="text-xs text-muted-foreground">Last scan: {lastScan.format} → {lastScan.value}</p>}
    </div>
  )
}
