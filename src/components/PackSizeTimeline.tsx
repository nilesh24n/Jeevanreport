import type { PackSizeChange } from "@/lib/types";
import Badge from "./Badge";

export default function PackSizeTimeline({ changes }: { changes: PackSizeChange[] }) {
  if (changes.length === 0) {
    return <p className="text-sm text-slate-500">No pack size changes recorded yet.</p>;
  }

  const sorted = [...changes].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="relative ml-3 border-l-2 border-slate-200 pl-6 space-y-6">
      {sorted.map((c, i) => (
        <div key={c.date + c.country} className="relative">
          <div className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full border-2 border-white bg-warning-500" />
          <div className="card">
            <div className="flex flex-wrap items-center gap-2">
              <Badge label={`${c.percentChange}%`} variant="warning" />
              <span className="text-sm font-semibold text-slate-900">{c.oldSize} → {c.newSize}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">{c.date} · {c.country}</p>
            {c.notes && <p className="mt-2 text-sm text-slate-600">{c.notes}</p>}
            {i === 0 && (
              <p className="mt-2 text-xs text-warning-700">Most recent change</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
