import { MEDICAL_DISCLAIMER } from "@/lib/types";

export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-slate-500 italic">
        General educational guidance — not medical advice.
      </p>
    );
  }
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
      <p className="text-xs text-amber-900">{MEDICAL_DISCLAIMER}</p>
    </div>
  );
}
