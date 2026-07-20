import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export const metadata: Metadata = {
  title: "Search Products — Find Nutrition Facts | JeevanReport",
  description:
    "Search 3 million+ products by name, brand, barcode, category, or ingredient. Get instant nutrition facts, shrinkflation alerts, and trust scores.",
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h1 className="text-3xl font-bold text-slate-900">Search Products</h1>
          <p className="mt-2 text-slate-600">Live search by barcode, product name, brand, category, or ingredient keyword</p>
          <div className="mt-6 space-y-4">
            <div className="shimmer h-14 w-full rounded-xl" />
            <div className="shimmer h-28 w-full rounded-xl" />
            <div className="grid gap-6 sm:grid-cols-2 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="shimmer h-48 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}
