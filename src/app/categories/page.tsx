import Link from "next/link";
import { categories } from "@/lib/data/products";

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
      <p className="mt-2 text-slate-600">Browse products by category with nutrition filters and change tracking</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link key={c.slug} href={`/categories/${c.slug}`} className="card group hover:border-brand-200 hover:shadow-md transition">
            <div className="text-4xl">{c.icon}</div>
            <h2 className="mt-3 text-xl font-semibold text-slate-900 group-hover:text-brand-600">{c.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{c.description}</p>
            <p className="mt-3 text-sm font-medium text-brand-600">{c.productCount} products →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
