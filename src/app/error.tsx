"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="mt-2 text-sm text-slate-600">{error.message || "An unexpected error occurred."}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" onClick={reset} className="btn-primary">Try again</button>
        <Link href="/" className="btn-secondary">Go home</Link>
        <Link href="/scan" className="btn-accent">Scan a product</Link>
      </div>
    </div>
  );
}
