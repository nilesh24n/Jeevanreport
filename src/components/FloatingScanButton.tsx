"use client";

import Link from "next/link";

/**
 * Floating scan button pinned to bottom-centre on screens < 768px.
 * Defined in .fab-scan in globals.css.
 * On desktop, display:none via CSS media query.
 */
export default function FloatingScanButton() {
  return (
    <Link href="/scan" id="fab-scan-btn" className="fab-scan md:hidden">
      ⚡ Scan
    </Link>
  );
}
