"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Disclaimer from "@/components/Disclaimer";
import { getProductById, getProductByBarcode } from "@/lib/data/products";
import type { Product } from "@/lib/types";

function SubmitFormContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");
  const barcodeParam = searchParams.get("barcode");

  const [prefillProduct, setPrefillProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (productId) {
      const local = getProductById(productId);
      if (local) {
        setPrefillProduct(local);
      } else {
        fetch(`/api/products/${productId}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => setPrefillProduct(data))
          .catch((err) => console.error(err));
      }
    } else if (barcodeParam) {
      const local = getProductByBarcode(barcodeParam);
      if (local) {
        setPrefillProduct(local);
      } else {
        fetch(`/api/products?barcode=${barcodeParam}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.products && data.products.length > 0) {
              return fetch(`/api/products/${data.products[0].id}`).then((res) => (res.ok ? res.json() : null));
            }
            return null;
          })
          .then((fullProduct) => {
            if (fullProduct) setPrefillProduct(fullProduct);
          })
          .catch((err) => console.error(err));
      }
    }
  }, [productId, barcodeParam]);

  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="text-4xl">✓</div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Evidence Submitted</h1>
        <p className="mt-2 text-slate-600">
          Thank you! Your submission is queued for moderation. Typical review time is 24–72 hours.
        </p>
      </div>
    );
  }

  const v = prefillProduct?.versions.at(-1);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Submit Evidence</h1>
      <p className="mt-2 text-slate-600">Help build the public archive with photos, prices, and product changes</p>

      {prefillProduct && (
        <div className="mt-4 card bg-brand-50 border-brand-200">
          <p className="text-sm text-brand-800">
            Pre-filled for <strong>{prefillProduct.name}</strong> ({prefillProduct.barcode})
          </p>
        </div>
      )}

      <div className="mt-6 card bg-brand-50 border-brand-200">
        <h2 className="font-semibold text-brand-900">Evidence quality checklist</h2>
        <ul className="mt-2 space-y-1 text-sm text-brand-800">
          <li>✓ Clear, readable photos of labels and barcodes</li>
          <li>✓ Include purchase date and store name</li>
          <li>✓ Match barcode to product name</li>
          <li>✓ For comparisons, include both old and new versions</li>
          <li>✓ Do not make medical claims in notes</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { name: "productName", label: "Product name", required: true, default: prefillProduct?.name },
            { name: "brand", label: "Brand", required: true, default: prefillProduct?.brand },
            { name: "barcode", label: "Barcode", required: true, default: prefillProduct?.barcode },
            { name: "category", label: "Category", default: prefillProduct?.category },
            { name: "country", label: "Country", required: true, default: v?.country },
            { name: "store", label: "Store" },
            { name: "purchaseDate", label: "Purchase date", type: "date" },
            { name: "price", label: "Price", type: "number" },
            { name: "currency", label: "Currency", default: prefillProduct?.prices.at(-1)?.currency },
            { name: "packSize", label: "Pack size", default: v?.packSize },
            { name: "servingSize", label: "Serving size", default: v?.servingSize },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-sm font-medium text-slate-700">{field.label}</label>
              <input
                name={field.name}
                type={field.type || "text"}
                required={field.required}
                defaultValue={field.default ?? ""}
                className="input-field mt-1"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Ingredients text (from label)</label>
          <textarea name="ingredients" rows={3} className="input-field mt-1" defaultValue={v?.ingredientsText ?? ""} />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Nutrition facts (from label)</label>
          <textarea
            name="nutrition"
            rows={3}
            className="input-field mt-1"
            placeholder="Calories, fat, protein, etc."
            defaultValue={
              v
                ? `Calories: ${v.nutrition.caloriesPerServing}, Fat: ${v.nutrition.totalFat}g, Protein: ${v.nutrition.protein}g, Sugar: ${v.nutrition.sugar}g, Sodium: ${v.nutrition.sodium}mg`
                : ""
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "Front package photo",
            "Back label photo",
            "Nutrition label photo",
            "Barcode photo",
            "Old version photo",
            "New version photo",
          ].map((label) => (
            <div key={label}>
              <label className="text-sm font-medium text-slate-700">{label}</label>
              <input type="file" accept="image/*" className="mt-1 text-sm" />
            </div>
          ))}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Notes</label>
          <textarea name="notes" rows={3} className="input-field mt-1" placeholder="Describe what changed, when you noticed, etc. No medical claims." />
        </div>

        <Disclaimer />

        <button type="submit" className="btn-primary w-full sm:w-auto">Submit Evidence</button>
      </form>

      <div className="mt-12 space-y-6">
        <div className="card">
          <h2 className="font-semibold">How trust scores work</h2>
          <p className="mt-2 text-sm text-slate-600">
            Submissions increase trust when barcodes match, photos are readable, metadata is complete,
            and other users confirm findings. Moderators review flagged or disputed submissions.
          </p>
        </div>
        <div className="card border-danger-500/20">
          <h2 className="font-semibold text-danger-600">Community rules</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>• Submit only accurate, good-faith evidence</li>
            <li>• Do not fabricate changes or use misleading photos</li>
            <li>• No medical diagnoses or health guarantees in notes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function SubmitForm() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading form…</div>}>
      <SubmitFormContent />
    </Suspense>
  );
}
