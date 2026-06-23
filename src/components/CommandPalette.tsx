"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/lib/data/products";

const pages = [
  { label: "Home", href: "/" },
  { label: "Scan product", href: "/scan" },
  { label: "Search products", href: "/search" },
  { label: "All products", href: "/products" },
  { label: "Countries", href: "/countries" },
  { label: "Brands", href: "/brands" },
  { label: "Ingredient glossary", href: "/ingredients" },
  { label: "Latest changes", href: "/latest-changes" },
  { label: "Compare", href: "/compare" },
  { label: "Submit evidence", href: "/submit" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Methodology", href: "/methodology" },
  { label: "API docs", href: "/api-docs" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const productResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return products.slice(0, 6);
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.barcode.includes(q)
    ).slice(0, 8);
  }, [query]);

  const pageResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return pages.slice(0, 6);
    return pages.filter((p) => p.label.toLowerCase().includes(q));
  }, [query]);

  function navigate(href: string) {
    router.push(href);
    setOpen(false);
    setQuery("");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[15vh]">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
        <input
          type="text"
          className="w-full border-b border-slate-200 px-4 py-4 text-base outline-none"
          placeholder="Search products, pages, barcodes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="max-h-80 overflow-y-auto p-2">
          {pageResults.length > 0 && (
            <div className="mb-2">
              <p className="px-2 py-1 text-xs font-semibold uppercase text-slate-400">Pages</p>
              {pageResults.map((p) => (
                <button
                  key={p.href}
                  type="button"
                  onClick={() => navigate(p.href)}
                  className="flex w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          {productResults.length > 0 && (
            <div>
              <p className="px-2 py-1 text-xs font-semibold uppercase text-slate-400">Products</p>
              {productResults.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="flex w-full flex-col rounded-lg px-3 py-2 text-left hover:bg-slate-100"
                >
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-slate-500">{p.brand} · {p.barcode}</span>
                </button>
              ))}
            </div>
          )}
          {/^\d{8,14}$/.test(query.replace(/\D/g, "")) && (
            <button
              type="button"
              onClick={() => navigate(`/scan?barcode=${query.replace(/\D/g, "")}`)}
              className="mt-2 flex w-full rounded-lg bg-brand-50 px-3 py-2 text-left text-sm font-medium text-brand-700 hover:bg-brand-100"
            >
              Scan barcode {query.replace(/\D/g, "")}
            </button>
          )}
        </div>
        <div className="border-t border-slate-100 px-4 py-2 text-xs text-slate-400">
          <kbd className="rounded bg-slate-100 px-1">↑↓</kbd> navigate · <kbd className="rounded bg-slate-100 px-1">esc</kbd> close · <kbd className="rounded bg-slate-100 px-1">⌘K</kbd> toggle
        </div>
      </div>
      <button type="button" className="absolute inset-0 -z-10" onClick={() => setOpen(false)} aria-label="Close" />
    </div>
  );
}
