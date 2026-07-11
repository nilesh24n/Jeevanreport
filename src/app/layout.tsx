import type { Metadata } from "next";
import "./globals.css";
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

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jeevanreport.in"),
  title: "Jeevanreport — Scan products. Know the truth.",
  description:
    "India's premier barcode-based nutrition, ingredient, and shrinkflation intelligence platform. Scan products, know the truth, and track package size changes.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Jeevanreport",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://jeevanreport.in",
    siteName: "Jeevanreport",
    title: "Jeevanreport — Scan products. Know the truth.",
    description:
      "India's premier barcode-based nutrition, ingredient, and shrinkflation intelligence platform. Scan products, know the truth, and track package size changes.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Jeevanreport — India's Product Transparency Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeevanreport — Scan products. Know the truth.",
    description:
      "India's premier barcode-based nutrition, ingredient, and shrinkflation intelligence platform.",
    images: ["/icon-512.png"],
  },
  alternates: {
    canonical: "https://jeevanreport.in",
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
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                registrations.forEach(function(reg) {
                  reg.unregister();
                });
              });
              navigator.serviceWorker.register('/sw.js').catch(function(err) {
                console.log('SW error:', err);
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
