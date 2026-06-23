import type { Product } from "@/lib/types";

export default function ProductJsonLd({ product }: { product: Product }) {
  const v = product.versions.at(-1)!;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    gtin13: product.barcode,
    description: product.baseDescription,
    image: product.imageUrl,
    category: product.category,
    nutrition: {
      "@type": "NutritionInformation",
      calories: `${v.nutrition.caloriesPerServing} calories`,
      proteinContent: `${v.nutrition.protein}g`,
      sugarContent: `${v.nutrition.sugar}g`,
      fatContent: `${v.nutrition.totalFat}g`,
      servingSize: v.servingSize,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
