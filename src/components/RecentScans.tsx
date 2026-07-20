"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getScanHistory, clearScanHistory, type ScanHistoryEntry } from "@/lib/storage";
import { products } from "@/lib/data/products";
import { useToast } from "./Toast";
import { useLang } from "./LanguageContext";

export default function RecentScans({ fallbackCount = 5 }: { fallbackCount?: number }) {
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const { t } = useLang();

  useEffect(() => {
    setMounted(true);
    const stored = getScanHistory();
    setHistory(stored);
  }, []);

  const items =
    mounted && history.length > 0
      ? history.slice(0, 5) // Show last 5 scanned products
      : products.slice(0, fallbackCount).map((p) => ({
          productId: p.id,
          name: p.name,
          barcode: p.barcode,
          scannedAt: "",
          rating: "Good" as const,
        }));

  function handleClear() {
    clearScanHistory();
    setHistory([]);
    toast("Scan history cleared", "success");
  }

  function getRatingColor(rating?: string) {
    if (rating === "Good") return "bg-emerald-500";
    if (rating === "Careful") return "bg-amber-500";
    return "bg-rose-500";
  }

  function getRatingLabel(rating?: string) {
    if (rating === "Good") return t("rating.good") || "Good Choice";
    if (rating === "Careful") return t("rating.caution") || "Caution";
    return t("rating.limit") || "Limit Often";
  }

  return (
    <div className="space-y-4">
      {/* Horizontal Scroll Cards */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 scrollbar-hide snap-x">
        {items.map((item) => (
          <div
            key={item.productId + item.scannedAt}
            className="flex-shrink-0 w-60 snap-start bg-white rounded-2xl border border-latte p-4 shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`h-2.5 w-2.5 rounded-full ${getRatingColor(item.rating)}`} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {getRatingLabel(item.rating)}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug">
                {item.name}
              </h3>
              <p className="text-[10px] font-mono text-slate-400 mt-1">{item.barcode}</p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
              <Link
                href={`/scan?barcode=${item.barcode}`}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 min-h-[36px]"
              >
                View Again →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {mounted && history.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors min-h-[36px] px-2"
          >
            {t("ui.clear_history") || "Clear history"}
          </button>
        </div>
      )}
    </div>
  );
}
