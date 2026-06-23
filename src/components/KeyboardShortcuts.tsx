"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if (typing) return;

      if (e.key === "/" || (e.key === "s" && !e.metaKey && !e.ctrlKey)) {
        e.preventDefault();
        router.push("/scan");
      }
      if (e.key === "f" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        router.push("/search");
      }
      if (e.key === "h" && !e.metaKey && !e.ctrlKey && pathname !== "/") {
        e.preventDefault();
        router.push("/");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, pathname]);

  return null;
}
