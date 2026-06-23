"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const DISMISS_KEY = "jeevanreport_welcome_dismissed";

export default function FirstVisitBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISS_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="border-b border-brand-200 bg-brand-50 px-4 py-3">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-900">Welcome to Jeevanreport</p>
          <p className="text-xs text-brand-800">
            Scan any barcode to see ingredients, nutrition, body-impact guidance, and shrinkflation history.
            Press <kbd className="rounded bg-white px-1">/</kbd> to scan anytime.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/scan" className="btn-primary text-xs py-1.5">Try a scan</Link>
          <button type="button" onClick={dismiss} className="btn-secondary text-xs py-1.5">Dismiss</button>
        </div>
      </div>
    </div>
  );
}
