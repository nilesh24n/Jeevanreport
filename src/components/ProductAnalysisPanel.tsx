"use client";

import { useState, useMemo } from "react";
import type { Product, ProductVersion } from "@/lib/types";
import { getLatestVersion } from "@/lib/data/products";
import { getProductStatus } from "@/lib/nutrition-engine";
import { computeGymAnalysis } from "@/lib/gym-engine";
import ProductDetailTabs from "./ProductDetailTabs";
import GymModePanel from "./GymModePanel";
import { useLang } from "./LanguageContext";

export default function ProductAnalysisPanel({ product }: { product: Product }) {
  const [mode, setMode] = useState<"everyone" | "gym">("everyone");
  const { t, lang } = useLang();

  const v: ProductVersion = useMemo(() => getLatestVersion(product), [product]);
  const n = v.nutrition;
  const body = v.bodyImpact;

  // Normal mode stuff
  const status = useMemo(() => getProductStatus(body), [body]);

  // Gym mode analysis
  const gymAnalysis = useMemo(() => computeGymAnalysis(v), [v]);

  // Protein per serving verdict
  const proteinVerdict = useMemo(() => {
    const protein = n.protein;
    if (protein >= 10) return { label: "Excellent (High Protein)", color: "text-emerald-600" };
    if (protein >= 5) return { label: "Moderate Protein", color: "text-amber-600" };
    return { label: "Low Protein", color: "text-rose-600" };
  }, [n.protein]);

  // Calorie to protein ratio
  const calorieToProteinRatio = useMemo(() => {
    const cal = n.caloriesPerServing;
    const protein = n.protein;
    if (!protein || protein === 0) return { label: "N/A (No protein)", ratio: Infinity, color: "text-slate-500" };
    const ratio = Math.round((cal / protein) * 10) / 10;
    if (ratio <= 10) return { label: `${ratio}:1 (Excellent)`, ratio, color: "text-emerald-600" };
    if (ratio <= 20) return { label: `${ratio}:1 (Good)`, ratio, color: "text-amber-600" };
    return { label: `${ratio}:1 (Poor)`, ratio, color: "text-rose-600" };
  }, [n.caloriesPerServing, n.protein]);

  // Amino acid completeness
  const aminoAcidCompleteness = useMemo(() => {
    const text = v.ingredientsText.toLowerCase();
    const protein = n.protein;
    if (protein < 1.5) {
      return "Negligible Protein (Completeness not applicable)";
    }
    const completeKeywords = [
      "whey", "casein", "milk protein", "egg", "egg white", "soy protein isolate",
      "chicken", "fish", "beef", "meat", "mutton", "turkey", "gelatin"
    ];
    const hasComplete = completeKeywords.some((kw) => text.includes(kw));
    if (hasComplete) {
      return "Complete Protein Profile (Contains all essential amino acids)";
    }
    return "Incomplete Plant Protein (Pair with other grains or legumes)";
  }, [v.ingredientsText, n.protein]);

  // Cutting vs bulking verdict
  const cuttingBulkingVerdict = useMemo(() => {
    const protein = n.protein;
    const cal = n.caloriesPerServing;
    const fat = n.totalFat;
    if (protein < 2) {
      return "Not optimal for fitness goals (Insufficient protein)";
    }
    const ratio = cal / protein;
    if (ratio <= 12 && fat <= 5) {
      return "Excellent for Cutting (Lean source, low fat & calories)";
    }
    if (ratio > 12 && ratio <= 25 && cal >= 220) {
      return "Good for Bulking (Provides clean calories + protein)";
    }
    if (ratio <= 20) {
      return "Balanced (Suitable for both Cutting and Bulking)";
    }
    return "Not ideal for fitness goals (High calorie-to-protein ratio)";
  }, [n.protein, n.caloriesPerServing, n.totalFat]);

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

  return (
    <div className="space-y-6">
      {/* Mode Selector Toggle */}
      <div className="flex flex-row gap-2 rounded-xl bg-slate-100 p-1 sm:p-1.5 border border-slate-200">
        <button
          type="button"
          onClick={() => setMode("everyone")}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold rounded-lg transition-all min-h-[48px] ${
            mode === "everyone"
              ? "bg-brand-600 text-white shadow-sm"
              : "text-espresso/70 hover:text-espresso"
          }`}
        >
          <span>👤</span> {t("ui.for_everyone") || "For Everyone"}
        </button>
        <button
          type="button"
          onClick={() => setMode("gym")}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold rounded-lg transition-all min-h-[48px] ${
            mode === "gym"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-espresso/70 hover:text-espresso"
          }`}
        >
          <span>💪</span> {t("ui.for_gym") || "For Gym"}
        </button>
      </div>

      {mode === "everyone" ? (
        <>
          {/* 2. Visual Assessment Points */}
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

          {/* 3. Easy Summary Card */}
          <section className="card space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>📝</span> Easy Summary
            </h2>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
              <p className="text-base font-semibold leading-relaxed text-slate-800">
                {lang === "hi" ? (
                  status.rating === 'Good' ? "यह उत्पाद दैनिक या नियमित उपयोग के लिए एक अच्छा विकल्प है। इसमें संतुलित पोषक तत्व हैं।" :
                  status.rating === 'Okay' ? "यह उत्पाद मध्यम मात्रा में दैनिक उपयोग के लिए ठीक है। मात्रा पर ध्यान रखें।" :
                  status.color === 'orange' ? "सावधानी: इस उत्पाद में कुछ मध्यम चेतावनी संकेत हैं। इसका सीमित उपयोग करना बेहतर है।" :
                  "सावधान रहें: इस उत्पाद में उच्च चीनी, उच्च नमक या उच्च वसा है। इसका उपयोग सीमित करें।"
                ) : (
                  status.rating === 'Good' ? "This product is a good choice for daily or regular use. It has balanced nutrients and no high warning signs." :
                  status.rating === 'Okay' ? "This product is okay for daily use in moderate quantities. Keep an eye on portions." :
                  status.color === 'orange' ? "Caution: This product has moderate warning signs. It is best to limit consumption or use occasionally." :
                  "Be Careful: This product has high sugar, high salt, or high fat. It is best to limit consumption and treat it as an occasional treat."
                )}
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

          {/* 4. Visual Nutrition Highlights */}
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

          {/* Tabs */}
          <ProductDetailTabs product={product} />
        </>
      ) : (
        <>
          {/* Gym Specific Fitness Analysis Card */}
          <section className="card space-y-4 border-2 border-emerald-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>💪</span> Fitness & Gym Analysis
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Protein Verdict</span>
                <span className={`text-base font-extrabold mt-1.5 ${proteinVerdict.color}`}>{proteinVerdict.label}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Calorie to Protein Ratio</span>
                <span className={`text-base font-extrabold mt-1.5 ${calorieToProteinRatio.color}`}>{calorieToProteinRatio.label}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Workout Suitability</span>
                <span className="text-base font-extrabold text-blue-700 mt-1.5">{gymAnalysis.bestConsumeLabel}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between md:col-span-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Amino Acid Completeness</span>
                <span className="text-sm font-semibold text-slate-800 mt-1.5 leading-snug">{aminoAcidCompleteness}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Muscle Building Rating</span>
                <span className="text-base font-extrabold text-emerald-700 mt-1.5">{gymAnalysis.goalScores.muscleGain}/10</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between sm:col-span-2 md:col-span-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Cutting vs Bulking Verdict</span>
                <span className="text-sm font-bold text-espresso mt-1.5">{cuttingBulkingVerdict}</span>
              </div>
            </div>
          </section>

          {/* Full Gym Mode Panel */}
          <GymModePanel version={v} />
        </>
      )}
    </div>
  );
}
