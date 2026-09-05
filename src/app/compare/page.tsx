"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { products, getProductById, getLatestVersion } from "@/lib/data/products";
import Badge from "@/components/Badge";
import CompareExport from "@/components/CompareExport";

import type { Product } from "@/lib/types";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialIds = searchParams.get("ids")?.split(",").filter(Boolean) || [];
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialIds.length > 0 ? initialIds : [products[0].id, products[1].id]
  );
  const [selected, setSelected] = useState<Product[]>([]);

  useEffect(() => {
    if (selectedIds.length >= 2) {
      router.replace(`/compare?ids=${selectedIds.join(",")}`, { scroll: false });
    }
  }, [selectedIds, router]);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setSelected([]);
      return;
    }
    // Fetch products that are not already loaded
    Promise.all(
      selectedIds.map((id) => {
        const local = getProductById(id);
        if (local) return Promise.resolve(local);
        return fetch(`/api/products/${id}`)
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null);
      })
    ).then((results) => {
      setSelected(results.filter(Boolean) as Product[]);
    });
  }, [selectedIds]);

  const chartData = useMemo(() => {
    if (selected.length < 2) return [];
    return [
      {
        nutrient: "Calories",
        ...Object.fromEntries(
          selected.map((p) => [p.brand, getLatestVersion(p).nutrition.caloriesPerServing])
        ),
      },
      {
        nutrient: "Protein",
        ...Object.fromEntries(
          selected.map((p) => [p.brand, getLatestVersion(p).nutrition.protein])
        ),
      },
      {
        nutrient: "Sugar",
        ...Object.fromEntries(
          selected.map((p) => [p.brand, getLatestVersion(p).nutrition.sugar])
        ),
      },
      {
        nutrient: "Fiber",
        ...Object.fromEntries(
          selected.map((p) => [p.brand, getLatestVersion(p).nutrition.fiber])
        ),
      },
      {
        nutrient: "Sodium",
        ...Object.fromEntries(
          selected.map((p) => [p.brand, Math.round(getLatestVersion(p).nutrition.sodium / 10)])
        ),
      },
    ];
  }, [selected]);

  function toggleProduct(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  }

  const dimensions = [
    { label: "Calories/serving", get: (id: string) => selected.find((p) => p.id === id)?.versions.at(-1)?.nutrition.caloriesPerServing ?? 0 },
    { label: "Protein (g)", get: (id: string) => selected.find((p) => p.id === id)?.versions.at(-1)?.nutrition.protein ?? 0 },
    { label: "Sugar (g)", get: (id: string) => selected.find((p) => p.id === id)?.versions.at(-1)?.nutrition.sugar ?? 0 },
    { label: "Fiber (g)", get: (id: string) => selected.find((p) => p.id === id)?.versions.at(-1)?.nutrition.fiber ?? 0 },
    { label: "Sodium (mg)", get: (id: string) => selected.find((p) => p.id === id)?.versions.at(-1)?.nutrition.sodium ?? 0 },
    { label: "Full pack cal", get: (id: string) => selected.find((p) => p.id === id)?.versions.at(-1)?.nutrition.caloriesPerPack ?? 0 },
    { label: "Satiety", get: (id: string) => selected.find((p) => p.id === id)?.versions.at(-1)?.bodyImpact.satietyLabel ?? "" },
    { label: "Pack size", get: (id: string) => selected.find((p) => p.id === id)?.versions.at(-1)?.packSize ?? "" },
    { label: "Trust", get: (id: string) => `${selected.find((p) => p.id === id)?.trustScore ?? 0}%` },
    { label: "Changes", get: (id: string) => (selected.find((p) => p.id === id)?.packSizeChanges.length ?? 0) + (selected.find((p) => p.id === id)?.formulaChanges.length ?? 0) },
  ];

  const colors = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(searchQuery.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults((data.products || []).slice(0, 6));
          setSearching(false);
        })
        .catch(() => {
          setSearchResults([]);
          setSearching(false);
        });
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Compare Products</h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600">Select 2–4 products from the archive to compare side by side</p>
        </div>
        <CompareExport selected={selected} />
      </div>

      {/* Dynamic Product Search for comparison */}
      <div className="mt-6 card p-4 space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-espresso/50">Search & Add Product from Archive</label>
        <div className="relative">
          <input
            type="text"
            className="input-field"
            placeholder="Type any brand or product name to add to comparison..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searching && (
            <div className="absolute right-3 top-3.5 h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 pt-2">
            {searchResults.map((p) => {
              const isAdded = selectedIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    toggleProduct(p.id);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-left text-xs font-medium transition ${
                    isAdded ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 bg-white hover:border-brand-300"
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="font-semibold block truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-400">{p.brand}</span>
                  </div>
                  <span className="text-xs font-bold text-brand-600 flex-shrink-0">{isAdded ? "✓ Added" : "+ Add"}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Select Popular Pills */}
      <div className="mt-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Quick popular items:</span>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggleProduct(p.id)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                selectedIds.includes(p.id) ? "border-brand-600 bg-brand-50 text-brand-700 font-semibold" : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {selected.length >= 2 ? (
        <>
          {chartData.length > 0 && (
            <div className="card mt-8">
              <h2 className="font-semibold text-slate-900 mb-4">Nutrition comparison chart</h2>
              <p className="text-xs text-slate-500 mb-4">Sodium shown as mg÷10 for scale</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nutrient" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  {selected.map((p, i) => (
                    <Bar key={p!.id} dataKey={p!.brand} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left bg-slate-50 border">Dimension</th>
                  {selected.map((p) => (
                    <th key={p!.id} className="p-3 text-center bg-slate-50 border min-w-[160px]">
                      <div className="relative h-12 w-12 mx-auto mb-2 overflow-hidden rounded-lg">
                        <Image src={p!.imageUrl} alt="" fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="font-medium text-xs">{p!.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dimensions.map((d) => (
                  <tr key={d.label}>
                    <td className="p-3 font-medium border bg-slate-50">{d.label}</td>
                    {selected.map((p) => (
                      <td key={p!.id} className="p-3 text-center border">{d.get(p!.id)}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-3 font-medium border bg-slate-50">Badges</td>
                  {selected.map((p) => (
                    <td key={p!.id} className="p-3 border">
                      <div className="flex flex-wrap justify-center gap-1">
                        {p!.badges.slice(0, 3).map((b) => <Badge key={b} label={b} />)}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="card mt-8 text-center py-12 text-slate-500">Select at least 2 products to compare</div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading…</div>}>
      <CompareContent />
    </Suspense>
  );
}
