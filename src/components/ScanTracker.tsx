"use client";

import { useEffect, useState } from "react";
import { addScanHistory } from "@/lib/storage";

export default function ScanTracker({
  productId,
  name,
  barcode,
}: {
  productId: string;
  name: string;
  barcode: string;
}) {
  const [, setTick] = useState(0);

  useEffect(() => {
    addScanHistory({ productId, name, barcode });
    setTick((t) => t + 1);
  }, [productId, name, barcode]);

  return null;
}
