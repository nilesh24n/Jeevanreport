import FaqAccordion from "@/components/FaqAccordion";

const faqs = [
  { q: "Is Jeevanreport medical advice?", a: "No. Jeevanreport provides general educational nutrition guidance based on publicly available label data. It is not a substitute for professional medical advice, diagnosis, or treatment." },
  { q: "How do I scan a product?", a: "Go to the Scan page, allow camera access, and point at the barcode. You can also enter the barcode manually, upload a photo, or use the Quick scan button in the header. Press / or s on your keyboard to jump to scan." },
  { q: "How are trust scores calculated?", a: "Trust scores combine barcode matches, photo evidence quality, community confirmations, price and change history, and cross-country data. See the trust breakdown on any product page or read our Methodology." },
  { q: "What is shrinkflation?", a: "Shrinkflation is when a product's package gets smaller while the price stays similar or increases — so you pay more per unit without an obvious price hike. Jeevanreport tracks these changes with dated photo evidence." },
  { q: "Can I submit evidence?", a: "Yes! Use Submit Evidence to upload photos, prices, and notes. You can pre-fill from a product page. All submissions are moderated within 24–72 hours." },
  { q: "Does Jeevanreport work in my country?", a: "We're building a global archive across India, USA, UK, Canada, Australia, Japan, and more. Browse by country to see market-specific products and changes." },
  { q: "How do I compare products?", a: "Use the Compare page to select 2–4 products side by side. You can export results as CSV and share the comparison URL." },
  { q: "Is there an API?", a: "Yes — a read-only JSON API is available at /api/products. See API docs for endpoints and examples." },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">FAQ</h1>
      <p className="mt-2 text-slate-650 text-slate-600">Common questions about scanning, trust, and submissions</p>
      <div className="mt-8">
        <FaqAccordion items={faqs} />
      </div>
    </div>
  );
}
