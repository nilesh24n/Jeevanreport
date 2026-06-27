"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import HeaderQuickScan from "./HeaderQuickScan";

// ── 4 primary nav items ──────────────────────────────────────────────
const primaryNav = [
  { href: "/scan",      label: "⚡ Scan" },
  { href: "/search",   label: "🔍 Search" },
  { href: "/compare",  label: "⚖️ Compare" },
  { href: "/dashboard",label: "📊 Dashboard" },
];

// ── Overflow items go in hamburger / "More" dropdown ────────────────
const overflowNav = [
  { href: "/products",         label: "Products" },
  { href: "/countries",        label: "Countries" },
  { href: "/brands",           label: "Brands" },
  { href: "/ingredients",      label: "Ingredients" },
  { href: "/categories",       label: "Categories" },
  { href: "/leaderboard",      label: "Leaderboard" },
  { href: "/latest-changes",   label: "Latest Changes" },
  { href: "/submit",           label: "Submit Evidence" },
  { href: "/methodology",      label: "Methodology" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close "More" dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-latte bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-sm shadow-sm transition-transform duration-300 group-hover:scale-105">
            JR
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold tracking-tight text-espresso group-hover:text-brand-600 transition-colors duration-300 font-display">
              Jeevanreport
            </span>
            <p className="text-[10px] font-medium text-brand-900/40">India&apos;s product transparency platform</p>
          </div>
        </Link>

        {/* Desktop primary nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                pathname === link.href
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-espresso/70 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* "More →" dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-espresso/70 hover:bg-brand-50 hover:text-brand-700 transition-all duration-200 flex items-center gap-1"
              aria-expanded={moreOpen}
            >
              More
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-latte bg-white shadow-premium overflow-hidden z-50">
                <div className="p-1.5 space-y-0.5">
                  {overflowNav.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className={`block rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                        pathname === link.href ? "bg-brand-50 text-brand-700" : "text-espresso/70 hover:bg-brand-50/60 hover:text-brand-700"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <HeaderQuickScan />
          <Link href="/scan" className="btn-primary !px-4 !py-2 hidden text-xs sm:inline-flex">
            ⚡ Scan
          </Link>
          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="rounded-xl p-2 text-espresso/60 hover:bg-brand-50 hover:text-brand-700 transition-colors md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav className="border-t border-latte bg-canvas/98 backdrop-blur-md px-4 py-4 md:hidden">
          {/* Primary */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                  pathname === link.href ? "bg-brand-600 text-white" : "bg-white text-espresso/70 border border-latte hover:bg-brand-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {/* Overflow */}
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-900/30 mb-2 px-1">More</p>
          <div className="grid grid-cols-2 gap-1">
            {overflowNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  pathname === link.href ? "bg-brand-50 text-brand-700" : "text-espresso/60 hover:bg-brand-50/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
