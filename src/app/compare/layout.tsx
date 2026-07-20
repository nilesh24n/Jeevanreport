import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Products — Side by Side Analysis | JeevanReport",
  description: "Compare the nutritional facts, ingredients list, and shrinkflation changes of multiple packaged food products side-by-side.",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
