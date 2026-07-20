"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import TabbedBrowseHubClient from "@/components/TabbedBrowseHub";
import FloatingScanButton from "@/components/FloatingScanButton";
import { products, changeFeed } from "@/lib/data/products";
import { getScanHistory, clearScanHistory, type ScanHistoryEntry } from "@/lib/storage";
import { useLang } from "@/components/LanguageContext";
import { useToast } from "@/components/Toast";

// ── Static data ────────────────────────────────────────────────────────────
const tickerItems = [
  "Maggi 2-Minute Noodles", "Amul Butter", "Dettol Handwash",
  "Kurkure Masala Munch", "Britannia Good Day", "Parle-G Biscuits",
  "Lay's Classic Salted", "Nestle KitKat", "Bournvita", "Horlicks",
  "Colgate MaxFresh", "Surf Excel", "Tata Salt", "Aavin Milk",
  "Amul Cheese Slices",
];

const learnItems = [
  "Full ingredient logs with simplified breakdowns",
  "Calories per serving and per full pack context",
  "Sugar, Fat, Protein, and Salt colour flags",
  "Vitamins and minerals vs Indian daily values",
  "Overall choice rating: Better, Average, or Limit",
  "Pack size reduction tracking over time",
  "Formula and ingredient modification history",
  "Shrinkflation alerts with photo proof",
];

const worstShrinkflation = [
  { name: "Dettol Liquid Handwash", brand: "Dettol", oldSize: "200ml", newSize: "175ml", change: "-12.5%", image: "https://placehold.co/120x120/fce4ec/a32d2d?text=Dettol" },
  { name: "Epigamia Mango Greek Yogurt", brand: "Epigamia", oldSize: "100g", newSize: "90g", change: "-10.0%", image: "https://placehold.co/120x120/f3e5f5/a32d2d?text=Epigamia" },
  { name: "Kurkure Masala Munch", brand: "Kurkure", oldSize: "90g", newSize: "82g", change: "-8.9%", image: "https://placehold.co/120x120/fff3e0/a32d2d?text=Kurkure" },
  { name: "Britannia Good Day Butter Cookies", brand: "Britannia", oldSize: "72g", newSize: "66g", change: "-8.3%", image: "https://placehold.co/120x120/fff3e0/a32d2d?text=Good+Day" },
  { name: "Maggi 2-Minute Noodles", brand: "Maggi", oldSize: "75g", newSize: "70g", change: "-6.7%", image: "https://placehold.co/120x120/fff3e0/a32d2d?text=Maggi" }
];

export default function HomePage() {
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const { t } = useLang();
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    setHistory(getScanHistory());
  }, []);

  const recentActivity = changeFeed.slice(0, 4);
  const featuredProduct = products.find((p) => p.id === "maggi-masala-noodles")!;

  function handleClearHistory() {
    clearScanHistory();
    setHistory([]);
    toast("Scan history cleared", "success");
  }

  function getRatingColor(rating?: string) {
    if (rating === "Good") return "bg-emerald-500";
    if (rating === "Careful") return "bg-amber-500";
    return "bg-rose-500";
  }

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-canvas border-b border-latte">
        {/* Warm radial backdrop */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 70% 50%, #e8ddd0 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20">
          {mounted && history.length > 0 ? (
            /* Welcome back view for returning users */
            <div className="space-y-8">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-200/60 border border-brand-300/60 text-brand-700 text-xs font-semibold mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                  {t("nav.watchlist") || "Welcome back!"}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-espresso leading-tight">
                  Welcome back! Your recent scans:
                </h1>
                <p className="text-sm text-espresso/60 mt-1">Quickly view or search your previously scanned products below</p>
              </div>

              {/* Horizontal scroll cards */}
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 scrollbar-hide snap-x">
                {history.slice(0, 5).map((item) => (
                  <div
                    key={item.productId + item.scannedAt}
                    className="flex-shrink-0 w-64 snap-start bg-white rounded-2xl border border-latte p-4 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${getRatingColor(item.rating)}`} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {item.rating || "Good"}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-400 mt-1">{item.barcode}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-50">
                      <Link
                        href={`/scan?barcode=${item.barcode}`}
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 min-h-[36px]"
                      >
                        View Again →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  <Link href="/scan" className="btn-primary min-h-[48px] text-xs sm:text-sm">
                    ⚡ Scan New Product
                  </Link>
                  <button
                    onClick={handleClearHistory}
                    className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors min-h-[44px] px-2"
                  >
                    Clear scan history
                  </button>
                </div>
                <div className="w-full sm:max-w-md">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const query = (e.currentTarget.elements.namedItem("search") as HTMLInputElement)?.value;
                      if (query) window.location.href = `/search?q=${encodeURIComponent(query)}`;
                    }}
                    className="flex gap-2 bg-white rounded-2xl border border-latte p-2 shadow-sm"
                  >
                    <input
                      name="search"
                      type="text"
                      className="input-field flex-1 !py-2 border-0 focus:ring-0 text-base"
                      placeholder="Or search by name..."
                      style={{ fontSize: "16px" }}
                    />
                    <button type="submit" className="btn-secondary !py-2 text-xs">Search</button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            /* Standard hero section for first-time visitors */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left — copy */}
              <div className="space-y-7">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-200/60 border border-brand-300/60 text-brand-700 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
                  India&apos;s Product Transparency Platform
                </div>

                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-espresso leading-[1.1]"
                  style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
                >
                  {t("hero.headline_1") || "Scan any product."}{" "}
                  <span className="text-brand-600">
                    {t("hero.headline_2") || "Know what's really inside."}
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-espresso/60 leading-relaxed max-w-lg">
                  {t("hero.subheading") || "India's first barcode transparency platform. Nutrition, ingredients, shrinkflation — all in one scan."}
                </p>

                {/* Primary Huge Scan Button */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/scan"
                    id="hero-scan-btn"
                    className="btn-primary w-full sm:w-auto min-h-[56px] text-base font-extrabold shadow-lg px-8 flex items-center justify-center gap-2"
                  >
                    ⚡ {t("hero.cta_scan") || "Scan Barcode"}
                  </Link>
                  <Link
                    href="/search"
                    id="hero-search-btn"
                    className="btn-secondary w-full sm:w-auto min-h-[56px] text-base font-semibold px-8 flex items-center justify-center gap-2"
                  >
                    🔍 {t("hero.cta_search") || "Search a Product"}
                  </Link>
                </div>

                {/* Inline search box */}
                <div className="max-w-md bg-white rounded-2xl border border-latte shadow-mocha p-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Or search by name..."
                    className="input-field flex-1 !py-2 border-0 focus:ring-0 text-base"
                    style={{ fontSize: "16px" }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value)}`;
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const val = (e.currentTarget.previousSibling as HTMLInputElement)?.value;
                      if (val) window.location.href = `/search?q=${encodeURIComponent(val)}`;
                    }}
                    className="btn-secondary !py-2 text-xs"
                  >
                    Go
                  </button>
                </div>

                <p className="text-xs text-espresso/50 font-medium">
                  {t("hero.trust_line") || "Trusted by lakhs of Indians who read labels before buying."}
                </p>

                {/* Trust indicators */}
                <div className="pt-2 border-t border-latte/50 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
                  <span>3M+ Products</span>
                  <span className="text-slate-350">•</span>
                  <span>6 Countries</span>
                  <span className="text-slate-350">•</span>
                  <span>Free Forever</span>
                  <span className="text-slate-350">•</span>
                  <span>No Login Needed</span>
                </div>
              </div>

              {/* Right — Animated product card preview */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-72">
                  <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-rose-200 shadow-premium p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-xl flex-shrink-0">
                        🍜
                      </div>
                      <div>
                        <span className="category-pill-food mb-0.5">🍽️ Food</span>
                        <h3 className="font-bold text-espresso text-sm leading-tight">
                          Maggi noodles
                        </h3>
                        <p className="text-[10px] text-espresso/40">Nestlé India</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-latte mt-4">
                      <span className="text-xs font-black text-rose-600">🔴 Be Careful</span>
                      <span className="text-[10px] font-bold text-slate-500">Limit Often</span>
                    </div>

                    <div className="space-y-1.5 mt-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-rose-700 bg-rose-50/50 p-2 rounded-lg border border-rose-100">
                        <span>⚠️</span> High sodium — 38% of daily RDA
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-rose-700 bg-rose-50/50 p-2 rounded-lg border border-rose-100">
                        <span>⚠️</span> Low protein — won&apos;t keep you full
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                        <span>✅</span> Fine as an occasional treat
                      </div>
                    </div>
                  </div>

                  {/* Laser sweep indicator */}
                  <div className="absolute -top-4 -left-4 bg-white rounded-2xl border border-latte shadow-premium p-3 w-40 z-10 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] font-extrabold text-emerald-700">🟢 Scan Complete</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Ticker ─────────────────────────────────────────────────────── */}
        <div className="border-t border-latte overflow-hidden py-3 bg-brand-600">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 px-6 text-sm font-medium text-white/80 flex-shrink-0"
              >
                <span className="w-1 h-1 rounded-full bg-white/40 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-latte">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">Why use JeevanReport?</h2>
            <p className="section-subtitle">Take control of your health with facts, not marketing promises.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card space-y-3">
              <span className="text-3xl">🔍</span>
              <h3 className="font-bold text-slate-900 text-lg">Instant Scan</h3>
              <p className="text-sm text-slate-650 text-slate-600">Point your camera at any food barcode and get a full nutritional breakdown in seconds.</p>
            </div>
            <div className="card space-y-3">
              <span className="text-3xl">🚨</span>
              <h3 className="font-bold text-slate-900 text-lg">Shrinkflation Alerts</h3>
              <p className="text-sm text-slate-650 text-slate-600">Catch when brands quietly reduce package sizes while keeping the price identical or higher.</p>
            </div>
            <div className="card space-y-3">
              <span className="text-3xl">💪</span>
              <h3 className="font-bold text-slate-900 text-lg">Special Gym Mode</h3>
              <p className="text-sm text-slate-650 text-slate-600">Separate analysis for fitness enthusiasts — protein ratio, amino acids, pre/post workout suitability.</p>
            </div>
            <div className="card space-y-3">
              <span className="text-3xl">⭐</span>
              <h3 className="font-bold text-slate-900 text-lg">Trust Score</h3>
              <p className="text-sm text-slate-650 text-slate-600">Community verified evidence, photo proofs, and price histories for every product archive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHRINKFLATION HIGHLIGHT SECTION ────────────────────────────────── */}
      <section className="py-16 bg-rose-50/20 border-b border-latte">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="section-title">Worst Shrinkflation Examples</h2>
            <p className="section-subtitle">Indian brands are quietly giving you less for the same price. Check the proof.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {worstShrinkflation.map((p) => (
              <div key={p.name} className="card relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-2 right-2 bg-rose-600 text-white font-extrabold text-xs px-2 py-1 rounded-lg">
                  {p.change}
                </div>
                <div className="space-y-3">
                  <div className="relative h-28 w-full bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{p.brand}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>{p.oldSize} → <strong className="text-rose-600">{p.newSize}</strong></span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/leaderboard" className="btn-secondary min-h-[48px] px-6 text-sm font-semibold">
              View Shrinkflation Leaderboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── DEMO SCAN RESULT SECTION ──────────────────────────────────────── */}
      <section className="py-16 bg-latte/30 border-b border-latte">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — copy */}
            <div className="space-y-5">
              <h2 className="section-title">See what scanning really shows you</h2>
              <p className="mt-3 text-base text-espresso/60 leading-relaxed">
                Every scan delivers a full breakdown — ingredients, nutrition flags, shrinkflation history, and a trust score.
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {learnItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-medium text-espresso/70">
                    <span className="mt-0.5 text-brand-600 font-bold text-base leading-none">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/products/maggi-masala-noodles" className="inline-block btn-primary mt-2 min-h-[48px]">
                See a full scan →
              </Link>
            </div>

            {/* Right — real result card (no placeholder) */}
            <div className="mx-auto max-w-sm w-full">
              <div className="rounded-3xl border-2 border-rose-200 bg-white shadow-premium overflow-hidden">
                <div className="bg-brand-600 px-4 py-2.5 flex items-center justify-between">
                  <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Scan Result</span>
                  <span className="text-[10px] font-mono text-white/50">8901058002478</span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
                      🍜
                    </div>
                    <div>
                      <span className="category-pill-food mb-1">🍽️ Food</span>
                      <h3 className="font-bold text-espresso text-base leading-tight mt-1">
                        {featuredProduct.name}
                      </h3>
                      <p className="text-xs text-espresso/40 font-medium">{featuredProduct.brand}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-latte">
                    <span className="badge-rating-red">🔴 Be Careful</span>
                    <span className="text-xs font-bold text-rose-600">Limit Often</span>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { icon: "⚠️", text: "High sodium — 38% of daily intake per serving" },
                      { icon: "⚠️", text: "Low protein — won't keep you full" },
                      { icon: "✅", text: "Fine as an occasional treat" },
                    ].map((point, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs font-semibold text-espresso/70 bg-brand-50/30 p-2.5 rounded-xl border border-latte"
                      >
                        <span>{point.icon}</span>
                        <span>{point.text}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/products/maggi-masala-noodles"
                    className="block text-center text-xs font-bold text-brand-600 hover:text-brand-700 pt-1"
                  >
                    View full analysis →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-900 text-white border-b border-latte">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 grid-cols-2 lg:grid-cols-4 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-400">3,000,000+</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Products Archived</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-400">6</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Countries Covered</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-400">100%</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Free — Always</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-brand-400">0</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hidden Agendas</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENT ACTIVITY ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white border-b border-latte">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Recent Activity</h2>
              <p className="mt-1 text-sm text-espresso/50 font-medium">
                Verified product changes across Indian retail shelves
              </p>
            </div>
            <Link
              href="/latest-changes"
              className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
            >
              See all changes →
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.map((item) => {
              const typeConfig =
                item.type === "shrinkflation"
                  ? { pill: "badge-warning", label: "Shrinkflation", showRed: true }
                  : item.type === "formula"
                  ? { pill: "badge-brand", label: "Formula Change", showRed: false }
                  : { pill: "badge-neutral", label: "Update", showRed: false };
              return (
                <Link
                  key={item.id}
                  href={`/products/${item.productId}`}
                  className="card flex items-center justify-between hover:border-brand-300 hover:scale-[1.003] transition-all duration-300"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={typeConfig.pill}>{typeConfig.label}</span>
                      <span className="font-bold text-espresso truncate">{item.productName}</span>
                      {typeConfig.showRed && (
                        <span className="bg-rose-600 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded ml-2">
                          Pack size down
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-espresso/60 font-medium">{item.summary}</p>
                    <p className="text-xs text-espresso/30 font-bold mt-0.5">
                      {item.country} · {item.date}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4 text-sm font-bold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-100">
                    {item.trustScore}%
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BROWSE HUB — Tabbed ────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-canvas border-b border-latte">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="section-title">Browse the archive</h2>
            <p className="section-subtitle text-espresso/50">
              Explore by country, brand, or category
            </p>
          </div>
          <Suspense fallback={<div className="h-48 shimmer rounded-2xl" />}>
            <TabbedBrowseHubClient />
          </Suspense>
        </div>
      </section>

      {/* ── TRUST SECTION ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-brand-950 text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center space-y-6">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
          >
            Built on evidence, not guesses
          </h2>
          <p className="text-white/60 leading-relaxed max-w-2xl mx-auto text-base">
            Every product earns a trust score from barcode matches, community-submitted photos, and moderator review. Multiple independent reports with readable label photos increase confidence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/methodology"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-espresso shadow-sm hover:bg-brand-50 transition-all min-h-[48px]"
            >
              Read our methodology
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all min-h-[48px]"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mobile floating scan button ───────────────────────────────────── */}
      <FloatingScanButton />
    </>
  );
}
