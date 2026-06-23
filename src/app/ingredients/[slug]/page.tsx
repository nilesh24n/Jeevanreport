import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Badge from "@/components/Badge";
import { getGlossaryEntry, ingredientGlossary } from "@/lib/ingredient-glossary";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return ingredientGlossary.map((e) => ({ slug: e.slug }));
}

export default async function IngredientPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getGlossaryEntry(slug);
  if (!entry) notFound();

  const searchTerm = entry.name.split("(")[0].trim().toLowerCase();
  const relatedProducts = products.filter((p) =>
    p.versions.some((v) =>
      v.ingredientsText.toLowerCase().includes(searchTerm) ||
      v.highlightedIngredients.some((h) => h.name.toLowerCase().includes(searchTerm.split(" ")[0]))
    )
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[
        { label: "Ingredients", href: "/ingredients" },
        { label: entry.name },
      ]} />

      <Badge label={entry.type} variant="brand" />
      <h1 className="mt-3 text-3xl font-bold text-slate-900">{entry.name}</h1>
      <p className="mt-4 text-slate-700 leading-relaxed">{entry.summary}</p>

      <div className="mt-6 card border-amber-200 bg-amber-50">
        <h2 className="font-semibold text-amber-900">Educational note</h2>
        <p className="mt-2 text-sm text-amber-800 leading-relaxed">{entry.educationalNote}</p>
        <p className="mt-2 text-xs text-amber-700 italic">General educational guidance — not medical advice.</p>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">
            Products in archive containing this ingredient ({relatedProducts.length})
          </h2>
          <div className="mt-4 space-y-3">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <Link href="/ingredients" className="mt-8 inline-block text-sm font-medium text-brand-600">
        ← Back to glossary
      </Link>
    </div>
  );
}
