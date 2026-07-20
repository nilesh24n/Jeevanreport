import type { Metadata } from "next";
import { Suspense } from "react";
import ScanPageClient from "./ScanPageClient";

export const metadata: Metadata = {
  title: "Scan Product Barcode — JeevanReport India",
  description:
    "Point your camera at any product barcode and instantly get nutrition facts, ingredient analysis, shrinkflation history, and trust score. Free forever.",
};

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Scan a Product</h1>
            <p className="mt-2 text-slate-600">Point your camera at a barcode or enter it manually</p>
          </div>
          {/* Skeleton scanner box */}
          <div className="shimmer aspect-video w-full rounded-xl mb-4" />
          <div className="shimmer h-12 w-full rounded-xl mb-4" />
          <div className="flex gap-2">
            <div className="shimmer flex-1 h-12 rounded-xl" />
            <div className="shimmer w-24 h-12 rounded-xl" />
          </div>
        </div>
      }
    >
      <ScanPageClient />
    </Suspense>
  );
}
