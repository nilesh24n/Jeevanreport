import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductById, products } from "@/lib/data/products";
import { dbGetProductById, dbGetProductByBarcode } from "@/lib/db";
import { getProductStatus } from "@/lib/nutrition-engine";
import ProductDetailTabs from "@/components/ProductDetailTabs";
import WatchlistButton from "@/components/WatchlistButton";
import ProductJsonLd from "@/components/ProductJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import CopyBarcode from "@/components/CopyBarcode";
import ShareButton from "@/components/ShareButton";
import SimilarProducts from "@/components/SimilarProducts";
import PrintButton from "@/components/PrintButton";
import TrustScoreBreakdown from "@/components/TrustScoreBreakdown";

function getRatingCardClass(color: string) {
  switch (color) {
    case "green": return "border-emerald-200 bg-emerald-50/15";
    case "yellow": return "border-amber-200 bg-amber-50/15";
    case "orange": return "border-orange-200 bg-orange-50/15";
    case "red":
    default:
      return "border-rose-200 bg-rose-50/15";
  }
}

function getRatingBadgeText(rating: string, color: string) {
  switch (color) {
    case "green": return "🟢 Good Choice";
    case "yellow": return "🟡 Okay Choice";
    case "orange": return "🟠 Caution";
    case "red":
    default:
      return "🔴 Be Careful";
  }
}

function getPointIcon(point: string) {
  const p = point.toLowerCase();
  if (p.includes("high sugar") || p.includes("high salt") || p.includes("high fat") || p.includes("limit") || p.includes("calorie dense") || p.includes("low protein") || p.includes("low fiber")) {
    return "⚠️";
  }
  return "✅";
}

function getNutrientTagColor(label: string, value: string) {
  if (label === "Protein" || label === "Fiber") {
    if (value === "High") return "bg-emerald-50 text-emerald-700 border border-emerald-100";
    if (value === "Low") return "bg-rose-50 text-rose-700 border border-rose-100";
    return "bg-amber-50 text-amber-700 border border-amber-100";
  } else {
    if (value === "High") return "bg-rose-50 text-rose-700 border border-rose-100";
    if (value === "Low") return "bg-emerald-50 text-emerald-700 border border-emerald-100";
    return "bg-amber-50 text-amber-700 border border-amber-100";
  }
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  let product = getProductById(id);
  if (!product) {
    product = (await dbGetProductById(id)) || (await dbGetProductByBarcode(id)) || undefined;
  }
  if (!product) return { title: "Product not found — Jeevanreport" };
  const v = product.versions.at(-1)!;
  return {
    title: `${product.name} — Jeevanreport`,
    description: `${product.brand} · ${v.country} · ${v.nutrition.caloriesPerServing} cal/serving. Ingredients, nutrition, shrinkflation history, and trust score ${product.trustScore}%.`,
    openGraph: {
      title: product.name,
      description: product.baseDescription,
      images: [{ url: product.imageUrl }],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product = getProductById(id);
  if (!product) {
    product = (await dbGetProductById(id)) || (await dbGetProductByBarcode(id)) || undefined;
  }
  if (!product) notFound();

  const v = product.versions[product.versions.length - 1];
  const latestPrice = product.prices[product.prices.length - 1];
  const body = v.bodyImpact;

  // Formatting INR pricing
  const priceString = latestPrice
    ? `${latestPrice.currency === "INR" ? "₹" : latestPrice.currency + " "}${latestPrice.price}`
    : null;
  const unitPriceString = latestPrice
    ? `${latestPrice.currency === "INR" ? "₹" : latestPrice.currency + " "}${latestPrice.unitPrice}/${v.unit}`
    : null;

  // Rating and assessment calculations
  const status = getProductStatus(body);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      <ProductJsonLd product={product} />
      
      <Breadcrumbs items={[
        { label: "Products", href: "/products" },
        { label: product.category, href: `/categories/${product.category}` },
        { label: product.name },
      ]} />

      {/* 1. Simple Visual Overall Result Card */}
      <div className={`card border-2 flex flex-col md:flex-row items-center gap-6 p-6 ${getRatingCardClass(status.color)}`}>
        <div className="relative mx-auto h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm md:mx-0">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="112px" priority />
        </div>
        
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{product.name}</h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">{product.brand} · {product.manufacturer}</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-1">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-extrabold shadow-sm ring-2 ${
              status.color === "green" ? "bg-emerald-50 text-emerald-700 ring-emerald-500/20" :
              status.color === "yellow" ? "bg-amber-50 text-amber-700 ring-amber-500/20" :
              status.color === "orange" ? "bg-orange-50 text-orange-700 ring-orange-500/20" :
              "bg-rose-50 text-rose-700 ring-rose-500/20"
            }`}>
              {getRatingBadgeText(status.rating, status.color)}
            </span>
            <CopyBarcode barcode={product.barcode} />
          </div>
        </div>

        {/* Big Product Status Label */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-sm w-36 mx-auto md:mx-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Choice Level</span>
          <span className={`text-base font-black mt-1 ${
            status.color === "green" ? "text-emerald-600" :
            status.color === "yellow" ? "text-amber-600" :
            status.color === "orange" ? "text-orange-500" :
            "text-rose-600"
          }`}>{status.label}</span>
        </div>
      </div>

      {/* 2. Visual Assessment Points (3-5 points only) */}
      <section className="card space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>⚡</span> Quick Assessment
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {status.points.map((p, idx) => (
            <li key={idx} className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-base mt-0.5">{getPointIcon(p)}</span>
              <span className="text-sm font-semibold text-slate-700 leading-snug">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Easy Summary Card (No medical/jargon terms) */}
      <section className="card space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>📝</span> Easy Summary
        </h2>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
          <p className="text-base font-semibold leading-relaxed text-slate-800">
            {status.rating === 'Good' ? "This product is a good choice for daily or regular use. It has balanced nutrients and no high warning signs." :
             status.rating === 'Okay' ? "This product is okay for daily use in moderate quantities. Keep an eye on portions." :
             status.color === 'orange' ? "Caution: This product has moderate warning signs. It is best to limit consumption or use occasionally." :
             "Be Careful: This product has high sugar, high salt, or high fat. It is best to limit consumption and treat it as an occasional treat."}
          </p>
          
          <div className="grid gap-3.5 sm:grid-cols-2 text-sm pt-4 border-t border-slate-200/60">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="font-semibold text-slate-500">Regular use suitability:</span>
              <span className="font-extrabold text-slate-800">
                {body.occasionLabel === "Better staple candidate" ? "Suitable for daily use" : 
                 body.occasionLabel === "Moderate frequency" ? "Eat in moderation" : "Limit often"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="font-semibold text-slate-500">Sugar level:</span>
              <span className={`font-extrabold ${body.sugarFlag === 'High' ? 'text-rose-600' : 'text-slate-800'}`}>
                {body.sugarFlag === 'High' ? "High sugar" : body.sugarFlag === 'Moderate' ? "Medium sugar" : "Low sugar"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="font-semibold text-slate-500">Salt / Sodium:</span>
              <span className={`font-extrabold ${body.sodiumFlag === 'High' ? 'text-rose-600' : 'text-slate-800'}`}>
                {body.sodiumFlag === 'High' ? "High salt" : body.sodiumFlag === 'Moderate' ? "Medium salt" : "Low salt"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="font-semibold text-slate-500">Fat content:</span>
              <span className={`font-extrabold ${body.saturatedFatFlag === 'High' ? 'text-rose-600' : 'text-slate-800'}`}>
                {body.saturatedFatFlag === 'High' ? "High fat" : body.saturatedFatFlag === 'Moderate' ? "Medium fat" : "Low fat"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="font-semibold text-slate-500">Protein:</span>
              <span className={`font-extrabold ${body.proteinFlag === 'Low' ? 'text-rose-500' : 'text-slate-800'}`}>
                {body.proteinFlag === 'High' ? "High protein" : body.proteinFlag === 'Moderate' ? "Medium protein" : "Low protein"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="font-semibold text-slate-500">Likely filling:</span>
              <span className="font-extrabold text-slate-800">
                {body.satietyLabel === 'More filling' ? "More filling" : 
                 body.satietyLabel === 'Moderately filling' ? "Moderately filling" : "Less filling"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Layer 1: Visual Nutrition Highlights */}
      <section className="card space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900">Nutrition Highlights</h2>
          <p className="text-xs text-slate-400 font-medium">Layer 1: Simple visual summary</p>
        </div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
          {[
            { label: "Sugar", val: body.sugarFlag, icon: "🍬" },
            { label: "Fat", val: body.saturatedFatFlag, icon: "🥑" },
            { label: "Protein", val: body.proteinFlag, icon: "💪" },
            { label: "Fiber", val: body.fiberFlag, icon: "🌾" },
            { label: "Salt/Sodium", val: body.sodiumFlag, icon: "🧂" },
            { label: "Calories", val: body.energyDensityLabel, icon: "🔋" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-base">{item.icon}</span>
                <span className="text-xs font-bold text-slate-600">{item.label}</span>
              </div>
              <span className={`text-xs font-black px-2 py-0.5 rounded-md border ${getNutrientTagColor(item.label, item.val)}`}>
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Pricing & Base Description Card */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Description / Info Card */}
        <div className="md:col-span-7">
          <section className="card h-full space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Product Info</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/40 p-4 rounded-2xl border border-slate-100">
              {product.baseDescription}
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <span className="text-xs font-bold text-slate-400 font-mono">Category: {product.category}</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-bold text-slate-400 font-mono">Pack size: {v.packSize}</span>
            </div>
          </section>
        </div>

        {/* Pricing card */}
        {latestPrice && (
          <div className="md:col-span-5">
            <section className="card h-full space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pricing Context</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Retail Store Price</span>
                  <span className="text-base font-black text-slate-950">{priceString}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Unit Price ({v.unit})</span>
                  <span className="text-sm font-bold text-slate-800">{unitPriceString}</span>
                </div>
                <p className="text-[10px] text-slate-400 text-center font-mono">
                  Price tracked at {latestPrice.store} on {latestPrice.dateObserved}
                </p>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Tabs containing further details: Pack history, formula changes, price trend, photos, reports, trust score */}
      <ProductDetailTabs product={product} />

      {/* Trust and recommendations */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TrustScoreBreakdown product={product} />
        <SimilarProducts productId={product.id} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 print:hidden pt-4 border-t border-slate-100">
        <Link href={`/scan?barcode=${product.barcode}`} className="btn-primary">Scan again</Link>
        <WatchlistButton productId={product.id} name={product.name} brand={product.brand} />
        <ShareButton title={product.name} />
        <PrintButton />
        <Link href={`/compare?ids=${product.id}`} className="btn-secondary">Compare</Link>
        <Link href={`/submit?product=${product.id}`} className="btn-accent">Submit evidence</Link>
      </div>
    </div>
  );
}
