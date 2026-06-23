"use client";

import { useEffect, useState } from "react";
import { isOnWatchlist, toggleWatchlist } from "@/lib/storage";
import { useToast } from "./Toast";

export default function WatchlistButton({
  productId,
  name,
  brand,
}: {
  productId: string;
  name: string;
  brand: string;
}) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    setSaved(isOnWatchlist(productId));
  }, [productId]);

  if (!mounted) {
    return (
      <button type="button" className="btn-secondary opacity-50" disabled>
        Watchlist
      </button>
    );
  }

  function handleToggle() {
    const nowSaved = toggleWatchlist({ productId, name, brand });
    setSaved(nowSaved);
    toast(
      nowSaved ? `Added ${name} to watchlist` : `Removed ${name} from watchlist`,
      "success"
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={saved ? "btn-accent" : "btn-secondary"}
    >
      {saved ? "✓ On watchlist" : "+ Add to watchlist"}
    </button>
  );
}
