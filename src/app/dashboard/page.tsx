"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/Badge";
import AlertPreferencesPanel from "@/components/AlertPreferences";
import {
  getScanHistory,
  getWatchlist,
  removeFromWatchlist,
  clearScanHistory,
  exportWatchlistJson,
  getAlertPreferences,
  type ScanHistoryEntry,
  type WatchlistEntry,
  type AlertPreferences,
} from "@/lib/storage";
import { getProductById, changeFeed } from "@/lib/data/products";
import { useToast } from "@/components/Toast";

const contributions = [
  { product: "Maggi Masala Noodles", status: "approved", date: "2024-05-10", trust: "+25" },
  { product: "Good Day Butter Cookies", status: "pending", date: "2025-02-28", trust: "—" },
];

function filterAlerts(watchlist: WatchlistEntry[], prefs: AlertPreferences) {
  return changeFeed.filter((c) => {
    if (!watchlist.some((w) => w.productId === c.productId)) return false;
    if (c.type === "shrinkflation" && !prefs.sizeChanges) return false;
    if (c.type === "formula" && !prefs.formulaChanges) return false;
    if (c.type === "price" && !prefs.priceChanges) return false;
    if ((c.type === "trending" || c.type === "new_scan") && !prefs.nutritionUpdates) return false;
    return true;
  });
}

export default function DashboardPage() {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [scanHistory, setScanHistory] = useState<ScanHistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    setWatchlist(getWatchlist());
    setScanHistory(getScanHistory());
  }, []);

  function handleRemove(productId: string) {
    removeFromWatchlist(productId);
    setWatchlist(getWatchlist());
    toast("Removed from watchlist", "success");
  }

  function handleClearHistory() {
    clearScanHistory();
    setScanHistory([]);
    toast("Scan history cleared", "success");
  }

  function handleExportWatchlist() {
    const json = exportWatchlistJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jeevanreport-watchlist.json";
    a.click();
    URL.revokeObjectURL(url);
    toast("Watchlist exported", "success");
  }

  const alerts = mounted ? filterAlerts(watchlist, getAlertPreferences()).slice(0, 6) : [];

  if (!mounted) {
    return <div className="py-20 text-center text-slate-500">Loading dashboard…</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Dashboard</h1>
          <p className="mt-2 text-slate-600">Watchlist, scan history, alerts, and contributions</p>
        </div>
        <div className="flex gap-2">
          {watchlist.length > 0 && (
            <button type="button" onClick={handleExportWatchlist} className="btn-secondary text-sm">
              Export watchlist
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">
            Saved products {watchlist.length > 0 && `(${watchlist.length})`}
          </h2>
          <div className="mt-4 space-y-3">
            {watchlist.length === 0 ? (
              <div className="card text-center py-8 text-sm text-slate-500">
                No saved products yet. Scan a product and tap &quot;Add to watchlist&quot;.
              </div>
            ) : (
              watchlist.map((w) => {
                const product = getProductById(w.productId);
                return (
                  <div key={w.productId} className="card flex items-center gap-3">
                    {product && (
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg flex-shrink-0">
                        <Image src={product.imageUrl} alt="" fill className="object-cover" sizes="48px" />
                      </div>
                    )}
                    <Link href={`/products/${w.productId}`} className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{w.name}</div>
                      <div className="text-xs text-slate-500">{w.brand}</div>
                    </Link>
                    {product && <Badge label={`${product.trustScore}%`} variant="brand" />}
                    <button
                      type="button"
                      onClick={() => handleRemove(w.productId)}
                      className="text-xs text-slate-400 hover:text-danger-600"
                    >
                      Remove
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <AlertPreferencesPanel />

        <section className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Alerts from watchlist</h2>
          <div className="mt-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="card text-center py-8 text-sm text-slate-500">
                Add products to your watchlist to see alerts matching your preferences.
              </div>
            ) : (
              alerts.map((a) => (
                <Link key={a.id} href={`/products/${a.productId}`} className="card block hover:border-brand-200">
                  <div className="flex items-center gap-2">
                    <Badge
                      label={a.type.replace("_", " ")}
                      variant={a.type === "shrinkflation" || a.type === "price" ? "warning" : "brand"}
                    />
                    <span className="text-sm font-medium">{a.productName}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{a.summary}</p>
                  <p className="text-xs text-slate-400">{a.country} · {a.date}</p>
                </Link>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Scan history</h2>
            {scanHistory.length > 0 && (
              <button type="button" onClick={handleClearHistory} className="text-xs text-slate-500 hover:text-danger-600">
                Clear
              </button>
            )}
          </div>
          <div className="mt-4 space-y-2">
            {scanHistory.length === 0 ? (
              <div className="card text-center py-8 text-sm text-slate-500">
                Your scan history will appear here after you scan products.
              </div>
            ) : (
              scanHistory.map((s) => (
                <Link
                  key={s.productId + s.scannedAt}
                  href={`/scan?barcode=${s.barcode}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                >
                  <span>{s.name}</span>
                  <span className="text-xs text-slate-400 font-mono">{s.barcode}</span>
                </Link>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">Your contributions</h2>
          <div className="mt-4 space-y-3">
            {contributions.map((c) => (
              <div key={c.date + c.product} className="card flex items-center justify-between">
                <div>
                  <span className="font-medium text-sm">{c.product}</span>
                  <p className="text-xs text-slate-500">{c.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={c.status} variant={c.status === "approved" ? "success" : "neutral"} />
                  <span className="text-sm text-success-600">{c.trust}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/submit" className="mt-4 inline-block btn-primary text-sm">Submit more evidence</Link>
        </section>
      </div>
    </div>
  );
}
