"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import HeaderQuickScan from "./HeaderQuickScan";
import { useLang } from "./LanguageContext";
import { getWatchlist } from "@/lib/storage";

// ── 4 primary nav items ──────────────────────────────────────────────
const primaryNavKeys = [
  { href: "/scan",       labelKey: "nav.scan" },
  { href: "/search",     labelKey: "nav.search" },
  { href: "/compare",    labelKey: "nav.compare" },
  { href: "/dashboard",  labelKey: "nav.dashboard" },
];

// ── Overflow items go in hamburger / "More" dropdown ────────────────
const overflowNavKeys = [
  { href: "/products",         labelKey: "nav.products" },
  { href: "/countries",        labelKey: "nav.countries" },
  { href: "/brands",           labelKey: "nav.brands" },
  { href: "/ingredients",      labelKey: "nav.ingredients" },
  { href: "/categories",       labelKey: "nav.categories" },
  { href: "/leaderboard",      labelKey: "nav.leaderboard" },
  { href: "/latest-changes",   labelKey: "nav.latest_changes" },
  { href: "/submit",           labelKey: "nav.submit_evidence" },
  { href: "/methodology",      labelKey: "nav.methodology" },
  { href: "/about",            labelKey: "nav.about" },
  { href: "/watchlist",        labelKey: "nav.watchlist" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLang();
  const [watchlistCount, setWatchlistCount] = useState(0);

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

  // Read watchlist count on mount
  useEffect(() => {
    setWatchlistCount(getWatchlist().length);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-latte bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <Image
            src="/logo-icon.svg"
            alt="Jeevanreport icon"
            width={40}
            height={40}
            className="transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="hidden sm:block">
            <span className="text-lg font-bold tracking-tight text-espresso group-hover:text-brand-600 transition-colors duration-300 font-display">
              Jeevanreport
            </span>
            <p className="text-[10px] font-medium text-brand-900/40">India&apos;s product transparency platform</p>
          </div>
        </Link>

        {/* Desktop primary nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {primaryNavKeys.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                pathname === link.href
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-espresso/70 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {t(link.labelKey)}
            </Link>
          ))}

          {/* "More →" dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-espresso/70 hover:bg-brand-50 hover:text-brand-700 transition-all duration-200 flex items-center gap-1"
              aria-expanded={moreOpen}
            >
              {t("nav.more")}
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-latte bg-white shadow-premium overflow-hidden z-50">
                <div className="p-1.5 space-y-0.5">
                  {overflowNavKeys.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className={`block rounded-xl px-3 py-2 text-sm font-medium transition-all flex items-center justify-between ${
                        pathname === link.href ? "bg-brand-50 text-brand-700" : "text-espresso/70 hover:bg-brand-50/60 hover:text-brand-700"
                      }`}
                    >
                      <span>{t(link.labelKey)}</span>
                      {link.href === "/watchlist" && watchlistCount > 0 && (
                        <span className="ml-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-brand-600 text-white text-[10px] font-bold px-1">
                          {watchlistCount}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="hidden sm:flex items-center rounded-lg border border-latte overflow-hidden text-xs font-bold">
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 transition-colors ${lang === "en" ? "bg-brand-600 text-white" : "text-espresso/60 hover:bg-brand-50"}`}
              aria-label="English"
            >
              EN
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-2.5 py-1.5 transition-colors ${lang === "hi" ? "bg-brand-600 text-white" : "text-espresso/60 hover:bg-brand-50"}`}
              aria-label="Hindi"
            >
              हिं
            </button>
          </div>

          <HeaderQuickScan />
          <Link href="/scan" className="btn-primary !px-4 !py-2 hidden text-xs sm:inline-flex min-h-[44px]">
            {t("nav.scan_now")}
          </Link>
          {/* Watchlist badge — mobile */}
          <Link href="/watchlist" className="relative md:hidden p-2 text-espresso/60 hover:text-brand-700" aria-label="Watchlist">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {watchlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-brand-600 text-white text-[9px] font-bold px-0.5">
                {watchlistCount}
              </span>
            )}
          </Link>
          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="rounded-xl p-2 text-espresso/60 hover:bg-brand-50 hover:text-brand-700 transition-colors md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
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
          {/* Language toggle mobile */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setLang("en")}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${lang === "en" ? "bg-brand-600 text-white" : "border border-latte text-espresso/60"}`}
            >
              EN — English
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${lang === "hi" ? "bg-brand-600 text-white" : "border border-latte text-espresso/60"}`}
            >
              हिं — हिन्दी
            </button>
          </div>
          {/* Primary */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {primaryNavKeys.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-center rounded-xl px-3 py-3 text-sm font-semibold transition-all min-h-[48px] ${
                  pathname === link.href ? "bg-brand-600 text-white" : "bg-white text-espresso/70 border border-latte hover:bg-brand-50"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>
          {/* Overflow */}
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-900/30 mb-2 px-1">{t("nav.more")}</p>
          <div className="grid grid-cols-2 gap-1">
            {overflowNavKeys.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-xs font-medium transition-all min-h-[44px] flex items-center justify-between ${
                  pathname === link.href ? "bg-brand-50 text-brand-700" : "text-espresso/60 hover:bg-brand-50/60"
                }`}
              >
                <span>{t(link.labelKey)}</span>
                {link.href === "/watchlist" && watchlistCount > 0 && (
                  <span className="ml-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-brand-600 text-white text-[9px] font-bold px-0.5">
                    {watchlistCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
