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
  const [showConsole, setShowConsole] = useState(false);

  useEffect(() => {
    if (initialProduct) return;

    let active = true;
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch product data: ${res.statusText}`);
        }
        const data = await res.json();
        if (active) {
          setProduct(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : "An error occurred while retrieving data.";
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
      <div className="card p-6 flex flex-col items-center justify-center space-y-3 min-h-[200px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"></div>
        <p className="text-sm font-semibold text-slate-500">Querying Shrinkflation API...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="card p-6 border-danger-200 bg-danger-50/20 text-center space-y-2">
        <span className="text-2xl">⚠️</span>
        <h4 className="font-bold text-danger-800">API Connection Failed</h4>
        <p className="text-xs text-danger-600 font-medium">{error || "Product not found"}</p>
      </div>
    );
  }

  const hasPackChanges = product.packSizeChanges && product.packSizeChanges.length > 0;
  const hasFormulaChanges = product.formulaChanges && product.formulaChanges.length > 0;

  // Format API details for console
  const apiEndpoint = typeof window !== "undefined" 
    ? `${window.location.origin}/api/products/${product.id}`
    : `/api/products/${product.id}`;

  const sampleJson = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    barcode: product.barcode,
    trustScore: product.trustScore,
    packSizeChanges: product.packSizeChanges || [],
    formulaChanges: product.formulaChanges || []
  };

  return (
    <div className="space-y-6">
      {/* Dynamic API Data Rendering */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Dynamic Pack Size/Weight Timeline */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              ⚖️ Dynamic Pack Size Timeline
            </h3>
            <span className="badge-warning">Realtime API</span>
          </div>

          {hasPackChanges ? (
            <div className="space-y-3">
              {product.packSizeChanges.map((c: PackSizeChange, idx: number) => (
                <div key={idx} className="rounded-xl border border-slate-155 p-2 bg-white shadow-sm hover:border-slate-300 transition-colors">
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
            <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400 font-semibold italic">
                No package size reductions or shrinkflation registered in database.
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Formula Changes */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              🧪 Dynamic Ingredient Changes
            </h3>
            <span className="badge-brand">Realtime API</span>
          </div>

          {hasFormulaChanges ? (
            <div className="space-y-3">
              {product.formulaChanges.map((c: FormulaChange, idx: number) => (
                <div key={idx} className="rounded-xl border border-brand-100 bg-white p-4 space-y-2.5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <Badge label="Formula Modified" variant="brand" />
                    <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-50 px-2 py-0.5 rounded border">{c.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 font-semibold leading-relaxed">{c.summary}</p>
                  <FormulaDiff change={c} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400 font-semibold italic">
                No ingredient modifications or formula changes registered.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* API Developer Console Integration Toggle */}
      <div className="card border-slate-200 bg-slate-50/30 overflow-hidden p-0 shadow-sm">
        <button
          type="button"
          onClick={() => setShowConsole(!showConsole)}
          className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-700 hover:bg-slate-50 focus:outline-none transition-colors"
        >
          <span className="flex items-center gap-2 text-xs uppercase tracking-wider font-mono">
            <span>⚙️</span> Developer API Integration Console
          </span>
          <span className="text-xs text-brand-600 font-bold bg-white border border-brand-100 px-2.5 py-1 rounded-lg shadow-sm">
            {showConsole ? "Hide Console ▴" : "Show Console ▾"}
          </span>
        </button>

        {showConsole && (
          <div className="p-4 border-t bg-slate-900 text-slate-100 font-mono text-xs space-y-4">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">GET Endpoint</p>
              <div className="flex items-center justify-between bg-slate-800 rounded px-3 py-2 border border-slate-700">
                <span className="text-green-400 truncate select-all">{apiEndpoint}</span>
                <span className="bg-slate-700 text-slate-300 font-bold text-[9px] px-1.5 py-0.5 rounded border border-slate-650">JSON</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">cURL Request</p>
              <pre className="bg-slate-950 p-3 rounded overflow-x-auto border border-slate-800 text-green-400 select-all">{`curl -X GET "${apiEndpoint}"`}</pre>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1.5">API Payload Schema (Response JSON)</p>
              <pre className="bg-slate-950 p-3 rounded max-h-48 overflow-y-auto border border-slate-800 text-green-500">{JSON.stringify(sampleJson, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
