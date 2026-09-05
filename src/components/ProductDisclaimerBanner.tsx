"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductDisclaimerBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("jr_disclaimer_dismissed");
    if (dismissed) {
      setVisible(false);
    }
  }, []);

  function handleDismiss() {
    setVisible(false);
    sessionStorage.setItem("jr_disclaimer_dismissed", "true");
  }

  if (!visible) return null;

  return (
    <div className="bg-slate-900 text-white px-4 py-2 text-xs rounded-xl flex items-center justify-between gap-3 shadow-md border border-slate-800 transition-all duration-300">
      <span className="leading-normal flex-1">
        ⚖️ <strong>Disclaimer:</strong> Assessments are editorial opinions based on public FSSAI label data. We do not allege legal violations by any manufacturer.{" "}
        <Link href="/corrections" className="underline hover:text-brand-300 font-bold transition-colors">
          Correction request?
        </Link>
      </span>
      <button
        type="button"
        onClick={handleDismiss}
        className="text-white/60 hover:text-white font-bold p-1 hover:bg-white/10 rounded-full h-5 w-5 flex items-center justify-center transition-colors text-[10px]"
        aria-label="Dismiss disclaimer"
      >
        ✕
      </button>
    </div>
  );
}
