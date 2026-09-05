import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryFilters from "@/components/CategoryFilters";
import { categories, products } from "@/lib/data/products";
import * as jsonProducts from "@/lib/products-json";

export const dynamicParams = true;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const fullCategoryProducts = jsonProducts.getProductsByCategory(slug);
  const categoryProducts = fullCategoryProducts.length > 0
    ? fullCategoryProducts
    : products.filter((p) => p.category === slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <Breadcrumbs items={[
        { label: "Categories", href: "/categories" },
        { label: category.name },
      ]} />
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 my-4">
        <span className="text-3xl sm:text-4xl">{category.icon}</span>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{category.name}</h1>
          <p className="mt-1 text-sm sm:text-base text-slate-600">{category.description}</p>
        </div>
      </div>

      <CategoryFilters products={categoryProducts} categoryName={category.name} />
    </div>
  );
}
