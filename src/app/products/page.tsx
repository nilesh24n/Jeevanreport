import ProductBrowser from "@/components/ProductBrowser";
import { dbGetProductCount } from "@/lib/db";

export default async function ProductsPage() {
  const dbCount = await dbGetProductCount();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
      <p className="mt-2 text-slate-600">{(dbCount || 0).toLocaleString()} products in the public archive</p>
      <ProductBrowser />
    </div>
  );
}
