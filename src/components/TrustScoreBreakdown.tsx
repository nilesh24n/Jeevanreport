import type { Product } from "@/lib/types";

interface TrustFactor {
  label: string;
  points: number;
  max: number;
  met: boolean;
  description: string;
}

export function getTrustFactors(product: Product): TrustFactor[] {
  const hasPhotos = product.submissions.some((s) =>
    Object.values(s.media).some(Boolean)
  );
  const hasConfirmations = product.confirmations.length > 0;
  const hasMultiplePrices = product.prices.length >= 2;
  const hasChangeEvidence = product.packSizeChanges.length > 0 || product.formulaChanges.length > 0;
  const hasCountryData = product.countryComparisons.length >= 2;

  return [
    {
      label: "Barcode verified",
      points: 20,
      max: 20,
      met: true,
      description: "Product matched to a valid barcode record",
    },
    {
      label: "Photo evidence",
      points: hasPhotos ? 25 : 0,
      max: 25,
      met: hasPhotos,
      description: "User-submitted label or packaging photos on file",
    },
    {
      label: "Community confirmations",
      points: hasConfirmations ? 20 : 0,
      max: 20,
      met: hasConfirmations,
      description: "Independent users confirmed submitted evidence",
    },
    {
      label: "Price & change history",
      points: (hasMultiplePrices ? 15 : 0) + (hasChangeEvidence ? 10 : 0),
      max: 25,
      met: hasMultiplePrices || hasChangeEvidence,
      description: "Tracked unit prices or documented pack/formula changes",
    },
    {
      label: "Cross-country data",
      points: hasCountryData ? 10 : 0,
      max: 10,
      met: hasCountryData,
      description: "Same product compared across multiple markets",
    },
  ];
}

export default function TrustScoreBreakdown({ product }: { product: Product }) {
  const factors = getTrustFactors(product);

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-900">Trust score breakdown</h3>
      <p className="mt-1 text-xs text-slate-500">
        How {product.trustScore}% was built from available evidence
      </p>
      <div className="mt-4 space-y-3">
        {factors.map((f) => (
          <div key={f.label}>
            <div className="flex items-center justify-between text-sm">
              <span className={f.met ? "text-slate-800" : "text-slate-400"}>{f.label}</span>
              <span className="font-medium text-slate-600">
                {f.met ? f.points : 0}/{f.max}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${f.met ? "bg-brand-500" : "bg-slate-200"}`}
                style={{ width: `${(f.met ? f.points : 0) / f.max * 100}%` }}
              />
            </div>
            <p className="mt-0.5 text-[10px] text-slate-400">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
