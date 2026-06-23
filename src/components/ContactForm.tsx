"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      subject: formData.get("subject")?.toString() ?? "",
      name: formData.get("name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      message: formData.get("message")?.toString() ?? "",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        setErrorMessage(result.error || "Unable to submit your message.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card text-center py-8">
        <div className="text-3xl">✓</div>
        <p className="mt-3 font-medium text-slate-900">Message sent</p>
        <p className="mt-1 text-sm text-slate-600">We typically respond within 2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700">Subject</label>
        <select name="subject" required className="input-field mt-1">
          <option value="general">General inquiry</option>
          <option value="press">Press / media</option>
          <option value="data">Data correction</option>
          <option value="partnership">Partnership</option>
          <option value="bug">Bug report</option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">Name</label>
          <input name="name" required className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input name="email" type="email" required className="input-field mt-1" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">Message</label>
        <textarea name="message" rows={5} required className="input-field mt-1" placeholder="How can we help?" />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage ?? "Something went wrong."}</p>
      )}
      <button type="submit" className="btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
