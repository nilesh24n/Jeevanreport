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
        <h1 className="section-title">My Watchlist</h1>
        <p className="mt-2 text-espresso/55">Products you are tracking for shrinkflation and updates</p>
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="shimmer h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="section-title">My Watchlist</h1>
      <p className="mt-2 text-espresso/55">Products you are tracking for shrinkflation, formula changes, and unit prices</p>

      <div className="mt-8 space-y-4">
        {watchlist.length === 0 ? (
          <div className="card bg-stone-50/50 py-16 text-center">
            <p className="text-base font-medium text-espresso/55">Your watchlist is empty.</p>
            <p className="mb-6 mt-1 text-xs text-espresso/35">Scan products and click &quot;Add to Watchlist&quot; to keep track of changes.</p>
            <Link href="/scan" className="btn-scan min-h-[48px]">
              Go to scanner
            </Link>
          </div>
        ) : (
          watchlist.map((w) => {
            const product = getProductById(w.productId);
            return (
              <div key={w.productId} className="card flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex w-full items-center gap-4 sm:w-auto">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-latte bg-stone-50">
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
                    <Link href={`/products/${w.productId}`} className="block truncate text-base font-semibold text-espresso transition-colors hover:text-brand-600">
                      {w.name}
                    </Link>
                    <p className="text-xs font-medium text-espresso/35">{w.brand} · Added on {new Date(w.addedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex w-full items-center justify-between gap-4 border-t border-latte pt-3 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
                  {product && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-espresso/35">Trust score:</span>
                      <Badge label={`${product.trustScore}%`} variant="brand" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(w.productId)}
                    className="min-h-[44px] rounded-xl border border-rose-200 px-3 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
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
