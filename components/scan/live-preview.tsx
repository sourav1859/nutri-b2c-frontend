"use client";

import { useEffect, useRef } from "react";
import type { BarcodeResult } from "@/lib/barcode"; // <-- use the shared type

type LivePreviewProps = {
  deviceId?: string;
  onDetected: (r: BarcodeResult) => void | Promise<void>; // <-- allow async
  onError: (e: Error) => void;
};

export function LivePreview({ deviceId, onDetected, onError }: LivePreviewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Normalize any vendor/library result to the shared shape
  function normalize(raw: any): BarcodeResult {
    if (typeof raw?.value === "string") {
      return { value: raw.value, format: raw.format, raw };
    }
    // common alt field is "text"
    if (typeof raw?.text === "string") {
      return { value: raw.text, format: raw.format, raw };
    }
    return { value: String(raw ?? ""), raw };
  }

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const constraints: MediaStreamConstraints = {
          video: deviceId
            ? { deviceId: { exact: deviceId } }
            : { facingMode: { ideal: "environment" } },
          audio: false,
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (cancelled) return;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // TODO: hook your barcode library here. When it yields a result `raw`,
        // call: onDetected(normalize(raw));
      } catch (e: any) {
        if (!cancelled) onError(e instanceof Error ? e : new Error(String(e)));
      }
    }

    start();
    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [deviceId, onError]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <video ref={videoRef} className="w-full h-auto" muted playsInline />
    </div>
  );
}

export default LivePreview;
