"use client";

import { useState, useMemo } from "react";
import type { ProductVersion } from "@/lib/types";
import { computeEverydayAnalysis } from "@/lib/everyday-engine";
import type { EverydayIngredientCard as EverydayIngCard } from "@/lib/everyday-engine";

// ─── Ingredient Card ───────────────────────────────────────────────────────────

function IngredientCard({ card }: { card: EverydayIngCard }) {
  const [expanded, setExpanded] = useState(false);

  const goodBadConfig = {
    good: {
      bg: "bg-emerald-50/60 border-emerald-100",
      textColor: "text-emerald-700",
      icon: "✅",
    },
    neutral: {
      bg: "bg-amber-50/60 border-amber-100",
      textColor: "text-amber-700",
      icon: "ℹ️",
    },
    bad: {
      bg: "bg-rose-50/60 border-rose-100",
      textColor: "text-rose-700",
      icon: "⚠️",
    },
  }[card.isGoodOrBad];

  const freqPillColor = {
    "🟢": "bg-emerald-100 text-emerald-800",
    "🟡": "bg-amber-100 text-amber-800",
    "🟠": "bg-orange-100 text-orange-800",
    "🔴": "bg-rose-100 text-rose-800",
  }[card.frequencyEmoji] ?? "bg-slate-100 text-slate-800";

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-sm transition-all duration-300 ${goodBadConfig.bg}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:brightness-95 transition-all"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base flex-shrink-0">{goodBadConfig.icon}</span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 leading-snug">
              {card.everydayName}
            </p>
            <p className="text-xs text-slate-500 font-medium leading-snug truncate">
              {card.oneLiner}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${freqPillColor}`}
          >
            {card.frequencyEmoji} {card.frequencyText.split(" ").slice(0, 3).join(" ")}
          </span>
          <span className="text-slate-400 text-xs">{expanded ? "▴" : "▾"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/60 pt-3 space-y-3 bg-white/50">
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            {card.oneLiner}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg">{card.frequencyEmoji}</span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${freqPillColor}`}
            >
              {card.frequencyText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function EverydayModePanel({ version }: { version: ProductVersion }) {
  const everyday = useMemo(() => computeEverydayAnalysis(version), [version]);

  const verdictBg = {
    green: "from-emerald-50 to-emerald-100/50 border-emerald-200",
    yellow: "from-amber-50 to-amber-100/50 border-amber-200",
    red: "from-rose-50 to-rose-100/50 border-rose-200",
  }[everyday.verdictColor];

  const verdictTextColor = {
    green: "text-emerald-800",
    yellow: "text-amber-800",
    red: "text-rose-800",
  }[everyday.verdictColor];

  return (
    <div className="space-y-5">
      {/* 1. Simple Verdict */}
      <div
        className={`rounded-2xl border-2 bg-gradient-to-br p-5 ${verdictBg}`}
      >
        <p className={`text-base font-black leading-snug ${verdictTextColor}`}>
          {everyday.verdictLabel}
        </p>
      </div>

      {/* 2. What's Inside */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>🔍</span> What&apos;s Inside
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">
            Tap to learn more
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 pb-1">
          {[
            { emoji: "🟢", label: "Fine every day", color: "bg-emerald-100 text-emerald-700" },
            { emoji: "🟡", label: "1–2× a week", color: "bg-amber-100 text-amber-700" },
            { emoji: "🟠", label: "Occasionally", color: "bg-orange-100 text-orange-700" },
            { emoji: "🔴", label: "Barely ever", color: "bg-rose-100 text-rose-700" },
          ].map((item) => (
            <span
              key={item.label}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${item.color}`}
            >
              {item.emoji} {item.label}
            </span>
          ))}
        </div>

        <div className="space-y-2">
          {everyday.ingredientCards.length > 0 ? (
            everyday.ingredientCards.map((card) => (
              <IngredientCard key={card.name} card={card} />
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">
              Ingredient details not available for this product.
            </p>
          )}
        </div>
      </div>



      {/* 4. Should I Eat This? */}
      <div className="rounded-2xl border border-brand-100/50 bg-gradient-to-br from-brand-50/30 to-white p-5 space-y-2 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
          <span>💬</span> Should I Eat This?
        </h3>
        <p className="text-sm font-semibold text-slate-700 leading-relaxed">
          {everyday.shouldIEatThis}
        </p>
      </div>

      {/* 5. Healthier Swap (conditional) */}
      {everyday.healthierSwap && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">
              Healthier Swap
            </p>
            <p className="text-sm font-semibold text-emerald-800 leading-snug">
              {everyday.healthierSwap}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
