"use client";

import type { ProductVersion } from "@/lib/types";

const BABY_CONCERNS: { name: string; issue: string; severity: "ok" | "caution" | "avoid" }[] = [
  { name: "fragrance",          issue: "Synthetic fragrance — common allergen for babies",      severity: "caution" },
  { name: "parfum",             issue: "Synthetic fragrance blend — avoid for newborns",         severity: "avoid"   },
  { name: "parabens",           issue: "Preservative — not recommended for infant skin",         severity: "avoid"   },
  { name: "methylparaben",      issue: "Preservative — avoid for babies under 6 months",         severity: "avoid"   },
  { name: "sodium lauryl sulfate", issue: "SLS — harsh foaming agent; irritating for delicate baby skin", severity: "avoid" },
  { name: "mineral oil",        issue: "Petroleum-derived — pore-clogging on sensitive skin",   severity: "caution" },
  { name: "alcohol",            issue: "Drying agent — can irritate newborn skin",              severity: "caution" },
  { name: "dye",                issue: "Artificial dye — possible allergen for infants",        severity: "caution" },
  { name: "glycerin",           issue: "Humectant — gentle and generally safe for babies",      severity: "ok"      },
  { name: "aloe vera",          issue: "Soothing agent — gentle and safe for baby skin",        severity: "ok"      },
  { name: "chamomile",          issue: "Calming botanical — safe for most babies",              severity: "ok"      },
  { name: "zinc oxide",         issue: "Protective barrier — safe and effective for nappy rash",severity: "ok"      },
  { name: "calendula",          issue: "Gentle botanical — soothing for baby skin",             severity: "ok"      },
];

export default function BabyCarePanel({ version, productName }: { version: ProductVersion; productName: string }) {
  const lower = version.ingredientsText.toLowerCase();
  const flagged = BABY_CONCERNS.filter((c) => lower.includes(c.name));

  const hasAvoid   = flagged.some((f) => f.severity === "avoid");
  const hasCaution = flagged.some((f) => f.severity === "caution");

  const overallLabel = hasAvoid
    ? { text: "Contains ingredients not recommended for infants", color: "text-rose-700", bg: "from-rose-50 to-rose-100/40 border-rose-200" }
    : hasCaution
    ? { text: "Some ingredients — check sensitivity before regular use", color: "text-amber-700", bg: "from-amber-50 to-amber-100/40 border-amber-200" }
    : { text: "Ingredient profile looks gentle for babies", color: "text-emerald-700", bg: "from-emerald-50 to-emerald-100/40 border-emerald-200" };

  // Guess age suitability from product name
  const nameL = productName.toLowerCase();
  const ageSuitability =
    nameL.includes("newborn") || nameL.includes("neonatal") ? "Newborn (0–1 month)" :
    nameL.includes("infant")  ? "Infant (0–6 months)" :
    nameL.includes("toddler") ? "Toddler (12m+)" :
    "Check label for age guidance";

  // Fragrance-free?
  const fragranceFree = !lower.includes("fragrance") && !lower.includes("parfum");

  // Dermatologist tested? (heuristic from product name)
  const dermTested = nameL.includes("dermat") || nameL.includes("clinically");

  return (
    <div className="space-y-5">
      {/* Overall */}
      <div className={`rounded-2xl border-2 bg-gradient-to-br p-5 ${overallLabel.bg}`}>
        <p className={`text-base font-bold ${overallLabel.color}`}>{overallLabel.text}</p>
      </div>

      {/* Quick info grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Age Suitability", value: ageSuitability, icon: "👶" },
          { label: "Fragrance-free", value: fragranceFree ? "✅ Yes" : "❌ No — check label", icon: "🌸" },
          { label: "Dermatologist tested", value: dermTested ? "✅ Yes (per label)" : "Not stated on label", icon: "🩺" },
          { label: "Parabens", value: lower.includes("paraben") ? "❌ Contains parabens" : "✅ Paraben-free", icon: "🔬" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm flex flex-col gap-1">
            <span className="text-lg">{item.icon}</span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
            <p className="text-xs font-semibold text-slate-700">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Ingredient cards */}
      {flagged.length > 0 && (
        <div className="card space-y-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <span>🔬</span> Key Ingredients — Safety Check
          </h3>
          {flagged.map((c) => {
            const cfg = {
              ok:      { bg: "bg-emerald-50 border-emerald-100", icon: "✅", text: "text-emerald-700" },
              caution: { bg: "bg-amber-50 border-amber-100",     icon: "⚠️", text: "text-amber-700"   },
              avoid:   { bg: "bg-rose-50 border-rose-100",       icon: "🚫", text: "text-rose-700"    },
            }[c.severity];
            return (
              <div key={c.name} className={`rounded-xl border px-4 py-3 flex items-start gap-2.5 ${cfg.bg}`}>
                <span className="text-base">{cfg.icon}</span>
                <div>
                  <p className="text-sm font-bold text-slate-800 capitalize">{c.name}</p>
                  <p className={`text-xs ${cfg.text}`}>{c.issue}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Extra sensitivity note */}
      <div className="rounded-2xl border border-pink-200 bg-pink-50/40 p-4">
        <p className="text-xs text-pink-800 leading-relaxed">
          <strong>👶 Extra care tip:</strong> Always do a patch test on baby&apos;s inner wrist before full use. Discontinue immediately if redness or rash appears. Consult your paediatrician for products used on newborns.
        </p>
      </div>
    </div>
  );
}
