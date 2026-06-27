import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileScanBar from "@/components/MobileScanBar";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import FirstVisitBanner from "@/components/FirstVisitBanner";
import CommandPalette from "@/components/CommandPalette";
import { ToastProvider } from "@/components/Toast";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Jeevanreport — Scan products. Know the truth.",
  description:
    "India's premier barcode-based nutrition, ingredient, and shrinkflation intelligence platform. Scan products, know the truth, and track package size changes.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Jeevanreport",
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable} font-sans bg-canvas text-espresso`}>
        <ToastProvider>
          <Header />
          <FirstVisitBanner />
          <KeyboardShortcuts />
          <CommandPalette />
          <main className="min-h-screen pb-20 sm:pb-0 print:pb-0">{children}</main>
          <MobileScanBar />
          <PwaInstallPrompt />
          <Footer />
        </ToastProvider>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GBVS13HWSL"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GBVS13HWSL', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <Script id="sw-register" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js'); }`}
        </Script>
      </body>
    </html>
  );
}
