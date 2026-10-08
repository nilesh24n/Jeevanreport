"use client";

import { useEffect, useState } from "react";

import type { Product, PackSizeChange, FormulaChange } from "@/lib/types";
import Badge from "./Badge";
import ShrinkflationComparison from "./ShrinkflationComparison";
import FormulaDiff from "./FormulaDiff";

interface ShrinkflationApiPanelProps {
  productId: string;
  initialProduct?: Product;
}

export default function ShrinkflationApiPanel({ productId, initialProduct }: ShrinkflationApiPanelProps) {
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProduct) return;

    let active = true;
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          throw new Error(`Could not load this product (${res.status})`);
        }
        const data = await res.json();
        if (active) {
          setProduct(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
          setError(msg);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProduct();
    return () => {
      active = false;
    };
  }, [productId, initialProduct]);

  if (loading) {
    return (
      <div className="card flex min-h-[160px] flex-col items-center justify-center space-y-3 p-6">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        <p className="text-sm font-medium text-espresso/50">Loading pack & formula history…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="card space-y-2 border-rose-200 bg-rose-50/30 p-6 text-center">
        <span className="text-2xl" aria-hidden>
          ⚠️
        </span>
        <h4 className="font-semibold text-rose-900">History unavailable</h4>
        <p className="text-xs font-medium text-rose-700">{error || "Product not found"}</p>
      </div>
    );
  }

  const hasPackChanges = product.packSizeChanges && product.packSizeChanges.length > 0;
  const hasFormulaChanges = product.formulaChanges && product.formulaChanges.length > 0;

  if (!hasPackChanges && !hasFormulaChanges) {
    return (
      <div className="card p-6 text-center">
        <p className="text-sm font-medium text-espresso/55">
          No recorded pack-size or recipe changes for this product yet.
        </p>
        <p className="mt-1 text-xs text-espresso/40">
          Spotted a smaller pack or new ingredients?{" "}
          <a href="/submit" className="font-semibold text-brand-600 underline-offset-2 hover:underline">
            Submit evidence
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card space-y-4">
          <h3 className="border-b border-latte pb-2 text-sm font-bold uppercase tracking-wider text-espresso">
            Pack size history
          </h3>

          {hasPackChanges ? (
            <div className="space-y-3">
              {product.packSizeChanges.map((c: PackSizeChange, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl border border-latte bg-white p-2 shadow-sm transition-colors hover:border-brand-200"
                >
                  <ShrinkflationComparison
                    productName={product.name}
                    imageUrl={product.imageUrl}
                    change={c}
                    trustScore={product.trustScore}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-xs font-medium text-espresso/40">No shrinkflation recorded.</p>
          )}
        </div>

        <div className="card space-y-4">
          <h3 className="border-b border-latte pb-2 text-sm font-bold uppercase tracking-wider text-espresso">
            Recipe changes
          </h3>

          {hasFormulaChanges ? (
            <div className="space-y-3">
              {product.formulaChanges.map((c: FormulaChange, idx: number) => (
                <div
                  key={idx}
                  className="space-y-2.5 rounded-xl border border-brand-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <Badge label="Ingredients updated" variant="brand" />
                    <span className="rounded bg-stone-50 px-2 py-0.5 text-[10px] font-semibold text-espresso/45">
                      {c.date}
                    </span>
                  </div>
                  <p className="text-sm font-semibold leading-relaxed text-espresso/80">{c.summary}</p>
                  <FormulaDiff change={c} />
                </div>
              ))}
            </div>
          ) : (
            <p className="py-6 text-center text-xs font-medium text-espresso/40">No formula changes recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}
