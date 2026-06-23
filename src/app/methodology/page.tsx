import Disclaimer from "@/components/Disclaimer";
import { MEDICAL_DISCLAIMER } from "@/lib/types";

const sections = [
  {
    title: "What Jeevanreport measures",
    content: `Jeevanreport tracks publicly visible product information: ingredient lists, nutrition facts,
    package sizes, unit prices, and changes over time. We measure shrinkflation (smaller packages at similar prices),
    skimpflation (reduced product quality or quantity within the same package), formula changes (ingredient additions
    or removals), and unit-price trends across stores and countries.`,
  },
  {
    title: "Nutrition interpretation methodology",
    content: `We provide educational interpretations based on widely accepted nutrition principles — calorie density,
    macronutrient balance, fiber and protein content, sugar and sodium levels, and degree of processing where data
    is available. Labels such as "High sugar" or "Low fiber" are relative to common serving sizes and general dietary
    reference values. We do not diagnose health conditions or provide individualized medical advice.`,
  },
  {
    title: "Body impact explanation principles",
    content: `Our body impact summaries consider: calorie density (calories per serving relative to volume),
    protein content (may support satiety for some people), fiber content (may support fullness and digestion for some people),
    sugar content (may lead to blood sugar spikes for some people), saturated fat and sodium (may be worth monitoring
    depending on personal health goals), and processing level when ingredient data supports an estimate.
    We use cautious language: "may," "for some people," "depending on total diet."`,
  },
  {
    title: "Important disclaimer",
    content: MEDICAL_DISCLAIMER + " Personal outcomes vary by body size, activity level, health conditions, medications, and total diet.",
  },
  {
    title: "Shrinkflation methodology",
    content: `We track package size reductions by comparing labeled weights/volumes over time. Evidence includes
    user-submitted photos with visible dates, store receipts, and barcode matches. We calculate percent change
    and unit-price impact when price data is available. Side-by-side photos of old and new packaging increase
    confidence. Multiple independent reports from different users strengthen verification.`,
  },
  {
    title: "Trust score methodology",
    content: `Trust scores (0–100%) are built from: barcode match accuracy, number of consistent independent submissions,
    readability of photo evidence, completeness of date/store metadata, community confirmations, moderator review status,
    and consistency across reports. Scores above 90% indicate verified data with multiple corroborating sources.
    Scores 70–89% are community-verified. Below 70% may be under review or based on limited evidence.`,
  },
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Methodology</h1>
      <p className="mt-2 text-slate-650 text-slate-600">How Jeevanreport collects, interprets, and presents product data</p>

      <div className="mt-8 space-y-8">
        {sections.map((s) => (
          <section key={s.title} className="card">
            <h2 className="text-xl font-semibold text-slate-900">{s.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-line">{s.content}</p>
          </section>
        ))}
      </div>

      <div className="mt-8"><Disclaimer /></div>
    </div>
  );
}
