"use client";

import { useEffect, useState } from "react";
import { addScanHistory } from "@/lib/storage";

export default function ScanTracker({
  productId,
  name,
  barcode,
  rating,
}: {
  productId: string;
  name: string;
  barcode: string;
  rating?: "Good" | "Careful" | "Limit";
}) {
  const [, setTick] = useState(0);

  useEffect(() => {
    addScanHistory({ productId, name, barcode, rating });
    setTick((t) => t + 1);
  }, [productId, name, barcode, rating]);

  return null;
}
