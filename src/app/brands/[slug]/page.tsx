import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { getAllBrands, getProductsByBrand } from "@/lib/brands";

export function generateStaticParams() {
  return getAllBrands().map((b) => ({ slug: b.slug }));
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getAllBrands().find((b) => b.slug === slug);
  if (!brand) notFound();

  const brandProducts = getProductsByBrand(slug);
  const withChanges = brandProducts.filter(
    (p) => p.packSizeChanges.length > 0 || p.formulaChanges.length > 0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[
        { label: "Brands", href: "/brands" },
        { label: brand.name },
      ]} />

      <h1 className="text-3xl font-bold text-slate-900">{brand.name}</h1>
      <p className="mt-2 text-slate-600">
        {brand.productCount} products · Markets: {brand.countries.join(", ")} · {brand.avgTrust}% avg trust
      </p>

      {withChanges.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Products with documented changes</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {withChanges.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">All {brand.name} products</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brandProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
