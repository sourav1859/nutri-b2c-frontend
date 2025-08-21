"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"
import { loadZxing, loadQuagga } from "@/lib/barcode"
import type { BarcodeResult } from "@/lib/barcode"

export function ImageUploadScan({ onDetected }: { onDetected: (r: BarcodeResult)=>void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onFile = async (file: File) => {
    setError(null); setIsProcessing(true)
    try {
      const res = await scanImageFile(file)
      if (!res) throw new Error("No barcode found")
      onDetected(res)
    } catch (e:any) {
      setError(e?.message || "Failed to scan image")
      console.error("Image scan error:", e)
    } finally {
      setIsProcessing(false)
    }
  }

  const scanImageFile = async (file: File): Promise<BarcodeResult | null> => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    return await new Promise((resolve) => {
      img.onload = async () => {
        // Try native/zxing/quagga, in that order (all dynamic)
        if ("BarcodeDetector" in window) {
          try {
            // @ts-ignore
            const det = new window.BarcodeDetector({ formats: ["ean_13","upc_a","upc_e","ean_8"] })
            const res = await det.detect(img)
            if (res?.[0]) return resolve({ format: res[0].format, value: res[0].rawValue })
          } catch {}
        }
        const ZX = await loadZxing()
        if (ZX) {
          try {
            const codeReader = new ZX.BrowserBarcodeReader()
            const result = await codeReader.decodeFromImage(img)
            if (result) return resolve({ format: result.getBarcodeFormat()?.toString?.() || "ZXing", value: result.getText?.() || "" })
          } catch {}
        }
        const Q = await loadQuagga()
        if (Q) {
          try {
            Q.decodeSingle({
              src: url,
              numOfWorkers: 0,
              inputStream: { size: 800 },
              decoder: { readers: ["ean_reader","upc_reader","upc_e_reader","ean_8_reader"] }
            }, (res:any) => {
              if (res?.codeResult?.code) resolve({ format: res.codeResult.format || "quagga", value: res.codeResult.code })
              else resolve(null)
            })
            return
          } catch {}
        }
        resolve(null)
      }
      img.src = url
    })
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Scan from Image</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e)=> e.target.files?.[0] && onFile(e.target.files[0])}/>
          <Button type="button" onClick={()=>inputRef.current?.click()} disabled={isProcessing}>
            {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Scanning…</> : <><Upload className="mr-2 h-4 w-4"/>Upload photo</>}
          </Button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </CardContent>
    </Card>
  )
}
