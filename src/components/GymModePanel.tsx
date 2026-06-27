"use client";

import { useState, useMemo } from "react";
import type { ProductVersion } from "@/lib/types";
import { computeGymAnalysis } from "@/lib/gym-engine";
import type { GymIngredientAnalysis } from "@/lib/gym-engine";

// ─── Macro Bar ─────────────────────────────────────────────────────────────────

function MacroBar({
  label,
  sublabel,
  value,
  unit,
  color,
  textColor,
  maxVal,
  watchOut,
}: {
  label: string;
  sublabel: string;
  value: number;
  unit: string;
  color: string;
  textColor: string;
  maxVal: number;
  watchOut?: boolean;
}) {
  const pct = Math.min(100, maxVal > 0 ? (value / maxVal) * 100 : 0);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold ${textColor}`}>{label}</span>
          <span className="text-slate-400 font-medium">— {sublabel}</span>
          {watchOut && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-300/50">
              Watch Out
            </span>
          )}
        </div>
        <span className={`font-extrabold ${textColor}`}>
          {value}
          {unit}
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Goal Score ────────────────────────────────────────────────────────────────

function GoalScore({ label, icon, score }: { label: string; icon: string; score: number }) {
  const dots = Array.from({ length: 10 }, (_, i) => i < score);
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-center">
      <div className="text-xl">{icon}</div>
      <div className="text-xs font-bold text-slate-600 leading-tight">{label}</div>
      <div className="text-lg font-black text-slate-900">{score}/10</div>
      <div className="flex justify-center gap-0.5 flex-wrap">
        {dots.map((filled, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${
              filled ? "bg-brand-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Ingredient Card ───────────────────────────────────────────────────────────

function IngredientCard({ ing }: { ing: GymIngredientAnalysis }) {
  const [expanded, setExpanded] = useState(false);

  const ratingConfig = {
    good: {
      pill: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300/50",
      dot: "🟢",
      label: "Good for Gym",
      border: "border-emerald-100",
    },
    neutral: {
      pill: "bg-amber-100 text-amber-700 ring-1 ring-amber-300/50",
      dot: "🟡",
      label: "Neutral",
      border: "border-amber-100",
    },
    avoid: {
      pill: "bg-rose-100 text-rose-700 ring-1 ring-rose-300/50",
      dot: "🔴",
      label: "Avoid",
      border: "border-rose-100",
    },
  }[ing.gymRating];

  return (
    <div
      className={`rounded-2xl border bg-white shadow-sm overflow-hidden transition-all duration-300 ${ratingConfig.border}`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base flex-shrink-0">{ratingConfig.dot}</span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{ing.simpleName}</p>
            <p className="text-xs text-slate-400 font-medium truncate">{ing.whatIsIt}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${ratingConfig.pill}`}
          >
            {ratingConfig.label}
          </span>
          <span className="text-slate-400 text-xs">{expanded ? "▴" : "▾"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-50 space-y-3 pt-3 bg-slate-50/30">
          <div className="flex items-start gap-2">
            <span className="text-base flex-shrink-0 mt-0.5">{ratingConfig.dot}</span>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">
                Why for gym?
              </p>
              <p className="text-sm text-slate-700 font-medium leading-snug">{ing.gymWhy}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">📅</span>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-0.5">
                How often?
              </p>
              <p className="text-sm font-bold text-slate-800">{ing.frequencyLabel}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function GymModePanel({ version }: { version: ProductVersion }) {
  const gym = useMemo(() => computeGymAnalysis(version), [version]);

  // Max value for macro bar chart scaling
  const maxMacro = Math.max(...gym.macros.map((m) => m.value), 1) * 1.2;

  const verdictBg = {
    green: "from-emerald-50 to-emerald-100/60 border-emerald-200",
    yellow: "from-amber-50 to-amber-100/60 border-amber-200",
    red: "from-rose-50 to-rose-100/60 border-rose-200",
  }[gym.verdictColor];

  const verdictText = {
    green: "text-emerald-800",
    yellow: "text-amber-800",
    red: "text-rose-800",
  }[gym.verdictColor];

  const bestTimeConfig = {
    "pre-workout": { bg: "bg-blue-100 text-blue-800", icon: "⚡" },
    "post-workout": { bg: "bg-emerald-100 text-emerald-800", icon: "🏋️" },
    "avoid-around-workout": { bg: "bg-rose-100 text-rose-800", icon: "🚫" },
    anytime: { bg: "bg-slate-100 text-slate-800", icon: "✅" },
  }[gym.bestConsumeTime];

  return (
    <div className="space-y-5">
      {/* 1. Fitness Verdict Banner */}
      <div
        className={`rounded-2xl border-2 bg-gradient-to-br p-5 ${verdictBg}`}
      >
        <p className={`text-base font-black leading-snug ${verdictText}`}>
          {gym.verdictLabel}
        </p>
      </div>

      {/* 2. Macro Breakdown */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>📊</span> Macro Breakdown
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Per serving
          </span>
        </div>
        <div className="space-y-3.5">
          {gym.macros.map((m) => (
            <MacroBar
              key={m.label}
              label={m.label}
              sublabel={m.sublabel}
              value={m.value}
              unit={m.unit}
              color={m.color}
              textColor={m.textColor}
              maxVal={maxMacro}
              watchOut={m.watchOut}
            />
          ))}
        </div>
      </div>

      {/* 3. Ingredient-by-Ingredient Breakdown */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>🧪</span> Ingredient Analysis
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">
            Tap to expand
          </span>
        </div>
        <div className="space-y-2">
          {gym.ingredientBreakdowns.length > 0 ? (
            gym.ingredientBreakdowns.map((ing) => (
              <IngredientCard key={ing.name} ing={ing} />
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">
              Ingredient details not available for this product.
            </p>
          )}
        </div>
      </div>

      {/* 4. Gym Goals Fit Score */}
      <div className="card space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <span>🎯</span> Gym Goals Fit Score
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <GoalScore label="Muscle Gain" icon="🏋️" score={gym.goalScores.muscleGain} />
          <GoalScore label="Fat Loss" icon="🔥" score={gym.goalScores.fatLoss} />
          <GoalScore label="Endurance / Cardio" icon="🏃" score={gym.goalScores.endurance} />
          <GoalScore label="Clean Eating" icon="🥗" score={gym.goalScores.cleanEating} />
        </div>
      </div>

      {/* 5. Best Time to Consume */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <span className="text-2xl">{bestTimeConfig.icon}</span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Best Time to Consume
          </p>
          <span
            className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${bestTimeConfig.bg}`}
          >
            {gym.bestConsumeLabel}
          </span>
        </div>
      </div>

      {/* 6. Quick Gym Verdict */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span>💬</span> Quick Gym Verdict
        </h3>
        <p className="text-sm font-semibold text-slate-700 leading-relaxed">
          {gym.quickVerdict}
        </p>
      </div>
    </div>
  );
}
