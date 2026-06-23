import Link from "next/link";
import Badge from "@/components/Badge";
import ProductCard from "@/components/ProductCard";
import ChangeFeedFilters from "@/components/ChangeFeedFilters";
import { changeFeed, products } from "@/lib/data/products";

export default function LatestChangesPage() {
  const shrinkflation = changeFeed.filter((c) => c.type === "shrinkflation");
  const formula = changeFeed.filter((c) => c.type === "formula");
  const trending = products.slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Latest Changes</h1>
      <p className="mt-2 text-slate-600">Shrinkflation, formula changes, price trends, and trending scans worldwide</p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Filter reports</h2>
        <ChangeFeedFilters />
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Latest shrinkflation reports</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {shrinkflation.map((item) => (
            <Link key={item.id} href={`/products/${item.productId}`} className="card hover:border-warning-500/30">
              <Badge label="Shrinkflation" variant="warning" />
              <p className="mt-2 font-medium">{item.productName}</p>
              <p className="text-sm text-slate-600">{item.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Latest ingredient changes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {formula.map((item) => (
            <Link key={item.id} href={`/products/${item.productId}`} className="card hover:border-brand-200">
              <Badge label="Formula change" variant="brand" />
              <p className="mt-2 font-medium">{item.productName}</p>
              <p className="text-sm text-slate-600">{item.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Trending scans this week</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {trending.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
