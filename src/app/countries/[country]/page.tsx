import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ShrinkflationComparison from "@/components/ShrinkflationComparison";
import { countries, changeFeed } from "@/lib/data/products";
import { getProductsByCountry, getCountryStats } from "@/lib/countries";

export const dynamicParams = true;

export function generateStaticParams() {
  return countries.map((country) => ({ country }));
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;

  if (!countries.some((c) => c.toLowerCase() === country.toLowerCase())) notFound();

  const matchedCountry = countries.find((c) => c.toLowerCase() === country.toLowerCase()) || country;
  const countryProducts = getProductsByCountry(matchedCountry);
  const stats = getCountryStats(matchedCountry);
  const countryChanges = changeFeed.filter((c) => c.country?.toLowerCase() === matchedCountry.toLowerCase());
  const shrinkflationProducts = countryProducts.filter((p) =>
    (p.packSizeChanges || []).some((c) => c.country?.toLowerCase() === matchedCountry.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <Breadcrumbs items={[
        { label: "Countries", href: "/countries" },
        { label: matchedCountry },
      ]} />

      <div className="my-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{matchedCountry} Products</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          {stats.productCount} products · {shrinkflationProducts.length || stats.shrinkflationCount} with shrinkflation · {stats.avgTrust}% avg trust
        </p>
      </div>

      {countryChanges.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">Recent changes in {matchedCountry}</h2>
          <div className="mt-4 space-y-2">
            {countryChanges.slice(0, 5).map((c) => (
              <div key={c.id} className="card text-sm p-4">
                <span className="font-semibold text-espresso">{c.productName}</span>
                <span className="text-slate-600"> — {c.summary}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {shrinkflationProducts.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-slate-900">Shrinkflation in {matchedCountry}</h2>
          <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
            {shrinkflationProducts.slice(0, 8).map((p) => {
              const change = (p.packSizeChanges || []).find((c) => c.country?.toLowerCase() === matchedCountry.toLowerCase()) || p.packSizeChanges[0];
              if (!change) return null;
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

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">All products ({countryProducts.length})</h2>
        <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {countryProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
