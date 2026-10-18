import Link from "next/link";
import Image from "next/image";
import { MEDICAL_DISCLAIMER, CONTENT_DISCLAIMER } from "@/lib/types";
import FooterLangToggle from "./FooterLangToggle";

const platformLinks = [
  { href: "/scan",           label: "Scan Product" },
  { href: "/search",         label: "Search Database" },
  { href: "/shrinkflation",  label: "Shrinkflation Report 2018–2026" },
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
  { href: "/privacy",      label: "Privacy Policy" },
  { href: "/terms",        label: "Terms of Service" },
  { href: "/disclaimer",   label: "Medical Disclaimer" },
  { href: "/data-sources", label: "Data Sources" },
  { href: "/corrections",  label: "Data Corrections" },
  { href: "/contact",      label: "Contact" },
];

const countryLinks = [
  { href: "/countries/india",     label: "India" },
  { href: "/countries/usa",       label: "USA" },
  { href: "/countries/uk",        label: "UK" },
  { href: "/countries/canada",    label: "Canada" },
  { href: "/countries/australia", label: "Australia" },
  { href: "/countries/japan",     label: "Japan" },
];

export default function Footer() {
  return (
    <footer className="border-t border-brand-700 bg-brand-800 text-white print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          <div className="col-span-2 space-y-4 lg:col-span-1">
            <Link href="/" className="group flex items-center gap-2.5">
              <Image
                src="/logo-icon.svg"
                alt="JeevanReport"
                width={40}
                height={40}
                className="transition-transform group-hover:scale-105"
              />
              <span className="text-lg font-semibold text-white">JeevanReport</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              India&apos;s product transparency platform. Scan barcodes, read the evidence, make informed choices.
            </p>
            <FooterLangToggle />
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/35">Platform</h3>
            <ul className="space-y-2">
              {platformLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/55 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/35">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/55 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/35">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/55 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/30">Browse by country</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {countryLinks.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="text-xs font-medium text-white/45 transition-colors hover:text-white"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">⚖️</span>
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                Legal Safe Harbor & Consumer Protection Notice
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-white/60">
              <Link href="/disclaimer" className="text-amber-300 hover:text-white underline font-semibold">
                View Full Legal Disclaimer →
              </Link>
              <span>·</span>
              <Link href="/corrections" className="text-white/70 hover:text-white underline">
                Manufacturer Corrections
              </Link>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 text-[11px] leading-relaxed text-white/45">
            <p>
              <strong className="text-white/70">Consumer Right to Know & Fair Use:</strong> {CONTENT_DISCLAIMER}
            </p>
            <p className="md:border-l md:border-white/10 md:pl-4">
              <strong className="text-white/70">Educational Health Guidance:</strong> {MEDICAL_DISCLAIMER}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} JeevanReport · Built for India</p>
          <a href="mailto:supportjeevanreport@gmail.com" className="transition-colors hover:text-white/70">
            supportjeevanreport@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
