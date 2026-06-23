"use client";

import { useState } from "react";

export default function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map((f, i) => (
        <div key={f.q} className="card overflow-hidden p-0">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
          >
            <span className="font-semibold text-slate-900 pr-4">{f.q}</span>
            <span className="text-slate-400 flex-shrink-0">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <p className="border-t border-slate-100 px-5 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
