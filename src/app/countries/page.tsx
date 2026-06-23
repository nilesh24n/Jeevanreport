import Link from "next/link";
import { countries } from "@/lib/data/products";
import { getCountryStats } from "@/lib/countries";

const countryMeta: Record<string, { flag: string; desc: string }> = {
  India: { flag: "🇮🇳", desc: "Indian consumer products database, tea-time biscuits, namkeens, instant foods, staples, and Ayurvedic OTC wellness" },
  USA: { flag: "🇺🇸", desc: "Archive of US packaged goods with shrinkflation tracking" },
  UK: { flag: "🇬🇧", desc: "British products including skimpflation and formula change reports" },
  Canada: { flag: "🇨🇦", desc: "Canadian market products with label data" },
  Australia: { flag: "🇦🇺", desc: "Australian packaged foods and consumer goods" },
  Japan: { flag: "🇯🇵", desc: "Japanese products with per-100g nutrition comparisons" },
};

export default function CountriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-4">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Browse by Country</h1>
      <p className="text-slate-500 font-medium">
        Compare how the same product differs across markets — ingredients, nutrition, and pack sizes
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => {
          const stats = getCountryStats(country);
          const meta = countryMeta[country] ?? { flag: "🌍", desc: "Products from this market" };
          return (
            <Link
              key={country}
              href={`/countries/${country}`}
              className="card group hover:-translate-y-0.5 transition-all duration-300 hover:border-brand-200/60"
            >
              <div className="text-4xl group-hover:scale-105 transition-transform duration-300">{meta.flag}</div>
              <h2 className="mt-3 text-xl font-bold text-slate-900">{country}</h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed font-medium min-h-[40px]">{meta.desc}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs font-semibold">
                <span className="text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">{stats.productCount} products</span>
                <span className="text-warning-600 bg-warning-50 px-2 py-1 rounded-lg">{stats.shrinkflationCount} shrinkflation</span>
                <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{stats.avgTrust}% avg trust</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
