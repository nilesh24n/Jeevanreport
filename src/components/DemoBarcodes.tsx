import Link from "next/link";

const demos = [
  { name: "Maggi Masala Noodles", barcode: "8901058002478" },
  { name: "Good Day Butter Cookies", barcode: "8901063012172" },
  { name: "Kurkure Masala Munch", barcode: "8901491101831" },
  { name: "Bournvita Chocolate", barcode: "8901233014722" },
];

export default function DemoBarcodes() {
  return (
    <div className="mt-8 animate-fade-in">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Try a demo barcode:</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {demos.map((d) => (
          <Link
            key={d.barcode}
            href={`/scan?barcode=${d.barcode}`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-300 hover:border-brand-500 hover:text-brand-600 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            {d.name}
          </Link>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Link href="/leaderboard" className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700">
          Explore the shrinkflation leaderboard →
        </Link>
      </div>
    </div>
  );
}
