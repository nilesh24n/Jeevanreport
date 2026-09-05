import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, products } from "@/lib/data/products";
import { dbGetProductById, dbGetProductByBarcode } from "@/lib/db";
import { getProductStatus } from "@/lib/nutrition-engine";
import { classifyProduct } from "@/lib/product-classifier";
import WatchlistButton from "@/components/WatchlistButton";
import ProductJsonLd from "@/components/ProductJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import BackButton from "@/components/BackButton";
import CopyBarcode from "@/components/CopyBarcode";
import ShareButton from "@/components/ShareButton";
import SimilarProducts from "@/components/SimilarProducts";
import PrintButton from "@/components/PrintButton";
import TrustScoreBreakdown from "@/components/TrustScoreBreakdown";
import ProductImage from "@/components/ProductImage";
import ProductAnalysisPanel from "@/components/ProductAnalysisPanel";
import ProductDisclaimerBanner from "@/components/ProductDisclaimerBanner";
import TrustScoreMeter from "@/components/TrustScoreMeter";
import { getRatingCardClass, RatingBadge } from "@/lib/rating-ui";

export const dynamicParams = true;

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

  // Classify product to check if it is a household product
  const catMeta = classifyProduct({
    name: product.name,
    brand: product.brand,
    categorySlug: product.category,
    description: product.baseDescription,
  });
  const isHousehold = catMeta.category === "HOUSEHOLD";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
      <ProductDisclaimerBanner />
      <ProductJsonLd product={product} />
      
      <BackButton productName={product.name} />

      <Breadcrumbs items={[
        { label: "Products", href: "/products" },
        ...(!isHousehold ? [{ label: product.category, href: `/categories/${product.category}` }] : []),
        { label: product.name },
      ]} />

      {/* 1. Simple Visual Overall Result Card */}
      <div className={`card border-2 flex flex-col md:flex-row items-center gap-6 p-4 sm:p-6 ${getRatingCardClass(status.color)}`}>
        <div className="relative mx-auto h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm md:mx-0">
          <ProductImage src={product.imageUrl} alt={product.name} barcode={product.barcode} category={product.category} fill sizes="112px" priority className="object-cover" />
        </div>
        
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{product.name}</h1>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-500">{product.brand} · {product.manufacturer}</p>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-1">
            <div className="flex flex-col items-center md:items-start gap-1">
              <RatingBadge color={status.color} />
              <span className="text-[10px] text-slate-500 font-medium mt-1">
                * Based on public label data as of {v.versionDate || "recent check"}.
              </span>
            </div>
            <CopyBarcode barcode={product.barcode} />
          </div>
        </div>

        {/* Big Product Status Label */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-100 shadow-sm w-full sm:w-44 mx-auto md:mx-0 text-center relative group">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Jeevanreport Assessment</span>
          <span className={`text-base font-black mt-1 ${
            status.color === "green" ? "text-emerald-600" :
            status.color === "yellow" ? "text-amber-600" :
            status.color === "orange" ? "text-orange-500" :
            "text-rose-600"
          }`}>{status.label}</span>
          <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg shadow-lg z-30 leading-snug font-normal">
            This rating is Jeevanreport&apos;s interpretive opinion based on public nutritional formulas. It is not an accusation of brand quality.
          </div>
        </div>
      </div>

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
              {!isHousehold && (
                <span className="text-xs font-bold text-slate-400 font-mono">Category: {product.category}</span>
              )}
              {!isHousehold && <span className="text-slate-300">·</span>}
              <span className="text-xs font-bold text-slate-400 font-mono">Pack size: {v.packSize}</span>
            </div>
          </section>
        </div>

        {/* Sidebar with Score and Pricing */}
        <div className="md:col-span-5 space-y-6">
          <div className="card">
            <TrustScoreMeter score={product.trustScore} level={product.trustLevel} />
          </div>

          {latestPrice && (
            <section className="card space-y-3">
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
          )}
        </div>
      </div>

      {/* Main Analysis and Tabs Panel (with For Everyone / For Gym mode selector) */}
      <ProductAnalysisPanel product={product} />

      {/* Trust and recommendations */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <TrustScoreBreakdown product={product} />
        <SimilarProducts productId={product.id} />
      </div>

      {/* Share Section */}
      <section className="card">
        <ShareButton
          title={product.name}
          slug={product.id}
          rating={status.rating}
          keyFinding={status.points[0]}
        />
      </section>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 print:hidden pt-4 border-t border-slate-100">
        <Link href={`/scan?barcode=${product.barcode}`} className="btn-primary min-h-[44px] flex-1 sm:flex-initial text-center">Scan again</Link>
        <WatchlistButton productId={product.id} name={product.name} brand={product.brand} />
        <PrintButton />
        <Link href={`/compare?ids=${product.id}`} className="btn-secondary min-h-[44px] flex-1 sm:flex-initial text-center">Compare</Link>
        <Link href={`/submit?product=${product.id}`} className="btn-accent min-h-[44px] w-full sm:w-auto text-center">Submit evidence</Link>
      </div>
    </div>
  );
}
