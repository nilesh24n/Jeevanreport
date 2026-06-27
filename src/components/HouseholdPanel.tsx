"use client";

import type { ProductVersion } from "@/lib/types";

const HARSH_CHEMICALS: { name: string; flag: string; ventilation: boolean; childSafe: boolean }[] = [
  { name: "bleach",            flag: "Contains bleach — corrosive; wear gloves",                            ventilation: true,  childSafe: false },
  { name: "sodium hypochlorite", flag: "Sodium hypochlorite — strong disinfectant, fumes in confined spaces", ventilation: true,  childSafe: false },
  { name: "ammonia",           flag: "Ammonia — toxic fumes; never mix with bleach",                        ventilation: true,  childSafe: false },
  { name: "hydrochloric acid", flag: "Hydrochloric acid — highly corrosive; use gloves and eye protection", ventilation: true,  childSafe: false },
  { name: "formaldehyde",      flag: "Formaldehyde — known carcinogen; avoid prolonged exposure",           ventilation: true,  childSafe: false },
  { name: "phosphoric acid",   flag: "Phosphoric acid — descaling agent; avoid contact with skin",          ventilation: false, childSafe: false },
  { name: "lactic acid",       flag: "Lactic acid — mild; generally safe in household cleaners",            ventilation: false, childSafe: true  },
  { name: "citric acid",       flag: "Citric acid — plant-derived; safe and biodegradable",                 ventilation: false, childSafe: true  },
  { name: "surfactant",        flag: "Surfactant — standard cleaning agent; rinse surfaces after use",      ventilation: false, childSafe: false },
];

export default function HouseholdPanel({ version }: { version: ProductVersion; productName?: string }) {
  const lower = version.ingredientsText.toLowerCase();

  const flagged = HARSH_CHEMICALS.filter((c) => lower.includes(c.name));
  const needsVentilation = flagged.some((f) => f.ventilation);
  const safeAroundKids   = flagged.length === 0 || flagged.every((f) => f.childSafe);
  const safeAroundPets   = !flagged.some((f) => ["bleach", "ammonia", "formaldehyde"].includes(f.name));

  return (
    <div className="space-y-5">
      {/* What this is for */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-start gap-3 shadow-sm">
        <span className="text-3xl flex-shrink-0">🧹</span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">What this product is for</p>
          <p className="text-sm font-semibold text-slate-700 leading-relaxed">
            Household cleaning product for surfaces, fabrics, or sanitation. Refer to label for specific usage.
          </p>
        </div>
      </div>

      {/* Chemical safety flags */}
      {flagged.length > 0 && (
        <div className="card space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <span>⚗️</span> Chemical Safety
          </h3>
          <div className="space-y-2">
            {flagged.map((c) => (
              <div
                key={c.name}
                className={`rounded-xl border px-4 py-3 flex items-start gap-2.5 ${
                  c.childSafe ? "bg-amber-50 border-amber-100" : "bg-rose-50 border-rose-100"
                }`}
              >
                <span className="text-base">{c.childSafe ? "⚠️" : "🚫"}</span>
                <p className="text-sm text-slate-700">{c.flag}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {flagged.length === 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <p className="text-sm font-semibold text-emerald-800">No highly hazardous chemicals identified in ingredients list.</p>
        </div>
      )}

      {/* Safety grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Ventilation needed", value: needsVentilation ? "Yes — open windows" : "Not required", icon: "💨", bad: needsVentilation },
          { label: "Safe around children", value: safeAroundKids ? "Generally yes" : "Keep out of reach", icon: "👶", bad: !safeAroundKids },
          { label: "Safe around pets", value: safeAroundPets ? "Generally yes" : "Keep pets away", icon: "🐾", bad: !safeAroundPets },
          { label: "Dilution", value: "Check label instructions", icon: "💧", bad: false },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-2xl border p-3 flex flex-col gap-1 ${item.bad ? "bg-rose-50 border-rose-100" : "bg-white border-slate-100 shadow-sm"}`}
          >
            <span className="text-lg">{item.icon}</span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
            <p className={`text-xs font-semibold ${item.bad ? "text-rose-700" : "text-slate-700"}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>ℹ️ Note:</strong> This analysis is based on ingredient text available in our database. Always read the full product label, safety data sheet, and follow manufacturer usage guidelines.
        </p>
      </div>
    </div>
  );
}
