"use client";

import type { Product } from "@/lib/types";
import { getLatestVersion } from "@/lib/data/products";

export default function CompareExport({ selected }: { selected: Product[] }) {
  function exportCsv() {
    if (selected.length < 2) return;

    const headers = ["Product", "Brand", "Calories", "Protein", "Sugar", "Fiber", "Sodium", "Trust"];
    const rows = selected.map((p) => {
      const n = getLatestVersion(p!).nutrition;
      return [p!.name, p!.brand, n.caloriesPerServing, n.protein, n.sugar, n.fiber, n.sodium, p!.trustScore];
    });

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jeevanreport-comparison.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (selected.length < 2) return null;

  return (
    <button type="button" onClick={exportCsv} className="btn-secondary text-sm">
      Export CSV
    </button>
  );
}
