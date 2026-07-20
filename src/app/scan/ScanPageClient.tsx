"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import ScanResult from "@/components/ScanResult";
import BarcodeNotFound from "@/components/BarcodeNotFound";
import RecentScans from "@/components/RecentScans";
import BarcodeImageUpload from "@/components/BarcodeImageUpload";
import { getProductByBarcode } from "@/lib/data/products";
import type { Product } from "@/lib/types";

const BarcodeScanner = dynamic(() => import("@/components/BarcodeScanner"), {
  ssr: false,
  loading: () => (
    <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-brand-300 bg-slate-900 aspect-video flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-400" />
        <div className="text-sm font-medium opacity-70">Initializing camera…</div>
      </div>
    </div>
  ),
});

export default function ScanPageClient() {
  const searchParams = useSearchParams();
  const barcodeParam = searchParams.get("barcode");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!barcodeParam) {
      setProduct(null);
      setLoading(false);
      setError(false);
      return;
    }

    setLoading(true);
    setError(false);

    // Look in mock products first for speed
    const mockProduct = getProductByBarcode(barcodeParam);
    if (mockProduct) {
      setProduct(mockProduct);
      setLoading(false);
      return;
    }

    // Otherwise fetch from database API with retry logic
    let attempts = 0;
    const maxAttempts = 3;

    async function tryFetch() {
      while (attempts < maxAttempts) {
        attempts++;
        try {
          const res = await fetch(`/api/products?barcode=${encodeURIComponent(barcodeParam!)}`);
          if (!res.ok) throw new Error("Failed to fetch product");
          const data = await res.json();

          if (!data.products || data.products.length === 0) {
            setProduct(null);
            setError(true);
            setLoading(false);
            return;
          }

          const firstProduct = data.products[0];
          const detailRes = await fetch(`/api/products/${firstProduct.id}`);
          if (!detailRes.ok) throw new Error("Failed to fetch full product details");
          const fullProduct = await detailRes.json();

          setProduct(fullProduct);
          setLoading(false);
          return;
        } catch (err) {
          if (attempts >= maxAttempts) {
            console.error(err);
            setProduct(null);
            setError(true);
            setLoading(false);
          } else {
            // Exponential backoff
            await new Promise((r) => setTimeout(r, 300 * Math.pow(2, attempts - 1)));
          }
        }
      }
    }

    tryFetch();
  }, [barcodeParam]);

  if (barcodeParam && loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
          <div className="text-sm font-semibold">Querying product transparency database…</div>
        </div>
      </div>
    );
  }

  if (barcodeParam && error) {
    return <BarcodeNotFound barcode={barcodeParam} />;
  }

  if (product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Scan Result</h1>
          <Link href="/scan" className="text-sm font-medium text-brand-600">
            Scan another →
          </Link>
        </div>
        <ScanResult product={product} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Scan a Product</h1>
        <p className="mt-2 text-slate-600">Point your camera at a barcode or enter it manually</p>
      </div>

      <BarcodeScanner />

      {/* Manual entry — always visible, no scrolling needed */}
      <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50/30 p-4">
        <p className="text-xs font-semibold text-brand-700 mb-2">📝 Or enter barcode manually</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.currentTarget.elements.namedItem("manual") as HTMLInputElement)?.value;
            const code = input?.replace(/\D/g, "");
            if (code && code.length >= 8) {
              window.location.href = `/scan?barcode=${encodeURIComponent(code)}`;
            }
          }}
          className="flex gap-2"
        >
          <input
            name="manual"
            type="text"
            inputMode="numeric"
            className="input-field flex-1 font-mono text-base"
            placeholder="e.g. 8901058002478"
            style={{ fontSize: "16px" }}
          />
          <button type="submit" className="btn-primary whitespace-nowrap min-h-[48px]">
            Search
          </button>
        </form>
      </div>

      <div className="mt-6">
        <BarcodeImageUpload />
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Quick scan tips</h2>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>• Hold the barcode 6–8 inches from the camera</li>
          <li>• Ensure good lighting and avoid glare on glossy packaging</li>
          <li>• Try manual entry if the camera can&apos;t focus</li>
          <li>• Works with UPC-A, EAN-13, EAN-8, and Code 128 formats</li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Recently Scanned</h2>
        <RecentScans />
      </div>
    </div>
  );
}
