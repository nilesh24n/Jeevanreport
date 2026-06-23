import Link from "next/link";
import { MEDICAL_DISCLAIMER } from "@/lib/types";

const footerLinks = {
  Platform: [
    { href: "/about", label: "About" },
    { href: "/methodology", label: "Methodology" },
    { href: "/ingredients", label: "Ingredient Glossary" },
    { href: "/brands", label: "Brands" },
    { href: "/api-docs", label: "API Docs" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/disclaimer", label: "Medical Disclaimer" },
    { href: "/data-sources", label: "Data Sources" },
    { href: "/community-guidelines", label: "Community Guidelines" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white font-extrabold text-sm shadow-sm">
                JR
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">Jeevanreport</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 max-w-sm">
              India&apos;s premier public utility for transparent packaged product understanding. Barcode-based proof for ingredients, nutrition facts, and package size changes over time.
            </p>
            <p className="mt-2 text-xs font-semibold text-brand-600">
              Tagline: Scan products. Know the truth.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm font-medium text-slate-500 transition-colors hover:text-brand-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-warning-100 bg-warning-50/30 p-5">
          <p className="text-xs leading-relaxed text-warning-800">
            <strong>Medical Disclaimer:</strong> {MEDICAL_DISCLAIMER}
          </p>
        </div>

        <div className="mt-12 border-t border-slate-100 pt-8 text-center text-xs text-slate-400">
          <p className="font-medium">Keyboard shortcuts: <kbd className="mx-0.5 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">⌘K</kbd> search · <kbd className="mx-0.5 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">/</kbd> scan · <kbd className="mx-0.5 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">f</kbd> find</p>
          <p className="mt-3">© {new Date().getFullYear()} Jeevanreport. Built for India. Empowering mass consumer awareness.</p>
        </div>
      </div>
    </footer>
  );
}
