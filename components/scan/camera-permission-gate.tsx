"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, Keyboard, AlertCircle } from "lucide-react"

type Props = {
  onPermissionGranted: () => void
  onFallback: () => void
}

export function CameraPermissionGate({ onPermissionGranted, onFallback }: Props) {
  return (
    <div className="px-4 py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Barcode Scanner</h1>
        <p className="text-muted-foreground">Scan product barcodes to view nutrition information</p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Camera Access Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            To scan barcodes with your camera, we need permission to access it.
          </p>

          <Button onClick={onPermissionGranted} className="w-full">
            <Camera className="w-4 h-4 mr-2" />
            Enable Camera
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or use alternatives</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={onFallback}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            <Button variant="outline" onClick={onFallback}>
              <Keyboard className="w-4 h-4 mr-2" />
              Enter Code
            </Button>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Privacy Notice</p>
              <p>Camera access is only used for barcode scanning. No images are stored or transmitted.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
