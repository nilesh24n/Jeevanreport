import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { getLatestVersion } from "@/lib/data/products";
import Badge from "./Badge";

export default function ProductCard({ product }: { product: Product }) {
  const v = getLatestVersion(product);
  const n = v.nutrition;
  const latestPrice = product.prices[product.prices.length - 1];

  return (
    <div className="card group hover:-translate-y-0.5 transition-all duration-300">
      <Link href={`/products/${product.id}`} className="flex gap-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="80px" />
        </div>
        
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-xs font-semibold text-slate-400">
            {product.brand} · {v.country} {latestPrice && `· ${latestPrice.currency === "INR" ? "₹" : latestPrice.currency + " "}${latestPrice.price}`}
          </p>
          <p className="text-[10px] text-slate-350 text-slate-400 font-mono">{product.barcode}</p>
          
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{n.caloriesPerServing} Cal</span>
            <span className="text-[10px] font-bold text-success-700 bg-success-50 px-2 py-0.5 rounded-md">P {n.protein}g</span>
            <span className="text-[10px] font-bold text-warning-700 bg-warning-50 px-2 py-0.5 rounded-md">S {n.sugar}g</span>
          </div>

          <div className="flex flex-wrap gap-1 pt-1.5">
            {product.badges.slice(0, 2).map((b) => (
              <Badge key={b} label={b} />
            ))}
          </div>
        </div>

        <div className="text-right flex-shrink-0 flex flex-col justify-between items-end">
          <div className="bg-brand-50 border border-brand-100/30 rounded-xl px-2.5 py-1.5 text-center">
            <div className="text-sm font-extrabold text-brand-700 leading-none">{product.trustScore}%</div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-brand-450 text-brand-500 mt-1">trust</div>
          </div>
        </div>
      </Link>

      <div className="mt-3 flex justify-between items-center border-t border-slate-100 pt-2.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pack size: {v.packSize}</span>
        <Link
          href={`/scan?barcode=${product.barcode}`}
          className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-0.5"
        >
          Quick scan <span className="text-sm">→</span>
        </Link>
      </div>
    </div>
  );
}
