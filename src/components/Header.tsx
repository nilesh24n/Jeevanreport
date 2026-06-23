"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import HeaderQuickScan from "./HeaderQuickScan";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/scan", label: "Scan" },
  { href: "/search", label: "Search" },
  { href: "/products", label: "Products" },
  { href: "/countries", label: "Countries" },
  { href: "/brands", label: "Brands" },
  { href: "/ingredients", label: "Ingredients" },
  { href: "/latest-changes", label: "Latest Changes" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/categories", label: "Categories" },
  { href: "/compare", label: "Compare" },
  { href: "/submit", label: "Submit Evidence" },
  { href: "/methodology", label: "Methodology" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-650 to-brand-500 text-white font-extrabold text-sm shadow-sm transition-transform duration-300 group-hover:scale-[1.05] bg-brand-600">
            JR
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors duration-300">
              Jeevanreport
            </span>
            <p className="hidden text-[10px] font-medium text-slate-400 sm:block">Scan products. Know the truth.</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                pathname === link.href
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <HeaderQuickScan />
          <Link href="/scan" className="btn-primary !px-4 !py-2 hidden text-xs sm:inline-flex">
            Scan Product
          </Link>
          <button
            type="button"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors xl:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-3 xl:hidden">
          <div className="grid grid-cols-2 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  pathname === link.href ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
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
