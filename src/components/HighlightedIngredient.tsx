import Link from "next/link";
import Badge from "./Badge";
import { findIngredientSlug } from "@/lib/ingredient-links";

export default function HighlightedIngredient({
  name,
  type,
  note,
}: {
  name: string;
  type: string;
  note: string;
}) {
  const slug = findIngredientSlug(name);

  return (
    <div className="flex items-start gap-2 text-sm">
      <Badge label={type} variant="brand" />
      <span className="text-slate-700">
        {slug ? (
          <Link href={`/ingredients/${slug}`} className="font-semibold text-brand-600 hover:underline">
            {name}
          </Link>
        ) : (
          <strong>{name}</strong>
        )}
        {" "}— {note}
      </span>
    </div>
  );
}
