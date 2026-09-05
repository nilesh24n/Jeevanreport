import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Data Corrections & Dispute Process — JeevanReport India",
  description: "Request corrections or submit data disputes. JeevanReport reviews all verified factual evidence within 3 business days.",
};

export default function CorrectionsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Data Corrections & Dispute Process</h1>
        <p className="mt-2 text-slate-650 text-slate-600 max-w-2xl text-base">
          At Jeevanreport, we are committed to absolute data accuracy and factual transparency. If you find any nutrition labels, pricing, or package weight records that are outdated or incorrect, please file a request below.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Submit a Correction or Dispute</h2>
            <p className="text-sm text-slate-600 mb-4">
              Manufacturers, brand representatives, and consumers can submit corrections using the form below. Please state the product barcode, the specific data field in question, and link to or upload verifiable evidence (e.g. FSSAI registration records, official company label statements).
            </p>
            {/* Prefill form with "dispute" subject category */}
            <ContactForm prefilledSubject="Data Correction / Dispute Request" />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card space-y-3 border-l-4 border-brand-500 bg-brand-50/30">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm uppercase tracking-wider">
              <span>⏱️</span> Service SLA
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed font-semibold">
              We review all factual dispute queries and correction requests within <strong className="text-brand-700 font-extrabold">3 business days</strong>.
            </p>
          </div>

          <div className="card space-y-3">
            <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">🛠️ Verifiable Evidence</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              To expedite updates, please provide one of the following:
            </p>
            <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
              <li>High-resolution photo of front and back packaging</li>
              <li>PDF copy of laboratory report</li>
              <li>Link to FSSAI licensing database record</li>
              <li>Manufacturer’s official press release or product spec sheet</li>
            </ul>
          </div>

          <div className="card space-y-3">
            <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">⚖️ Content Policy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Jeevanreport operates as an educational platform and consumer archive. We make assessments based strictly on public label data. We do not make claims of legal violations. If a correction is verified, the database is updated immediately and logged.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
