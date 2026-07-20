import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Transparency Dashboard | JeevanReport India",
  description: "Manage your food scan history, watchlist preferences, custom alerts, and view community contributions on JeevanReport.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
