import type { PackSizeChange } from "@/lib/types";
import Badge from "./Badge";
import Image from "next/image";

export default function ShrinkflationComparison({
  productName,
  imageUrl,
  change,
  trustScore,
}: {
  productName: string;
  imageUrl: string;
  change: PackSizeChange;
  trustScore: number;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <Badge label={`${change.percentChange}% smaller`} variant="warning" />
        <span className="text-xs text-slate-500">{change.country} · {change.date}</span>
      </div>
      <div className="flex items-end justify-center gap-6">
        <div className="text-center">
          <div className="relative mx-auto h-28 w-20 overflow-hidden rounded-lg bg-slate-200 opacity-80">
            <Image src={imageUrl} alt={`${productName} old pack`} fill className="object-cover" sizes="80px" />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500 uppercase tracking-wide">Before</p>
          <p className="text-sm font-semibold text-slate-800">{change.oldSize}</p>
        </div>
        <div className="flex flex-col items-center pb-6">
          <svg className="h-6 w-6 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <span className="mt-1 text-lg font-bold text-warning-600">{change.percentChange}%</span>
        </div>
        <div className="text-center">
          <div className="relative mx-auto h-24 w-20 overflow-hidden rounded-lg bg-slate-200">
            <Image src={imageUrl} alt={`${productName} new pack`} fill className="object-cover" sizes="80px" />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500 uppercase tracking-wide">After</p>
          <p className="text-sm font-semibold text-slate-800">{change.newSize}</p>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-900">{productName}</p>
      {change.notes && <p className="mt-1 text-xs text-slate-600">{change.notes}</p>}
      <p className="mt-2 text-xs text-slate-400">Trust score: {trustScore}%</p>
    </div>
  );
}
