"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "./ProductCard";
import { countries, categories } from "@/lib/data/products";
import type { Product } from "@/lib/types";

export default function LiveSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [country, setCountry] = useState("India"); // India is the default country
  const [category, setCategory] = useState("");
  const [nutritionFlag, setNutritionFlag] = useState("");
  const [changeType, setChangeType] = useState("");
  const [minTrustScore, setMinTrustScore] = useState(0);
  const [brand, setBrand] = useState("");

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (country) params.set("country", country);
    if (category) params.set("category", category);
    if (nutritionFlag) params.set("nutritionFlag", nutritionFlag);
    if (changeType) params.set("changeType", changeType);
    if (brand.trim()) params.set("brand", brand.trim());
    if (minTrustScore) params.set("minTrustScore", minTrustScore.toString());

    const timer = setTimeout(() => {
      fetch(`/api/products?${params.toString()}`)
        .then((res) => {
          if (!res.ok) throw new Error("Search failed");
          return res.json();
        })
        .then((data) => {
          setResults(data.products || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }, 300); // 300ms debounce to prevent spamming queries

    return () => clearTimeout(timer);
  }, [query, country, category, nutritionFlag, changeType, brand, minTrustScore]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (/^\d{8,14}$/.test(trimmed.replace(/\D/g, ""))) {
      router.push(`/scan?barcode=${encodeURIComponent(trimmed.replace(/\D/g, ""))}`);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="search"
            className="input-field pl-4"
            placeholder="Search by barcode, name, brand, category, or ingredient keyword…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary whitespace-nowrap">Search</button>
      </form>

      <div className="card grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 bg-slate-50/50">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-450 text-slate-500">Country</label>
          <select className="input-field mt-1.5" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All countries</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
          <select className="input-field mt-1.5" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Nutrition Flag</label>
          <select className="input-field mt-1.5" value={nutritionFlag} onChange={(e) => setNutritionFlag(e.target.value)}>
            <option value="">Any profile</option>
            <option value="high sugar">High sugar</option>
            <option value="high sodium">High sodium</option>
            <option value="low protein">Low protein</option>
            <option value="calorie">Calorie dense</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Change Type</label>
          <select className="input-field mt-1.5" value={changeType} onChange={(e) => setChangeType(e.target.value)}>
            <option value="">Any change</option>
            <option value="shrinkflation">Smaller pack (Shrinkflation)</option>
            <option value="formula">Formula changed</option>
            <option value="price">Unit price up</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Min Trust Score</label>
          <select className="input-field mt-1.5" value={minTrustScore} onChange={(e) => setMinTrustScore(Number(e.target.value))}>
            <option value="0">Any trust level</option>
            <option value="70">Community verified (70%+)</option>
            <option value="90">Fully Verified (90%+)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Brand</label>
          <input className="input-field mt-1.5" placeholder="Brand name" value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-500">
            Showing {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
          {loading && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
          )}
        </div>
        <span className="text-xs font-bold text-success-600 bg-success-50 border border-success-100/30 px-3 py-1 rounded-lg">
          ⚡ India-focused results prioritized first
        </span>
      </div>

      <div className={`mt-4 grid gap-6 sm:grid-cols-2 transition-opacity duration-200 ${loading ? "opacity-60" : "opacity-100"}`}>
        {results.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      
      {results.length === 0 && !loading && (
        <div className="card text-center py-16 bg-slate-50/50">
          <p className="text-slate-500 font-medium text-base">No matching products found.</p>
          <p className="text-xs text-slate-400 mt-1">Try modifying your query or selecting another country/category.</p>
        </div>
      )}
    </div>
  );
}
