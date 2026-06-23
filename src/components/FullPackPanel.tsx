import type { NutritionFacts } from "@/lib/types";

export default function FullPackPanel({
  nutrition,
  servingsPerPack,
  servingSize,
}: {
  nutrition: NutritionFacts;
  servingsPerPack: number;
  servingSize: string;
}) {
  if (servingsPerPack <= 1) return null;

  const multiplier = servingsPerPack;
  const isHighCaloriePack = nutrition.caloriesPerPack > 600;

  return (
    <div className={`rounded-xl border p-4 ${isHighCaloriePack ? "border-warning-500/30 bg-warning-50" : "border-slate-200 bg-slate-50"}`}>
      <h3 className="text-sm font-semibold text-slate-900">Full-pack reality</h3>
      <p className="mt-1 text-xs text-slate-600">
        Labels show per-serving data ({servingSize}). This pack contains{" "}
        <strong>{servingsPerPack} servings</strong>.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-3 text-center border border-slate-200">
          <div className="text-lg font-bold text-slate-900">{nutrition.caloriesPerPack}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">Total calories</div>
        </div>
        <div className="rounded-lg bg-white p-3 text-center border border-slate-200">
          <div className="text-lg font-bold text-slate-900">{(nutrition.sugar * multiplier).toFixed(0)}g</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">Total sugar</div>
        </div>
        <div className="rounded-lg bg-white p-3 text-center border border-slate-200">
          <div className="text-lg font-bold text-slate-900">{(nutrition.sodium * multiplier).toFixed(0)}mg</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">Total sodium</div>
        </div>
        <div className="rounded-lg bg-white p-3 text-center border border-slate-200">
          <div className="text-lg font-bold text-slate-900">{(nutrition.protein * multiplier).toFixed(0)}g</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide">Total protein</div>
        </div>
      </div>
      {isHighCaloriePack && (
        <p className="mt-3 text-xs text-warning-700">
          Eating the full pack in one sitting may provide a large share of daily calorie needs for many adults.
          Portion awareness may help if you are monitoring total intake.
        </p>
      )}
    </div>
  );
}
