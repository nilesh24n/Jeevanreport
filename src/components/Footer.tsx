import Link from "next/link";
import { MEDICAL_DISCLAIMER } from "@/lib/types";

const footerLinks = [
  { href: "/about",    label: "About" },
  { href: "/privacy",  label: "Privacy" },
  { href: "/terms",    label: "Terms" },
  { href: "/contact",  label: "Contact" },
  { href: "/api-docs", label: "API Docs" },
];

export default function Footer() {
  return (
    <footer className="border-t border-latte bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Top row — logo + links */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white font-bold text-sm shadow-sm">
              JR
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-espresso group-hover:text-brand-600 transition-colors">
              Jeevanreport
            </span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-espresso/50 hover:text-brand-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Medical disclaimer */}
        <div className="mt-8 rounded-2xl border border-warning-100 bg-warning-50/30 p-4">
          <p className="text-xs leading-relaxed text-warning-600">
            <strong>Medical Disclaimer:</strong> {MEDICAL_DISCLAIMER}
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-latte pt-6 text-center text-xs text-espresso/40">
          <p>© {new Date().getFullYear()} Jeevanreport · Built for India · Empowering consumer awareness</p>
        </div>
      </div>
    </footer>
  );
}
