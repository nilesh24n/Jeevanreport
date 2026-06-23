"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getScanHistory, type ScanHistoryEntry } from "@/lib/storage";
import { products } from "@/lib/data/products";

export default function RecentScans({ fallbackCount = 5 }: { fallbackCount?: number }) {
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getScanHistory();
    setHistory(stored.length > 0 ? stored : []);
  }, []);

  const items =
    mounted && history.length > 0
      ? history
      : products.slice(0, fallbackCount).map((p) => ({
          productId: p.id,
          name: p.name,
          barcode: p.barcode,
          scannedAt: "",
        }));

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Link
          key={item.productId}
          href={`/scan?barcode=${item.barcode}`}
          className="card flex items-center justify-between py-3 hover:border-brand-200"
        >
          <div>
            <span className="font-medium text-sm">{item.name}</span>
            <span className="ml-2 text-xs text-slate-400 font-mono">{item.barcode}</span>
          </div>
          <span className="text-xs text-brand-600">Rescan →</span>
        </Link>
      ))}
    </div>
  );
}
