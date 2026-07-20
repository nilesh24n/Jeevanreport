"use client";

import { useSearchParams } from "next/navigation";
import LiveSearch from "@/components/LiveSearch";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Search Products</h1>
      <p className="mt-2 text-slate-600">
        Live search by barcode, product name, brand, category, or ingredient keyword
      </p>
      <div className="mt-6">
        <LiveSearch initialQuery={initialQuery} />
      </div>
    </div>
  );
}
