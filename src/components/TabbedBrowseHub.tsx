"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllBrands } from "@/lib/brands";
import { countries, categories } from "@/lib/data/products";

const countryFlags: Record<string, string> = {
  USA: "🇺🇸", UK: "🇬🇧", Canada: "🇨🇦", Australia: "🇦🇺", Japan: "🇯🇵", India: "🇮🇳",
};

const TABS = ["Countries", "Brands", "Categories"] as const;
type Tab = (typeof TABS)[number];

export default function TabbedBrowseHub() {
  const [activeTab, setActiveTab] = useState<Tab>("Countries");
  const topBrands = getAllBrands().slice(0, 8);

  return (
    <div className="rounded-3xl border border-latte bg-white shadow-card overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-latte">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold transition-all duration-200 ${
              activeTab === tab
                ? "border-b-2 border-brand-600 text-brand-700 bg-brand-50/30"
                : "text-espresso/50 hover:text-espresso hover:bg-brand-50/20"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {activeTab === "Countries" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {countries.map((c) => (
                <Link
                  key={c}
                  href={`/countries/${c}`}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold bg-brand-50 text-brand-700 border border-brand-100 hover:bg-brand-100 transition-colors"
                >
                  {countryFlags[c] ?? "🌍"} {c}
                </Link>
              ))}
            </div>
            <Link href="/countries" className="text-sm font-bold text-brand-600 hover:text-brand-700">
              View all countries →
            </Link>
          </div>
        )}
        {activeTab === "Brands" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {topBrands.map((b) => (
                <Link
                  key={b.slug}
                  href={`/brands/${b.slug}`}
                  className="badge-neutral hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors text-sm"
                >
                  {b.name}
                </Link>
              ))}
            </div>
            <Link href="/brands" className="text-sm font-bold text-brand-600 hover:text-brand-700">
              View all brands →
            </Link>
          </div>
        )}
        {activeTab === "Categories" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 8).map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className="badge-neutral hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-colors text-sm"
                >
                  {c.icon} {c.name}
                </Link>
              ))}
            </div>
            <Link href="/categories" className="text-sm font-bold text-brand-600 hover:text-brand-700">
              View all categories →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
