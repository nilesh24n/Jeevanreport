type Level = "Simple" | "Moderate" | "Complex";

const config: Record<Level, { width: string; color: string; desc: string }> = {
  Simple: { width: "33%", color: "bg-success-500", desc: "Few recognizable whole-food ingredients" },
  Moderate: { width: "66%", color: "bg-warning-500", desc: "Mix of whole foods and processed additives" },
  Complex: { width: "100%", color: "bg-danger-500", desc: "Many additives, flavor enhancers, or colorings" },
};

export default function IngredientComplexity({ level }: { level: Level }) {
  const c = config[level];
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">Ingredient complexity</span>
        <span className="font-semibold text-slate-900">{level}</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full transition-all ${c.color}`} style={{ width: c.width }} />
      </div>
      <p className="mt-1 text-xs text-slate-500">{c.desc}</p>
    </div>
  );
}
