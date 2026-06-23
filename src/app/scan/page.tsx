"use client";

import { Suspense, useEffect, useState } from "react";
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
    <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-100">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        <div className="text-sm text-slate-500">Initializing camera…</div>
      </div>
    </div>
  ),
});

function ScanContent() {
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

    // Otherwise fetch from database API
    fetch(`/api/products?barcode=${encodeURIComponent(barcodeParam)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        if (data.products && data.products.length > 0) {
          // Fetch full product details
          const firstProduct = data.products[0];
          return fetch(`/api/products/${firstProduct.id}`).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch full product details");
            return res.json();
          });
        } else {
          setProduct(null);
          setError(true);
          setLoading(false);
        }
      })
      .then((fullProduct) => {
        if (fullProduct) {
          setProduct(fullProduct);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProduct(null);
        setError(true);
        setLoading(false);
      });
  }, [barcodeParam]);

  if (barcodeParam && loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
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
          <Link href="/scan" className="text-sm font-medium text-brand-600">Scan another →</Link>
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
        <h2 className="text-sm font-semibold text-slate-800 mb-3">Recent scans</h2>
        <RecentScans />
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading scanner…</div>}>
      <ScanContent />
    </Suspense>
  );
}
