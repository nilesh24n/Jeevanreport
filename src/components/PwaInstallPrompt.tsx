"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("jeevanreport_pwa_dismissed")) {
      setDismissed(true);
      return;
    }

    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  async function handleInstall() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted") setDeferred(null);
  }

  function handleDismiss() {
    localStorage.setItem("jeevanreport_pwa_dismissed", "1");
    setDismissed(true);
    setDeferred(null);
  }

  if (dismissed || !deferred) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-md rounded-xl border border-brand-200 bg-white p-4 shadow-lg sm:bottom-6 sm:left-auto sm:right-6">
      <p className="text-sm font-semibold text-slate-900">Install Jeevanreport</p>
      <p className="mt-1 text-xs text-slate-600">Add to your home screen for fast in-store barcode scanning.</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={handleInstall} className="btn-primary text-xs py-1.5">Install</button>
        <button type="button" onClick={handleDismiss} className="btn-secondary text-xs py-1.5">Not now</button>
      </div>
    </div>
  );
}
