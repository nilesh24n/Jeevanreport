import { MEDICAL_DISCLAIMER, CONTENT_DISCLAIMER } from "@/lib/types";

export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-[11px] italic leading-normal text-espresso/45">
        General educational guidance — not medical advice. Product assessments are editorial opinions based on public label data.
      </p>
    );
  }
  return (
    <div className="space-y-3 rounded-2xl border border-latte bg-stone-50/50 p-4">
      <div>
        <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-espresso/70">Content disclaimer</h4>
        <p className="text-xs leading-relaxed text-espresso/55">{CONTENT_DISCLAIMER}</p>
      </div>
      <div className="border-t border-latte pt-2">
        <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-espresso/70">Medical disclaimer</h4>
        <p className="text-xs leading-relaxed text-espresso/55">{MEDICAL_DISCLAIMER}</p>
      </div>
    </div>
  );
}
