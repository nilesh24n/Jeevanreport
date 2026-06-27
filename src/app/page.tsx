import { Suspense } from "react";
import Link from "next/link";
import ScanInput from "@/components/ScanInput";
import TabbedBrowseHubClient from "@/components/TabbedBrowseHub";
import FloatingScanButton from "@/components/FloatingScanButton";
import { products, changeFeed } from "@/lib/data/products";

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

export default function HomePage() {
  const recentActivity = changeFeed.slice(0, 4);
  const featuredProduct = products.find((p) => p.id === "maggi-masala-noodles")!;

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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
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
                Scan any product.{" "}
                <span className="text-brand-600">
                  Know what&apos;s really inside.
                </span>
              </h1>

              <p className="text-lg text-espresso/60 leading-relaxed max-w-lg">
                Trusted by lakhs of Indians who read labels before buying.
              </p>

              {/* Search box */}
              <div className="max-w-md bg-white rounded-2xl border border-latte shadow-mocha p-3">
                <ScanInput autoFocus />
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/scan"
                  id="hero-scan-btn"
                  className="btn-primary !px-7 !py-3.5 !text-sm !font-semibold"
                >
                  ⚡ Scan Barcode
                </Link>
                <Link
                  href="/search"
                  id="hero-search-btn"
                  className="btn-secondary !px-7 !py-3.5 !text-sm"
                >
                  🔍 Search a Product
                </Link>
              </div>
            </div>

            {/* Right — animated CSS barcode */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-56 sm:w-64">
                <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-latte shadow-premium p-6">
                  {/* Bars */}
                  <div className="flex items-end gap-[3px] h-36 mb-3">
                    {[3,7,2,5,8,3,6,4,7,2,8,5,3,7,4,6,2,8,4,6,3,7,5,2,8,6,3,7,2,5,8].map((w, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 bg-espresso rounded-sm"
                        style={{ width: `${w * 1.5}px`, height: `${60 + (i % 4) * 10}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-center font-mono text-[11px] text-espresso/40 tracking-[0.3em]">
                    8901058002478
                  </p>
                  {/* Laser sweep */}
                  <div className="laser-line absolute left-4 right-4 h-0.5 rounded-full bg-brand-600/70 shadow-[0_0_8px_2px_rgba(155,118,83,0.5)]" />
                </div>

                {/* Floating result chip */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl border-2 border-emerald-200 shadow-premium p-3 w-40">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-[10px] font-bold text-emerald-700">🟢 Good Choice</span>
                  </div>
                  <p className="text-[10px] text-espresso/50 leading-snug">
                    Low sugar · Decent protein · Safe to eat daily
                  </p>
                </div>
              </div>
            </div>
          </div>
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

      {/* ── FEATURED SCAN PREVIEW ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-latte/30 border-b border-latte">
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
              <Link href="/products/maggi-masala-noodles" className="inline-block btn-primary mt-2">
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
                  ? { pill: "badge-warning", label: "Shrinkflation" }
                  : item.type === "formula"
                  ? { pill: "badge-brand", label: "Formula Change" }
                  : { pill: "badge-neutral", label: "Update" };
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-semibold text-espresso shadow-sm hover:bg-brand-50 transition-all"
            >
              Read our methodology
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
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
