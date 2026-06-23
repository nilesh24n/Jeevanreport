import Link from "next/link";
import { getAllBrands } from "@/lib/brands";

export default function BrandsPage() {
  const brands = getAllBrands();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Brands</h1>
      <p className="mt-2 text-slate-600">Browse products by manufacturer and brand</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <Link
            key={b.slug}
            href={`/brands/${b.slug}`}
            className="card hover:border-brand-200 hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-slate-900">{b.name}</h2>
            <p className="mt-2 text-sm text-slate-600">
              {b.productCount} product{b.productCount !== 1 ? "s" : ""} · {b.avgTrust}% avg trust
            </p>
            <p className="mt-1 text-xs text-slate-400">{b.countries.join(", ")}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
