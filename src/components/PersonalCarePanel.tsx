"use client";

import { useMemo, useState } from "react";
import type { ProductVersion } from "@/lib/types";

// ── Keyword-based ingredient safety analysis ──────────────────────────

interface IngredientSafety {
  name: string;
  everydayName: string;
  role: string;
  isSafe: "safe" | "caution" | "avoid";
  note: string;
}

const PERSONAL_CARE_CONCERNS: Record<string, { role: string; isSafe: "safe" | "caution" | "avoid"; note: string }> = {
  "sodium lauryl sulfate": { role: "Foaming agent", isSafe: "caution", note: "Can strip natural oils; may irritate sensitive skin" },
  "sodium laureth sulfate": { role: "Foaming agent", isSafe: "caution", note: "Milder than SLS but may irritate sensitive or dry skin" },
  "parabens": { role: "Preservative", isSafe: "caution", note: "Linked to hormonal disruption in high concentrations" },
  "methylparaben": { role: "Preservative", isSafe: "caution", note: "Common preservative; caution for sensitive skin" },
  "propylparaben": { role: "Preservative", isSafe: "caution", note: "Common preservative; caution for sensitive skin" },
  "fragrance": { role: "Scent", isSafe: "caution", note: "May trigger allergies or irritation; undisclosed ingredients" },
  "parfum": { role: "Scent", isSafe: "caution", note: "Synthetic fragrance blend; potential allergen" },
  "formaldehyde": { role: "Preservative", isSafe: "avoid", note: "Known carcinogen; avoid on skin" },
  "triclosan": { role: "Antibacterial agent", isSafe: "avoid", note: "Banned in many countries; disrupts hormones" },
  "phthalates": { role: "Plasticiser/fragrance carrier", isSafe: "avoid", note: "Hormone disruptor; avoid especially for children" },
  "mineral oil": { role: "Moisturiser", isSafe: "caution", note: "Petroleum-derived; can clog pores in heavy use" },
  "alcohol denat": { role: "Solvent/astringent", isSafe: "caution", note: "Drying for sensitive skin; fine in moderation" },
  "glycerin": { role: "Moisturiser/humectant", isSafe: "safe", note: "Draws moisture to skin; gentle and effective" },
  "aloe vera": { role: "Soothing agent", isSafe: "safe", note: "Calming and hydrating for most skin types" },
  "niacinamide": { role: "Skin brightener", isSafe: "safe", note: "Reduces dark spots; generally well-tolerated" },
  "hyaluronic acid": { role: "Hydration booster", isSafe: "safe", note: "Excellent for all skin types; deeply hydrating" },
  "salicylic acid": { role: "Exfoliant/acne fighter", isSafe: "caution", note: "Effective for oily skin; avoid if pregnant" },
  "chlorhexidine": { role: "Antibacterial agent", isSafe: "safe", note: "Effective antiseptic; generally safe for skin" },
  "benzalkonium chloride": { role: "Preservative/antiseptic", isSafe: "caution", note: "Can irritate skin with repeated contact" },
};

function analyzePersonalCareIngredients(ingredientsText: string): IngredientSafety[] {
  const lower = ingredientsText.toLowerCase();
  const found: IngredientSafety[] = [];
  const seen = new Set<string>();

  for (const [key, info] of Object.entries(PERSONAL_CARE_CONCERNS)) {
    if (lower.includes(key) && !seen.has(key)) {
      seen.add(key);
      found.push({
        name: key,
        everydayName: key.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        role: info.role,
        isSafe: info.isSafe,
        note: info.note,
      });
    }
  }

  // Surface remaining simplified ingredients as safe by default
  return found;
}

// ── Subcomponents ─────────────────────────────────────────────────────

function IngSafetyCard({ ing }: { ing: IngredientSafety }) {
  const [expanded, setExpanded] = useState(false);
  const config = {
    safe:    { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", icon: "✅", label: "Safe" },
    caution: { bg: "bg-amber-50 border-amber-100",     text: "text-amber-700",   icon: "⚠️", label: "Use with care" },
    avoid:   { bg: "bg-rose-50 border-rose-100",       text: "text-rose-700",    icon: "🚫", label: "Better avoided" },
  }[ing.isSafe];

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${config.bg}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:brightness-95 transition-all"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base flex-shrink-0">{config.icon}</span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{ing.everydayName}</p>
            <p className="text-xs text-slate-500">{ing.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`hidden sm:inline rounded-full px-2 py-0.5 text-[10px] font-bold ${config.text} bg-white/60`}>
            {config.label}
          </span>
          <span className="text-slate-400 text-xs">{expanded ? "▴" : "▾"}</span>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-white/60 bg-white/50">
          <p className="text-sm text-slate-700 leading-relaxed">{ing.note}</p>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────

export default function PersonalCarePanel({ version }: { version: ProductVersion; productName?: string }) {
  const safetyCards = useMemo(
    () => analyzePersonalCareIngredients(version.ingredientsText),
    [version.ingredientsText]
  );

  const hasCaution = safetyCards.some((c) => c.isSafe === "caution");
  const hasAvoid   = safetyCards.some((c) => c.isSafe === "avoid");
  const safeCt     = safetyCards.filter((c) => c.isSafe === "safe").length;

  const overallLabel = hasAvoid
    ? { text: "Contains ingredients to avoid", color: "text-rose-700", bg: "from-rose-50 to-rose-100/40 border-rose-200" }
    : hasCaution
    ? { text: "Some ingredients need care — check your skin type", color: "text-amber-700", bg: "from-amber-50 to-amber-100/40 border-amber-200" }
    : { text: "Ingredients look gentle for regular use", color: "text-emerald-700", bg: "from-emerald-50 to-emerald-100/40 border-emerald-200" };

  return (
    <div className="space-y-5">
      {/* Overview */}
      <div className={`rounded-2xl border-2 bg-gradient-to-br p-5 ${overallLabel.bg}`}>
        <p className={`text-base font-bold leading-snug ${overallLabel.color}`}>{overallLabel.text}</p>
        {safeCt > 0 && (
          <p className="text-xs mt-1 text-slate-500">
            {safeCt} recognized ingredient{safeCt !== 1 ? "s" : ""} flagged as safe for regular use.
          </p>
        )}
      </div>

      {/* Ingredient safety breakdown */}
      {safetyCards.length > 0 && (
        <div className="card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>🔬</span> Key Active Ingredients
            </h3>
            <span className="text-[10px] text-slate-400">Tap to expand</span>
          </div>
          <div className="flex flex-wrap gap-2 pb-1">
            {[
              { icon: "✅", label: "Safe", color: "bg-emerald-100 text-emerald-700" },
              { icon: "⚠️", label: "Use with care", color: "bg-amber-100 text-amber-700" },
              { icon: "🚫", label: "Better avoided", color: "bg-rose-100 text-rose-700" },
            ].map((b) => (
              <span key={b.label} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${b.color}`}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            {safetyCards.map((ing) => (
              <IngSafetyCard key={ing.name} ing={ing} />
            ))}
          </div>
          {safetyCards.length === 0 && (
            <p className="text-sm text-slate-400 italic">Detailed ingredient data not available for this product.</p>
          )}
        </div>
      )}

      {/* Who should be careful */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
          <span>👤</span> Who should be careful
        </h3>
        <ul className="space-y-1.5 text-sm text-slate-700">
          {hasAvoid && <li className="flex gap-2"><span>🚫</span> Anyone with sensitive or reactive skin</li>}
          {hasCaution && <li className="flex gap-2"><span>⚠️</span> People with dry, cracked, or eczema-prone skin</li>}
          <li className="flex gap-2"><span>👶</span> Not recommended for children under 2 without paediatrician advice</li>
          <li className="flex gap-2"><span>🤰</span> Consult a doctor if pregnant — some actives (e.g. salicylic acid) to avoid</li>
        </ul>
      </div>

      {/* Usage frequency */}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 flex items-start gap-3 shadow-sm">
        <span className="text-2xl flex-shrink-0">🗓️</span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Safe Usage Frequency</p>
          <p className="text-sm font-semibold text-slate-700">
            {hasAvoid
              ? "As infrequently as possible — consider switching to a gentler formula"
              : hasCaution
              ? "As needed — avoid prolonged daily contact on broken or very sensitive skin"
              : "Daily use is generally fine for most skin types"}
          </p>
        </div>
      </div>
    </div>
  );
}
