"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  SHRINKFLATION_METADATA,
  KEY_FINDINGS,
  DOCUMENTED_REDUCTIONS,
  CATEGORY_PACK_SHARES,
  CORPORATE_STATEMENTS,
  RESEARCH_SOURCES,
} from "@/lib/shrinkflation-data";

export default function ShrinkflationReportPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"cut" | "hike" | "price">("cut");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Calculator State
  const [calcOldSize, setCalcOldSize] = useState<number>(75);
  const [calcNewSize, setCalcNewSize] = useState<number>(70);
  const [calcPrice, setCalcPrice] = useState<number>(15);
  const [calcMonthlyPacks, setCalcMonthlyPacks] = useState<number>(10);

  // Filtered and sorted records
  const filteredRecords = useMemo(() => {
    return DOCUMENTED_REDUCTIONS.filter((item) => {
      const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.pricePoint.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "cut") return a.qtyChangePct - b.qtyChangePct; // More negative first
      if (sortBy === "hike") return b.pricePerUnitRisePct - a.pricePerUnitRisePct;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    if (pageSize >= filteredRecords.length) return filteredRecords;
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Calculator computations
  const calcQtyChangePct = useMemo(() => {
    if (calcOldSize <= 0 || calcNewSize <= 0) return 0;
    return (((calcNewSize - calcOldSize) / calcOldSize) * 100).toFixed(1);
  }, [calcOldSize, calcNewSize]);

  const calcPriceHikePct = useMemo(() => {
    if (calcOldSize <= 0 || calcNewSize <= 0) return 0;
    return (((calcOldSize / calcNewSize) - 1) * 100).toFixed(1);
  }, [calcOldSize, calcNewSize]);

  const calcOldPer100 = useMemo(() => {
    if (calcOldSize <= 0) return 0;
    return ((calcPrice / calcOldSize) * 100).toFixed(2);
  }, [calcPrice, calcOldSize]);

  const calcNewPer100 = useMemo(() => {
    if (calcNewSize <= 0) return 0;
    return ((calcPrice / calcNewSize) * 100).toFixed(2);
  }, [calcPrice, calcNewSize]);

  const calcMonthlyLoss = useMemo(() => {
    if (calcOldSize <= 0 || calcNewSize <= 0 || calcMonthlyPacks <= 0) return 0;
    const oldPricePerUnit = calcPrice / calcOldSize;
    const lostGramsPerPack = Math.max(0, calcOldSize - calcNewSize);
    return (lostGramsPerPack * oldPricePerUnit * calcMonthlyPacks).toFixed(1);
  }, [calcPrice, calcOldSize, calcNewSize, calcMonthlyPacks]);

  return (
    <div className="min-h-screen bg-canvas text-espresso">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-latte bg-brand-800 text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboard</Link>
            <span>/</span>
            <span className="text-white font-medium">Shrinkflation Report 2018–2026</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-200 border border-rose-400/30">
              <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
              Published 17 October 2026
            </span>
            <Link
              href="/leaderboard"
              className="rounded-lg bg-white/10 px-3 py-1 text-xs font-medium text-white hover:bg-white/20 transition-colors"
            >
              Browse Live Database →
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <header className="border-b border-latte bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800 border border-amber-200">
              <span>📊 Investigative FMCG Dossier</span>
              <span>·</span>
              <span>India Retail Intelligence</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-espresso">
              Shrinkflation in Indian Packaged Foods
            </h1>
            <p className="text-lg leading-relaxed text-espresso/70 sm:text-xl">
              Documented pack-size reductions, 2018–2026, compiled from published reports, distributor audits, and corporate statements.
            </p>
          </div>

          {/* Scope and honest limits callout */}
          <div className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50/70 to-orange-50/40 p-5 sm:p-6 text-sm text-espresso/80">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-amber-200/70 text-amber-900 font-bold">
                ℹ
              </div>
              <div className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900">Scope and Honest Limits</h2>
                <p className="leading-relaxed text-espresso/75">
                  {SHRINKFLATION_METADATA.scopeText}
                </p>
                <p className="text-xs text-amber-800/80 pt-1">
                  Confidence ratings (High, Medium, Low) indicate verification levels. Figures originate in news reports, market audits, and company calls.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-2xl border border-latte bg-canvas/60 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-espresso/45">Database Breadth</span>
              <span className="mt-1 block text-2xl font-black text-brand-700 sm:text-3xl">100 SKUs</span>
              <span className="mt-0.5 block text-xs text-espresso/60">Top packaged foods across 8 FMCG categories</span>
            </div>
            <div className="rounded-2xl border border-latte bg-canvas/60 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-espresso/45">Max Documented Cut</span>
              <span className="mt-1 block text-2xl font-black text-rose-600 sm:text-3xl">-50.0%</span>
              <span className="mt-0.5 block text-xs text-espresso/60">Parle-G ₹5 pack (100g → ~50g long-term)</span>
            </div>
            <div className="rounded-2xl border border-latte bg-canvas/60 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-espresso/45">Latest Major Wave</span>
              <span className="mt-1 block text-2xl font-black text-amber-600 sm:text-3xl">July 2026</span>
              <span className="mt-0.5 block text-xs text-espresso/60">Nestlé Maggi 7-pack size portfolio cuts</span>
            </div>
            <div className="rounded-2xl border border-latte bg-canvas/60 p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-espresso/45">Magic Price Points</span>
              <span className="mt-1 block text-2xl font-black text-espresso sm:text-3xl">₹5 · ₹10 · ₹20</span>
              <span className="mt-0.5 block text-xs text-espresso/60">Rigid psychological kirana anchors</span>
            </div>
            <div className="rounded-2xl border border-latte bg-canvas/60 p-4 col-span-2 sm:col-span-1">
              <span className="block text-xs font-semibold uppercase tracking-wider text-espresso/45">Small Pack Sales</span>
              <span className="mt-1 block text-2xl font-black text-emerald-700 sm:text-3xl">Up to 79%</span>
              <span className="mt-0.5 block text-xs text-espresso/60">Shampoo 79%, Biscuits 64%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Jump Bar */}
      <nav className="sticky top-[61px] z-40 border-b border-latte bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-3 sm:px-6 text-sm font-semibold text-espresso/70">
          <a href="#key-findings" className="hover:text-brand-600 whitespace-nowrap">Key Findings</a>
          <a href="#data-table" className="hover:text-brand-600 whitespace-nowrap">Documented Reductions (Table 1)</a>
          <a href="#visual-charts" className="hover:text-brand-600 whitespace-nowrap">Visual Charts</a>
          <a href="#calculator" className="hover:text-brand-600 whitespace-nowrap">Shrinkflation Calculator</a>
          <a href="#corporate-playbook" className="hover:text-brand-600 whitespace-nowrap">Corporate Statements (Table 2)</a>
          <a href="#small-packs" className="hover:text-brand-600 whitespace-nowrap">Why Small Packs Matter</a>
          <a href="#gst-episode" className="hover:text-brand-600 whitespace-nowrap">The GST 2.0 Episode</a>
          <a href="#consumer-guide" className="hover:text-brand-600 whitespace-nowrap">Consumer Guide</a>
          <a href="#sources" className="hover:text-brand-600 whitespace-nowrap">Verified Sources (19)</a>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-20">

        {/* Section 1: Key Findings */}
        <section id="key-findings" className="scroll-mt-32">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Executive Summary</span>
            <h2 className="text-2xl font-extrabold sm:text-3xl text-espresso mt-1">Core Takeaways from Public Records</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {KEY_FINDINGS.map((finding, idx) => (
              <div key={idx} className="card relative flex flex-col justify-between !p-5 hover:border-brand-500/40">
                <div className="space-y-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 font-black text-brand-700 text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-base text-espresso leading-snug">{finding.title}</h3>
                  <p className="text-sm leading-relaxed text-espresso/70">{finding.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Interactive Data Table (Table 1) */}
        <section id="data-table" className="scroll-mt-32">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 border border-brand-200">
                <span>Table 1 · Complete FMCG Database</span>
                <span>·</span>
                <span>100 Documented SKUs</span>
              </div>
              <h2 className="text-2xl font-extrabold sm:text-3xl text-espresso mt-2">
                Top 100 Packaged Foods: Documented Pack-Size Reductions
              </h2>
              <p className="text-sm text-espresso/60 mt-1">
                Compiled across India&apos;s 100 highest-selling packaged food & FMCG SKUs. Price per unit rise is calculated at unchanged shelf MRP.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-espresso/50">Sort by:</span>
              <button
                type="button"
                onClick={() => setSortBy("cut")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  sortBy === "cut" ? "bg-brand-600 text-white" : "bg-white border border-latte text-espresso/70"
                }`}
              >
                Largest Cut %
              </button>
              <button
                type="button"
                onClick={() => setSortBy("hike")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  sortBy === "hike" ? "bg-brand-600 text-white" : "bg-white border border-latte text-espresso/70"
                }`}
              >
                Highest Price/Unit Hike
              </button>
            </div>
          </div>

          {/* Top 5 Worst Offenders Spotlight */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              { rank: "1", name: "Parle-G Glucose", cut: "-50.0%", price: "₹5", oldW: "100g", newW: "50g", brand: "Parle Products" },
              { rank: "2", name: "Lay's Magic Masala", cut: "-25.0%", price: "₹10", oldW: "40g", newW: "30g", brand: "PepsiCo" },
              { rank: "3", name: "Haldiram's Aloo Bhujia", cut: "-23.6%", price: "₹10", oldW: "55g", newW: "42g", brand: "Haldiram's" },
              { rank: "4", name: "Kurkure Masala Munch", cut: "-23.0%", price: "₹10", oldW: "52g", newW: "40g", brand: "PepsiCo" },
              { rank: "5", name: "Lahori Zeera", cut: "-20.0%", price: "₹10", oldW: "200ml", newW: "160ml", brand: "Lahori" },
            ].map((offender) => (
              <div key={offender.rank} className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-xs">
                <div className="flex items-center justify-between font-bold text-rose-800">
                  <span className="text-[10px] uppercase tracking-wider text-rose-600">Offender #{offender.rank}</span>
                  <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-black text-white">{offender.cut}</span>
                </div>
                <div className="mt-1 font-bold text-espresso line-clamp-1">{offender.name}</div>
                <div className="text-[11px] text-espresso/60">{offender.brand} · {offender.price}</div>
                <div className="mt-1 font-mono text-[10px] text-espresso/70">
                  <span className="line-through text-espresso/40">{offender.oldW}</span> → <strong className="text-rose-700">{offender.newW}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Search & Category Pills */}
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "all", label: "All 100 SKUs", count: 100 },
                { id: "biscuits", label: "🍪 Biscuits & Bakery", count: 20 },
                { id: "snacks", label: "🥔 Chips & Namkeen", count: 20 },
                { id: "instant-foods", label: "🍜 Instant Foods & Soups", count: 15 },
                { id: "chocolates", label: "🍫 Chocolates & Sweets", count: 15 },
                { id: "beverages", label: "🥤 Beverages", count: 10 },
                { id: "dairy", label: "🥛 Dairy & Butter", count: 5 },
                { id: "edible-oils", label: "🌾 Staples & Cooking Oils", count: 10 },
                { id: "home-care", label: "🧼 Soaps & Hygiene", count: 5 },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-espresso text-white shadow-sm ring-1 ring-espresso"
                      : "bg-white border border-latte text-espresso/70 hover:bg-latte/50"
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search among 100 brands, SKUs or prices..."
                  className="w-full rounded-xl border border-latte bg-white px-3.5 py-2 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange("")}
                    className="absolute right-3 top-2.5 text-xs text-espresso/40 hover:text-espresso"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* View Size Selector */}
              <div className="flex items-center gap-2 text-xs text-espresso/60">
                <span>Show:</span>
                {[25, 50, 100].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setPageSize(size);
                      setCurrentPage(1);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                      pageSize === size
                        ? "bg-brand-700 text-white font-bold"
                        : "bg-white border border-latte text-espresso/70 hover:bg-latte/40"
                    }`}
                  >
                    {size === 100 ? "All 100" : size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* The Table */}
          <div className="overflow-x-auto rounded-2xl border border-latte bg-white shadow-premium">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-latte bg-canvas/70 text-xs font-bold text-espresso/60 uppercase tracking-wider">
                  <th className="px-4 py-3.5">#</th>
                  <th className="px-4 py-3.5">Product & Brand</th>
                  <th className="px-4 py-3.5">Price Point</th>
                  <th className="px-4 py-3.5">Before</th>
                  <th className="px-4 py-3.5">After</th>
                  <th className="px-4 py-3.5 text-right">Pack Cut</th>
                  <th className="px-4 py-3.5 text-right">Price/Unit Hike</th>
                  <th className="px-4 py-3.5">Period</th>
                  <th className="px-4 py-3.5 text-center">Confidence</th>
                  <th className="px-4 py-3.5 text-right">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-latte">
                {paginatedRecords.map((item, index) => {
                  const globalIndex = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-4 py-3.5 text-xs font-mono text-espresso/40">
                        {globalIndex}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-espresso">
                        <div>
                          {item.productId ? (
                            <Link
                              href={`/products/${item.productId}`}
                              className="font-semibold text-brand-700 hover:underline flex items-center gap-1.5"
                            >
                              {item.productName}
                              <span className="text-[10px] text-espresso/40">↗</span>
                            </Link>
                          ) : (
                            <span className="font-semibold text-espresso">{item.productName}</span>
                          )}
                          <span className="block text-xs text-espresso/45">
                            {item.brand} · <span className="italic">{item.categoryLabel}</span>
                          </span>
                          {item.notes && (
                            <p className="mt-0.5 text-[11px] text-espresso/60 leading-tight">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-espresso/80">{item.pricePoint}</td>
                      <td className="px-4 py-3.5 text-espresso/60 line-through">{item.beforeQty}</td>
                      <td className="px-4 py-3.5 font-bold text-espresso">{item.afterQty}</td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="inline-flex rounded-lg bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                          {item.qtyChangePct}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="inline-flex rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                          +{item.pricePerUnitRisePct}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-medium text-espresso/70">{item.period}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            item.confidence === "High"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.confidence === "Medium"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {item.confidence}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-xs">
                        <a
                          href={`#source-${item.sourceId}`}
                          className="font-bold text-brand-600 hover:underline inline-flex items-center gap-0.5"
                        >
                          [{item.sourceId}]
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-espresso/60">
            <div>
              Showing {Math.min((currentPage - 1) * pageSize + 1, filteredRecords.length)} to{" "}
              {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length} documented reductions
              {filteredRecords.length < DOCUMENTED_REDUCTIONS.length && ` (filtered from ${DOCUMENTED_REDUCTIONS.length} total)`}.
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-latte bg-white px-3 py-1.5 font-semibold text-espresso disabled:opacity-40 disabled:cursor-not-allowed hover:bg-latte/50"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-1 font-medium">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-7 w-7 rounded-lg text-xs font-semibold ${
                        currentPage === pageNum
                          ? "bg-brand-700 text-white"
                          : "border border-latte bg-white text-espresso/70 hover:bg-latte/40"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg border border-latte bg-white px-3 py-1.5 font-semibold text-espresso disabled:opacity-40 disabled:cursor-not-allowed hover:bg-latte/50"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Visual Charts */}
        <section id="visual-charts" className="scroll-mt-32">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Visualizations</span>
            <h2 className="text-2xl font-extrabold sm:text-3xl text-espresso mt-1">Pack Size Reductions at a Glance</h2>
            <p className="text-sm text-espresso/60 mt-1">
              Visual breakdowns showing reported weight cuts across price points and long-term erosion.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Chart 1: Maggi July 2026 cuts */}
            <div className="card !p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-espresso">Maggi: Reported Weight Cuts by Pack (July 2026)</h3>
                  <p className="text-xs text-espresso/50">MRP maintained unchanged; net noodle weight reduced across line.</p>
                </div>
                <span className="rounded-lg bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-800">
                  -6.7% to -8.6%
                </span>
              </div>

              {/* Bar visualization */}
              <div className="space-y-3 pt-2">
                {[
                  { label: "₹7 pack (Mini)", oldW: "35g", newW: "32g", cut: 8.6, cutStr: "-8.6%" },
                  { label: "₹10 pack (Single)", oldW: "52g", newW: "48g", cut: 7.7, cutStr: "-7.7%" },
                  { label: "₹15 pack (Standard)", oldW: "75g", newW: "70g", cut: 6.7, cutStr: "-6.7%" },
                  { label: "₹30 pack (Double)", oldW: "150g", newW: "140g", cut: 6.7, cutStr: "-6.7%" },
                  { label: "₹60 pack (4-Pack)", oldW: "300g", newW: "280g", cut: 6.7, cutStr: "-6.7%" },
                  { label: "₹90 pack (6-Pack)", oldW: "450g", newW: "420g", cut: 6.7, cutStr: "-6.7%" },
                  { label: "₹120 pack (8-Pack)", oldW: "600g", newW: "560g", cut: 6.7, cutStr: "-6.7%" },
                ].map((row) => (
                  <div key={row.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-espresso">
                      <span>{row.label}</span>
                      <span className="text-espresso/60 font-mono">
                        {row.oldW} → <strong className="text-rose-600">{row.newW}</strong> ({row.cutStr})
                      </span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-latte/60 flex">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${(row.cut / 12) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-espresso/45 pt-1">
                Source: Distributor checks reported by Angel One [1]. Not officially confirmed by Nestlé India.
              </p>
            </div>

            {/* Chart 2: Parle-G 30-Year Weight Timeline */}
            <div className="card !p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-espresso">Parle-G ₹5 Pack: 30-Year Weight Erosion</h3>
                  <p className="text-xs text-espresso/50">India&apos;s iconic glucose biscuit has roughly halved in grammage.</p>
                </div>
                <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                  -50% Long-term
                </span>
              </div>

              {/* Step chart / bars */}
              <div className="space-y-3.5 pt-2">
                {[
                  { era: "1994 (₹4 pack)", weight: 100, label: "100 g", note: "Original staple weight (₹0.04/g)" },
                  { era: "Pre-2018", weight: 80, label: "80 g", note: "Pre-GST era weight" },
                  { era: "2018 (Post GST 18%)", weight: 76, label: "76 g", note: "Adjusted after 18% GST tax levy" },
                  { era: "2021 (₹5 pack)", weight: 55, label: "55 g", note: "Post-pandemic commodity pressure" },
                  { era: "Mid-2020s / 2026", weight: 48, label: "45–50 g", note: "Current estimated shelf grammage (₹0.104/g)" },
                ].map((item) => (
                  <div key={item.era} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-espresso">{item.era}</span>
                      <span className="font-mono font-bold text-brand-700">{item.label}</span>
                    </div>
                    <div className="h-5 w-full overflow-hidden rounded-lg bg-latte/50 flex items-center">
                      <div
                        className="h-full bg-gradient-to-r from-brand-600 to-amber-500 rounded-lg flex items-center px-2 text-[10px] font-bold text-white transition-all duration-500"
                        style={{ width: `${item.weight}%` }}
                      >
                        {item.weight}g
                      </div>
                    </div>
                    <p className="text-[10px] text-espresso/50">{item.note}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-espresso/45 pt-1">
                Sources: IndraStra Parle-G Economic Index [4], FactChecker.in [2], Agron Food Processing [3].
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Interactive Shrinkflation & Unit Price Calculator */}
        <section id="calculator" className="scroll-mt-32">
          <div className="rounded-3xl border border-latte bg-gradient-to-br from-white via-amber-50/30 to-brand-50/20 p-6 sm:p-10 shadow-premium">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Interactive Tool</span>
              <h2 className="text-2xl font-extrabold sm:text-3xl text-espresso mt-1">
                Your Personal Shrinkflation Calculator
              </h2>
              <p className="text-sm leading-relaxed text-espresso/70 mt-1">
                Notice your daily pack feels lighter? Enter the old weight, new weight, and price to see your hidden price hike and how much it costs your household every month.
              </p>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-12 items-center">
              {/* Inputs */}
              <div className="space-y-4 lg:col-span-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso/60 mb-1">
                    Old Pack Weight (grams or ml)
                  </label>
                  <input
                    type="number"
                    value={calcOldSize}
                    onChange={(e) => setCalcOldSize(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-latte bg-white p-3 font-semibold text-espresso focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. 75"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso/60 mb-1">
                    New Pack Weight (grams or ml)
                  </label>
                  <input
                    type="number"
                    value={calcNewSize}
                    onChange={(e) => setCalcNewSize(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-latte bg-white p-3 font-semibold text-espresso focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g. 70"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-espresso/60 mb-1">
                      Pack MRP (₹)
                    </label>
                    <input
                      type="number"
                      value={calcPrice}
                      onChange={(e) => setCalcPrice(Number(e.target.value) || 0)}
                      className="w-full rounded-xl border border-latte bg-white p-3 font-semibold text-espresso focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      placeholder="e.g. 15"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-espresso/60 mb-1">
                      Packs Bought / Month
                    </label>
                    <input
                      type="number"
                      value={calcMonthlyPacks}
                      onChange={(e) => setCalcMonthlyPacks(Number(e.target.value) || 0)}
                      className="w-full rounded-xl border border-latte bg-white p-3 font-semibold text-espresso focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>

                {/* Quick Preset Buttons */}
                <div className="pt-2">
                  <span className="block text-xs font-bold text-espresso/45 mb-1.5">Try with real documented examples:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => { setCalcOldSize(75); setCalcNewSize(70); setCalcPrice(15); setCalcMonthlyPacks(12); }}
                      className="rounded-lg bg-white border border-latte px-2.5 py-1 text-xs font-medium text-espresso/70 hover:bg-latte/50"
                    >
                      Maggi ₹15 (75g → 70g)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCalcOldSize(155); setCalcNewSize(135); setCalcPrice(10); setCalcMonthlyPacks(4); }}
                      className="rounded-lg bg-white border border-latte px-2.5 py-1 text-xs font-medium text-espresso/70 hover:bg-latte/50"
                    >
                      Vim Bar ₹10 (155g → 135g)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCalcOldSize(55); setCalcNewSize(42); setCalcPrice(20); setCalcMonthlyPacks(6); }}
                      className="rounded-lg bg-white border border-latte px-2.5 py-1 text-xs font-medium text-espresso/70 hover:bg-latte/50"
                    >
                      Aloo Bhujia (55g → 42g)
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Results */}
              <div className="rounded-2xl border border-latte bg-white p-6 shadow-card lg:col-span-6 space-y-5">
                <h3 className="font-bold text-base text-espresso border-b border-latte pb-3">
                  Calculation Results
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-rose-50 border border-rose-100 p-4">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-rose-700">Weight Reduction</span>
                    <span className="mt-1 block text-2xl font-black text-rose-700">{calcQtyChangePct}%</span>
                    <span className="text-xs text-rose-600/80">Less product in your hands</span>
                  </div>
                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-800">Effective Price Hike</span>
                    <span className="mt-1 block text-2xl font-black text-amber-800">+{calcPriceHikePct}%</span>
                    <span className="text-xs text-amber-700/80">Hidden cost increase / gram</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-latte pt-4 text-xs font-medium text-espresso/75">
                  <div className="flex justify-between">
                    <span>Unit price before:</span>
                    <span className="font-mono font-bold text-espresso">₹{calcOldPer100} / 100g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit price after:</span>
                    <span className="font-mono font-bold text-rose-600">₹{calcNewPer100} / 100g</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-latte pt-2">
                    <span className="font-semibold text-espresso">Monthly invisible loss:</span>
                    <span className="font-mono font-bold text-brand-700">≈ ₹{calcMonthlyLoss} / month</span>
                  </div>
                </div>

                <p className="text-[11px] leading-relaxed text-espresso/50">
                  Formula: <code>Rise in Price = (Old Weight ÷ New Weight) - 1</code>. Legal Metrology Rules mandate display of unit sale price (₹/g or ₹/ml) on every pack.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: What Companies Have Said (Table 2) */}
        <section id="corporate-playbook" className="scroll-mt-32">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Table 2</span>
            <h2 className="text-2xl font-extrabold sm:text-3xl text-espresso mt-1">
              What FMCG Companies Have Said & Done
            </h2>
            <p className="text-sm text-espresso/60 mt-1">
              Disclosures from earnings calls, analyst presentations, and corporate spokespeople on managing inflation.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {CORPORATE_STATEMENTS.map((item) => (
              <div key={item.company} className="card !p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-espresso">{item.company}</h3>
                      <p className="text-xs text-espresso/50">Brands: {item.brands.join(", ")}</p>
                    </div>
                    <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-700 border border-brand-200">
                      {item.when}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-espresso/75">
                    {item.whatWasSaidOrDone}
                  </p>

                  {item.keyQuote && (
                    <blockquote className="rounded-xl border-l-4 border-amber-500 bg-amber-50/60 p-3 text-xs italic text-amber-950">
                      &ldquo;{item.keyQuote}&rdquo;
                    </blockquote>
                  )}
                </div>

                <div className="border-t border-latte pt-3 text-xs text-espresso/50 flex items-center justify-between">
                  <span>Cited in Sources:</span>
                  <div className="flex gap-1.5 font-bold text-brand-600">
                    {item.sourceIds.map((sid) => (
                      <a key={sid} href={`#source-${sid}`} className="hover:underline">
                        [{sid}]
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Why Small Packs Matter */}
        <section id="small-packs" className="scroll-mt-32">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Market Dynamics</span>
            <h2 className="text-2xl font-extrabold sm:text-3xl text-espresso mt-1">
              Why Small Packs Drive Indian Retail
            </h2>
            <p className="text-sm text-espresso/60 mt-1">
              Because so much volume sits in a few fixed price points, shrinking the pack is the primary lever to raise the effective price.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="space-y-4 lg:col-span-7">
              <p className="text-sm leading-relaxed text-espresso/80">
                In India&apos;s 1.2+ crore kirana ecosystem, low-unit packs (LUPs) priced at <strong>₹5, ₹10, and ₹20</strong> are consumer anchors. For daily wage earners, rural households, and students, these denominations represent strict, non-negotiable budget boundaries rather than casual change.
              </p>
              <p className="text-sm leading-relaxed text-espresso/80">
                A price increase from ₹5 to ₹6 creates transaction friction (coin shortage, psychology shock) and immediately causes volumes to plummet. Consequently, manufacturers treat the price tag as fixed and treat the <strong>grammage as fluid</strong>.
              </p>
              <div className="rounded-2xl border border-latte bg-white p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-espresso/60">Share of Sales from Small Price-Point Packs (Sep 2025) [13]</h4>
                <div className="space-y-3">
                  {CATEGORY_PACK_SHARES.map((cat) => (
                    <div key={cat.category} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-espresso">{cat.category}</span>
                        <span className="font-mono font-bold text-brand-700">{cat.sharePct}%</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-latte/60 overflow-hidden">
                        <div
                          className="h-full bg-brand-600 rounded-full"
                          style={{ width: `${cat.sharePct}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-espresso/50">{cat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-5">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Macroeconomic Context</span>
                <h3 className="font-bold text-lg text-emerald-950">Food Inflation vs Headline CPI</h3>
                <p className="text-xs leading-relaxed text-emerald-900/80">
                  India’s consumer food price inflation was reported at <strong>5.32% in June 2026</strong>, while headline CPI was <strong>4.38%</strong> [16].
                </p>
                <p className="text-xs leading-relaxed text-emerald-900/80">
                  Official CPI indexes treat smaller pack weights as price rises in theory. In practice, pack-weight adjustments occur across thousands of SKUs and are notoriously hard to detect in monthly headline basket samplings.
                </p>
              </div>

              <div className="rounded-2xl border border-latte bg-white p-6 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-espresso/50">Company Dependency</span>
                <p className="text-xs text-espresso/70 leading-relaxed">
                  Reported share of total corporate revenue originating from packs priced at <strong>₹10 and below</strong>:
                </p>
                <div className="flex justify-between text-xs font-semibold pt-1 border-t border-latte">
                  <span>Parle Products</span>
                  <strong className="text-brand-700 font-mono">~70%</strong>
                </div>
                <div className="flex justify-between text-xs font-semibold border-t border-latte pt-1">
                  <span>Britannia Industries</span>
                  <strong className="text-brand-700 font-mono">50–55%</strong>
                </div>
                <div className="flex justify-between text-xs font-semibold border-t border-latte pt-1">
                  <span>Hindustan Unilever</span>
                  <strong className="text-brand-700 font-mono">~30%</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: The GST 2.0 Episode */}
        <section id="gst-episode" className="scroll-mt-32">
          <div className="rounded-3xl border border-latte bg-white p-6 sm:p-10 shadow-premium">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800 border border-blue-200">
                <span>⚖️ Policy & Anti-Profiteering</span>
              </div>
              <h2 className="text-2xl font-extrabold sm:text-3xl text-espresso">
                The GST 2.0 Episode (September 2025 Onward)
              </h2>
              <p className="text-sm leading-relaxed text-espresso/70">
                How a major tax rationalisation triggered an unprecedented clash between convenient coin prices and legal mandates.
              </p>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="space-y-4 text-sm leading-relaxed text-espresso/80">
                <p>
                  On <strong>22 September 2025</strong>, the GST rate on biscuits, soaps, shampoos, and noodles was slashed from <strong>18% down to 5%</strong> [14].
                </p>
                <p>
                  While intended to grant immediate price relief, it presented FMCG makers with a logistical headache: an exact price reduction created bizarre non-standard coin amounts. For a brief period:
                </p>
                <ul className="space-y-1.5 pl-4 list-disc text-xs font-medium text-espresso/90">
                  <li>Parle-G ₹5 pack was repriced to <strong>₹4.45</strong></li>
                  <li>₹1 candy was reduced to <strong>88 paise</strong></li>
                  <li>₹2 shampoo sachet became <strong>₹1.77</strong></li>
                  <li>₹10 Oreo dropped to <strong>₹8.90</strong></li>
                  <li>Bournvita dropped to <strong>₹26.69</strong> [13]</li>
                </ul>
                <p>
                  Retailers were unable to dispense 55-paise change, causing widespread arguments at kirana counters.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 space-y-4 text-sm">
                <h3 className="font-bold text-amber-950 text-base">The Legal Dilemma: Weight Increase vs Price Cut</h3>
                <p className="text-xs text-espresso/80 leading-relaxed">
                  The <strong>Central Board of Indirect Taxes and Customs (CBIC)</strong> clarified that FMCG manufacturers could increase pack weights or volumes by <strong>6% to 12% (11–12% for biscuits)</strong> to pass on the GST benefit while preserving round numbers like ₹5 and ₹10 [15, 17].
                </p>
                <div className="rounded-xl border border-amber-300/80 bg-white p-3.5 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">Delhi High Court Contention</span>
                  <p className="text-xs text-espresso/80 leading-relaxed">
                    A note by law firm JSA Advocates highlighted a Delhi High Court order ruling that anti-profiteering provisions require benefits to be passed on as <strong>direct price reductions</strong> rather than forced quantity additions [18].
                  </p>
                </div>
                <p className="text-[11px] italic text-espresso/60">
                  Status check: Judicial interpretation remains active. Subsequent cost shocks in 2026 quickly reversed temporary grammage bonuses back into weight reductions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: How to Check Any Product Yourself (Consumer Guide) */}
        <section id="consumer-guide" className="scroll-mt-32">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Consumer Rights</span>
            <h2 className="text-2xl font-extrabold sm:text-3xl text-espresso mt-1">
              How to Check Any Product Yourself
            </h2>
            <p className="text-sm text-espresso/60 mt-1">
              Protect your monthly grocery budget with three simple steps and statutory consumer rights.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="card !p-6 space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 font-extrabold">1</span>
              <h3 className="font-bold text-base text-espresso">Check Net Quantity & MRP</h3>
              <p className="text-xs leading-relaxed text-espresso/70">
                Always inspect the fine print on the back or side panel. Do not rely on packet dimensions—foil pouches frequently retain identical outer packaging while containing less product.
              </p>
            </div>

            <div className="card !p-6 space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 font-extrabold">2</span>
              <h3 className="font-bold text-base text-espresso">Compute Price per 100g</h3>
              <p className="text-xs leading-relaxed text-espresso/70">
                Use the formula: <code>(MRP ÷ Net Weight) × 100</code>. This standardises all pack variations and allows direct comparison between different brands and package formats.
              </p>
            </div>

            <div className="card !p-6 space-y-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 font-extrabold">3</span>
              <h3 className="font-bold text-base text-espresso">Check Unit Sale Price Rule</h3>
              <p className="text-xs leading-relaxed text-espresso/70">
                Since <strong>1 April 2022</strong>, under the Legal Metrology (Packaged Commodities) Rules, 2011, manufacturers must declare unit sale price (₹/g or ₹/ml) on pre-packed goods [19].
              </p>
            </div>
          </div>

          {/* Helpline Callout */}
          <div className="mt-6 rounded-2xl border border-latte bg-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-sm text-espresso">Suspect short quantity or deceptive packaging?</h3>
              <p className="text-xs text-espresso/60">
                Complaints regarding misleading grammage, incorrect unit pricing, or weight tampering can be lodged with the Government of India.
              </p>
            </div>
            <a
              href="https://consumerhelpline.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary shrink-0 text-xs font-semibold"
            >
              National Consumer Helpline (1915) ↗
            </a>
          </div>
        </section>

        {/* Section 9: Verified Sources Directory (19 Citations) */}
        <section id="sources" className="scroll-mt-32 border-t border-latte pt-12">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Bibliography</span>
              <h2 className="text-2xl font-extrabold sm:text-3xl text-espresso mt-1">
                Verified Sources & References ({RESEARCH_SOURCES.length})
              </h2>
              <p className="text-sm text-espresso/60 mt-1">
                All citations used in this report, cross-checked with news reports, filings, and regulatory notices.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RESEARCH_SOURCES.map((source) => (
              <div
                key={source.id}
                id={`source-${source.id}`}
                className="rounded-2xl border border-latte bg-white p-4 space-y-2 hover:border-brand-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-6 min-w-[24px] items-center justify-center rounded-md bg-brand-50 font-mono text-xs font-bold text-brand-700">
                    [{source.id}]
                  </span>
                  <span className="text-[10px] font-semibold text-espresso/45">{source.date}</span>
                </div>
                <h3 className="font-semibold text-xs text-espresso leading-snug">
                  {source.title}
                </h3>
                <p className="text-[11px] text-espresso/60 italic">{source.publication}</p>
                <p className="text-[11px] text-espresso/70 leading-relaxed">{source.notes}</p>
                <div className="pt-1">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:underline"
                  >
                    View Original Report ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Footer Banner */}
      <div className="border-t border-latte bg-brand-50/50 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 space-y-4">
          <h2 className="text-xl font-bold text-espresso">Scan products on JeevanReport to see their full history</h2>
          <p className="mx-auto max-w-xl text-xs text-espresso/60">
            Barcode transparency for nutrition, ingredients, and pack size history. Free for all Indian consumers.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/scan" className="btn-primary text-xs">
              Scan Barcode Now
            </Link>
            <Link href="/leaderboard" className="btn-secondary text-xs">
              View Shrinkflation Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
