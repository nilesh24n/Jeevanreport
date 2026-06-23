"use client";

import { useState } from "react";

export default function ShareButton({ title, url }: { title: string; url?: string }) {
  const [shared, setShared] = useState(false);
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl, text: `View ${title} on Jeevanreport` });
        return;
      } catch {
        // user cancelled or unsupported
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // silent
    }
  }

  return (
    <button type="button" onClick={handleShare} className="btn-secondary text-sm">
      {shared ? "Link copied!" : "Share"}
    </button>
  );
}
