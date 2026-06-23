"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, ProductVersion } from "@/lib/types";
import { getLatestVersion } from "@/lib/data/products";
import { getProductStatus } from "@/lib/nutrition-engine";
import Badge from "./Badge";
import BodyImpactPanel from "./BodyImpactPanel";
import FullPackPanel from "./FullPackPanel";
import ScanTracker from "./ScanTracker";
import WatchlistButton from "./WatchlistButton";
import IngredientComplexity from "./IngredientComplexity";
import NutritionLabel from "./NutritionLabel";
import ShrinkflationComparison from "./ShrinkflationComparison";
import SimilarProducts from "./SimilarProducts";
import ShareButton from "./ShareButton";
import HighlightedIngredient from "./HighlightedIngredient";

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

function getPointIcon(point: string) {
  const p = point.toLowerCase();
  if (p.includes("high sugar") || p.includes("high salt") || p.includes("high fat") || p.includes("limit") || p.includes("calorie dense") || p.includes("low protein") || p.includes("low fiber")) {
    return "⚠️";
  }
  return "✅";
}

export default function ScanResult({ product }: { product: Product }) {
  const v: ProductVersion = getLatestVersion(product);
  const n = v.nutrition;
  const body = v.bodyImpact;

  // Pricing context in INR
  const latestPrice = product.prices[product.prices.length - 1];
  const priceString = latestPrice
    ? `${latestPrice.currency === "INR" ? "₹" : latestPrice.currency + " "}${latestPrice.price}`
    : null;
  const unitPriceString = latestPrice
    ? `${latestPrice.currency === "INR" ? "₹" : latestPrice.currency + " "}${latestPrice.unitPrice}/${v.unit}`
    : null;

  // Rating and status calculations
  const status = getProductStatus(body);

  // Accordion Toggles for detailed layers (for mobile friendliness)
  const [showNutrition, setShowNutrition] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="space-y-6">
      <ScanTracker productId={product.id} name={product.name} barcode={product.barcode} />

      {/* 1. Simple, Color-Coded Verdict Banner */}
      <section className={`card border-2 flex flex-col md:flex-row items-center gap-6 p-6 ${getRatingCardClass(status.color)}`}>
        <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm mx-auto md:mx-0">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="112px" priority />
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-2xl font-black text-slate-900 leading-tight">{product.name}</h1>
          <p className="text-sm font-semibold text-slate-500">{product.brand} · {product.manufacturer}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-1">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-extrabold shadow-sm ring-2 ${
              status.color === "green" ? "bg-emerald-50 text-emerald-700 ring-emerald-500/20" :
              status.color === "yellow" ? "bg-amber-50 text-amber-700 ring-amber-500/20" :
              status.color === "orange" ? "bg-orange-50 text-orange-700 ring-orange-500/20" :
              "bg-rose-50 text-rose-700 ring-rose-500/20"
            }`}>
              {getRatingBadgeText(status.rating, status.color)}
            </span>
            <span className="text-xs font-bold text-slate-400 font-mono">Barcode: {product.barcode}</span>
          </div>
        </div>

        {/* Big Overall Product Choice Status Label */}
        <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm w-36 mx-auto md:mx-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Choice Level</span>
          <span className={`text-base font-black mt-1 ${
            status.color === "green" ? "text-emerald-600" :
            status.color === "yellow" ? "text-amber-600" :
            status.color === "orange" ? "text-orange-500" :
            "text-rose-600"
          }`}>{status.label}</span>
        </div>
      </section>

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

      {/* 4. Layer 1: Nutrition Highlights (Simple Visual Grid) */}
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

      {/* 5. Detailed Core Metrics Accordion (Layer 2) */}
      <section className="card p-0 overflow-hidden border border-slate-100 shadow-card">
        <button 
          onClick={() => setShowNutrition(!showNutrition)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 transition-colors focus:outline-none"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">Detailed Nutrition Facts</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Layer 2: Detailed values, serving sizes, and RDA %</p>
          </div>
          <span className="text-base text-brand-600 font-bold transition-transform duration-300 flex items-center gap-1">
            {showNutrition ? "Hide ▴" : "Show ▾"}
          </span>
        </button>

        {showNutrition && (
          <div className="p-6 border-t border-slate-100 space-y-6 bg-slate-50/10">
            <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
              <div className="w-full max-w-xs mx-auto md:mx-0 flex-shrink-0">
                <NutritionLabel nutrition={n} version={v} />
              </div>
              <div className="flex-1 w-full space-y-4">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Serving Size Reality</h3>
                  <div className="grid grid-cols-2 gap-2.5 text-center text-xs">
                    <div className="rounded-xl bg-white border border-slate-150 p-2.5 shadow-sm">
                      <div className="font-semibold text-slate-400">Calories / Serving</div>
                      <div className="mt-1 text-base font-extrabold text-slate-950">{n.caloriesPerServing} cal</div>
                    </div>
                    <div className="rounded-xl bg-white border border-slate-150 p-2.5 shadow-sm">
                      <div className="font-semibold text-slate-400">Calories / Full Pack</div>
                      <div className="mt-1 text-base font-extrabold text-slate-950">{n.caloriesPerPack} cal</div>
                    </div>
                  </div>
                </div>
                <FullPackPanel nutrition={n} servingsPerPack={v.servingsPerPack} servingSize={v.servingSize} />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 6. Ingredients & Additives Accordion */}
      <section className="card p-0 overflow-hidden border border-slate-100 shadow-card">
        <button 
          onClick={() => setShowIngredients(!showIngredients)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 transition-colors focus:outline-none"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ingredients & Additives Log</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Complexity index, simplified labels, and allergen details</p>
          </div>
          <span className="text-base text-brand-600 font-bold transition-transform duration-300 flex items-center gap-1">
            {showIngredients ? "Hide ▴" : "Show ▾"}
          </span>
        </button>

        {showIngredients && (
          <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/10">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Ingredients text</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                {v.ingredientsText}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Simplified Breakdown</h3>
              <div className="flex flex-wrap gap-1.5">
                {v.simplifiedIngredients.map((ing) => (
                  <span key={ing} className="badge-neutral !rounded-lg">{ing}</span>
                ))}
              </div>
            </div>

            {v.highlightedIngredients.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Highlighted compounds</h3>
                <div className="space-y-1.5">
                  {v.highlightedIngredients.map((h) => (
                    <HighlightedIngredient key={h.name} name={h.name} type={h.type} note={h.note} />
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-t border-slate-100">
              <IngredientComplexity level={v.ingredientComplexity} />
              {v.allergens.length > 0 && (
                <div className="text-xs font-semibold text-danger-700 bg-danger-50 px-3 py-1.5 rounded-lg border border-danger-100/30">
                  Contains allergens: {v.allergens.join(", ")}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 7. Detailed Body Impact Accordion */}
      <section className="card p-0 overflow-hidden border border-slate-100 shadow-card">
        <div className="bg-gradient-to-br from-white to-brand-50/5">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50/50 transition-colors focus:outline-none"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900">Historical TIMELINE & Evidence</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Track size reduction, formula changes, and photo proof</p>
            </div>
            <span className="text-base text-brand-600 font-bold transition-transform duration-300 flex items-center gap-1">
              {showHistory ? "Hide ▴" : "Show ▾"}
            </span>
          </button>
        </div>

        {showHistory && (
          <div className="p-6 border-t border-slate-100 space-y-6 bg-slate-50/10">
            {/* Price retail check */}
            {latestPrice && (
              <div className="inline-flex flex-wrap items-center gap-2 bg-white border border-slate-150 rounded-xl px-4 py-2.5 text-sm shadow-sm">
                <span className="text-slate-500 font-medium">Store Price:</span>
                <span className="text-slate-900 font-extrabold">{priceString}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 font-medium">Unit Cost:</span>
                <span className="text-slate-900 font-semibold">{unitPriceString}</span>
                <span className="text-xs text-slate-400 font-medium">({latestPrice.store})</span>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 pt-2">
              {/* Left side of history: Timeline comparison */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Timeline Changes</h3>
                {product.packSizeChanges.length > 0 || product.formulaChanges.length > 0 ? (
                  <>
                    {product.packSizeChanges.map((c) => (
                      <div key={c.date} className="rounded-xl border border-slate-150 p-2 bg-white shadow-sm">
                        <ShrinkflationComparison
                          productName={product.name}
                          imageUrl={product.imageUrl}
                          change={c}
                          trustScore={product.trustScore}
                        />
                      </div>
                    ))}

                    {product.formulaChanges.map((c) => (
                      <div key={c.date} className="rounded-xl border border-brand-100 bg-white p-4 space-y-2 shadow-sm">
                        <div className="flex items-center justify-between">
                          <Badge label="Formula changed" variant="brand" />
                          <span className="text-[10px] text-slate-400 font-mono">{c.date}</span>
                        </div>
                        <p className="text-sm text-slate-700 font-semibold">{c.summary}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-xs text-slate-400 italic">No shrinkflation or size changes reported for this product.</p>
                )}
              </div>

              {/* Right side of history: Price trends & photos */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Unit Price Trend</h3>
                {product.prices.length >= 2 ? (
                  <div className="rounded-xl border border-slate-200/60 p-4 bg-white text-sm space-y-2 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Badge label="Price trend" variant="warning" />
                      <span className="text-[10px] text-slate-400 font-semibold font-mono">{product.prices[0].dateObserved} to {product.prices[product.prices.length - 1].dateObserved}</span>
                    </div>
                    <p className="text-slate-700 font-semibold">
                      Unit price altered: <span className="font-extrabold text-slate-950">
                        ₹{product.prices[0].unitPrice}
                      </span> → <span className="font-extrabold text-brand-600">
                        ₹{product.prices[product.prices.length - 1].unitPrice}
                      </span> per {v.unit}
                    </p>
                    <p className="text-xs text-slate-500">
                      Observed at {product.prices[0].store}. Overall price shifted from ₹{product.prices[0].price} to ₹{product.prices[product.prices.length - 1].price}.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-100 p-4 text-center text-xs text-slate-400 bg-white shadow-sm">
                    No price shifts recorded on retail shelves.
                  </div>
                )}

                {/* Submitted Proof Photos if any */}
                {product.submissions.length > 0 && (
                  <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">User-submitted Photo Proof</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {product.submissions.flatMap((s) =>
                        Object.entries(s.media).filter(([, url]) => url).slice(0, 2).map(([type, url]) => (
                          <div key={`${s.id}-${type}`} className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200">
                            <Image src={url!} alt={type} fill className="object-cover" unoptimized sizes="150px" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-brand-50 border border-brand-100/50 rounded-2xl p-4 w-full">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Total Trust Verification Score</span>
              <span className="text-2xl font-black text-brand-700 mt-1">{product.trustScore}% ({product.trustLevel})</span>
            </div>
          </div>
        )}
      </section>

      {/* 8. Detailed Body Impact Panel (Always accessible, styled clean) */}
      <section className="card border-brand-100 bg-gradient-to-br from-white to-brand-50/5 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Detailed Educational Impact Summary</h2>
            <p className="text-xs text-slate-400 font-medium">Ayurvedic & modern nutritional markers</p>
          </div>
          <span className="badge-brand">Educational Guidance</span>
        </div>
        <BodyImpactPanel body={body} />
      </section>

      {/* 9. Similar products recommendations */}
      <SimilarProducts productId={product.id} />

      {/* 10. Large, Thumb-Friendly Mobile Actions (Blue Actions) */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 pt-4 border-t border-slate-100">
        <div className="col-span-2">
          <WatchlistButton productId={product.id} name={product.name} brand={product.brand} />
        </div>
        <ShareButton title={product.name} />
        <Link href={`/compare?ids=${product.id}`} className="btn-secondary text-center">Compare</Link>
        <Link href={`/submit?product=${product.id}`} className="col-span-2 btn-primary text-center">⚡ Submit Proof</Link>
      </div>
    </div>
  );
}
