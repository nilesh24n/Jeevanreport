"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ScanInput({
  autoFocus = false,
  size = "lg",
  defaultValue = "",
}: {
  autoFocus?: boolean;
  size?: "lg" | "md";
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    if (/^\d{8,14}$/.test(trimmed.replace(/\D/g, ""))) {
      router.push(`/scan?barcode=${encodeURIComponent(trimmed.replace(/\D/g, ""))}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  const inputClass = size === "lg" ? "input-field text-base py-4" : "input-field";

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
        <input
          type="text"
          className={`${inputClass} pl-12`}
          placeholder="Enter barcode, product name, or brand..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus={autoFocus}
        />
      </div>
      <button type="submit" className="btn-primary whitespace-nowrap">
        Scan / Search
      </button>
    </form>
  );
}
