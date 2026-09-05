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
import ProductDisclaimerBanner from "./ProductDisclaimerBanner";
import { getRatingCardClass, RatingBadge, getPointIcon } from "@/lib/rating-ui";

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

  // Also block if classifier identifies it as Household
  const isHousehold = catMeta.category === "HOUSEHOLD";

  // Rating and status calculations (only meaningful for food)
  const status = getProductStatus(body);

  // Mode Toggle: "gym" | "everyday"
  const [scanMode, setScanMode] = useState<"gym" | "everyday">("everyday");

  // Accordion Toggles for detailed layers (for mobile friendliness)
  const [showNutrition, setShowNutrition] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);


  if (!isFood || isHousehold) {
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
      <ProductDisclaimerBanner />
      {/* ── Sticky Mode Toggle ── */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 backdrop-blur-xl bg-canvas/90 border-b border-latte">
        <div className="flex items-center gap-2 max-w-xs">
          <button
            id="scan-mode-gym"
            onClick={() => setScanMode("gym")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              scanMode === "gym"
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-stone-100 text-espresso/55 hover:bg-stone-200"
            }`}
          >
            Gym mode
          </button>
          <button
            id="scan-mode-everyday"
            onClick={() => setScanMode("everyday")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              scanMode === "everyday"
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-stone-100 text-espresso/55 hover:bg-stone-200"
            }`}
          >
            Everyday
          </button>
        </div>
      </div>
      <ScanTracker
        productId={product.id}
        name={product.name}
        barcode={product.barcode}
        rating={
          status.rating === "Good"
            ? "Good"
            : status.rating === "Okay" || status.color === "orange"
            ? "Careful"
            : "Limit"
        }
      />

      {/* 1. Simple, Color-Coded Verdict Banner */}
      <section className={`card border-2 flex flex-col md:flex-row items-center gap-6 p-6 ${getRatingCardClass(status.color)}`}>
        <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-white border border-latte shadow-sm mx-auto md:mx-0">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="112px" priority />
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-1">
            {/* Category badge — hide for household products */}
            {!isHousehold && (
              <span className={catMeta.pillClass}>
                {catMeta.emoji} {catMeta.label}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-espresso leading-tight">{product.name}</h1>
          <p className="text-sm font-semibold text-espresso/50">{product.brand} · {product.manufacturer}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 pt-1">
            {isFood && (
              <div className="flex flex-col items-start gap-1">
                <RatingBadge color={status.color} />
                <span className="text-[10px] text-espresso/50 font-medium mt-1">
                  * Factual data from package labels as of {v.versionDate || "recent check"}.
                </span>
              </div>
            )}
            <span className="text-xs font-bold text-espresso/30 font-mono">Barcode: {product.barcode}</span>
          </div>
        </div>

        {/* Choice level — food only */}
        {isFood && (
          <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border border-latte shadow-sm w-44 mx-auto md:mx-0 text-center relative group">
            <span className="text-[9px] font-bold uppercase tracking-wider text-espresso/45">Jeevanreport Assessment</span>
            <span className={`text-base font-bold mt-1 ${
              status.color === "green" ? "text-emerald-600" :
              status.color === "yellow" ? "text-amber-600" :
              status.color === "orange" ? "text-orange-500" :
              "text-rose-600"
            }`}>{status.label}</span>
            <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-brand-800 text-white text-[10px] rounded-lg shadow-lg z-30 leading-snug">
              This rating is Jeevanreport&apos;s interpretive opinion based on public nutritional formulas. It is not an accusation of brand quality.
            </div>
          </div>
        )}
      </section>

      {/* ── Dual Mode Panel (food/supplement only) ── */}
      <section>
        {scanMode === "gym" ? (
          <GymModePanel version={v} />
        ) : (
          <EverydayModePanel version={v} status={status} />
        )}
      </section>

      {/* 2. Visual Assessment Points — food only */}
      <section className="card space-y-4">
        <h2 className="text-lg font-semibold text-espresso">Quick assessment</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {status.points.map((p, idx) => (
            <li key={idx} className="flex items-start gap-2.5 rounded-xl border border-latte bg-brand-50/20 p-3">
              <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${getPointIcon(p) === "warn" ? "bg-rose-500" : "bg-emerald-500"}`} />
              <span className="text-sm font-medium leading-snug text-espresso/75">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. Easy Summary Card — food only */}
      <section className="card space-y-4">
        <h2 className="text-lg font-semibold text-espresso">Easy summary</h2>
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
            { label: "Sugar", val: body.sugarFlag },
            { label: "Fat", val: body.saturatedFatFlag },
            { label: "Protein", val: body.proteinFlag },
            { label: "Fiber", val: body.fiberFlag },
            { label: "Salt/Sodium", val: body.sodiumFlag },
            { label: "Calories", val: body.energyDensityLabel },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-xl border border-latte bg-brand-50/20 p-3">
              <span className="text-xs font-bold text-espresso/70">{item.label}</span>
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
          aria-expanded={showNutrition}
          aria-controls="nutrition-details-panel"
          className="w-full flex items-center justify-between p-6 text-left hover:bg-brand-50/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <div>
            <h2 className="text-lg font-bold text-espresso">Detailed Nutrition Facts</h2>
            <p className="text-xs text-espresso/30 font-medium mt-0.5">Serving sizes, macros and % daily values</p>
          </div>
          <span className="text-base text-brand-600 font-bold transition-transform duration-300 flex items-center gap-1" aria-hidden="true">
            {showNutrition ? "Hide ▴" : "Show ▾"}
          </span>
        </button>

        {showNutrition && (
          <div id="nutrition-details-panel" className="p-6 border-t border-latte space-y-6 bg-brand-50/5">
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
      <section className="card p-0 overflow-hidden border border-latte shadow-card">
        <button 
          onClick={() => setShowIngredients(!showIngredients)}
          aria-expanded={showIngredients}
          aria-controls="ingredients-details-panel"
          className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <div>
            <h2 className="text-lg font-semibold text-espresso">Ingredients & additives log</h2>
            <p className="mt-0.5 text-xs font-medium text-espresso/35">Complexity index, simplified labels, and allergen details</p>
          </div>
          <span className="text-base text-brand-600 font-bold transition-transform duration-300 flex items-center gap-1" aria-hidden="true">
            {showIngredients ? "Hide ▴" : "Show ▾"}
          </span>
        </button>

        {showIngredients && (
          <div id="ingredients-details-panel" className="space-y-4 border-t border-latte bg-stone-50/10 p-6">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-espresso/35">Full Ingredients text</h3>
              <p className="text-sm text-espresso/75 leading-relaxed font-medium bg-white rounded-xl p-4 border border-latte shadow-sm">
                {v.ingredientsText}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-espresso/35">Simplified Breakdown</h3>
              <div className="flex flex-wrap gap-1.5">
                {v.simplifiedIngredients.map((ing) => (
                  <span key={ing} className="badge-neutral !rounded-lg">{ing}</span>
                ))}
              </div>
            </div>

            {v.highlightedIngredients.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-espresso/35">Highlighted compounds</h3>
                <div className="space-y-1.5">
                  {v.highlightedIngredients.map((h) => (
                    <HighlightedIngredient key={h.name} name={h.name} type={h.type} note={h.note} />
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-t border-latte">
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
        <div className="border-b border-latte pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-espresso">Detailed educational impact summary</h2>
            <p className="text-xs text-espresso/35 font-medium">Ayurvedic & modern nutritional markers</p>
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
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 pt-4 border-t border-latte">
        <div className="col-span-2">
          <WatchlistButton productId={product.id} name={product.name} brand={product.brand} />
        </div>
        <ShareButton title={product.name} />
        <Link href={`/compare?ids=${product.id}`} className="btn-secondary text-center">Compare</Link>
        <Link href={`/submit?product=${product.id}`} className="col-span-2 btn-primary text-center">Submit proof</Link>
      </div>
    </div>
  );
}
