import Link from "next/link";
import type { Product } from "@/lib/types";
import { getLatestVersion } from "@/lib/data/products";
import Badge from "./Badge";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const v = getLatestVersion(product);
  const n = v.nutrition;
  const latestPrice = product.prices[product.prices.length - 1];

  return (
    <div className="card group !p-4 transition-all hover:-translate-y-0.5">
      <Link href={`/products/${product.id}`} className="flex gap-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-latte bg-stone-50">
          <ProductImage src={product.imageUrl} alt={product.name} barcode={product.barcode} category={product.category} fill className="object-cover" sizes="80px" />
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <h3 className="truncate font-semibold text-espresso transition-colors group-hover:text-brand-600">
            {product.name}
          </h3>
          <p className="text-xs font-medium text-espresso/45">
            {product.brand} · {v.country}
            {latestPrice && ` · ${latestPrice.currency === "INR" ? "₹" : latestPrice.currency + " "}${latestPrice.price}`}
          </p>
          <p className="font-mono text-[10px] text-espresso/30">{product.barcode}</p>

          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-espresso/55">{n.caloriesPerServing} cal</span>
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">P {n.protein}g</span>
            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">S {n.sugar}g</span>
          </div>

          <div className="flex flex-wrap gap-1 pt-0.5">
            {product.badges.slice(0, 2).map((b) => (
              <Badge key={b} label={b} />
            ))}
          </div>
        </div>

        <div className="flex flex-shrink-0 flex-col items-end justify-between">
          <div className="rounded-xl border border-brand-100 bg-brand-50 px-2.5 py-1.5 text-center">
            <div className="text-sm font-bold leading-none text-brand-700">{product.trustScore}%</div>
            <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-500/70">trust</div>
          </div>
        </div>
      </Link>

      <div className="mt-3 flex items-center justify-between border-t border-latte pt-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-espresso/35">Pack: {v.packSize}</span>
        <Link
          href={`/scan?barcode=${product.barcode}`}
          className="flex items-center gap-0.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          Quick scan →
        </Link>
      </div>
    </div>
  );
}
