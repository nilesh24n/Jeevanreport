import type { NutritionFacts } from "@/lib/types";

export default function NutritionTable({ nutrition, servingsPerPack }: { nutrition: NutritionFacts; servingsPerPack: number }) {
  const rows: { label: string; serving: string | number; pack?: string | number; dv?: number }[] = [
    { label: "Calories", serving: nutrition.caloriesPerServing, pack: nutrition.caloriesPerPack },
    { label: "Total Fat", serving: `${nutrition.totalFat}g`, dv: nutrition.dailyValuePercentages.totalFat },
    { label: "Saturated Fat", serving: `${nutrition.saturatedFat}g`, dv: nutrition.dailyValuePercentages.saturatedFat },
    ...(nutrition.transFat !== undefined ? [{ label: "Trans Fat", serving: `${nutrition.transFat}g` }] : []),
    { label: "Cholesterol", serving: nutrition.cholesterol ? `${nutrition.cholesterol}mg` : "0mg", dv: nutrition.dailyValuePercentages.cholesterol },
    { label: "Sodium", serving: `${nutrition.sodium}mg`, dv: nutrition.dailyValuePercentages.sodium },
    { label: "Total Carbohydrate", serving: `${nutrition.carbs}g`, dv: nutrition.dailyValuePercentages.carbs },
    { label: "Dietary Fiber", serving: `${nutrition.fiber}g`, dv: nutrition.dailyValuePercentages.fiber },
    { label: "Total Sugars", serving: `${nutrition.sugar}g` },
    ...(nutrition.addedSugar !== undefined ? [{ label: "Added Sugars", serving: `${nutrition.addedSugar}g` }] : []),
    { label: "Protein", serving: `${nutrition.protein}g`, dv: nutrition.dailyValuePercentages.protein },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-4 py-2 text-left font-semibold text-slate-700">Nutrient</th>
            <th className="px-4 py-2 text-right font-semibold text-slate-700">Per Serving</th>
            <th className="px-4 py-2 text-right font-semibold text-slate-700">Per Pack ({servingsPerPack} srv)</th>
            <th className="px-4 py-2 text-right font-semibold text-slate-700">% DV</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-slate-100">
              <td className="px-4 py-2 text-slate-700">{row.label}</td>
              <td className="px-4 py-2 text-right font-medium">{row.serving}</td>
              <td className="px-4 py-2 text-right text-slate-600">
                {row.pack !== undefined
                  ? typeof row.pack === "number" && row.label !== "Calories"
                    ? `${(parseFloat(String(row.serving)) * servingsPerPack).toFixed(1)}${String(row.serving).replace(/[\d.]/g, "")}`
                    : row.pack
                  : "—"}
              </td>
              <td className="px-4 py-2 text-right text-slate-500">{row.dv !== undefined ? `${row.dv}%` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
