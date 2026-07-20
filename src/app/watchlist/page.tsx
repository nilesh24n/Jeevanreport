"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/Badge";
import { getWatchlist, removeFromWatchlist, type WatchlistEntry } from "@/lib/storage";
import { getProductById } from "@/lib/data/products";
import { useToast } from "@/components/Toast";
import ProductImage from "@/components/ProductImage";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setWatchlist(getWatchlist());
    setMounted(true);
  }, []);

  function handleRemove(productId: string) {
    removeFromWatchlist(productId);
    setWatchlist(getWatchlist());
    toast("Removed from watchlist", "success");
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">My Watchlist</h1>
        <p className="mt-2 text-slate-650 text-slate-650">Products you are tracking for shrinkflation and updates</p>
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer h-20 rounded-2xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">My Watchlist</h1>
      <p className="mt-2 text-slate-600">Products you are tracking for shrinkflation, formula changes, and unit prices</p>

      <div className="mt-8 space-y-4">
        {watchlist.length === 0 ? (
          <div className="card text-center py-16 bg-slate-50/50">
            <p className="text-slate-500 font-medium text-base">Your watchlist is empty.</p>
            <p className="text-xs text-slate-400 mt-1 mb-6">Scan products and click &quot;+ Add to Watchlist&quot; to keep track of changes.</p>
            <Link href="/scan" className="btn-primary min-h-[48px]">
              ⚡ Go to Scanner
            </Link>
          </div>
        ) : (
          watchlist.map((w) => {
            const product = getProductById(w.productId);
            return (
              <div key={w.productId} className="card flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-100 flex-shrink-0 bg-slate-50">
                    <ProductImage
                      src={product?.imageUrl || ""}
                      alt={w.name}
                      barcode={product?.barcode}
                      category={product?.category}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0">
                    <Link href={`/products/${w.productId}`} className="font-bold text-slate-800 hover:text-brand-600 transition-colors text-base truncate block">
                      {w.name}
                    </Link>
                    <p className="text-xs text-slate-400 font-medium">{w.brand} · Added on {new Date(w.addedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {product && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">Trust Score:</span>
                      <Badge label={`${product.trustScore}%`} variant="brand" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(w.productId)}
                    className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors min-h-[44px] px-3 border border-rose-200 hover:bg-rose-50 rounded-xl"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
