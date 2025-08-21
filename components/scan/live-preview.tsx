"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw, Zap } from "lucide-react"
import type { BarcodeResult } from "@/lib/barcode"
import { loadZxing, loadQuagga } from "@/lib/barcode"

export function LivePreview({ onDetected, onError }: { onDetected: (r: BarcodeResult)=>void; onError: (e: Error)=>void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [scanning, setScanning] = useState(false)

  const stopCamera = () => { stream?.getTracks().forEach((t)=>t.stop()); setStream(null) }

  const startCamera = async () => {
    try {
      stopCamera()
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      setStream(stream)
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play() }
      setScanning(true)
      requestAnimationFrame(tickScan)
    } catch (e:any) {
      onError(e instanceof Error ? e : new Error("Camera error"))
    }
  }

  useEffect(() => { startCamera(); return () => stopCamera() }, [])

  const tickScan = async () => {
    if (!scanning || !videoRef.current) return
    try {
      const ZX = await loadZxing()
      if (ZX) {
        const codeReader = new ZX.BrowserBarcodeReader()
        const result = await codeReader.decodeOnceFromVideoDevice(undefined, videoRef.current)
        if (result?.getText) {
          setScanning(false)
          onDetected({ format: result.getBarcodeFormat()?.toString?.() || "ZXing", value: result.getText() })
          return
        }
      }
    } catch {}
    if (scanning) requestAnimationFrame(tickScan)
  }

  return (
    <div className="space-y-2">
      <video ref={videoRef} className="w-full rounded-md border" playsInline muted />
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={startCamera}><RotateCcw className="h-4 w-4 mr-2"/>Restart</Button>
        <Button type="button" variant="secondary" onClick={()=>setScanning((s)=>!s)}><Zap className="h-4 w-4 mr-2"/>{scanning ? "Pause" : "Resume"}</Button>
      </div>
    </div>
  )
}
