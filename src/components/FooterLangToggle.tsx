"use client";

import { useCallback } from "react";

export default function FooterLangToggle() {
  const setLang = useCallback((lang: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jr_lang", lang);
      window.location.reload();
    }
  }, []);

  return (
    <div className="flex gap-1">
      <span className="text-xs text-espresso/40 font-medium mr-1 self-center">Language:</span>
      <button
        type="button"
        onClick={() => setLang("en")}
        className="px-2 py-1 text-xs font-bold border border-latte rounded-lg hover:bg-brand-50 text-espresso/60 transition-colors min-h-[32px]"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("hi")}
        className="px-2 py-1 text-xs font-bold border border-latte rounded-lg hover:bg-brand-50 text-espresso/60 transition-colors min-h-[32px]"
      >
        हिं
      </button>
    </div>
  );
}
