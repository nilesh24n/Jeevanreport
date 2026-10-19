"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useToast } from "./Toast";

export interface FoodTruth {
  id: string;
  category: string;
  categoryColor: {
    bg: string;
    text: string;
    border: string;
    dot: string;
  };
  icon: string;
  title: string;
  fact: string;
  takeaway: string;
  actionLabel: string;
  actionHref: string;
}

export const FOOD_TRUTHS: FoodTruth[] = [
  {
    id: "palm-oil",
    category: "Palm Oil Watch",
    categoryColor: {
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    icon: "🌴",
    title: "The 'Edible Vegetable Oil' Deception",
    fact: "Over 65% of popular biscuits, cookies & instant noodles in India list generic 'Edible Vegetable Oil' instead of naming Palm Oil. Under Indian regulations, if saturated fat exceeds 15-20%, it is almost exclusively cheap hydrogenated palm oil.",
    takeaway: "Check the nutrition table for saturated fats before believing front-of-pack 'Wheat' or 'Healthy' claims.",
    actionLabel: "Search Biscuits Catalog",
    actionHref: "/categories/snacks",
  },
  {
    id: "sneaky-sugars",
    category: "Hidden Sugars",
    categoryColor: {
      bg: "bg-rose-50",
      text: "text-rose-800",
      border: "border-rose-200",
      dot: "bg-rose-500",
    },
    icon: "🍬",
    title: "'Zero Added Sugar' Doesn't Mean Healthy",
    fact: "Products stamped 'No Added Sugar' frequently replace sucrose with Maltodextrin, Invert Sugar, or Concentrated Apple Puree. Maltodextrin has a Glycemic Index of 110—nearly double regular table sugar (GI 65)—spiking insulin rapidly.",
    takeaway: "Read the full ingredient deck for words ending in '-ose' or '-dextrin'.",
    actionLabel: "Scan a Product Label",
    actionHref: "/scan",
  },
  {
    id: "shrinkflation",
    category: "Shrinkflation Watch",
    categoryColor: {
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-200",
      dot: "bg-purple-500",
    },
    icon: "📉",
    title: "The Magic Shrinking 100g Pack",
    fact: "Instead of raising price points above ₹5 or ₹10, FMCG brands quietly reduce the package net weight: 100g biscuits become 85g, then 72g, then 48g. JeevanReport tracks package size reductions across Indian grocery brands over time.",
    takeaway: "Always check the net weight and price-per-100g, not just the retail pack price.",
    actionLabel: "View Shrinkflation Tracker",
    actionHref: "/shrinkflation",
  },
  {
    id: "atta-illusion",
    category: "Whole Grain Trap",
    categoryColor: {
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    icon: "🌾",
    title: "The 'Atta / Multigrain' Bread Illusion",
    fact: "Packaged breads & biscuits marketed in green boxes labeled 'Whole Wheat' or 'Atta' often contain 65% to 80% refined maida (wheat flour) with just a 5% to 10% whole wheat fraction mixed in.",
    takeaway: "By law, ingredients are sorted by weight. If 'Refined Wheat Flour (Maida)' is first, it's not real whole grain.",
    actionLabel: "Check Breakfast Items",
    actionHref: "/categories/breakfast",
  },
  {
    id: "frozen-dessert",
    category: "Dairy Truth",
    categoryColor: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    icon: "🍨",
    title: "Frozen Dessert is Not Ice Cream",
    fact: "Under FSSAI rules, 'Ice Cream' must be made exclusively with milk fats. Many commercial tubs replace milk cream with hydrogenated vegetable palm fat and must legally be labeled 'Frozen Dessert' in fine print.",
    takeaway: "Look for 'Milk Fat' vs 'Vegetable Fat' on the tub before serving to children.",
    actionLabel: "Explore Dairy & Chilled",
    actionHref: "/categories/dairy",
  },
  {
    id: "caramel-color",
    category: "Additive Alert",
    categoryColor: {
      bg: "bg-orange-50",
      text: "text-orange-800",
      border: "border-orange-200",
      dot: "bg-orange-500",
    },
    icon: "🧪",
    title: "Decoding INS 150d (Caramel Color IV)",
    fact: "The dark amber color in cola drinks, packaged sauces, and commercial bread often comes from INS 150d (Class IV caramel), processed under high pressure with ammonium and sulfite compounds.",
    takeaway: "Natural foods don't need artificial darkeners. Check the INS code list on JeevanReport.",
    actionLabel: "Inspect Beverages",
    actionHref: "/categories/beverages",
  },
  {
    id: "baby-cereal",
    category: "Baby Care Alert",
    categoryColor: {
      bg: "bg-pink-50",
      text: "text-pink-800",
      border: "border-pink-200",
      dot: "bg-pink-500",
    },
    icon: "🍼",
    title: "Refined Sugar in Infant Cereals",
    fact: "Investigations into popular infant cereals sold across South Asia revealed up to 5g to 6g of added sugar per serving—while the identical brand's formulation in Europe contains zero added sugar.",
    takeaway: "Stick to clean, single-ingredient whole grains for infants without added syrups or sweet powders.",
    actionLabel: "See Methodology",
    actionHref: "/methodology",
  },
  {
    id: "clean-label",
    category: "Golden Rule",
    categoryColor: {
      bg: "bg-teal-50",
      text: "text-teal-800",
      border: "border-teal-200",
      dot: "bg-teal-500",
    },
    icon: "🌿",
    title: "The Grandma Principle of Clean Food",
    fact: "If your grandmother wouldn't recognize an ingredient on the label (e.g. INS 471, INS 322, Maltitol, Potassium Sorbate), it is an industrial additive meant for long distributor shelf-life, not your body.",
    takeaway: "Fewer ingredients always equals higher real food content. Aim for products with under 5 natural ingredients.",
    actionLabel: "Browse Clean Products",
    actionHref: "/products",
  },
];

const STORAGE_KEY = "jeevan_daily_truth_collapsed";

export default function DailyFoodTruth() {
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    // Retrieve collapsed preference if set; default to collapsed (minimal pill)
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setIsExpanded(saved === "false");
      } else {
        // First visit: keep collapsed by default so it never intrudes on user's browsing
        setIsExpanded(false);
      }
    } catch {
      setIsExpanded(false);
    }
  }, []);

  const toggleExpand = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(!next));
    } catch {}
  };

  const handleNext = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % FOOD_TRUTHS.length);
      setIsAnimating(false);
    }, 150);
  }, []);

  const handlePrev = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + FOOD_TRUTHS.length) % FOOD_TRUTHS.length);
      setIsAnimating(false);
    }, 150);
  }, []);

  const handleCopy = async () => {
    const truth = FOOD_TRUTHS[currentIndex];
    const textToCopy = `💡 JeevanReport Daily Food Truth:\n"${truth.title}"\n${truth.fact}\n\nTakeaway: ${truth.takeaway}\nLearn more: https://jeevanreport.in`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast("Truth insight copied to clipboard!", "success");
    } catch {
      toast("Failed to copy insight", "info");
    }
  };

  if (!mounted) return null;

  const currentTruth = FOOD_TRUTHS[currentIndex];

  return (
    <aside
      aria-label="Daily Food Truth Intelligence"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none print:hidden transition-all duration-300"
    >
      {/* 1. EXPANDED POPUP CARD */}
      {isExpanded ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="food-truth-title"
          className="w-[330px] sm:w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl border border-latte bg-white/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Subtle Top Gradient Accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-brand-500 rounded-t-2xl" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-latte pb-3 pt-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${currentTruth.categoryColor.bg} ${currentTruth.categoryColor.text} ${currentTruth.categoryColor.border}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${currentTruth.categoryColor.dot} animate-pulse`} />
                {currentTruth.category}
              </span>
              <span className="text-[11px] font-medium text-espresso/40">
                {currentIndex + 1} / {FOOD_TRUTHS.length}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg p-1.5 text-espresso/50 transition-colors hover:bg-latte hover:text-espresso"
                title="Copy insight to share"
                aria-label="Copy truth insight to clipboard"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>

              <button
                type="button"
                onClick={toggleExpand}
                className="rounded-lg p-1.5 text-espresso/50 transition-colors hover:bg-latte hover:text-espresso"
                title="Collapse to minimal badge"
                aria-label="Collapse food truth badge"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Card Content */}
          <div
            className={`transition-opacity duration-150 ${
              isAnimating ? "opacity-30" : "opacity-100"
            } mt-3.5 space-y-3`}
          >
            <div className="flex items-start gap-2.5">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-latte/60 text-lg shadow-inner">
                {currentTruth.icon}
              </span>
              <div>
                <h4
                  id="food-truth-title"
                  className="text-sm font-bold leading-snug text-espresso"
                >
                  {currentTruth.title}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-espresso/70">
                  {currentTruth.fact}
                </p>
              </div>
            </div>

            {/* Pro-Tip Takeaway Callout */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-2.5 text-xs text-emerald-950 flex items-start gap-2">
              <span className="font-bold text-emerald-600 flex-shrink-0 text-xs">💡 Tip:</span>
              <p className="font-medium text-[11.5px] leading-relaxed">
                {currentTruth.takeaway}
              </p>
            </div>
          </div>

          {/* Footer Controls & Direct Link */}
          <div className="mt-4 flex items-center justify-between border-t border-latte pt-3 text-xs">
            {/* Prev / Next controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-lg border border-latte bg-white p-1.5 text-espresso/60 transition-colors hover:border-brand-300 hover:text-espresso"
                title="Previous truth"
                aria-label="Previous tip"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg border border-latte bg-white p-1.5 text-espresso/60 transition-colors hover:border-brand-300 hover:text-espresso"
                title="Next truth"
                aria-label="Next tip"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Quick Action Button */}
            <Link
              href={currentTruth.actionHref}
              className="inline-flex items-center gap-1.5 rounded-lg bg-espresso px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-brand-600 active:scale-95"
            >
              <span>{currentTruth.actionLabel}</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      ) : (
        /* 2. MINIMAL COLLAPSED PILL BADGE */
        <button
          type="button"
          onClick={toggleExpand}
          className="group flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-white/90 px-3.5 py-2 text-xs font-semibold text-espresso shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-emerald-500 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          title="Open Daily Food Truth"
          aria-label="Open Daily Food Truth intelligence tip"
        >
          {/* Glowing Green Indicator Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>

          <span className="flex items-center gap-1.5 font-bold tracking-tight text-espresso group-hover:text-brand-600 transition-colors">
            <span>💡</span>
            <span>Daily Food Truth</span>
          </span>

          {/* Tiny subtle category hint */}
          <span className="hidden sm:inline-block rounded-full bg-latte/70 px-2 py-0.5 text-[10px] font-medium text-espresso/60">
            {currentTruth.category}
          </span>

          {/* Expand chevron icon */}
          <svg
            className="h-3.5 w-3.5 text-espresso/40 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-espresso"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </aside>
  );
}
