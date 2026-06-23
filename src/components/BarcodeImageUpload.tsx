"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BarcodeImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setError(null);

    try {
      const objectUrl = URL.createObjectURL(file);
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      const result = await reader.decodeFromImageUrl(objectUrl);
      URL.revokeObjectURL(objectUrl);
      const code = result.getText().replace(/\D/g, "");
      if (code.length >= 8) {
        router.push(`/scan?barcode=${encodeURIComponent(code)}`);
      } else {
        setError("Barcode found but too short. Try manual entry.");
      }
    } catch {
      setError("Could not read a barcode from this image. Try better lighting or manual entry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2 className="text-sm font-semibold text-slate-800">Upload packaging photo</h2>
      <p className="mt-1 text-xs text-slate-500">We&apos;ll decode the barcode from your photo automatically</p>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleUpload}
        disabled={loading}
        className="mt-3 text-sm"
      />
      {loading && (
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
          Decoding barcode…
        </div>
      )}
      {error && <p className="mt-3 text-sm text-amber-700">{error}</p>}
      {preview && !loading && (
        <div className="relative mt-3 h-40 w-full overflow-hidden rounded-lg bg-slate-100">
          <Image src={preview} alt="Upload preview" fill className="object-contain" unoptimized />
        </div>
      )}
    </div>
  );
}
