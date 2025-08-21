"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { BarcodeResult, BarcodeEngine } from "@/lib/barcode"
import { detectBarcodeSupport } from "@/lib/barcode"

type Permission = "prompt" | "granted" | "denied"

type ScannerState = {
  permission: Permission
  engine: BarcodeEngine | null
  devices: MediaDeviceInfo[]
  activeDeviceId: string | null
  torchAvailable: boolean
  isScanning: boolean
  lastResult: BarcodeResult | null
  error: string | null
}

const SCAN_HISTORY_KEY = "nutri_scan_history_v1"

export function useBarcodeScanner() {
  const [state, setState] = useState<ScannerState>({
    permission: "prompt",
    engine: null,
    devices: [],
    activeDeviceId: null,
    torchAvailable: false,
    isScanning: false,
    lastResult: null,
    error: null,
  })

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } },
      })

      // Stop the stream immediately, we just wanted to check permission
      stream.getTracks().forEach((track) => track.stop())

      setState((prev) => ({ ...prev, permission: "granted" }))
      return true
    } catch (error) {
      // Try without exact constraint
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        stream.getTracks().forEach((track) => track.stop())
        setState((prev) => ({ ...prev, permission: "granted" }))
        return true
      } catch {
        setState((prev) => ({ ...prev, permission: "denied", error: "Camera access denied" }))
        return false
      }
    }
  }, [])

  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((device) => device.kind === "videoinput")
      setState((prev) => ({ ...prev, devices: videoDevices }))
      return videoDevices
    } catch (error) {
      setState((prev) => ({ ...prev, error: "Failed to enumerate devices" }))
      return []
    }
  }, [])

  const startScanning = useCallback(
    async (deviceId?: string) => {
      if (state.permission !== "granted") {
        const granted = await requestPermission()
        if (!granted) return false
      }

      try {
        const constraints: MediaStreamConstraints = {
          video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "environment" },
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        // Check for torch capability
        const track = stream.getVideoTracks()[0]
        const capabilities = track.getCapabilities?.()
        const torchAvailable = !!(capabilities && "torch" in capabilities)

        setState((prev) => ({
          ...prev,
          isScanning: true,
          activeDeviceId: deviceId || null,
          torchAvailable,
          error: null,
        }))

        return true
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to start camera",
        }))
        return false
      }
    },
    [state.permission, requestPermission],
  )

  const stopScanning = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setState((prev) => ({
      ...prev,
      isScanning: false,
      activeDeviceId: null,
      torchAvailable: false,
    }))
  }, [])

  const toggleTorch = useCallback(async (enabled: boolean) => {
    if (!streamRef.current) return false

    try {
      const track = streamRef.current.getVideoTracks()[0]
      await track.applyConstraints({
        advanced: [{ torch: enabled } as any],
      })
      return true
    } catch (error) {
      console.warn("Failed to toggle torch:", error)
      return false
    }
  }, [])

  const saveToHistory = useCallback((result: BarcodeResult) => {
    try {
      const history = JSON.parse(localStorage.getItem(SCAN_HISTORY_KEY) || "[]")
      const newScan = {
        ts: new Date().toISOString(),
        format: result.format,
        value: result.value,
      }

      // Keep only last 10 scans
      const updated = [newScan, ...history].slice(0, 10)
      localStorage.setItem(SCAN_HISTORY_KEY, JSON.stringify(updated))
    } catch (error) {
      console.warn("Failed to save scan to history:", error)
    }
  }, [])

  const getHistory = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(SCAN_HISTORY_KEY) || "[]")
    } catch {
      return []
    }
  }, [])

  // Initialize supported engines
  useEffect(() => {
    detectBarcodeSupport().then((engines) => {
      setState((prev) => ({
        ...prev,
        engine: engines[0] || null,
      }))
    })
  }, [])

  return {
    ...state,
    videoRef,
    requestPermission,
    getDevices,
    startScanning,
    stopScanning,
    toggleTorch,
    saveToHistory,
    getHistory,
    setResult: (result: BarcodeResult | null) => setState((prev) => ({ ...prev, lastResult: result })),
    clearError: () => setState((prev) => ({ ...prev, error: null })),
  }
}
