import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryFilters from "@/components/CategoryFilters";
import { categories, products } from "@/lib/data/products";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const categoryProducts = products.filter((p) => p.category === slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[
        { label: "Categories", href: "/categories" },
        { label: category.name },
      ]} />
      <div className="flex items-center gap-3">
        <span className="text-4xl">{category.icon}</span>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{category.name}</h1>
          <p className="mt-1 text-slate-600">{category.description}</p>
        </div>
      </div>

      <CategoryFilters products={categoryProducts} categoryName={category.name} />
    </div>
  );
}
