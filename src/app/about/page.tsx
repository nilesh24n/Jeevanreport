import Link from "next/link";
import { getPlatformStats } from "@/lib/server-stats";

const values = [
  { title: "Transparency", desc: "Public data, linkable product pages, and open methodology — no black boxes." },
  { title: "Evidence-based", desc: "Trust scores built from photos, barcodes, dates, and community confirmations." },
  { title: "Educational", desc: "Careful nutrition language that informs without diagnosing or fearmongering." },
  { title: "Community-powered", desc: "Anyone can submit shrinkflation photos, price data, and label evidence." },
];

export default async function AboutPage() {
  const stats = await getPlatformStats();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">About Jeevanreport</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        Jeevanreport is a public, barcode-based platform that helps consumers in India and worldwide understand packaged products
        before buying or eating them. We decode ingredients, explain nutrition in plain language, and track
        shrinkflation, skimpflation, and formula changes with community-submitted photo evidence.
      </p>
      <p className="mt-4 text-slate-600 leading-relaxed">
        Our mission is transparency: making hidden product changes visible and building a searchable, linkable
        archive of product history for families, journalists, and consumer-rights researchers.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-brand-600">{stats.productCount}</div>
          <div className="text-xs text-slate-500">Products</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-brand-600">{stats.countryCount}</div>
          <div className="text-xs text-slate-500">Countries</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warning-600">{stats.shrinkflationCount}</div>
          <div className="text-xs text-slate-500">Shrinkflation</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-brand-600">{stats.avgTrustScore}%</div>
          <div className="text-xs text-slate-500">Avg trust</div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Our values</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="card">
              <h3 className="font-semibold text-slate-900">{v.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Who uses Jeevanreport?</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>• Families checking ingredients and sugar before buying snacks</li>
          <li>• Fitness-conscious shoppers comparing protein and calories</li>
          <li>• Price-sensitive shoppers tracking shrinkflation and unit prices</li>
          <li>• Journalists and researchers building evidence-based consumer stories</li>
          <li>• Anyone who wants to know what changed in a product they already buy</li>
        </ul>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/methodology" className="btn-primary">Read methodology</Link>
        <Link href="/submit" className="btn-accent">Submit evidence</Link>
        <Link href="/leaderboard" className="btn-secondary">Shrinkflation leaderboard</Link>
      </div>
    </div>
  );
}
