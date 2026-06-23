"use client";

import { useEffect, useState } from "react";
import { getAlertPreferences, saveAlertPreferences, type AlertPreferences } from "@/lib/storage";
import { useToast } from "./Toast";

const options: { key: keyof AlertPreferences; label: string; desc: string }[] = [
  { key: "sizeChanges", label: "Pack size changes", desc: "Shrinkflation and skimpflation alerts" },
  { key: "formulaChanges", label: "Formula changes", desc: "Ingredient additions or removals" },
  { key: "priceChanges", label: "Price increases", desc: "Unit price trend updates" },
  { key: "nutritionUpdates", label: "Nutrition updates", desc: "New scans or label changes" },
];

export default function AlertPreferencesPanel() {
  const [prefs, setPrefs] = useState<AlertPreferences | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setPrefs(getAlertPreferences());
  }, []);

  if (!prefs) return null;

  function toggle(key: keyof AlertPreferences) {
    const next = { ...prefs!, [key]: !prefs![key] };
    setPrefs(next);
    saveAlertPreferences(next);
    toast("Alert preferences saved", "success");
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-slate-900">Alert preferences</h2>
      <p className="mt-1 text-sm text-slate-500">Choose which watchlist alerts you want to see</p>
      <div className="mt-4 space-y-3">
        {options.map((opt) => (
          <label key={opt.key} className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={prefs[opt.key]}
              onChange={() => toggle(opt.key)}
              className="mt-1 rounded border-slate-300 text-brand-600"
            />
            <div>
              <span className="text-sm font-medium text-slate-800">{opt.label}</span>
              <p className="text-xs text-slate-500">{opt.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
