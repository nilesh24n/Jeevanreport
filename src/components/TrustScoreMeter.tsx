export default function TrustScoreMeter({ score, level }: { score: number; level: string }) {
  const color =
    score >= 90 ? "bg-success-500" : score >= 70 ? "bg-brand-500" : score >= 40 ? "bg-warning-500" : "bg-slate-400";

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">Trust score</span>
        <span className="font-bold text-slate-900">{score}% · {level}</span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Based on barcode matches, photo evidence, community confirmations, and moderator review.
      </p>
    </div>
  );
}
