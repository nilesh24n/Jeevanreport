"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useLang } from "./LanguageContext";
import { getWatchlist, getScanHistory } from "@/lib/storage";
import { getDynamicNav } from "@/lib/nav";

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLang();
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [scanHistoryCount, setScanHistoryCount] = useState(0);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setWatchlistCount(getWatchlist().length);
    setScanHistoryCount(getScanHistory().length);
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const nav = getDynamicNav({ pathname, watchlistCount, scanHistoryCount });
  const menuActive = menuOpen || nav.menuSections.some((s) => s.items.some((i) => i.href === pathname));

  const logoSrc = pathname === "/" ? "/logo-scanner.svg" : "/logo-icon.svg";

  return (
    <header className="sticky top-0 z-50 border-b border-latte bg-canvas/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5">
          <Image
            id="site-logo"
            src={logoSrc}
            alt="JeevanReport"
            width={40}
            height={40}
            className="transition-transform duration-150 group-hover:scale-105"
            priority
          />
          <span className="text-base font-bold text-espresso transition-colors group-hover:text-brand-600 tracking-tight sm:text-lg">
            Jeevan<span className="text-amber-500">Report</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.visible.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "bg-brand-600 text-white"
                  : "text-espresso/70 hover:bg-brand-50 hover:text-brand-700"
              }`}
            >
              {t(link.labelKey)}
              {link.badge ? (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-warning-400 px-1 text-[10px] font-bold text-espresso">
                  {link.badge}
                </span>
              ) : null}
            </Link>
          ))}

          {nav.menuSections.length > 0 && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  menuActive ? "bg-brand-50 text-brand-700" : "text-espresso/70 hover:bg-brand-50 hover:text-brand-700"
                }`}
                aria-expanded={menuOpen}
              >
                {t("nav.menu")}
                <svg className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-latte bg-white shadow-premium">
                  <div className="border-b border-latte p-2">
                    <div className="flex overflow-hidden rounded-md border border-latte text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setLang("en")}
                        className={`flex-1 px-2 py-1.5 ${lang === "en" ? "bg-brand-600 text-white" : "text-espresso/60 hover:bg-gray-50"}`}
                      >
                        EN
                      </button>
                      <button
                        type="button"
                        onClick={() => setLang("hi")}
                        className={`flex-1 px-2 py-1.5 ${lang === "hi" ? "bg-brand-600 text-white" : "text-espresso/60 hover:bg-gray-50"}`}
                      >
                        HI
                      </button>
                    </div>
                  </div>
                  {nav.menuSections.map((section) => (
                    <div key={section.titleKey} className="border-b border-latte p-1.5 last:border-b-0">
                      <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-espresso/40">
                        {t(section.titleKey)}
                      </p>
                      {section.items.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                            pathname === link.href
                              ? "bg-brand-50 text-brand-700"
                              : "text-espresso/70 hover:bg-gray-50 hover:text-brand-700"
                          }`}
                        >
                          <span>{t(link.labelKey)}</span>
                          {link.badge ? (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                              {link.badge}
                            </span>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {nav.primaryAction && (
            <Link
              href={nav.primaryAction.href}
              className="hidden sm:inline-flex btn-scan !px-4 !py-2 text-sm min-h-[40px] shadow-sm"
            >
              <svg className="h-4 w-4 text-espresso" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span>{t(nav.primaryAction.labelKey)}</span>
              {nav.primaryAction.badge ? ` (${nav.primaryAction.badge})` : ""}
            </Link>
          )}

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-espresso/60 transition-colors hover:bg-brand-50 hover:text-brand-700 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-latte bg-canvas px-4 py-4 md:hidden">
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold ${lang === "en" ? "bg-brand-600 text-white" : "border border-latte text-espresso/60"}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("hi")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold ${lang === "hi" ? "bg-brand-600 text-white" : "border border-latte text-espresso/60"}`}
            >
              Hindi
            </button>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            {[...nav.visible, ...(nav.primaryAction ? [nav.primaryAction] : [])].map((link) => {
              const isScan = link.href === "/scan";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${
                    isScan
                      ? "bg-warning-400 text-espresso font-bold shadow-sm hover:bg-warning-300"
                      : pathname === link.href
                      ? "bg-brand-600 text-white"
                      : "border border-latte bg-white text-espresso/70"
                  }`}
                >
                  {isScan && (
                    <svg className="h-4 w-4 text-espresso" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  )}
                  <span>{t(link.labelKey)}</span>
                  {link.badge ? (
                    <span className="rounded-full bg-warning-400 px-1.5 text-[10px] font-bold text-espresso">{link.badge}</span>
                  ) : null}
                </Link>
              );
            })}
          </div>

          {nav.menuSections.map((section) => (
            <div key={section.titleKey} className="mb-3">
              <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-espresso/40">
                {t(section.titleKey)}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {section.items.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex min-h-[40px] items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                      pathname === link.href ? "bg-brand-50 text-brand-700" : "text-espresso/65 hover:bg-gray-50"
                    }`}
                  >
                    <span>{t(link.labelKey)}</span>
                    {link.badge ? (
                      <span className="ml-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-600 px-0.5 text-[9px] font-bold text-white">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
