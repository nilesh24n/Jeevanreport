import Disclaimer from "@/components/Disclaimer";
import { MEDICAL_DISCLAIMER } from "@/lib/types";

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Medical Disclaimer</h1>
      <div className="mt-6"><Disclaimer /></div>
      <p className="mt-6 text-sm text-slate-600 leading-relaxed">{MEDICAL_DISCLAIMER}</p>
    </div>
  );
}
