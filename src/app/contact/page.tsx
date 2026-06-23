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
        <p className="mt-2 text-sm text-slate-700">
          For all inquiries — support, press, data corrections, and partnerships — email us at:
        </p>
        <p className="mt-3 text-base font-semibold">
          <a href="mailto:supportjeevanreport@gmail.com" className="text-green-600 hover:underline">
            supportjeevanreport@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
