// lib/barcode.ts
import type { Product } from "./types"

export type BarcodeResult = { format: string; value: string }

/** Detect which engines are available at runtime (native/zxing/quagga). */
export async function detectBarcodeSupport() {
  const engines: string[] = []
  try {
    if (typeof window !== "undefined" && "BarcodeDetector" in window) {
      engines.push("native")
    }
  } catch {}
  try {
    const z = await loadZxing()
    if (z) engines.push("zxing")
  } catch {}
  try {
    const q = await loadQuagga()
    if (q) engines.push("quagga")
  } catch {}
  return engines
}

/** Lazy-load ZXing. Safe even if the package is not installed. */
export async function loadZxing() {
  try {
    // @ts-ignore - package may not be installed; we handle at runtime
    const ZX = await import("@zxing/library")
    return ZX
  } catch (e) {
    console.warn("ZXing not available:", e)
    return null
  }
}

/** Lazy-load quagga2. Safe even if the package is not installed. */
export async function loadQuagga() {
  try {
    // @ts-ignore - package may not be installed; we handle at runtime
    const Q = await import("quagga2")
    // some bundlers expose default
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (Q as any)?.default ?? Q
  } catch (e) {
    console.warn("Quagga not available:", e)
    return null
  }
}

/** Lookup a product by UPC using the mock API, then fallback to local JSON. */
export async function lookupProduct(upc: string): Promise<Product | null> {
  try {
    const res = await fetch("/api/mock/barcodes")
    if (res.ok) {
      const data = await res.json()
      return data[upc] || null
    }
  } catch {}
  try {
    // Fallback to the local mock JSON (works in dev and offline)
    const offline = await import("../app/_mock/barcodes.json")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = (offline as any).default ?? offline
    return map[upc] || null
  } catch (e) {
    console.error("lookup error:", e)
    return null
  }
}

/** Basic validation for EAN-8, UPC-A/EAN-13 lengths. */
export function validateBarcode(v: string) {
  return /^\d{8}$|^\d{12}$|^\d{13}$/.test(v || "")
}
