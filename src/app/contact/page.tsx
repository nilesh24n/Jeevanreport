import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Contact</h1>
      <p className="mt-4 text-slate-600">Reach the Jeevanreport team for press inquiries, data corrections, or partnership requests.</p>

      <div className="mt-8">
        <ContactForm />
      </div>

      <div className="mt-8 card">
        <h2 className="font-semibold text-slate-900">Direct email</h2>
        <p className="mt-2 text-sm text-slate-700"><strong>General:</strong> hello@jeevanreport.org</p>
        <p className="mt-1 text-sm text-slate-700"><strong>Press:</strong> press@jeevanreport.org</p>
        <p className="mt-1 text-sm text-slate-700"><strong>Data corrections:</strong> data@jeevanreport.org</p>
      </div>
    </div>
  );
}
