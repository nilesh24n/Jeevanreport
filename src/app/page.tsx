"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import TabbedBrowseHubClient from "@/components/TabbedBrowseHub";
import FloatingScanButton from "@/components/FloatingScanButton";
import { changeFeed } from "@/lib/data/products";
import { getScanHistory, clearScanHistory, type ScanHistoryEntry } from "@/lib/storage";
import { useLang } from "@/components/LanguageContext";
import { useToast } from "@/components/Toast";
import { RatingBadge } from "@/lib/rating-ui";

const tickerItems = [
  "Maggi 2-Minute Noodles", "Amul Butter", "Dettol Handwash",
  "Kurkure Masala Munch", "Britannia Good Day", "Parle-G Biscuits",
  "Lay's Classic Salted", "Nestle KitKat", "Bournvita", "Horlicks",
  "Colgate MaxFresh", "Surf Excel", "Tata Salt", "Aavin Milk",
  "Amul Cheese Slices",
];

const features = [
  {
    title: "Instant Scan",
    desc: "Point your camera at any barcode and get a full nutritional breakdown in seconds.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    title: "Shrinkflation Alerts",
    desc: "Catch when brands quietly reduce package sizes while keeping prices the same or higher.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
  },
  {
    title: "Gym Mode",
    desc: "Protein ratio, amino acids, and pre/post workout suitability for fitness enthusiasts.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
  },
  {
    title: "Trust Score",
    desc: "Community evidence, photo proofs, and price histories determine data confidence.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

const worstShrinkflation = [
  { name: "Dettol Liquid Handwash", brand: "Dettol", oldSize: "200ml", newSize: "175ml", change: "-12.5%" },
  { name: "Epigamia Mango Greek Yogurt", brand: "Epigamia", oldSize: "100g", newSize: "90g", change: "-10.0%" },
  { name: "Kurkure Masala Munch", brand: "Kurkure", oldSize: "90g", newSize: "82g", change: "-8.9%" },
  { name: "Britannia Good Day Butter Cookies", brand: "Britannia", oldSize: "72g", newSize: "66g", change: "-8.3%" },
  { name: "Maggi 2-Minute Noodles", brand: "Maggi", oldSize: "75g", newSize: "70g", change: "-6.7%" },
];

const learnItems = [
  "Full ingredient logs with simplified breakdowns",
  "Calories per serving and per full pack context",
  "Sugar, fat, protein, and salt colour flags",
  "Vitamins and minerals vs Indian daily values",
  "Overall choice rating: Better, Average, or Limit",
  "Pack size reduction tracking over time",
  "Formula and ingredient modification history",
  "Shrinkflation alerts with photo proof",
];

function ScanPreviewCard() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="absolute -left-3 -top-3 z-10 flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 shadow-card">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        <span className="text-[11px] font-semibold text-emerald-700">Scan complete</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-glow">
        <div className="flex items-center justify-between border-b border-latte bg-brand-700 px-4 py-2.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Scan result</span>
          <span className="font-mono text-[10px] text-white/35">8901058002478</span>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-stone-100 text-xs font-bold text-stone-400">
              IMG
            </div>
            <div>
              <span className="category-pill-food">Food</span>
              <h3 className="mt-1.5 font-semibold leading-tight text-espresso">Maggi 2-Minute Masala Noodles</h3>
              <p className="text-xs text-espresso/45">Maggi · Nestlé India</p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-latte pt-3">
            <RatingBadge color="red" />
            <span className="text-xs font-semibold text-rose-600">Limit often</span>
          </div>

          <div className="space-y-2">
            {[
              { type: "warn", text: "High sodium — 38% of daily intake per serving" },
              { type: "warn", text: "Low protein — won't keep you full" },
              { type: "ok", text: "Fine as an occasional treat" },
            ].map((point) => (
              <div
                key={point.text}
                className={`flex items-start gap-2.5 rounded-xl border px-3 py-2 text-xs font-medium ${
                  point.type === "warn"
                    ? "border-rose-100 bg-rose-50/60 text-rose-800"
                    : "border-emerald-100 bg-emerald-50/60 text-emerald-800"
                }`}
              >
                <span className={`mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full ${point.type === "warn" ? "bg-rose-500" : "bg-emerald-500"}`} />
                {point.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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

  function handleClearHistory() {
    clearScanHistory();
    setHistory([]);
    toast("Scan history cleared", "success");
  }

  function getRatingDot(rating?: string) {
    if (rating === "Good") return "bg-emerald-500";
    if (rating === "Careful") return "bg-amber-500";
    return "bg-rose-500";
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-latte bg-brand-50">
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          {mounted && history.length > 0 ? (
            <div className="space-y-8">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-600">Welcome back</p>
                <h1 className="text-3xl font-semibold text-espresso sm:text-4xl">
                  Your recent scans
                </h1>
                <p className="mt-2 text-sm text-espresso/55">Pick up where you left off or scan something new.</p>
              </div>

              <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
                {history.slice(0, 5).map((item) => (
                  <div
                    key={item.productId + item.scannedAt}
                    className="flex w-60 flex-shrink-0 flex-col justify-between rounded-2xl border border-latte bg-white p-4 shadow-card transition-all hover:border-brand-200 hover:shadow-card-hover"
                  >
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${getRatingDot(item.rating)}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-espresso/45">
                          {item.rating || "Good"}
                        </span>
                      </div>
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-espresso">{item.name}</h3>
                      <p className="mt-1 font-mono text-[10px] text-espresso/35">{item.barcode}</p>
                    </div>
                    <div className="mt-4 border-t border-latte pt-3">
                      <Link href={`/scan?barcode=${item.barcode}`} className="text-xs font-semibold text-brand-600 hover:text-brand-700">
                        View again →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/scan" className="btn-scan min-h-[48px]">Scan new product</Link>
                <button
                  onClick={handleClearHistory}
                  className="min-h-[44px] px-2 text-xs font-medium text-espresso/40 hover:text-rose-600"
                >
                  Clear history
                </button>
              </div>
            </div>
          ) : (
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-300 bg-white px-3.5 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  <span className="text-xs font-medium text-brand-700">India&apos;s product transparency platform</span>
                </div>

                <h1 className="text-3xl font-semibold leading-tight text-espresso sm:text-4xl lg:text-5xl">
                  {t("hero.headline_1") || "Scan any product."}{" "}
                  <span className="text-brand-600">{t("hero.headline_2") || "Know what's really inside."}</span>
                </h1>

                <p className="max-w-lg text-base leading-relaxed text-espresso/60 sm:text-lg">
                  {t("hero.subheading") || "Nutrition, ingredients, and shrinkflation — verified from barcode data and community evidence."}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/scan" id="hero-scan-btn" className="hidden sm:inline-flex btn-scan min-h-[52px] px-8 text-base shadow-md">
                    <svg className="h-5 w-5 text-espresso" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <span>{t("hero.cta_scan") || "Scan barcode"}</span>
                  </Link>
                  <Link href="/search" id="hero-search-btn" className="btn-secondary min-h-[52px] px-8 text-base justify-center">
                    {t("hero.cta_search") || "Search products"}
                  </Link>
                </div>

                <div className="flex max-w-md gap-2 rounded-2xl border border-latte bg-white p-2 shadow-card">
                  <input
                    type="text"
                    placeholder="Search by product name..."
                    className="input-field flex-1 !border-0 !py-2 !shadow-none focus:!ring-0"
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
                    className="btn-primary !px-4 !py-2 text-xs"
                  >
                    Go
                  </button>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-medium text-espresso/45">
                  <span>3M+ products</span>
                  <span>6 countries</span>
                  <span>Free forever</span>
                  <span>No login needed</span>
                </div>
              </div>

              <ScanPreviewCard />
            </div>
          )}
        </div>

        <div className="overflow-hidden border-t border-brand-600 bg-brand-700 py-3">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="inline-flex flex-shrink-0 items-center gap-3 px-6 text-sm text-white/80">
                <span className="h-1 w-1 flex-shrink-0 rounded-full bg-warning-400" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-latte bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 max-w-xl">
            <h2 className="section-title">Why JeevanReport?</h2>
            <p className="section-subtitle !mx-0 mt-3">Facts over marketing. Every scan is backed by label data and community evidence.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="card space-y-4 !p-5">
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <h3 className="font-semibold text-espresso">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-espresso/55">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shrinkflation */}
      <section className="border-b border-latte bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-rose-600">Shrinkflation watch</p>
              <h2 className="section-title">Getting less for the same price</h2>
              <p className="section-subtitle !mx-0 mt-2">Indian brands quietly reducing pack sizes — with proof.</p>
            </div>
            <Link href="/leaderboard" className="btn-secondary shrink-0 text-sm">View leaderboard</Link>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {worstShrinkflation.map((p) => (
              <div key={p.name} className="card relative !p-4">
                <span className="absolute right-3 top-3 rounded-lg bg-rose-600 px-2 py-0.5 text-[11px] font-bold text-white">
                  {p.change}
                </span>
                <div className="mb-3 flex h-16 items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-espresso/35">{p.brand}</p>
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-espresso">{p.name}</h3>
                  </div>
                </div>
                <div className="border-t border-latte pt-3 text-xs font-medium text-espresso/60">
                  <span className="text-espresso/40">{p.oldSize}</span>
                  <span className="mx-1.5 text-espresso/25">→</span>
                  <span className="font-semibold text-rose-600">{p.newSize}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo scan */}
      <section className="border-b border-latte py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="section-title">What every scan reveals</h2>
              <p className="text-base leading-relaxed text-espresso/60">
                Ingredients, nutrition flags, shrinkflation history, and a trust score — all from one barcode.
              </p>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {learnItems.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-espresso/65">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/products/maggi-masala-noodles" className="btn-primary inline-flex min-h-[48px]">
                See a full analysis
              </Link>
            </div>
            <ScanPreviewCard />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-latte bg-brand-700 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {[
              { value: "3M+", label: "Products archived" },
              { value: "6", label: "Countries covered" },
              { value: "100%", label: "Free — always" },
              { value: "0", label: "Hidden agendas" },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="text-3xl font-semibold text-warning-300 sm:text-4xl">{s.value}</p>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent activity */}
      <section className="border-b border-latte bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="section-title">Recent activity</h2>
              <p className="mt-1 text-sm text-espresso/50">Verified product changes across Indian retail shelves</p>
            </div>
            <Link href="/latest-changes" className="shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700">
              See all →
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.map((item) => {
              const isShrink = item.type === "shrinkflation";
              const pill = isShrink ? "badge-warning" : item.type === "formula" ? "badge-brand" : "badge-neutral";
              const label = isShrink ? "Shrinkflation" : item.type === "formula" ? "Formula change" : "Update";
              return (
                <Link
                  key={item.id}
                  href={`/products/${item.productId}`}
                  className="card flex items-center justify-between gap-4 !py-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className={pill}>{label}</span>
                      <span className="truncate font-semibold text-espresso">{item.productName}</span>
                      {isShrink && (
                        <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          Pack size down
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-espresso/55">{item.summary}</p>
                    <p className="mt-0.5 text-xs text-espresso/30">{item.country} · {item.date}</p>
                  </div>
                  <div className="flex-shrink-0 rounded-xl border border-brand-100 bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-700">
                    {item.trustScore}%
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse */}
      <section className="border-b border-latte bg-canvas py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="section-title">Browse the archive</h2>
            <p className="section-subtitle !mx-0 mt-2">Explore by country, brand, or category</p>
          </div>
          <Suspense fallback={<div className="h-48 shimmer rounded-2xl" />}>
            <TabbedBrowseHubClient />
          </Suspense>
        </div>
      </section>

      {/* Trust CTA */}
      <section className="bg-brand-600 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Built on evidence, not guesses
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/80">
            Every product earns a trust score from barcode matches, community photos, and moderator review.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/methodology" className="inline-flex min-h-[48px] items-center rounded-lg bg-warning-400 px-7 py-3 text-sm font-semibold text-espresso transition-colors hover:bg-warning-500">
              Read our methodology
            </Link>
            <Link href="/dashboard" className="inline-flex min-h-[48px] items-center rounded-lg border border-white/40 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
              Go to dashboard
            </Link>
          </div>
        </div>
      </section>

      <FloatingScanButton />
    </>
  );
}
