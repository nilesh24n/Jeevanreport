"use client";

import { useState } from "react";
import type { ChangeFeedItem } from "@/lib/types";
import { changeFeed, countries } from "@/lib/data/products";
import Link from "next/link";
import Badge from "./Badge";

const typeLabels: Record<string, { label: string; variant: "warning" | "brand" | "success" | "neutral" }> = {
  shrinkflation: { label: "Shrinkflation", variant: "warning" },
  formula: { label: "Formula change", variant: "brand" },
  price: { label: "Price increase", variant: "warning" },
  trending: { label: "Trending", variant: "success" },
  new_scan: { label: "New scan", variant: "neutral" },
};

export default function ChangeFeedFilters() {
  const [type, setType] = useState<ChangeFeedItem["type"] | "">("");
  const [country, setCountry] = useState("");

  const filtered = changeFeed.filter((item) => {
    if (type && item.type !== type) return false;
    if (country && item.country !== country) return false;
    return true;
  });

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4">
        <select
          className="input-field w-auto text-sm"
          value={type}
          onChange={(e) => setType(e.target.value as ChangeFeedItem["type"] | "")}
        >
          <option value="">All change types</option>
          <option value="shrinkflation">Shrinkflation</option>
          <option value="formula">Formula change</option>
          <option value="price">Price increase</option>
          <option value="trending">Trending</option>
          <option value="new_scan">New scan</option>
        </select>
        <select className="input-field w-auto text-sm" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">All countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="self-center text-sm text-slate-500">{filtered.length} reports</span>
      </div>

      <div className="mt-4 space-y-3">
        {filtered.map((item) => {
          const meta = typeLabels[item.type] || typeLabels.new_scan;
          return (
            <Link
              key={item.id}
              href={`/products/${item.productId}`}
              className="card flex items-center justify-between hover:border-brand-200 transition"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge label={meta.label} variant={meta.variant} />
                  <span className="font-medium">{item.productName}</span>
                  <span className="text-xs text-slate-400">· {item.brand}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
                <p className="text-xs text-slate-400">{item.country} · {item.date}</p>
              </div>
              <div className="text-sm font-semibold text-brand-600 flex-shrink-0 ml-4">{item.trustScore}%</div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
