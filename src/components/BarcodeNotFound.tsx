import Link from "next/link";

export default function BarcodeNotFound({ barcode }: { barcode: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="card text-center py-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl">
          ?
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Barcode not in archive</h1>
        <p className="mt-2 font-mono text-sm text-slate-500">{barcode}</p>
        <p className="mt-4 text-slate-600 max-w-md mx-auto">
          We don&apos;t have this product yet. You can search by name, submit evidence with photos,
          or try scanning again.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={`/search?q=${encodeURIComponent(barcode)}`} className="btn-primary">
            Search archive
          </Link>
          <Link href="/submit" className="btn-accent">
            Submit this product
          </Link>
          <Link href="/scan" className="btn-secondary">
            Scan another
          </Link>
        </div>
      </div>

      <div className="mt-8 card bg-brand-50 border-brand-200">
        <h2 className="font-semibold text-brand-900">Help us add it</h2>
        <p className="mt-2 text-sm text-brand-800">
          Upload front and back label photos, the barcode, nutrition facts, and purchase price.
          Community submissions help everyone understand what&apos;s on store shelves.
        </p>
      </div>
    </div>
  );
}
