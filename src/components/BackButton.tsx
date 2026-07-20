"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  productName?: string;
}

export default function BackButton({ productName }: BackButtonProps) {
  const router = useRouter();

  // Try to determine where the user came from
  function getLabel(): string {
    if (typeof document === "undefined") return "← Back";
    const ref = document.referrer;
    if (ref.includes("/search")) return "← Back to Search Results";
    if (ref.includes("/scan")) return "← Scan Another Product";
    if (ref.includes("/leaderboard")) return "← Back to Leaderboard";
    if (ref.includes("/compare")) return "← Back to Compare";
    if (ref.includes("/watchlist")) return "← Back to Watchlist";
    if (productName) return "← Back";
    return "← Back";
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-espresso/50 hover:text-brand-600 transition-colors min-h-[44px] px-1 -ml-1 mb-1"
      aria-label="Go back to previous page"
    >
      {getLabel()}
    </button>
  );
}
