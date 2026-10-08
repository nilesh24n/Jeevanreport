import type { Product, ProductVersion } from "./types";
import type { ProductStatus } from "./nutrition-engine";
import type { BodyImpactSummary } from "./types";
import { products } from "./data/products";

export type DataStatusTone = "verified" | "community" | "caution" | "review";

export interface DataStatus {
  label: string;
  detail: string;
  tone: DataStatusTone;
}

export function getProductDataStatus(product: Product): DataStatus {
  const isCurated = products.some((p) => p.id === product.id || p.barcode === product.barcode);

  if (product.trustLevel === "Verified" || (isCurated && product.trustScore >= 85)) {
    return {
      label: "Verified label data",
      detail: "Checked against pack label or curated catalog",
      tone: "verified",
    };
  }
  if (product.trustLevel === "Community verified" || product.submissions.some((s) => s.status === "approved")) {
    return {
      label: "Community verified",
      detail: "Includes approved shopper evidence — still confirm your pack",
      tone: "community",
    };
  }
  if (product.trustLevel === "Under review") {
    return {
      label: "Under review",
      detail: "We are validating this entry",
      tone: "review",
    };
  }
  return {
    label: "Check your pack",
    detail: "Imported or incomplete data — compare with the back of your package",
    tone: "caution",
  };
}

export function dataStatusToneClass(tone: DataStatusTone): string {
  switch (tone) {
    case "verified":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "community":
      return "bg-sky-50 text-sky-800 border-sky-200";
    case "review":
      return "bg-amber-50 text-amber-900 border-amber-200";
    default:
      return "bg-stone-100 text-stone-700 border-stone-200";
  }
}

export function getEverydayOneLiner(status: ProductStatus, body: BodyImpactSummary): string {
  if (body.summaryText && body.summaryText.length > 20) {
    return body.summaryText.replace(/\.\s*Educational only.*$/i, ".").trim();
  }
  if (status.rating === "Good") {
    return "Balanced enough for regular use in normal portions — still read the label.";
  }
  if (status.rating === "Okay") {
    return "Fine in moderation; watch portions and how often you eat it.";
  }
  if (status.color === "orange") {
    return "Some caution flags — best as an occasional choice, not an everyday staple.";
  }
  return "High sugar, salt, or fat for frequent use — treat as an occasional item.";
}

export function buildWhatMattersBullets(
  product: Product,
  version: ProductVersion,
  status: ProductStatus,
  body: BodyImpactSummary,
  max = 5
): string[] {
  const bullets: string[] = [];

  for (const p of status.points) {
    if (bullets.length >= max) break;
    bullets.push(p);
  }

  if (version.allergens.length > 0 && bullets.length < max) {
    bullets.push(`Allergens: ${version.allergens.join(", ")}`);
  }

  const latestPack = product.packSizeChanges[0];
  if (latestPack && bullets.length < max) {
    bullets.push(
      `Pack size changed ${latestPack.oldSize} → ${latestPack.newSize} (${latestPack.date})`
    );
  }

  const latestFormula = product.formulaChanges[0];
  if (latestFormula && bullets.length < max) {
    bullets.push(`Recipe update (${latestFormula.date}): ${latestFormula.summary}`);
  }

  for (const badge of product.badges) {
    if (bullets.length >= max) break;
    if (!bullets.some((b) => b.toLowerCase().includes(badge.toLowerCase()))) {
      bullets.push(badge);
    }
  }

  if (body.sodiumFlag === "High" && !bullets.some((b) => /sodium|salt/i.test(b))) {
    bullets.push("Relatively high sodium for one serving");
  }

  return bullets.slice(0, max);
}

export function hasPackOrFormulaHistory(product: Product): boolean {
  return product.packSizeChanges.length > 0 || product.formulaChanges.length > 0;
}
