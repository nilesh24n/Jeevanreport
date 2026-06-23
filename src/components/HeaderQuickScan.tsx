"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeaderQuickScan() {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim().replace(/\D/g, "");
    if (trimmed.length >= 8) {
      router.push(`/scan?barcode=${encodeURIComponent(trimmed)}`);
      setValue("");
      setOpen(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 md:inline-flex"
        title="Quick barcode lookup"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Quick scan
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="hidden md:flex items-center gap-1">
      <input
        type="text"
        className="w-36 rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-mono focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        placeholder="Barcode…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <button type="submit" className="rounded-lg bg-brand-600 px-2 py-1.5 text-xs text-white hover:bg-brand-700">
        Go
      </button>
      <button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">
        ✕
      </button>
    </form>
  );
}
