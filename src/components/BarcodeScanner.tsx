"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function BarcodeScanner({ onDetected }: { onDetected?: (code: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const router = useRouter();

  const handleCode = useCallback(
    (code: string) => {
      if (onDetected) {
        onDetected(code);
      } else {
        router.push(`/scan?barcode=${encodeURIComponent(code)}`);
      }
    },
    [onDetected, router]
  );

  useEffect(() => {
    let cancelled = false;

    async function startScanner() {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader();
        setScanning(true);
        setError(null);

        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const backCam = devices.find((d) => /back|rear|environment/i.test(d.label)) ?? devices[0];

        if (!videoRef.current || cancelled) return;

        const controls = await reader.decodeFromVideoDevice(
          backCam?.deviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              const code = result.getText();
              controlsRef.current?.stop();
              setScanning(false);
              handleCode(code);
            }
            if (err && err.name !== "NotFoundException") {
              // continuous scan noise
            }
          }
        );
        controlsRef.current = controls;
      } catch {
        if (!cancelled) {
          setError("Camera access unavailable. Use manual entry or upload instead.");
          setScanning(false);
        }
      }
    }

    startScanner();
    return () => {
      cancelled = true;
      controlsRef.current?.stop();
    };
  }, [handleCode]);

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = manualCode.replace(/\D/g, "");
    if (code.length >= 8) handleCode(code);
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-brand-300 bg-slate-900">
        <video ref={videoRef} className="aspect-video w-full object-cover" playsInline muted />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-40 w-64 rounded-lg border-2 border-brand-400/60" />
        </div>
        {scanning && (
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <span className="rounded-full bg-brand-600/90 px-3 py-1 text-xs font-medium text-white">
              Scanning… point at barcode
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <input
          type="text"
          className="input-field flex-1 font-mono"
          placeholder="Or enter barcode manually..."
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
        />
        <button type="submit" className="btn-primary">Look Up</button>
      </form>

      <p className="text-xs text-slate-500">
        Supported: UPC-A, EAN-13, EAN-8, Code 128. Tip: hold steady 6–8 inches from label.
      </p>
    </div>
  );
}
