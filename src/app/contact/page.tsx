import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — JeevanReport India",
  description: "Get in touch with the JeevanReport team for press inquiries, data corrections, partnerships, or bug reports.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
        <p className="mt-2 text-slate-600">
          Reach the Jeevanreport team for press inquiries, data corrections, or partnership requests.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ContactForm />
        </div>
        <aside className="space-y-4">
          <div className="card space-y-2">
            <h2 className="font-semibold text-slate-900">📧 Email</h2>
            <a
              href="mailto:contact@jeevanreport.in"
              className="text-brand-600 hover:underline font-medium text-sm break-all"
            >
              contact@jeevanreport.in
            </a>
            <p className="text-xs text-slate-500">Response within 2–3 business days</p>
          </div>
          <div className="card space-y-2">
            <h2 className="font-semibold text-slate-900">📍 Based in</h2>
            <p className="text-sm text-slate-600">India 🇮🇳</p>
          </div>
          <div className="card space-y-2">
            <h2 className="font-semibold text-slate-900">🔗 Quick links</h2>
            <ul className="space-y-1 text-sm">
              <li><a href="/submit" className="text-brand-600 hover:underline">Submit product evidence</a></li>
              <li><a href="/methodology" className="text-brand-600 hover:underline">Our methodology</a></li>
              <li><a href="/faq" className="text-brand-600 hover:underline">FAQ</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
