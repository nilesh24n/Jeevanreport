import Link from "next/link";
import Image from "next/image";
import { MEDICAL_DISCLAIMER } from "@/lib/types";
import FooterLangToggle from "./FooterLangToggle";

const platformLinks = [
  { href: "/scan",           label: "Scan Product" },
  { href: "/search",         label: "Search Database" },
  { href: "/compare",        label: "Compare Products" },
  { href: "/leaderboard",    label: "Shrinkflation Leaderboard" },
  { href: "/dashboard",      label: "Dashboard" },
  { href: "/watchlist",      label: "My Watchlist" },
  { href: "/latest-changes", label: "Latest Changes" },
];

const companyLinks = [
  { href: "/about",       label: "About" },
  { href: "/methodology", label: "Methodology" },
  { href: "/submit",      label: "Submit Evidence" },
  { href: "/api-docs",    label: "API Docs" },
  { href: "/blog",        label: "Blog" },
  { href: "/faq",         label: "FAQ" },
];

const legalLinks = [
  { href: "/privacy",     label: "Privacy Policy" },
  { href: "/terms",       label: "Terms of Service" },
  { href: "/disclaimer",  label: "Medical Disclaimer" },
  { href: "/data-sources",label: "Data Sources" },
  { href: "/contact",     label: "Contact" },
];

const countryLinks = [
  { href: "/countries/india",     label: "🇮🇳 India" },
  { href: "/countries/usa",       label: "🇺🇸 USA" },
  { href: "/countries/uk",        label: "🇬🇧 UK" },
  { href: "/countries/canada",    label: "🇨🇦 Canada" },
  { href: "/countries/australia", label: "🇦🇺 Australia" },
  { href: "/countries/japan",     label: "🇯🇵 Japan" },
];

export default function Footer() {
  return (
    <footer className="border-t border-latte bg-white print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">

        {/* 4-column grid */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/logo-icon.svg"
                alt="Jeevanreport"
                width={36}
                height={36}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-display text-lg font-bold tracking-tight text-espresso group-hover:text-brand-600 transition-colors">
                Jeevanreport
              </span>
            </Link>
            <p className="text-sm text-espresso/60 leading-relaxed">
              India&apos;s product transparency platform. Scan. Know. Share.
            </p>
            {/* Language toggle in footer */}
            <FooterLangToggle />
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900/40">Platform</h3>
            <ul className="space-y-2">
              {platformLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-espresso/60 hover:text-brand-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900/40">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-espresso/60 hover:text-brand-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900/40">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-espresso/60 hover:text-brand-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Country links */}
        <div className="mt-10 border-t border-latte pt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-900/30 mb-3">Browse by Country</p>
          <div className="flex flex-wrap gap-3">
            {countryLinks.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="text-xs font-medium text-espresso/50 hover:text-brand-600 transition-colors"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Medical disclaimer */}
        <div className="mt-6 rounded-2xl border border-warning-100 bg-warning-50/30 p-4">
          <p className="text-xs leading-relaxed text-warning-600">
            <strong>Medical Disclaimer:</strong> {MEDICAL_DISCLAIMER}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 border-t border-latte pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-espresso/40">
          <p>© {new Date().getFullYear()} Jeevanreport · Built for India · Empowering consumer awareness</p>
          <a href="mailto:contact@jeevanreport.in" className="hover:text-brand-600 transition-colors">
            contact@jeevanreport.in
          </a>
        </div>
      </div>
    </footer>
  );
}
