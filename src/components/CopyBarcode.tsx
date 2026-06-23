"use client";

import { useState } from "react";

export default function CopyBarcode({ barcode }: { barcode: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(barcode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silent
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-sm text-slate-600 hover:bg-slate-200 transition"
      title="Copy barcode"
    >
      {barcode}
      <span className="text-[10px] font-sans text-brand-600">{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}
