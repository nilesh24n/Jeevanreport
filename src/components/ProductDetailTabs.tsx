"use client";

import { useState } from "react";
import type { Product, ProductVersion } from "@/lib/types";
import { getLatestVersion } from "@/lib/data/products";
import NutritionTable from "./NutritionTable";
import BodyImpactPanel from "./BodyImpactPanel";
import Badge from "./Badge";
import NutritionLabel from "./NutritionLabel";
import ShrinkflationApiPanel from "./ShrinkflationApiPanel";
import HighlightedIngredient from "./HighlightedIngredient";
import Disclaimer from "./Disclaimer";
import Image from "next/image";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

const tabs = ["Overview", "Nutrition", "Ingredients", "Body Impact", "Shrinkflation API", "Unit Price", "Photos", "Countries", "Reports"] as const;
type Tab = (typeof tabs)[number];

const primaryTabs: Tab[] = ["Overview", "Nutrition", "Ingredients", "Body Impact", "Shrinkflation API", "Unit Price"];
const moreTabs: Tab[] = ["Photos", "Countries", "Reports"];

export default function ProductDetailTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<Tab>("Overview");
  const [showMore, setShowMore] = useState(false);
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

  const activeIsMore = moreTabs.includes(active as typeof moreTabs[number]);

  return (
    <div className="mt-6">
      <div className="relative">
        {/* Desktop: show all tabs */}
        <div className="hidden sm:flex overflow-x-auto border-b border-latte gap-1 pb-px scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setActive(tab); setShowMore(false); }}
              className={`whitespace-nowrap px-3.5 py-3 text-sm font-semibold min-h-[44px] ${active === tab ? "tab-active" : "tab-inactive"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Mobile: show primary tabs + More button */}
        <div className="sm:hidden">
          <div className="flex overflow-x-auto border-b border-latte gap-1 pb-px scrollbar-hide">
            {primaryTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => { setActive(tab); setShowMore(false); }}
                className={`whitespace-nowrap px-3 py-3 text-sm font-semibold min-h-[44px] ${active === tab ? "tab-active" : "tab-inactive"}`}
              >
                {tab}
              </button>
            ))}
            {/* More button */}
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className={`whitespace-nowrap px-3 py-3 text-sm font-semibold min-h-[44px] flex items-center gap-1 ${activeIsMore ? "tab-active" : "tab-inactive"}`}
            >
              More {showMore ? "▲" : "▼"}
            </button>
          </div>
          {/* More dropdown on mobile */}
          {showMore && (
            <div className="border border-latte rounded-xl mt-1 overflow-hidden shadow-md">
              {moreTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => { setActive(tab); setShowMore(false); }}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold border-b border-latte last:border-b-0 ${active === tab ? "bg-brand-50 text-brand-700" : "bg-white text-espresso/70 hover:bg-stone-50"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile scroll indicator dots for primary tabs */}
        <div className="flex justify-center gap-1.5 mt-2 sm:hidden pb-1">
          {primaryTabs.map((tab) => (
            <span
              key={tab}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                active === tab ? "bg-brand-600 w-3" : "bg-latte w-1.5"
              }`}
            />
          ))}
          <span className={`h-1.5 rounded-full transition-all duration-300 ${activeIsMore ? "bg-brand-600 w-3" : "bg-latte w-1.5"}`} />
        </div>
      </div>

      <div className="mt-6">
        {active === "Overview" && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold text-espresso">At a glance</h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="text-center rounded-lg bg-stone-50 p-3">
                  <div className="text-2xl font-bold">{n.caloriesPerServing}</div>
                  <div className="text-xs text-espresso/55">cal/serving</div>
                </div>
                <div className="text-center rounded-lg bg-stone-50 p-3">
                  <div className="text-2xl font-bold">{n.protein}g</div>
                  <div className="text-xs text-espresso/55">protein</div>
                </div>
                <div className="text-center rounded-lg bg-stone-50 p-3">
                  <div className="text-2xl font-bold">{n.sugar}g</div>
                  <div className="text-xs text-espresso/55">sugar</div>
                </div>
                <div className="text-center rounded-lg bg-stone-50 p-3">
                  <div className="text-2xl font-bold">{product.packSizeChanges.length}</div>
                  <div className="text-xs text-espresso/55">size changes</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-espresso/55">{v.bodyImpact.summaryText}</p>
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
            <p className="text-sm text-espresso/55">
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

        {active === "Shrinkflation API" && (
          <ShrinkflationApiPanel productId={product.id} initialProduct={product} />
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
                    <thead className="bg-stone-50">
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
              <p className="text-sm text-espresso/55">Limited price history available.</p>
            )}
          </div>
        )}



        {active === "Photos" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {product.submissions.flatMap((s) =>
              Object.entries(s.media).filter(([, url]) => url).map(([type, url]) => (
                <div key={`${s.id}-${type}`} className="card">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-stone-100">
                    <Image src={url!} alt={type} fill className="object-cover" unoptimized sizes="(max-width: 640px) 100vw, 300px" />
                  </div>
                  <p className="mt-2 text-xs text-espresso/55">{type} · {s.userName} · {s.submittedAt}</p>
                </div>
              ))
            )}
            {product.submissions.length === 0 && (
              <p className="text-sm text-espresso/55 sm:col-span-2">No user photos yet. Be the first to submit evidence.</p>
            )}
          </div>
        )}

        {active === "Countries" && (
          <div className="overflow-hidden rounded-lg border">
            {product.countryComparisons.length === 0 ? (
              <p className="p-4 text-sm text-espresso/55">No cross-country data available.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-stone-50">
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
                      <td className="px-4 py-2 text-xs text-espresso/55">{c.keyIngredientDiff || "—"}</td>
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
                <p className="mt-2 text-sm text-espresso/55">{s.notes}</p>
                <p className="text-xs text-espresso/35">{s.store} · {s.country} · {s.submittedAt}</p>
              </div>
            ))}
            {product.confirmations.map((c) => (
              <div key={c.submissionId + c.confirmerName} className="card bg-success-50 border-success-500/20">
                <span className="text-sm font-medium text-success-700">{c.confirmerName} — {c.vote}</span>
                <p className="text-sm text-espresso/55">{c.comment}</p>
              </div>
            ))}
            {product.submissions.length === 0 && product.confirmations.length === 0 && (
              <p className="text-sm text-espresso/55">No community reports yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
