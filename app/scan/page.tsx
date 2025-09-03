"use client"

import { useState, useEffect } from "react"
import { useBarcodeScanner } from "@/hooks/use-barcode-scanner"
import { CameraPermissionGate } from "@/components/scan/camera-permission-gate"
import { LivePreview } from "@/components/scan/live-preview"
import { ScanResultSheet } from "@/components/scan/scan-result-sheet"
import { ImageUploadScan } from "@/components/scan/image-upload-scan"
import { ManualCodeEntry } from "@/components/scan/manual-code-entry"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, Camera } from "lucide-react"
import type { BarcodeResult } from "@/lib/barcode"
import { lookupProduct } from "@/lib/barcode"
import type { Product } from "@/lib/types"

export default function ScanPage() {
  const scanner = useBarcodeScanner()
  const [showResult, setShowResult] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [scanHistory, setScanHistory] = useState<any[]>([])

  useEffect(() => {
    setScanHistory(scanner.getHistory())
  }, [])

  const handleDetected = async (result: BarcodeResult) => {
    scanner.setResult(result)
    scanner.saveToHistory(result)
    setScanHistory(scanner.getHistory())

    const product = await lookupProduct(result.value)
    setCurrentProduct(product)
    setShowResult(true)

    if (navigator.vibrate) {
      navigator.vibrate(200)
    }
  }

  const handleScanAgain = () => {
    setShowResult(false)
    setCurrentProduct(null)
    scanner.setResult(null)
  }

  const handleManualEntry = async (code: string) => {
    const result: BarcodeResult = {
      format: "Manual",
      value: code,
    }
    await handleDetected(result)
  }

  const handleImageScan = async (result: BarcodeResult) => {
    await handleDetected(result)
  }

  if (scanner.permission === "prompt") {
    return (
      <CameraPermissionGate
        onPermissionGranted={() => scanner.requestPermission()}
        onFallback={() => {
          // Show fallback options
        }}
      />
    )
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Barcode Scanner</h1>
        <p className="text-muted-foreground">Scan product barcodes to view nutrition information</p>
      </div>

      {scanner.permission === "granted" && !showResult ? (
        <div className="space-y-4">
          <LivePreview
            // deviceId={scanner.activeDeviceId || undefined}
            onDetected={handleDetected}
            onError={(error) => console.error("Scan error:", error)}
          />

          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scanner.toggleTorch(true)}
              disabled={!scanner.torchAvailable}
            >
              <Camera className="w-4 h-4 mr-2" />
              Torch
            </Button>
          </div>
        </div>
      ) : null}

      {scanner.permission === "denied" || showResult ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploadScan onDetected={handleImageScan} />
            <ManualCodeEntry onSubmit={handleManualEntry} />
          </div>
        </div>
      ) : null}

      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Recent Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanHistory.slice(0, 5).map((scan, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {scan.format}
                    </Badge>
                    <span className="ml-2 font-mono text-sm">{scan.value}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(scan.ts).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <ScanResultSheet
        open={showResult}
        onOpenChange={setShowResult}
        result={{
          format: scanner.lastResult?.format || "",
          value: scanner.lastResult?.value || "",
          product: currentProduct,
        }}
        onScanAgain={handleScanAgain}
      />
    </div>
  )
}
