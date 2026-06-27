"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// Ambient light threshold (lux) below which torch is auto-enabled
const DARK_LUX_THRESHOLD = 50;

// AmbientLightSensor is not in the standard TS lib — define a minimal interface
interface AmbientLightSensor {
  illuminance: number;
  start(): void;
  stop(): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}
interface AmbientLightSensorConstructor {
  new (options?: { frequency?: number }): AmbientLightSensor;
}

export default function BarcodeScanner({ onDetected }: { onDetected?: (code: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lightSensorRef = useRef<AmbientLightSensor | null>(null);

  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [lightLevel, setLightLevel] = useState<number | null>(null);

  const router = useRouter();

  const handleCode = useCallback(
    (code: string) => {
      // Turn off torch on successful scan
      disableTorch();
      if (onDetected) {
        onDetected(code);
      } else {
        router.push(`/scan?barcode=${encodeURIComponent(code)}`);
      }
    },
    [onDetected, router]
  );

  // ─── Torch Control ─────────────────────────────────────────────────────────

  async function enableTorch() {
    if (!streamRef.current) return;
    const [track] = streamRef.current.getVideoTracks();
    if (!track) return;
    try {
      // @ts-expect-error: torch is not in the TS lib yet
      await track.applyConstraints({ advanced: [{ torch: true }] });
      setTorchOn(true);
    } catch {
      // torch not supported on this device
    }
  }

  function disableTorch() {
    if (!streamRef.current) return;
    const [track] = streamRef.current.getVideoTracks();
    if (!track) return;
    try {
      // @ts-expect-error: torch is not in the TS lib yet
      track.applyConstraints({ advanced: [{ torch: false }] });
    } catch {
      // ignore
    }
    setTorchOn(false);
  }

  async function toggleTorch() {
    if (torchOn) {
      disableTorch();
    } else {
      await enableTorch();
    }
  }

  // ─── Check torch capability ────────────────────────────────────────────────

  function checkTorchCapability(stream: MediaStream) {
    const [track] = stream.getVideoTracks();
    if (!track) return;
    const capabilities = track.getCapabilities() as MediaTrackCapabilities & { torch?: boolean };
    if (capabilities.torch) {
      setTorchSupported(true);
    }
  }

  // ─── Ambient Light Sensor ──────────────────────────────────────────────────

  function startAmbientLightSensor() {
    const ALS = (window as Window & { AmbientLightSensor?: AmbientLightSensorConstructor }).AmbientLightSensor;
    if (!ALS) return; // not supported — fallback to manual toggle button

    try {
      const sensor = new ALS({ frequency: 2 });
      sensor.addEventListener("reading", () => {
        const lux = sensor.illuminance ?? null;
        setLightLevel(lux);
        if (lux !== null && lux < DARK_LUX_THRESHOLD) {
          enableTorch();
        }
      });
      sensor.addEventListener("error", () => {
        // Sensor permission denied or unavailable — use manual toggle
      });
      sensor.start();
      lightSensorRef.current = sensor;
    } catch {
      // AmbientLightSensor constructor failed
    }
  }

  // ─── Scanner Start ─────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function startScanner() {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader();
        setScanning(true);
        setError(null);

        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        const backCam =
          devices.find((d) => /back|rear|environment/i.test(d.label)) ?? devices[0];

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
              // continuous scan noise — ignore
            }
          }
        );
        controlsRef.current = controls;

        // Grab the stream from the video element for torch control
        if (videoRef.current?.srcObject instanceof MediaStream) {
          streamRef.current = videoRef.current.srcObject;
          checkTorchCapability(streamRef.current);
          // Start ambient light sensing
          startAmbientLightSensor();
        }
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
      disableTorch();
      lightSensorRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleCode]);

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = manualCode.replace(/\D/g, "");
    if (code.length >= 8) handleCode(code);
  }

  return (
    <div className="space-y-4">
      {/* Camera viewfinder */}
      <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-brand-300 bg-slate-900">
        <video ref={videoRef} className="aspect-video w-full object-cover" playsInline muted />

        {/* Targeting overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-40 w-64 rounded-lg border-2 border-brand-400/60" />
        </div>

        {/* Scanning status */}
        {scanning && (
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <span className="rounded-full bg-brand-600/90 px-3 py-1 text-xs font-medium text-white">
              Scanning… point at barcode
            </span>
          </div>
        )}

        {/* Torch button — shown if torch is supported */}
        {torchSupported && (
          <button
            id="scanner-torch-toggle"
            onClick={toggleTorch}
            aria-label={torchOn ? "Turn off flashlight" : "Turn on flashlight"}
            className={`absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg transition-all duration-200 ${
              torchOn
                ? "bg-yellow-400 border-yellow-300 text-yellow-900"
                : "bg-slate-800/70 border-slate-600 text-white hover:bg-slate-700/80"
            }`}
          >
            <span className="text-lg">🔦</span>
          </button>
        )}

        {/* Light level indicator (debug, hidden in production) */}
        {process.env.NODE_ENV === "development" && lightLevel !== null && (
          <div className="absolute top-3 left-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white font-mono">
            {Math.round(lightLevel)} lux
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {/* Manual torch toggle fallback — shown when torch is supported but AmbientLightSensor is not */}
      {torchSupported && !lightSensorRef.current && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm">
          <span className="text-slate-600 font-medium">🔦 Flashlight</span>
          <button
            onClick={toggleTorch}
            className={`rounded-lg px-3 py-1 text-xs font-bold transition-all duration-200 ${
              torchOn
                ? "bg-yellow-400 text-yellow-900"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {torchOn ? "ON" : "OFF"}
          </button>
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
