"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { categories, countries } from "@/lib/data/products";
import Link from "next/link";
import type { Product } from "@/lib/types";

type SortKey = "name" | "trust" | "calories" | "changes";

export default function ProductBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState<SortKey>("name");
  const [onlyChanged, setOnlyChanged] = useState(false);

  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    if (country) params.set("country", country);
    if (sort) params.set("sort", sort);
    if (onlyChanged) params.set("onlyChanged", "true");

    const timer = setTimeout(() => {
      fetch(`/api/products?${params.toString()}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch products");
          return res.json();
        })
        .then((data) => {
          setFiltered(data.products || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setFiltered([]);
          setLoading(false);
        });
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query, category, country, sort, onlyChanged]);

  return (
    <>
      <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label className="text-xs font-medium text-slate-600">Search</label>
          <input
            className="input-field mt-1"
            placeholder="Name, brand, barcode…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Category</label>
          <select className="input-field mt-1" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Country</label>
          <select className="input-field mt-1" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600">Sort by</label>
          <select className="input-field mt-1" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="name">Name</option>
            <option value="trust">Trust score</option>
            <option value="calories">Calories</option>
            <option value="changes">Most changes</option>
          </select>
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
        <input
          type="checkbox"
          checked={onlyChanged}
          onChange={(e) => setOnlyChanged(e.target.checked)}
          className="rounded border-slate-300 text-brand-600"
        />
        Only products with pack or formula changes
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link key={c.slug} href={`/categories/${c.slug}`} className="badge-brand">
            {c.icon} {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2">
        <p className="text-sm text-slate-500">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>
        {loading && (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        )}
      </div>
      <div className={`mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${loading ? "opacity-60" : "opacity-100"}`}>
        {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
