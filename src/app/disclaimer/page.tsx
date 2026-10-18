import Link from "next/link";
import { Metadata } from "next";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Legal Disclaimer & Safe Harbor Notice | JeevanReport",
  description:
    "Official legal safe harbor notice, nominative fair use statement, and consumer protection declaration for JeevanReport.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-canvas text-espresso py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-12">
        {/* Header */}
        <header className="space-y-4 border-b border-latte pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900 border border-amber-300">
            <span>⚖️ Legal Notice & Safe Harbor Policy</span>
            <span>·</span>
            <span>Updated October 2026</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-espresso">
            Platform Legal Disclaimer & Consumer Protection Charter
          </h1>
          <p className="text-base text-espresso/70 leading-relaxed">
            Statutory disclosure regarding public package data, consumer rights under Indian law, nominative fair use of trademarks, and editorial analysis.
          </p>
        </header>

        {/* Highlight Alert Box */}
        <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-6 text-sm text-espresso/80 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <span className="text-lg">🛡️</span>
            <span>Summary for Manufacturers, Brand Owners, and Legal Counsel</span>
          </div>
          <p>
            JeevanReport is an independent, non-commercial public interest initiative. We do not sell competing food products, endorse rival commercial brands, or manufacture false allegations. Every raw ingredient, nutritional number, additive INS code, net quantity, and packaging claim displayed on this platform is a verbatim reproduction of what manufacturers print on retail packages sold to Indian consumers in open commerce.
          </p>
        </div>

        {/* Interactive Disclaimer Component */}
        <Disclaimer />

        {/* Detailed Legal Sections */}
        <div className="space-y-10 text-sm leading-relaxed text-espresso/80">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-espresso flex items-center gap-2">
              <span className="text-brand-700">1.</span>
              Constitutional Rights & Consumer Protection Act, 2019
            </h2>
            <p>
              Under <strong>Article 19(1)(a) of the Constitution of India</strong>, citizens enjoy the fundamental right to freedom of speech and expression, which inherently includes the right to impart and receive factual information of public interest.
            </p>
            <p>
              Furthermore, under <strong>Section 2(9) of the Consumer Protection Act, 2019</strong>, every Indian consumer is explicitly guaranteed the <em>&quot;right to be informed about the quality, quantity, potency, purity, standard and price of goods, products or services&quot;</em> so as to be protected against unfair trade practices. JeevanReport operates in strict fulfillment of this statutory objective.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-espresso flex items-center gap-2">
              <span className="text-brand-700">2.</span>
              Truth as an Absolute Defense & Absence of Malice (No Defamation)
            </h2>
            <p>
              Under the law of torts and criminal jurisprudence (formerly Sections 499/500 of the Indian Penal Code and the Bharatiya Nyaya Sanhita), truthful representation of facts published for the public good is a complete and absolute defense against any claim of defamation.
            </p>
            <p>
              JeevanReport maintains a zero-malice standard. Highlighting the presence of palm oil, high fructose corn syrup, maltodextrin, artificial food colors, emulsifiers, or excessive sodium/sugar levels is based entirely on the manufacturer&apos;s own packaging and published scientific research by the <strong>Food Safety and Standards Authority of India (FSSAI)</strong>, the <strong>Indian Council of Medical Research - National Institute of Nutrition (ICMR-NIN)</strong>, and the <strong>World Health Organization (WHO)</strong>.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-espresso flex items-center gap-2">
              <span className="text-brand-700">3.</span>
              Nominative Fair Use of Trademarks (Trade Marks Act, 1999)
            </h2>
            <p>
              All product names, brand names, registered trade names, packaging artwork, and company logos referenced on JeevanReport are the exclusive intellectual property of their respective trademark holders.
            </p>
            <p>
              In accordance with <strong>Section 30(1) and Section 30(2)(d) of the Trade Marks Act, 1999</strong>, the use of registered trademarks on this platform constitutes <em>Nominative Fair Use</em>. Trademarks are used solely and strictly to identify the specific commercial goods being reviewed and compared for consumer transparency. JeevanReport does not claim any affiliation, sponsorship, endorsement, or commercial association with any trademark holder.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-espresso flex items-center gap-2">
              <span className="text-brand-700">4.</span>
              Shrinkflation & Pack-Size Reduction Reporting
            </h2>
            <p>
              Our historical pack-size tracking (including documented reductions from 2018 to 2026) is compiled from verified distributor price circulars, retail point-of-sale audits, public news coverage, and statutory packaging declarations governed by the <strong>Legal Metrology (Packaged Commodities) Rules, 2011</strong>.
            </p>
            <p>
              Reporting that a package size has changed from 100g to 50g at a constant price point is a matter of factual retail history. It is neither disparagement nor trade libel; it is factual economic data reporting.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-espresso flex items-center gap-2">
              <span className="text-brand-700">5.</span>
              Intermediary Safe Harbor & Verified Right of Reply
            </h2>
            <p>
              To the extent that JeevanReport hosts crowdsourced community barcode submissions, label images, and user reviews, it operates under the safe harbor provisions of <strong>Section 79 of the Information Technology Act, 2000</strong> and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
            </p>
            <p>
              We provide a fair, prompt right of reply. If any manufacturer reformulates a product, alters packaging claims, removes controversial additives, or identifies an error in transcribed label data, we invite them to submit verified high-resolution packaging proof through our dedicated portal.
            </p>
            <div className="rounded-xl border border-latte bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="block font-bold text-espresso">Manufacturer Grievance & Corrections Desk</span>
                <span className="text-xs text-espresso/60">Response SLA: Verified brand submissions reviewed within 48–72 hours.</span>
              </div>
              <Link
                href="/corrections"
                className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-4 py-2 text-xs font-bold text-white hover:bg-brand-800 transition-colors"
              >
                Submit Correction →
              </Link>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-espresso flex items-center gap-2">
              <span className="text-brand-700">6.</span>
              Not Medical or Clinical Advice
            </h2>
            <p>
              The nutritional grades, traffic-light flags, and wellness scores calculated on JeevanReport are intended for general consumer guidance and educational reference. They do not constitute personalized medical advice, clinical dietary therapy, diagnostic conclusions, or therapeutic regimens.
            </p>
            <p>
              Individuals with chronic health conditions (including diabetes, hypertension, renal conditions, or severe food allergies) must consult a certified medical practitioner or registered dietitian before making dietary decisions.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-espresso flex items-center gap-2">
              <span className="text-brand-700">7.</span>
              Governing Law & Dispute Resolution
            </h2>
            <p>
              This platform is published and maintained in India. Any dispute, grievance, or legal inquiry arising out of the content on this website shall be subject to the exclusive jurisdiction of the competent courts in India, governed by the laws of India.
            </p>
            <p className="text-xs text-espresso/60">
              For official correspondence, inquiries, or grievance communications:{" "}
              <a
                href="mailto:supportjeevanreport@gmail.com"
                className="rounded bg-latte/50 px-1.5 py-0.5 font-mono text-espresso font-semibold hover:underline text-brand-700"
              >
                supportjeevanreport@gmail.com
              </a>.
            </p>
          </section>
        </div>

        {/* Back navigation */}
        <div className="border-t border-latte pt-6 flex items-center justify-between">
          <Link href="/" className="text-xs font-semibold text-brand-700 hover:underline">
            ← Back to Home
          </Link>
          <Link href="/methodology" className="text-xs font-semibold text-brand-700 hover:underline">
            View Scoring Methodology →
          </Link>
        </div>
      </div>
    </div>
  );
}
