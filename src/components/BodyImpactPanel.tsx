import type { BodyImpactSummary } from "@/lib/types";
import Disclaimer from "./Disclaimer";

export default function BodyImpactPanel({ body }: { body: BodyImpactSummary }) {
  const flags = [
    { label: `Sugar: ${body.sugarFlag}`, icon: "🍬", variant: body.sugarFlag === "High" ? "warning" as const : "neutral" as const },
    { label: `Sodium: ${body.sodiumFlag}`, icon: "🧂", variant: body.sodiumFlag === "High" ? "warning" as const : "neutral" as const },
    { label: `Protein: ${body.proteinFlag}`, icon: "💪", variant: body.proteinFlag === "Low" ? "danger" as const : body.proteinFlag === "High" ? "success" as const : "neutral" as const },
    { label: `Fiber: ${body.fiberFlag}`, icon: "🌾", variant: body.fiberFlag === "Low" ? "danger" as const : body.fiberFlag === "High" ? "success" as const : "neutral" as const },
    { label: body.energyDensityLabel === "High" ? "Calorie dense" : `Energy: ${body.energyDensityLabel}`, icon: "🔋", variant: body.energyDensityLabel === "High" ? "warning" as const : "neutral" as const },
    { label: body.satietyLabel, icon: "🍽️", variant: body.satietyLabel === "Less filling" ? "warning" as const : body.satietyLabel === "More filling" ? "success" as const : "neutral" as const },
    { label: body.balanceLabel, icon: "⚖️", variant: body.balanceLabel === "Less balanced" ? "warning" as const : body.balanceLabel === "More balanced" ? "success" as const : "neutral" as const },
    { label: body.occasionLabel, icon: "📅", variant: body.occasionLabel === "Better occasional treat" ? "warning" as const : body.occasionLabel === "Better staple candidate" ? "success" as const : "neutral" as const },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {flags.map((f) => (
          <div 
            key={f.label} 
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold shadow-sm transition-all duration-300 hover:scale-[1.01] ${
              f.variant === "success" 
                ? "bg-success-50 border-success-100 text-success-700" 
                : f.variant === "warning" 
                ? "bg-warning-50 border-warning-100 text-warning-700" 
                : f.variant === "danger" 
                ? "bg-danger-50 border-danger-100 text-danger-700" 
                : "bg-slate-50 border-slate-100 text-slate-700"
            }`}
          >
            <span className="text-sm">{f.icon}</span>
            <span>{f.label}</span>
          </div>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-slate-600 font-medium border-t border-slate-50 pt-3">{body.summaryText}</p>
      <Disclaimer compact />
    </div>
  );
}
