"use client";

import { useState } from "react";

export default function TrustScoreMeter({ score, level }: { score: number; level: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const color =
    score >= 90 ? "bg-success-600" : score >= 70 ? "bg-brand-500" : score >= 40 ? "bg-warning-500" : "bg-slate-400";

  return (
    <div className="relative">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 font-semibold text-espresso/70">
          Trust score
          <button
            type="button"
            className="text-[11px] font-bold bg-slate-200 text-slate-500 rounded-full h-4 w-4 flex items-center justify-center cursor-help"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            aria-label="What is this?"
          >
            ?
          </button>
        </span>
        <span className="font-bold text-espresso">{score}% · {level}</span>
      </div>

      {showTooltip && (
        <div className="absolute z-40 left-0 right-0 mt-2 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl leading-relaxed border border-slate-800">
          This score measures the completeness and verifiability of evidence Jeevanreport has collected for this product (e.g. ingredient list photographs, price records, FSSAI database matches). <strong>It is NOT a judgment of the product&apos;s quality, healthiness, or safety.</strong>
        </div>
      )}

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-200">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${score}%` }} />
      </div>
      <p className="mt-1 text-[11px] text-slate-400">
        Calculated from barcode records, clear packaging photographs, and community confirmations.
      </p>
    </div>
  );
}
