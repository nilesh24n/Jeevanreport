"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, ProductVersion } from "@/lib/types";
import { getLatestVersion } from "@/lib/data/products";
import { getProductStatus } from "@/lib/nutrition-engine";
import { classifyProduct } from "@/lib/product-classifier";
import { isConsumableProduct } from "@/lib/consumable-filter";
import BodyImpactPanel from "./BodyImpactPanel";
import FullPackPanel from "./FullPackPanel";
import ScanTracker from "./ScanTracker";
import WatchlistButton from "./WatchlistButton";
import IngredientComplexity from "./IngredientComplexity";
import NutritionLabel from "./NutritionLabel";
import SimilarProducts from "./SimilarProducts";
import ShareButton from "./ShareButton";
import HighlightedIngredient from "./HighlightedIngredient";
import GymModePanel from "./GymModePanel";
import EverydayModePanel from "./EverydayModePanel";
import ShrinkflationApiPanel from "./ShrinkflationApiPanel";

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

  // Check if this is a consumable product FIRST
  const isFood = isConsumableProduct(product);

  // Product category classification (for reference only, but we override based on consumable check)
  const catMeta = classifyProduct({
    name: product.name,
    brand: product.brand,
    categorySlug: product.category,
    description: product.baseDescription,
  });

  // Rating and status calculations (only meaningful for food)
  const status = getProductStatus(body);

  // Mode Toggle: "gym" | "everyday"
  const [scanMode, setScanMode] = useState<"gym" | "everyday">("everyday");

  // Accordion Toggles for detailed layers (for mobile friendliness)
  const [showNutrition, setShowNutrition] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);


  if (!isFood) {
    // Non-consumable product - show only warning
    return (
      <div className="space-y-6">
        <div className="bg-rose-50 border-4 border-rose-400 rounded-3xl p-8 space-y-5 text-center">
          <div className="flex flex-col items-center gap-4">
            <span className="text-6xl">🛑</span>
            <div>
              <h2 className="font-bold text-rose-900 text-2xl">Not for Consumption</h2>
              <p className="text-base text-rose-800 mt-3 leading-relaxed max-w-md">
                This platform is designed <strong>exclusively for edible and consumable products</strong>.
              </p>
              <div className="bg-white/60 rounded-2xl p-4 mt-4 border border-rose-200">
                <p className="text-lg font-bold text-rose-900">
                  📱 Please scan a food or beverage product instead
                </p>
                <p className="text-sm text-rose-700 mt-2">
                  Examples: Food items, Beverages, Snacks, Dairy products, Grains, etc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For consumable products - show full content
  return (
    <div className="space-y-6">
      {/* ── Sticky Mode Toggle ── */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-2 max-w-xs">
          <button
            id="scan-mode-gym"
            onClick={() => setScanMode("gym")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
              scanMode === "gym"
                ? "bg-brand-600 text-white shadow-md scale-[1.02]"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <span>💪</span> Gym Mode
          </button>
          <button
            id="scan-mode-everyday"
            onClick={() => setScanMode("everyday")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
              scanMode === "everyday"
                ? "bg-brand-600 text-white shadow-md scale-[1.02]"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            <span>🥗</span> Everyday
          </button>
        </div>
      </div>
      <ScanTracker productId={product.id} name={product.name} barcode={product.barcode} />

      {/* 1. Simple, Color-Coded Verdict Banner */}
      <section className={`card border-2 flex flex-col md:flex-row items-center gap-6 p-6 ${getRatingCardClass(status.color)}`}>
        <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm mx-auto md:mx-0">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="112px" priority />
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-1">
            {/* Category badge */}
            <span className={catMeta.pillClass}>
              {catMeta.emoji} {catMeta.label}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-espresso leading-tight">{product.name}</h1>
          <p className="text-sm font-semibold text-espresso/50">{product.brand} · {product.manufacturer}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-1">
            {isFood && (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm ring-2 ${
                status.color === "green" ? "bg-emerald-50 text-emerald-700 ring-emerald-500/20" :
                status.color === "yellow" ? "bg-amber-50 text-amber-700 ring-amber-500/20" :
                status.color === "orange" ? "bg-orange-50 text-orange-700 ring-orange-500/20" :
                "bg-rose-50 text-rose-700 ring-rose-500/20"
              }`}>
                {getRatingBadgeText(status.rating, status.color)}
              </span>
            )}
            <span className="text-xs font-bold text-espresso/30 font-mono">Barcode: {product.barcode}</span>
          </div>
        </div>

        {/* Choice level — food only */}
        {isFood && (
          <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-latte shadow-sm w-36 mx-auto md:mx-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-espresso/40">Choice Level</span>
            <span className={`text-base font-bold mt-1 ${
              status.color === "green" ? "text-emerald-600" :
              status.color === "yellow" ? "text-amber-600" :
              status.color === "orange" ? "text-orange-500" :
              "text-rose-600"
            }`}>{status.label}</span>
          </div>
        )}
      </section>

      {/* ── Dual Mode Panel (food/supplement only) ── */}
      <section>
        {scanMode === "gym" ? (
          <GymModePanel version={v} />
        ) : (
          <EverydayModePanel version={v} />
        )}
      </section>

      {/* 2. Visual Assessment Points — food only */}
      <section className="card space-y-4">
        <h2 className="text-lg font-bold text-espresso flex items-center gap-2">
          <span>⚡</span> Quick Assessment
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {status.points.map((p, idx) => (
            <li key={idx} className="flex items-start gap-2.5 bg-brand-50/30 p-3 rounded-xl border border-latte">
              <span className="text-base mt-0.5">{getPointIcon(p)}</span>
              <span className="text-sm font-semibold text-espresso/80 leading-snug">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Easy Summary Card — food only */}
      <section className="card space-y-4">
        <h2 className="text-lg font-bold text-espresso flex items-center gap-2">
          <span>📝</span> Easy Summary
        </h2>
        <div className="bg-brand-50/20 border border-latte rounded-2xl p-5 space-y-4">
          <p className="text-base font-semibold leading-relaxed text-espresso/80">
            {status.rating === 'Good' ? "This product is a good choice to consume daily or regularly. It has balanced nutrients and no high warning signs." :
             status.rating === 'Okay' ? "This product is okay to consume daily in moderate quantities. Keep an eye on portions." :
             status.color === 'orange' ? "Caution: This product has moderate warning signs. It is best to limit consumption or consume it occasionally." :
             "Be Careful: This product has high sugar, high salt, or high fat. It is best to limit consumption and treat it as an occasional item to consume."}
          </p>
          
          <div className="grid gap-3.5 sm:grid-cols-2 text-sm pt-4 border-t border-latte">
            <div className="flex justify-between py-1.5 border-b border-latte">
              <span className="font-semibold text-espresso/50">Regular use suitability:</span>
              <span className="font-bold text-espresso">
                {body.occasionLabel === "Better staple candidate" ? "Suitable for daily use" : 
                 body.occasionLabel === "Moderate frequency" ? "Eat in moderation" : "Limit often"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-latte">
              <span className="font-semibold text-espresso/50">Sugar level:</span>
              <span className={`font-bold ${body.sugarFlag === 'High' ? 'text-rose-600' : 'text-espresso'}`}>
                {body.sugarFlag === 'High' ? "High sugar" : body.sugarFlag === 'Moderate' ? "Medium sugar" : "Low sugar"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-latte">
              <span className="font-semibold text-espresso/50">Salt / Sodium:</span>
              <span className={`font-bold ${body.sodiumFlag === 'High' ? 'text-rose-600' : 'text-espresso'}`}>
                {body.sodiumFlag === 'High' ? "High salt" : body.sodiumFlag === 'Moderate' ? "Medium salt" : "Low salt"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-latte">
              <span className="font-semibold text-espresso/50">Fat content:</span>
              <span className={`font-bold ${body.saturatedFatFlag === 'High' ? 'text-rose-600' : 'text-espresso'}`}>
                {body.saturatedFatFlag === 'High' ? "High fat" : body.saturatedFatFlag === 'Moderate' ? "Medium fat" : "Low fat"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-latte">
              <span className="font-semibold text-espresso/50">Protein:</span>
              <span className={`font-bold ${body.proteinFlag === 'Low' ? 'text-rose-500' : 'text-espresso'}`}>
                {body.proteinFlag === 'High' ? "High protein" : body.proteinFlag === 'Moderate' ? "Medium protein" : "Low protein"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-latte">
              <span className="font-semibold text-espresso/50">Likely filling:</span>
              <span className="font-bold text-espresso">
                {body.satietyLabel === 'More filling' ? "More filling" : 
                 body.satietyLabel === 'Moderately filling' ? "Moderately filling" : "Less filling"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Nutrition Highlights */}
      <section className="card space-y-4">
        <div className="border-b border-latte pb-3">
          <h2 className="text-lg font-bold text-espresso">Nutrition Highlights</h2>
          <p className="text-xs text-espresso/30 font-medium">Per serving — key nutrient levels at a glance</p>
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
            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl border border-latte bg-brand-50/20">
              <div className="flex items-center gap-2">
                <span className="text-base">{item.icon}</span>
                <span className="text-xs font-bold text-espresso/70">{item.label}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getNutrientTagColor(item.label, item.val)}`}>
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Detailed Core Metrics Accordion */}
      <section className="card p-0 overflow-hidden border border-latte shadow-card">
        <button 
          onClick={() => setShowNutrition(!showNutrition)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-brand-50/10 transition-colors focus:outline-none"
        >
          <div>
            <h2 className="text-lg font-bold text-espresso">Detailed Nutrition Facts</h2>
            <p className="text-xs text-espresso/30 font-medium mt-0.5">Serving sizes, macros and % daily values</p>
          </div>
          <span className="text-base text-brand-600 font-bold transition-transform duration-300 flex items-center gap-1">
            {showNutrition ? "Hide ▴" : "Show ▾"}
          </span>
        </button>

        {showNutrition && (
          <div className="p-6 border-t border-latte space-y-6 bg-brand-50/5">
            <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
              <div className="w-full max-w-xs mx-auto md:mx-0 flex-shrink-0">
                <NutritionLabel nutrition={n} version={v} />
              </div>
              <div className="flex-1 w-full space-y-4">
                <div className="rounded-xl bg-brand-50/20 border border-latte p-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-espresso/30">Serving Size Reality</h3>
                  <div className="grid grid-cols-2 gap-2.5 text-center text-xs">
                    <div className="rounded-xl bg-white border border-latte p-2.5 shadow-sm">
                      <div className="font-semibold text-espresso/40">Calories / Serving</div>
                      <div className="mt-1 text-base font-bold text-espresso">{n.caloriesPerServing} cal</div>
                    </div>
                    <div className="rounded-xl bg-white border border-latte p-2.5 shadow-sm">
                      <div className="font-semibold text-espresso/40">Calories / Full Pack</div>
                      <div className="mt-1 text-base font-bold text-espresso">{n.caloriesPerPack} cal</div>
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

      {/* 9. Shrinkflation & Package Size Changes (for consumable products) */}
      {isFood && (
        <section>
          <ShrinkflationApiPanel productId={product.id} initialProduct={product} />
        </section>
      )}

      {/* 10. Similar products recommendations */}
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
