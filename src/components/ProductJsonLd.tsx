import type { Product } from "@/lib/types";
import { getProductStatus } from "@/lib/nutrition-engine";

export default function ProductJsonLd({ product }: { product: Product }) {
  const v = product.versions.at(-1)!;
  const status = getProductStatus(v.bodyImpact);

  // 1. Product Schema
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "brand": { "@type": "Brand", "name": product.brand },
    "gtin13": product.barcode,
    "description": product.baseDescription,
    "image": product.imageUrl,
    "category": product.category,
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": `${v.nutrition.caloriesPerServing} calories`,
      "proteinContent": `${v.nutrition.protein}g`,
      "sugarContent": `${v.nutrition.sugar}g`,
      "fatContent": `${v.nutrition.totalFat}g`,
      "servingSize": v.servingSize,
    },
  };

  // 2. BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://jeevanreport.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://jeevanreport.in/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://jeevanreport.in/products/${product.id}`
      }
    ]
  };

  // 3. FAQPage Schema for the product
  const shrinkflationAnswer = product.packSizeChanges.length > 0
    ? `Yes, ${product.name} has a recorded history of package size reductions. The pack size changed from ${product.packSizeChanges[0].oldSize} to ${product.packSizeChanges[0].newSize}.`
    : `No, we do not currently have any recorded size changes (shrinkflation) for ${product.name}.`;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Is ${product.name} healthy?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `According to our nutritional analysis, ${product.name} is rated as a '${status.label}' (${status.rating} Choice). Key assessment points: ${status.points.join(", ")}.`
        }
      },
      {
        "@type": "Question",
        "name": `What are the main ingredients in ${product.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The ingredients listed for ${product.name} are: ${v.ingredientsText}`
        }
      },
      {
        "@type": "Question",
        "name": `Does ${product.name} have a history of shrinkflation?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": shrinkflationAnswer
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
