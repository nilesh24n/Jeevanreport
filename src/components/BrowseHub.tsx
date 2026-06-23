import Link from "next/link";
import { countries } from "@/lib/data/products";
import { getAllBrands } from "@/lib/brands";
import { categories } from "@/lib/data/products";

const countryFlags: Record<string, string> = {
  USA: "🇺🇸", UK: "🇬🇧", Canada: "🇨🇦", Australia: "🇦🇺", Japan: "🇯🇵",
};

export default function BrowseHub() {
  const topBrands = getAllBrands().slice(0, 6);

  return (
    <section className="py-16 bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="section-title text-center">Browse the archive</h2>
        <p className="section-subtitle text-center">Explore by country, brand, or category</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="card">
            <h3 className="font-semibold text-slate-900">By country</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {countries.map((c) => (
                <Link key={c} href={`/countries/${c}`} className="badge-brand">
                  {countryFlags[c] ?? "🌍"} {c}
                </Link>
              ))}
            </div>
            <Link href="/countries" className="mt-4 inline-block text-sm font-medium text-brand-600">All countries →</Link>
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-900">By brand</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {topBrands.map((b) => (
                <Link key={b.slug} href={`/brands/${b.slug}`} className="badge-neutral">
                  {b.name}
                </Link>
              ))}
            </div>
            <Link href="/brands" className="mt-4 inline-block text-sm font-medium text-brand-600">All brands →</Link>
          </div>

          <div className="card">
            <h3 className="font-semibold text-slate-900">By category</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.slice(0, 6).map((c) => (
                <Link key={c.slug} href={`/categories/${c.slug}`} className="badge-neutral">
                  {c.icon} {c.name}
                </Link>
              ))}
            </div>
            <Link href="/categories" className="mt-4 inline-block text-sm font-medium text-brand-600">All categories →</Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/leaderboard" className="btn-secondary">View shrinkflation leaderboard →</Link>
        </div>
      </div>
    </section>
  );
}
