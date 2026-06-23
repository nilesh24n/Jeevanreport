import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ShrinkflationComparison from "@/components/ShrinkflationComparison";
import { countries, changeFeed } from "@/lib/data/products";
import { getProductsByCountry, getCountryStats } from "@/lib/countries";

export function generateStaticParams() {
  return countries.map((country) => ({ country }));
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;

  if (!countries.includes(country)) notFound();

  const countryProducts = getProductsByCountry(country);
  const stats = getCountryStats(country);
  const countryChanges = changeFeed.filter((c) => c.country === country);
  const shrinkflationProducts = countryProducts.filter((p) =>
    p.packSizeChanges.some((c) => c.country === country)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[
        { label: "Countries", href: "/countries" },
        { label: country },
      ]} />

      <h1 className="text-3xl font-bold text-slate-900">{country} Products</h1>
      <p className="mt-2 text-slate-600">
        {stats.productCount} products · {stats.shrinkflationCount} with shrinkflation · {stats.avgTrust}% avg trust
      </p>

      {countryChanges.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Recent changes in {country}</h2>
          <div className="mt-4 space-y-2">
            {countryChanges.slice(0, 5).map((c) => (
              <div key={c.id} className="card text-sm">
                <span className="font-medium">{c.productName}</span>
                <span className="text-slate-600"> — {c.summary}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {shrinkflationProducts.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Shrinkflation in {country}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {shrinkflationProducts.map((p) => {
              const change = p.packSizeChanges.find((c) => c.country === country)!;
              return (
                <ShrinkflationComparison
                  key={p.id}
                  productName={p.name}
                  imageUrl={p.imageUrl}
                  change={change}
                  trustScore={p.trustScore}
                />
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">All products ({countryProducts.length})</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {countryProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
