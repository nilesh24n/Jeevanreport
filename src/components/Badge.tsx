type BadgeVariant = "warning" | "success" | "danger" | "neutral" | "brand";

const variantClass: Record<BadgeVariant, string> = {
  warning: "badge-warning",
  success: "badge-success",
  danger: "badge-danger",
  neutral: "badge-neutral",
  brand: "badge-brand",
};

export function getBadgeVariant(badge: string): BadgeVariant {
  const lower = badge.toLowerCase();
  if (lower.includes("high sugar") || lower.includes("high sodium") || lower.includes("calorie") || lower.includes("smaller") || lower.includes("skimp") || lower.includes("price")) return "warning";
  if (lower.includes("low protein") || lower.includes("low fiber") || lower.includes("processed")) return "danger";
  if (lower.includes("verified") || lower.includes("high protein") || lower.includes("high fiber") || lower.includes("low sugar") || lower.includes("staple") || lower.includes("better")) return "success";
  if (lower.includes("formula") || lower.includes("changed")) return "brand";
  return "neutral";
}

export default function Badge({ label, variant }: { label: string; variant?: BadgeVariant }) {
  const v = variant ?? getBadgeVariant(label);
  return <span className={variantClass[v]}>{label}</span>;
}
