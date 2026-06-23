import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <div className="text-6xl font-bold text-brand-200">404</div>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Product or page not found</h1>
      <p className="mt-2 text-slate-600">
        This barcode or URL is not in our archive yet. You can scan another product or submit evidence to add it.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/scan" className="btn-primary">Scan a product</Link>
        <Link href="/search" className="btn-secondary">Search archive</Link>
        <Link href="/submit" className="btn-accent">Submit evidence</Link>
      </div>
    </div>
  );
}
