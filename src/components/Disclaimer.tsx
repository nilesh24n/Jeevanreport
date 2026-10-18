import Link from "next/link";
import { MEDICAL_DISCLAIMER, CONTENT_DISCLAIMER, SHORT_LEGAL_DISCLAIMER } from "@/lib/types";

export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="rounded-xl border border-latte/60 bg-amber-50/40 p-2.5 text-[11px] leading-relaxed text-espresso/70">
        <div className="flex items-start gap-2">
          <span className="text-amber-700 font-bold">🛡️</span>
          <div>
            <span>{SHORT_LEGAL_DISCLAIMER}</span>{" "}
            <Link href="/disclaimer" className="font-semibold text-brand-700 underline hover:text-brand-900">
              Read Legal Safe Harbor Notice →
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-stone-50/60 p-5 shadow-sm text-espresso">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-latte pb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-amber-200/70 text-xs font-bold text-amber-900">
            ⚖️
          </span>
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
            Legal, Editorial & Consumer Rights Notice
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-espresso/60">
          <span>Art. 19(1)(a)</span>
          <span>·</span>
          <span>Consumer Protection Act 2019</span>
          <span>·</span>
          <span>Nominative Fair Use</span>
        </div>
      </div>

      <div className="space-y-2.5 text-xs text-espresso/75 leading-relaxed">
        <div>
          <h4 className="font-bold text-espresso text-[11px] uppercase tracking-wider mb-1">
            Factual Package Data & Freedom of Information
          </h4>
          <p>{CONTENT_DISCLAIMER}</p>
        </div>

        <div className="border-t border-latte/70 pt-2.5">
          <h4 className="font-bold text-espresso text-[11px] uppercase tracking-wider mb-1">
            General Health Guidance (Not Medical Advice)
          </h4>
          <p className="text-espresso/65">{MEDICAL_DISCLAIMER}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-latte/70 pt-3 text-[11px] text-espresso/60">
        <span>
          Are you a brand representative? Submit verified label updates or reformulated packaging proof.
        </span>
        <div className="flex items-center gap-3 font-semibold text-brand-700">
          <Link href="/corrections" className="hover:underline">
            Submit Packaging Correction →
          </Link>
          <Link href="/disclaimer" className="hover:underline">
            Full Legal Safe Harbor Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}

