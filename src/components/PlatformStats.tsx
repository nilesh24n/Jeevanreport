import { getPlatformStats } from "@/lib/server-stats";

export default async function PlatformStats() {
  const stats = await getPlatformStats();

  const items = [
    { value: stats.productCount, label: "Products archived" },
    { value: stats.countryCount, label: "Countries covered" },
    { value: stats.shrinkflationCount, label: "Shrinkflation tracked" },
    { value: stats.formulaChangeCount, label: "Formula changes" },
    { value: `${stats.avgTrustScore}%`, label: "Avg data confidence" },
  ];

  return (
    <section className="border-y border-latte bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-5">
          {items.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-2xl font-semibold text-brand-600 sm:text-3xl">{item.value}</div>
              <div className="mt-1 text-xs text-espresso/45 sm:text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
