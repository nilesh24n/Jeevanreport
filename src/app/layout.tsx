import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className={`${inter.variable} font-sans`}>
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
      </body>
    </html>
  );
}
