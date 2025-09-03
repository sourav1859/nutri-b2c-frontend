// lib/barcode.ts
import type { Product } from "./types"

export type BarcodeResult = {
  value: string;
  format?: string;   // <- make optional
  raw?: unknown;     // (keep if you added this earlier)
};

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

/** Lazy-load ZXing only at runtime (won't break build if missing). */
export async function loadZxing() {
  try {
    const dyn = new Function("m", "return import(m)") as (m: string) => Promise<any>;
    const ZX = await dyn("@zxing/library");
    // ESM/CJS safe
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (ZX as any)?.default ?? ZX;
  } catch (e) {
    console.warn("ZXing not available:", e);
    return null;
  }
}

/** Lazy-load Quagga only at runtime; try common forks. */
export async function loadQuagga() {
  try {
    const dyn = new Function("m", "return import(m)") as (m: string) => Promise<any>;
    for (const name of ["@ericblade/quagga2", "quagga2", "quagga"]) {
      try {
        const Q = await dyn(name);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (Q as any)?.default ?? Q;
      } catch {}
    }
    console.warn("Quagga not available (no variant found).");
    return null;
  } catch (e) {
    console.warn("Quagga dynamic import failed:", e);
    return null;
  }
}

/** Lookup a product by UPC using the mock API, then fallback to local JSON. */
export async function lookupProduct(upc: string) {
  try {
    // 1) the route that exists in your tree
    const res = await fetch("/_mock/barcodes");
    if (res.ok) {
      const data = await res.json();
      return (data as Record<string, any>)[upc] ?? null;
    }
  } catch {}
  try {
    // 2) alternate mock path (also present)
    const r2 = await fetch("/mock-api/mock/barcodes");
    if (r2.ok) {
      const data = await r2.json();
      return (data as Record<string, any>)[upc] ?? null;
    }
  } catch {}
  try {
    // 3) final fallback to the local JSON file
    const offline = await import("../app/_mock/barcodes.json");
    const map = (offline as any).default ?? offline;
    return map[upc] ?? null;
  } catch (e) {
    console.error("lookup error:", e);
    return null;
  }
}

/** Basic validation for EAN-8, UPC-A/EAN-13 lengths. */
export function validateBarcode(v: string) {
  return /^\d{8}$|^\d{12}$|^\d{13}$/.test(v || "")
}
