"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product, ProductVersion } from "@/lib/types";
import { getLatestVersion } from "@/lib/data/products";
import { getProductStatus } from "@/lib/nutrition-engine";
import { classifyProduct } from "@/lib/product-classifier";
import { isConsumableProduct } from "@/lib/consumable-filter";
import {
  buildWhatMattersBullets,
  dataStatusToneClass,
  getEverydayOneLiner,
  getProductDataStatus,
  hasPackOrFormulaHistory,
} from "@/lib/scan-result-presenter";
import ScanTracker from "./ScanTracker";
import WatchlistButton from "./WatchlistButton";
import NutritionLabel from "./NutritionLabel";
import SimilarProducts from "./SimilarProducts";
import ShareButton from "./ShareButton";
import HighlightedIngredient from "./HighlightedIngredient";
import GymModePanel from "./GymModePanel";
import ShrinkflationApiPanel from "./ShrinkflationApiPanel";
import ProductDisclaimerBanner from "./ProductDisclaimerBanner";
import { getRatingCardClass, RatingBadge } from "@/lib/rating-ui";
import { MEDICAL_DISCLAIMER } from "@/lib/types";

export default function ScanResult({ product }: { product: Product }) {
  const v: ProductVersion = getLatestVersion(product);
  const n = v.nutrition;
  const body = v.bodyImpact;
  const isFood = isConsumableProduct(product);

  const catMeta = classifyProduct({
    name: product.name,
    brand: product.brand,
    categorySlug: product.category,
    description: product.baseDescription,
  });

  const isBlockedNonFood =
    !isFood ||
    catMeta.category === "HOUSEHOLD" ||
    catMeta.category === "PERSONAL_CARE";

  const status = getProductStatus(body);
  const dataStatus = getProductDataStatus(product);
  const oneLiner = getEverydayOneLiner(status, body);
  const whatMatters = buildWhatMattersBullets(product, v, status, body);
  const showHistory = hasPackOrFormulaHistory(product);

  const [scanMode, setScanMode] = useState<"everyday" | "gym">("everyday");
  const [showFullNutrition, setShowFullNutrition] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);

  if (isBlockedNonFood) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border-2 border-rose-200 bg-rose-50 p-8 text-center space-y-4">
          <span className="text-5xl" aria-hidden>
            🛑
          </span>
          <h2 className="text-2xl font-bold text-rose-900">Food & drinks only</h2>
          <p className="mx-auto max-w-md text-base leading-relaxed text-rose-800">
            This scan looks like a non-food item. JeevanReport is built for packaged food and beverages.
          </p>
          <Link href="/scan" className="btn-primary inline-flex">
            Scan another product
          </Link>
        </div>
      </div>
    );
  }

  const ratingForHistory =
    status.rating === "Good" ? "Good" : status.rating === "Okay" || status.color === "orange" ? "Careful" : "Limit";

  return (
    <div className="space-y-5 pb-4">
      <ScanTracker
        productId={product.id}
        name={product.name}
        barcode={product.barcode}
        rating={ratingForHistory}
      />

      {/* 1 — Identity */}
      <section className="card space-y-4 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative mx-auto h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-latte bg-stone-50 sm:mx-0">
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="112px" priority />
          </div>
          <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className={catMeta.pillClass}>
                {catMeta.emoji} {catMeta.label}
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${dataStatusToneClass(dataStatus.tone)}`}
                title={dataStatus.detail}
              >
                {dataStatus.label}
              </span>
            </div>
            <h1 className="text-2xl font-bold leading-tight text-espresso">{product.name}</h1>
            <p className="text-sm font-medium text-espresso/55">
              {product.brand}
              {product.manufacturer ? ` · ${product.manufacturer}` : ""}
            </p>
            <p className="text-sm text-espresso/45">
              Pack: <span className="font-semibold text-espresso/70">{v.packSize}</span>
              <span className="mx-2 text-espresso/20">·</span>
              Serving: <span className="font-semibold text-espresso/70">{v.servingSize}</span>
            </p>
            <p className="font-mono text-[11px] text-espresso/35">Barcode {product.barcode}</p>
            <p className="text-[11px] text-espresso/40">{dataStatus.detail}</p>
          </div>
        </div>
      </section>

      {/* 2 — Verdict */}
      <section className={`card border-2 p-5 ${getRatingCardClass(status.color)}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <RatingBadge color={status.color} />
            <p className="text-lg font-semibold leading-snug text-espresso">{status.label}</p>
            <p className="text-sm leading-relaxed text-espresso/70">{oneLiner}</p>
          </div>
          <div className="rounded-2xl border border-latte bg-white/80 px-4 py-3 text-center sm:min-w-[140px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-espresso/40">Data confidence</p>
            <p className="mt-1 text-2xl font-bold text-brand-600">{product.trustScore}%</p>
            <p className="mt-0.5 text-[10px] text-espresso/40">Label completeness & evidence</p>
          </div>
        </div>
        <p className="mt-4 border-t border-latte/60 pt-3 text-[11px] leading-relaxed text-espresso/45">
          {MEDICAL_DISCLAIMER}
        </p>
      </section>

      {/* Mode toggle — gym is optional lens */}
      <div className="flex items-center gap-2 rounded-xl border border-latte bg-white p-1.5">
        <button
          type="button"
          id="scan-mode-everyday"
          onClick={() => setScanMode("everyday")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            scanMode === "everyday" ? "bg-brand-600 text-white" : "text-espresso/55 hover:bg-stone-50"
          }`}
        >
          Everyday view
        </button>
        <button
          type="button"
          id="scan-mode-gym"
          onClick={() => setScanMode("gym")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            scanMode === "gym" ? "bg-brand-600 text-white" : "text-espresso/55 hover:bg-stone-50"
          }`}
        >
          Gym view
        </button>
      </div>

      {scanMode === "gym" ? (
        <section className="card p-4">
          <GymModePanel version={v} />
        </section>
      ) : (
        <>
          {/* 3 — What matters */}
          {whatMatters.length > 0 && (
            <section className="card space-y-3 p-5">
              <h2 className="text-base font-bold text-espresso">What matters</h2>
              <ul className="space-y-2">
                {whatMatters.map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2.5 rounded-xl border border-latte bg-brand-50/30 px-3 py-2.5 text-sm font-medium text-espresso/80"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 4 — Nutrition */}
          <section className="card space-y-4 p-5">
            <div>
              <h2 className="text-base font-bold text-espresso">Nutrition</h2>
              <p className="text-xs text-espresso/45">
                Per serving ({v.servingSize}) · full pack ≈ {n.caloriesPerPack} kcal
              </p>
              <p className="mt-1 text-[11px] text-espresso/40">
                Source: JeevanReport catalog
                {v.versionDate ? ` · label snapshot ${v.versionDate}` : ""}
              </p>
            </div>
            <NutritionLabel nutrition={n} version={v} />
            <button
              type="button"
              onClick={() => setShowFullNutrition(!showFullNutrition)}
              className="text-sm font-semibold text-brand-600"
            >
              {showFullNutrition ? "Hide" : "Show"} macros table
            </button>
            {showFullNutrition && (
              <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                {[
                  ["Calories", `${n.caloriesPerServing} kcal`],
                  ["Protein", `${n.protein} g`],
                  ["Carbs", `${n.carbs} g`],
                  ["Sugar", `${n.sugar} g`],
                  ["Fat", `${n.totalFat} g`],
                  ["Sodium", `${n.sodium} mg`],
                  ["Fiber", `${n.fiber} g`],
                ].map(([label, val]) => (
                  <div key={label} className="rounded-lg border border-latte bg-stone-50/80 px-3 py-2">
                    <div className="text-[10px] font-bold uppercase text-espresso/40">{label}</div>
                    <div className="font-semibold text-espresso">{val}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 5 — Ingredients */}
          <section className="card space-y-4 p-5">
            <h2 className="text-base font-bold text-espresso">Ingredients</h2>
            {v.allergens.length > 0 && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800">
                Contains: {v.allergens.join(", ")}
              </div>
            )}
            {v.simplifiedIngredients.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {v.simplifiedIngredients.map((ing) => (
                  <span key={ing} className="badge-neutral !rounded-lg">
                    {ing}
                  </span>
                ))}
              </div>
            )}
            <p className="rounded-xl border border-latte bg-white p-4 text-sm leading-relaxed text-espresso/75">
              {v.ingredientsText || "Ingredient list not available yet."}
            </p>
            {v.highlightedIngredients.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-espresso/40">Worth knowing</h3>
                {v.highlightedIngredients.map((h) => (
                  <HighlightedIngredient key={h.name} name={h.name} type={h.type} note={h.note} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* 6 — Pack history (only when we have data) */}
      {showHistory && (
        <section className="space-y-2">
          <h2 className="px-1 text-base font-bold text-espresso">Pack & recipe history</h2>
          <ShrinkflationApiPanel productId={product.id} initialProduct={product} />
        </section>
      )}

      <ProductDisclaimerBanner />

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 border-t border-latte pt-4">
        <div className="col-span-2">
          <WatchlistButton productId={product.id} name={product.name} brand={product.brand} />
        </div>
        <ShareButton title={product.name} />
        <Link href={`/compare?ids=${product.id}`} className="btn-secondary text-center">
          Compare
        </Link>
        <Link href={`/corrections?product=${encodeURIComponent(product.id)}`} className="btn-secondary text-center">
          Report issue
        </Link>
        <Link href={`/submit?product=${product.id}`} className="col-span-2 btn-primary text-center">
          Submit label photo
        </Link>
        <Link
          href={`/products/${product.id}`}
          className="col-span-2 text-center text-sm font-semibold text-brand-600 hover:underline"
        >
          Open full product page →
        </Link>
      </div>

      {/* Similar — collapsed by default */}
      <section className="card overflow-hidden p-0">
        <button
          type="button"
          onClick={() => setShowSimilar(!showSimilar)}
          className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-espresso"
        >
          Similar products
          <span className="text-brand-600">{showSimilar ? "Hide" : "Show"}</span>
        </button>
        {showSimilar && (
          <div className="border-t border-latte p-4">
            <SimilarProducts productId={product.id} />
          </div>
        )}
      </section>
    </div>
  );
}
