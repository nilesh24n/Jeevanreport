import type { NutritionFacts, ProductVersion } from "@/lib/types";

export default function NutritionLabel({
  nutrition,
  version,
}: {
  nutrition: NutritionFacts;
  version: Pick<ProductVersion, "servingSize" | "servingsPerPack">;
}) {
  const dv = nutrition.dailyValuePercentages;

  const rows: { label: string; amount: string; dv?: number; bold?: boolean; indent?: boolean }[] = [
    { label: "Total Fat", amount: `${nutrition.totalFat}g`, dv: dv.totalFat, bold: true },
    { label: "Saturated Fat", amount: `${nutrition.saturatedFat}g`, dv: dv.saturatedFat, indent: true },
    ...(nutrition.transFat !== undefined
      ? [{ label: "Trans Fat", amount: `${nutrition.transFat}g`, indent: true }]
      : []),
    { label: "Cholesterol", amount: `${nutrition.cholesterol ?? 0}mg`, dv: dv.cholesterol, bold: true },
    { label: "Sodium", amount: `${nutrition.sodium}mg`, dv: dv.sodium, bold: true },
    { label: "Total Carbohydrate", amount: `${nutrition.carbs}g`, dv: dv.carbs, bold: true },
    { label: "Dietary Fiber", amount: `${nutrition.fiber}g`, dv: dv.fiber, indent: true },
    { label: "Total Sugars", amount: `${nutrition.sugar}g`, indent: true },
    ...(nutrition.addedSugar !== undefined
      ? [{ label: "Incl. Added Sugars", amount: `${nutrition.addedSugar}g`, indent: true }]
      : []),
    { label: "Protein", amount: `${nutrition.protein}g`, dv: dv.protein, bold: true },
  ];

  return (
    <div className="mx-auto max-w-xs rounded-sm border-2 border-black bg-white p-1 font-sans text-black">
      <div className="border-b-8 border-black px-1 pb-1">
        <h3 className="text-3xl font-extrabold leading-none">Nutrition Facts</h3>
        <p className="mt-1 text-sm">{version.servingsPerPack} servings per container</p>
        <p className="text-sm font-bold">Serving size {version.servingSize}</p>
      </div>
      <div className="border-b-4 border-black py-1">
        <div className="flex items-end justify-between px-1">
          <span className="text-sm font-bold">Calories</span>
          <span className="text-4xl font-extrabold leading-none">{nutrition.caloriesPerServing}</span>
        </div>
        <p className="px-1 text-right text-xs font-bold">% Daily Value*</p>
      </div>
      <div>
        {rows.map((row) => (
          <div
            key={row.label}
            className={`flex justify-between border-b border-black px-1 py-0.5 text-sm ${row.bold ? "font-bold" : ""}`}
            style={{ paddingLeft: row.indent ? "1rem" : undefined }}
          >
            <span>{row.label} {row.amount}</span>
            {row.dv !== undefined && <span className="font-bold">{row.dv}%</span>}
          </div>
        ))}
      </div>
      <p className="mt-2 px-1 text-[10px] leading-tight">
        * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet.
        2,000 calories a day is used for general nutrition advice.
      </p>
    </div>
  );
}
