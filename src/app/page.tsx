import Link from "next/link";
import Image from "next/image";
import ScanInput from "@/components/ScanInput";
import Badge from "@/components/Badge";
import ShrinkflationComparison from "@/components/ShrinkflationComparison";
import PlatformStats from "@/components/PlatformStats";
import DemoBarcodes from "@/components/DemoBarcodes";
import BrowseHub from "@/components/BrowseHub";
import { products, changeFeed, getProductById } from "@/lib/data/products";

export default function HomePage() {
  const featuredProduct = getProductById("maggi-masala-noodles")!;
  const comparisons = products.filter((p) => p.packSizeChanges.length > 0).slice(0, 3);

  const explainerCards = [
    { icon: "🧪", title: "Ingredients simplified", desc: "Instantly see additives, complex preservatives, and allergens in clear wording." },
    { icon: "🎨", title: "Clear color codes", desc: "Green, yellow, and red color tags guide you without complex chemical names." },
    { icon: "📝", title: "Easy summaries", desc: "Short, non-technical points explain whether a product is best for daily use or occasionally." },
    { icon: "📉", title: "Shrinkflation alerts", desc: "Track size changes, skimpflation formula tweaks, and unit price hikes on store shelves." },
  ];

  const learnItems = [
    "Full ingredient logs with simplified break-downs",
    "Calories per serving and per full pack context",
    "Easy Sugar, Fat, Protein, and Salt color flags",
    "Vitamins and minerals mapped to Indian daily values",
    "Clear overall choice rating: Better, Average, or Limit",
    "Ayurvedic and modern consumer satiety indexes",
    "Pack size reduction tracking over time (Shrinkflation)",
    "Formula and ingredient modifications history",
  ];

  return (
    <>
      {/* Hero Section — White and Clean */}
      <section className="bg-white py-16 sm:py-24 border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            {"India's Product Transparency Platform"}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl leading-[1.15]">
            Scan products. <br className="sm:hidden" />
            <span className="text-brand-600">Know the truth.</span>
          </h1>
          <p className="mt-4 text-base text-slate-500 sm:text-lg leading-relaxed max-w-xl mx-auto font-medium">
            Jeevanreport helps you understand packaged food ingredients, nutrition flags, and shrinkflation changes in simple, clear color codes.
          </p>

          {/* Premium Mobile App-Like Search/Scan Box Container */}
          <div className="mt-8 max-w-lg mx-auto bg-slate-50 p-4 rounded-3xl border border-slate-200/60 shadow-premium">
            <ScanInput autoFocus />
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Link href="/scan" className="flex-1 btn-primary text-xs py-3 font-bold">⚡ Scan Barcode</Link>
              <Link href="/search" className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-brand-600 bg-white px-6 py-3 text-xs font-bold text-brand-700 shadow-sm transition-all duration-300 hover:bg-brand-50/50 hover:scale-[1.01] active:scale-[0.99]">🔍 Search Database</Link>
            </div>
          </div>

          <div className="mt-6">
            <DemoBarcodes />
          </div>
        </div>
      </section>

      <PlatformStats />

      {/* Explainer Cards with premium rounded corners and startup visuals */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="section-title text-center">How Jeevanreport works</h2>
          <p className="section-subtitle text-center font-medium">Instant transparency in plain English</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {explainerCards.map((card) => (
              <div key={card.title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
                <h3 className="mt-4 font-extrabold text-lg text-slate-900">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured scan preview - Updated to reflect simplified rating banners */}
      <section className="bg-slate-50/60 py-20 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="section-title text-center">Featured scan preview</h2>
          <p className="section-subtitle text-center font-medium">This is what you see immediately after scanning a product</p>
          <div className="mx-auto mt-12 max-w-md">
            <div className="overflow-hidden rounded-3xl border-2 border-rose-200 bg-rose-50/10 shadow-premium transition-all duration-300 hover:shadow-2xl">
              <div className="bg-brand-600 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white">
                Scan Result Preview
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white border border-slate-100 flex-shrink-0 shadow-sm">
                    <Image src={featuredProduct.imageUrl} alt="" fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{featuredProduct.name}</h3>
                    <p className="text-xs text-slate-550 font-semibold font-mono mt-0.5">{featuredProduct.barcode}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-150 pt-3">
                  <span className="badge-rating-red">
                    🔴 Be Careful
                  </span>
                  <div className="text-right">
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">Choice Level</span>
                    <span className="text-xs font-black text-rose-600">Limit Often</span>
                  </div>
                </div>

                {/* 3 simple preview points */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                    <span>⚠️</span>
                    <span>High sugar — not best for regular use</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                    <span>⚠️</span>
                    <span>Low protein — may not keep you full</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                    <span>✅</span>
                    <span>Better as an occasional treat</span>
                  </div>
                </div>
                
                <div className="pt-2 text-center">
                  <span className="text-xs font-bold text-brand-600 hover:underline">View full analysis →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you learn list */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="section-title">What you learn after scanning</h2>
              <p className="section-subtitle font-medium">Everything you need to make an informed choice in the store aisle</p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {learnItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm font-semibold text-slate-600">
                  <span className="mt-0.5 text-brand-600 font-black">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Featured comparisons */}
      <section className="bg-slate-50/60 py-20 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="section-title text-center">Featured Indian comparisons</h2>
          <p className="section-subtitle text-center font-medium">Old vs new — with photo proof and trust scores</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {comparisons.map((product) => {
              const change = product.packSizeChanges[0];
              if (!change) return null;
              return (
                <Link key={product.id} href={`/products/${product.id}`} className="block hover:scale-[1.01] transition-transform duration-300">
                  <ShrinkflationComparison
                    productName={product.name}
                    imageUrl={product.imageUrl}
                    change={change}
                    trustScore={product.trustScore}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest changes feed */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="section-title">Latest reported changes</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">Verified modifications across retail shelves in India</p>
            </div>
            <Link href="/latest-changes" className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">View all →</Link>
          </div>
          <div className="mt-8 space-y-4">
            {changeFeed.slice(0, 6).map((item) => (
              <Link key={item.id} href={`/products/${item.productId}`} className="card flex items-center justify-between hover:border-brand-200/60 hover:scale-[1.005] transition-all duration-300">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge label={item.type.replace("_", " ")} variant={item.type === "shrinkflation" ? "warning" : "brand"} />
                    <span className="font-extrabold text-slate-900">{item.productName}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-550 font-semibold">{item.summary}</p>
                  <p className="text-xs text-slate-400 font-bold mt-1">{item.country} · {item.date}</p>
                </div>
                <div className="text-base font-extrabold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-100">{item.trustScore}%</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <BrowseHub />

      {/* Trust section */}
      <section className="bg-brand-50/20 py-20 border-y border-brand-100/30">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 space-y-6">
          <h2 className="section-title">Built on evidence, not guesses</h2>
          <p className="text-slate-500 font-semibold leading-relaxed max-w-2xl mx-auto">
            Every product earns a trust score from barcode matches, user-submitted photos, date and store metadata, community confirmations, and moderator review. Multiple independent reports with readable label photos increase confidence.
          </p>
          <Link href="/methodology" className="inline-block btn-primary">Read our methodology</Link>
        </div>
      </section>

      {/* Watchlist CTA */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 space-y-6">
          <h2 className="section-title">Follow products. Get alerts.</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Add products to your watchlist and receive alerts when pack sizes shrink, formulas change, or unit prices increase.
          </p>
          <div className="pt-2">
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-50 border border-brand-100 text-brand-700 px-8 py-3.5 text-sm font-bold shadow-sm transition-all duration-300 hover:bg-brand-100 hover:scale-[1.01] active:scale-[0.99]">Go to Dashboard</Link>
          </div>
        </div>
      </section>
    </>
  );
}
