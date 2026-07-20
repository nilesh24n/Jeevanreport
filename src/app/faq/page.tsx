import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — JeevanReport India",
  description: "Learn how JeevanReport works, how we calculate trust scores, how to scan products, track shrinkflation, and submit package data evidence.",
};

const faqs = [
  {
    q: "How does JeevanReport work?",
    a: "JeevanReport works by using barcode scanning or manual entry to fetch a product's nutritional details, ingredient listings, size variations, and price records from our public archive. We flag high-risk ingredients (like excess sugar, sodium, saturated fats) and track package size changes (shrinkflation) over time so you know the exact value you are getting."
  },
  {
    q: "Is it free?",
    a: "Yes, JeevanReport is 100% free for everyone. There are no hidden fees, paid subscriptions, or login requirements. We are dedicated to maintaining consumer transparency in retail spaces across India."
  },
  {
    q: "How accurate is the data?",
    a: "Our data is highly accurate and sourced directly from product package photographs uploaded by users and moderators. When discrepancies are reported, we update records accordingly. We also display a 'Trust Score' for every product so you know the confidence level of its data."
  },
  {
    q: "How do I scan a product?",
    a: "To scan a product, go to the Scan page (jeevanreport.in/scan) and grant camera permissions to your browser. Point your mobile camera steady at the barcode. If camera permission is denied or the camera cannot focus, you can type the barcode numbers directly into the manual lookup input field visible on the screen."
  },
  {
    q: "What is shrinkflation?",
    a: "Shrinkflation is a retail tactic where a manufacturer decreases a product's size, volume, or weight while maintaining the same packaging and retail price. This is a subtle way of raising unit prices without changing the retail price tag. JeevanReport documents these package changes with dated evidence."
  },
  {
    q: "How is trust score calculated?",
    a: "Trust scores are calculated based on multiple factors: the availability of clear ingredient packaging photos, barcode database matches, unit price records, history updates, and community verification votes. Product entries verified by high-quality photographic proofs receive a score above 90%."
  },
  {
    q: "Can I submit evidence?",
    a: "Yes! If you spot a product package with incorrect data or a package size reduction (shrinkflation), you can click 'Submit Evidence' on the product page or use the main Submit link. Upload clear photos of the barcode, front package, and the nutrition/ingredient tables. All community inputs are reviewed by moderators."
  },
  {
    q: "Is there a mobile app?",
    a: "JeevanReport is a Progressive Web App (PWA). You don't need to download it from the Play Store or App Store. Simply open jeevanreport.in in Chrome on Android or Safari on iOS, click 'Add to Home Screen' or the install prompt, and the platform will install as an app on your phone with offline support."
  }
];

export default function FAQPage() {
  // Construct FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h1 className="text-3xl font-bold text-slate-900">FAQ</h1>
      <p className="mt-2 text-slate-600">Common questions about scanning, trust, and submissions</p>
      <div className="mt-8">
        <FaqAccordion items={faqs} />
      </div>
    </div>
  );
}
