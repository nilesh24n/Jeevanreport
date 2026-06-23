import Link from "next/link";
import { ingredientGlossary } from "@/lib/ingredient-glossary";

export default function IngredientsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Ingredient Glossary</h1>
      <p className="mt-2 text-slate-600">
        Educational explanations of common additives, sweeteners, and label ingredients — not medical advice
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {ingredientGlossary.map((entry) => (
          <Link
            key={entry.slug}
            href={`/ingredients/${entry.slug}`}
            className="card hover:border-brand-200 transition"
          >
            <span className="badge-brand">{entry.type}</span>
            <h2 className="mt-2 font-semibold text-slate-900">{entry.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{entry.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
