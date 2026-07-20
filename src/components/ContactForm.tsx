"use client";

import { useState } from "react";

const SUBJECTS = [
  { value: "general", label: "General Inquiry" },
  { value: "wrong_data", label: "Report Wrong Data" },
  { value: "evidence", label: "Submit Evidence" },
  { value: "partnership", label: "Partnership" },
  { value: "bug", label: "Bug Report" },
  { value: "other", label: "Other" },
];

const CONTACT_EMAIL = "contact@jeevanreport.in";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    // Save to localStorage since no backend yet
    try {
      const existing = JSON.parse(localStorage.getItem("jr_contact_submissions") || "[]");
      existing.push({
        ...form,
        submittedAt: new Date().toISOString(),
        id: crypto.randomUUID(),
      });
      localStorage.setItem("jr_contact_submissions", JSON.stringify(existing));
    } catch {
      // silent
    }

    // Simulate sending
    setTimeout(() => setStatus("success"), 600);
  }

  if (status === "success") {
    return (
      <div className="card text-center py-10 space-y-4">
        <div className="text-4xl">✅</div>
        <p className="text-xl font-bold text-slate-900">Message received!</p>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Thank you! We&apos;ll get back to you at{" "}
          <strong>{form.email}</strong> via{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-600 hover:underline">
            {CONTACT_EMAIL}
          </a>{" "}
          within 2–3 business days.
        </p>
        <button
          type="button"
          onClick={() => { setStatus("idle"); setForm({ name: "", email: "", subject: "general", message: "" }); }}
          className="btn-secondary text-sm mx-auto"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div>
        <label htmlFor="cf-name" className="block text-sm font-semibold text-slate-700 mb-1">
          Name <span className="text-rose-500">*</span>
        </label>
        <input
          id="cf-name"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          className="input-field"
          placeholder="Your full name"
          style={{ fontSize: "16px" }}
        />
      </div>

      <div>
        <label htmlFor="cf-email" className="block text-sm font-semibold text-slate-700 mb-1">
          Email <span className="text-rose-500">*</span>
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="input-field"
          placeholder="you@example.com"
          style={{ fontSize: "16px" }}
        />
      </div>

      <div>
        <label htmlFor="cf-subject" className="block text-sm font-semibold text-slate-700 mb-1">
          Subject <span className="text-rose-500">*</span>
        </label>
        <select
          id="cf-subject"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          className="input-field"
          style={{ fontSize: "16px" }}
        >
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-sm font-semibold text-slate-700 mb-1">
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="input-field resize-none"
          placeholder="How can we help you?"
          style={{ fontSize: "16px" }}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full min-h-[56px] text-base disabled:opacity-60"
      >
        {status === "sending" ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Sending…
          </span>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
