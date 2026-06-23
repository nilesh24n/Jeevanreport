"use client";

import { useState } from "react";
import type { Product, ProductVersion } from "@/lib/types";
import { getLatestVersion } from "@/lib/data/products";
import NutritionTable from "./NutritionTable";
import BodyImpactPanel from "./BodyImpactPanel";
import Badge from "./Badge";
import FormulaDiff from "./FormulaDiff";
import NutritionLabel from "./NutritionLabel";
import PackSizeTimeline from "./PackSizeTimeline";
import HighlightedIngredient from "./HighlightedIngredient";
import Disclaimer from "./Disclaimer";
import Image from "next/image";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

const tabs = ["Overview", "Nutrition", "Ingredients", "Body Impact", "Pack History", "Unit Price", "Formula", "Photos", "Countries", "Reports"] as const;
type Tab = (typeof tabs)[number];

export default function ProductDetailTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<Tab>("Overview");
  const v: ProductVersion = getLatestVersion(product);
  const n = v.nutrition;

  const radarData = [
    { nutrient: "Protein", value: Math.min(n.protein * 10, 100) },
    { nutrient: "Fiber", value: Math.min(n.fiber * 15, 100) },
    { nutrient: "Sugar", value: Math.min(n.sugar * 5, 100) },
    { nutrient: "Sodium", value: Math.min(n.sodium / 20, 100) },
    { nutrient: "Fat", value: Math.min(n.totalFat * 8, 100) },
  ];

  const priceChartData = product.prices.map((p) => ({
    date: p.dateObserved,
    unitPrice: p.unitPrice,
    price: p.price,
  }));

  return (
    <div className="mt-6">
      <div className="flex overflow-x-auto border-b border-slate-200 gap-1 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`whitespace-nowrap px-3 py-2 text-sm ${active === tab ? "tab-active" : "tab-inactive"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {active === "Overview" && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-slate-900">At a glance</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="text-center rounded-lg bg-slate-50 p-3">
                  <div className="text-2xl font-bold">{n.caloriesPerServing}</div>
                  <div className="text-xs text-slate-500">cal/serving</div>
                </div>
                <div className="text-center rounded-lg bg-slate-50 p-3">
                  <div className="text-2xl font-bold">{n.protein}g</div>
                  <div className="text-xs text-slate-500">protein</div>
                </div>
                <div className="text-center rounded-lg bg-slate-50 p-3">
                  <div className="text-2xl font-bold">{n.sugar}g</div>
                  <div className="text-xs text-slate-500">sugar</div>
                </div>
                <div className="text-center rounded-lg bg-slate-50 p-3">
                  <div className="text-2xl font-bold">{product.packSizeChanges.length}</div>
                  <div className="text-xs text-slate-500">size changes</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600">{v.bodyImpact.summaryText}</p>
            </div>
            {product.packSizeChanges.length > 0 && (
              <div className="card border-warning-500/20 bg-warning-50">
                <Badge label="Pack size changed" variant="warning" />
                <p className="mt-2 text-sm">{product.packSizeChanges[0].oldSize} → {product.packSizeChanges[0].newSize}</p>
              </div>
            )}
          </div>
        )}

        {active === "Nutrition" && (
          <div className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <NutritionTable nutrition={n} servingsPerPack={v.servingsPerPack} />
              <div className="flex justify-center lg:justify-end">
                <NutritionLabel nutrition={n} version={v} />
              </div>
            </div>
            <div className="card">
              <h3 className="font-semibold mb-4">Nutrition profile</h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="nutrient" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-slate-600">
              Per full pack: {n.caloriesPerPack} calories across {v.servingsPerPack} servings.
            </p>
          </div>
        )}

        {active === "Ingredients" && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold">Full ingredient list</h3>
              <p className="mt-2 text-sm leading-relaxed">{v.ingredientsText}</p>
            </div>
            <div className="card">
              <h3 className="font-semibold">Simplified interpretation</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {v.simplifiedIngredients.map((i: string) => <span key={i} className="badge-neutral">{i}</span>)}
              </div>
            </div>
            {v.highlightedIngredients.map((h) => (
              <div key={h.name} className="card">
                <HighlightedIngredient name={h.name} type={h.type} note={h.note} />
              </div>
            ))}
            {v.allergens.length > 0 && (
              <div className="card border-danger-500/20 bg-danger-50">
                <strong className="text-sm text-danger-600">Allergens:</strong> {v.allergens.join(", ")}
              </div>
            )}
          </div>
        )}

        {active === "Body Impact" && (
          <div className="card">
            <BodyImpactPanel body={v.bodyImpact} />
            <div className="mt-4"><Disclaimer /></div>
          </div>
        )}

        {active === "Pack History" && (
          <PackSizeTimeline changes={product.packSizeChanges} />
        )}

        {active === "Unit Price" && (
          <div className="space-y-4">
            {product.prices.length >= 2 ? (
              <>
                <div className="card">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={priceChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="unitPrice" stroke="#2563eb" strokeWidth={2} name="Unit price" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Store</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-right">Unit price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.prices.map((p) => (
                        <tr key={p.dateObserved + p.store} className="border-t">
                          <td className="px-4 py-2">{p.dateObserved}</td>
                          <td className="px-4 py-2">{p.store} ({p.country})</td>
                          <td className="px-4 py-2 text-right">{p.currency} {p.price}</td>
                          <td className="px-4 py-2 text-right">{p.unitPrice} {p.unitPriceLabel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">Limited price history available.</p>
            )}
          </div>
        )}

        {active === "Formula" && (
          <div className="space-y-4">
            {product.formulaChanges.length === 0 ? (
              <p className="text-sm text-slate-500">No formula changes recorded.</p>
            ) : (
              product.formulaChanges.map((c) => (
                <div key={c.date} className="card">
                  <Badge label="Formula change" variant="brand" />
                  <p className="text-xs text-slate-500 mt-1">{c.date} · {c.country}</p>
                  <div className="mt-3">
                    <FormulaDiff change={c} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {active === "Photos" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {product.submissions.flatMap((s) =>
              Object.entries(s.media).filter(([, url]) => url).map(([type, url]) => (
                <div key={`${s.id}-${type}`} className="card">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-slate-100">
                    <Image src={url!} alt={type} fill className="object-cover" unoptimized sizes="(max-width: 640px) 100vw, 300px" />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{type} · {s.userName} · {s.submittedAt}</p>
                </div>
              ))
            )}
            {product.submissions.length === 0 && (
              <p className="text-sm text-slate-500 sm:col-span-2">No user photos yet. Be the first to submit evidence.</p>
            )}
          </div>
        )}

        {active === "Countries" && (
          <div className="overflow-hidden rounded-lg border">
            {product.countryComparisons.length === 0 ? (
              <p className="p-4 text-sm text-slate-500">No cross-country data available.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Country</th>
                    <th className="px-4 py-2 text-left">Pack</th>
                    <th className="px-4 py-2 text-right">Cal</th>
                    <th className="px-4 py-2 text-right">Sugar</th>
                    <th className="px-4 py-2 text-right">Sodium</th>
                    <th className="px-4 py-2 text-right">Protein</th>
                    <th className="px-4 py-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {product.countryComparisons.map((c) => (
                    <tr key={c.country} className="border-t">
                      <td className="px-4 py-2 font-medium">{c.country}</td>
                      <td className="px-4 py-2">{c.packSize}</td>
                      <td className="px-4 py-2 text-right">{c.caloriesPerServing}</td>
                      <td className="px-4 py-2 text-right">{c.sugar}g</td>
                      <td className="px-4 py-2 text-right">{c.sodium}</td>
                      <td className="px-4 py-2 text-right">{c.protein}g</td>
                      <td className="px-4 py-2 text-xs text-slate-500">{c.keyIngredientDiff || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {active === "Reports" && (
          <div className="space-y-4">
            {product.submissions.map((s) => (
              <div key={s.id} className="card">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{s.userName}</span>
                  <Badge label={s.status} variant={s.status === "approved" ? "success" : "neutral"} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{s.notes}</p>
                <p className="text-xs text-slate-400">{s.store} · {s.country} · {s.submittedAt}</p>
              </div>
            ))}
            {product.confirmations.map((c) => (
              <div key={c.submissionId + c.confirmerName} className="card bg-success-50 border-success-500/20">
                <span className="text-sm font-medium text-success-700">{c.confirmerName} — {c.vote}</span>
                <p className="text-sm text-slate-600">{c.comment}</p>
              </div>
            ))}
            {product.submissions.length === 0 && product.confirmations.length === 0 && (
              <p className="text-sm text-slate-500">No community reports yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
