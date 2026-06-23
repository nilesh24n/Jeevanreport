import ProductCard from "./ProductCard";
import { getSimilarProducts } from "@/lib/stats";

export default function SimilarProducts({ productId }: { productId: string }) {
  const similar = getSimilarProducts(productId);
  if (similar.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900">Similar products in this category</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {similar.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
