import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/Badge";
import { getShrinkflationLeaderboard, getPriceIncreaseLeaderboard } from "@/lib/leaderboard";

export default function LeaderboardPage() {
  const shrinkflation = getShrinkflationLeaderboard();
  const priceIncreases = getPriceIncreaseLeaderboard();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Shrinkflation Leaderboard</h1>
      <p className="mt-2 text-slate-600">
        Biggest documented pack-size reductions and unit-price increases in the public archive
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Largest pack-size reductions</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-left">Change</th>
                <th className="px-4 py-3 text-right">Reduction</th>
                <th className="px-4 py-3 text-right">Trust</th>
              </tr>
            </thead>
            <tbody>
              {shrinkflation.map((entry, i) => (
                <tr key={`${entry.productId}-${entry.date}`} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-400">#{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link href={`/products/${entry.productId}`} className="flex items-center gap-3 hover:text-brand-600">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg flex-shrink-0">
                        <Image src={entry.imageUrl} alt="" fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <span className="font-medium">{entry.productName}</span>
                        <span className="block text-xs text-slate-400">{entry.brand}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">{entry.country}</td>
                  <td className="px-4 py-3 text-slate-600">{entry.oldSize} → {entry.newSize}</td>
                  <td className="px-4 py-3 text-right">
                    <Badge label={`${entry.percentChange}%`} variant="warning" />
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-brand-600">{entry.trustScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-slate-900">Biggest unit-price increases</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {priceIncreases.map((entry) => (
            <Link key={entry.productId} href={`/products/${entry.productId}`} className="card hover:border-warning-500/30">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                  <Image src={entry.imageUrl} alt="" fill className="object-cover" sizes="48px" />
                </div>
                <div>
                  <span className="font-medium">{entry.productName}</span>
                  <p className="text-xs text-slate-500">{entry.store} · {entry.country}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                {entry.oldUnitPrice} → {entry.newUnitPrice} {entry.unitLabel}
              </p>
              <Badge label={`+${entry.percentChange}%`} variant="warning" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
