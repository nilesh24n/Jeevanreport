"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

export default function CategoryFilters({
  products,
  categoryName,
}: {
  products: Product[];
  categoryName: string;
}) {
  const [nutritionFlag, setNutritionFlag] = useState("");
  const [onlyChanged, setOnlyChanged] = useState(false);
  const [sort, setSort] = useState<"name" | "trust" | "calories">("name");

  const filtered = useMemo(() => {
    let list = [...products];
    if (nutritionFlag) {
      list = list.filter((p) =>
        p.badges.some((b) => b.toLowerCase().includes(nutritionFlag.toLowerCase()))
      );
    }
    if (onlyChanged) {
      list = list.filter(
        (p) => p.packSizeChanges.length > 0 || p.formulaChanges.length > 0
      );
    }
    list.sort((a, b) => {
      if (sort === "trust") return b.trustScore - a.trustScore;
      if (sort === "calories") {
        return b.versions.at(-1)!.nutrition.caloriesPerServing - a.versions.at(-1)!.nutrition.caloriesPerServing;
      }
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [products, nutritionFlag, onlyChanged, sort]);

  const withChanges = products.filter(
    (p) => p.packSizeChanges.length > 0 || p.formulaChanges.length > 0
  );

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-4 rounded-xl border border-latte bg-white p-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-espresso/45">Nutrition flag</label>
          <select className="input-field mt-1" value={nutritionFlag} onChange={(e) => setNutritionFlag(e.target.value)}>
            <option value="">Any</option>
            <option value="high sugar">High sugar</option>
            <option value="high sodium">High sodium</option>
            <option value="low protein">Low protein</option>
            <option value="calorie">Calorie dense</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-espresso/45">Sort by</label>
          <select className="input-field mt-1" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="name">Name</option>
            <option value="trust">Data confidence</option>
            <option value="calories">Calories</option>
          </select>
        </div>
        <label className="flex cursor-pointer items-end gap-2 pb-2 text-sm text-espresso/60">
          <input
            type="checkbox"
            checked={onlyChanged}
            onChange={(e) => setOnlyChanged(e.target.checked)}
            className="rounded border-latte text-brand-600"
          />
          Only products with changes
        </label>
      </div>

      {!onlyChanged && withChanges.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-espresso">Products with recent changes</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {withChanges.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-espresso">
          {onlyChanged ? "Changed" : "All"} {categoryName} products ({filtered.length})
        </h2>
        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {filtered.length === 0 && (
          <p className="mt-4 text-sm text-espresso/45">No products match these filters.</p>
        )}
      </section>
    </>
  );
}
