"use client";

import { useState } from "react";
import Image from "next/image";

// Category-based color backgrounds when no image available
const CATEGORY_COLORS: Record<string, { bg: string; emoji: string }> = {
  food: { bg: "#fff3e0", emoji: "🍽️" },
  snacks: { bg: "#fff3e0", emoji: "🍿" },
  beverages: { bg: "#e3f2fd", emoji: "🥤" },
  dairy: { bg: "#f3e5f5", emoji: "🥛" },
  health: { bg: "#e8f5e9", emoji: "💊" },
  supplements: { bg: "#e8f5e9", emoji: "💪" },
  personal_care: { bg: "#fce4ec", emoji: "🧴" },
  household: { bg: "#f5f5f5", emoji: "🏠" },
  baby: { bg: "#fce4ec", emoji: "👶" },
  default: { bg: "#f9f6f2", emoji: "📦" },
};

interface ProductImageProps {
  src: string;
  alt: string;
  barcode?: string;
  category?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export default function ProductImage({
  src,
  alt,
  barcode,
  category = "default",
  fill,
  sizes,
  priority,
  className,
  width,
  height,
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(() => {
    // If src is a placeholder or missing, try OFT
    if (!src || src.includes("placehold.co") || src === "" || src.startsWith("/")) {
      if (barcode) {
        return `https://images.openfoodfacts.org/images/products/${barcode}/front.400.jpg`;
      }
    }
    return src;
  });
  const [failed, setFailed] = useState(false);

  const catKey = (category?.toLowerCase() || "default") as keyof typeof CATEGORY_COLORS;
  const catConfig = CATEGORY_COLORS[catKey] || CATEGORY_COLORS.default;

  if (failed) {
    // Category-colored placeholder
    return (
      <div
        className={`flex items-center justify-center ${fill ? "absolute inset-0" : ""} ${className || ""}`}
        style={{
          backgroundColor: catConfig.bg,
          ...(width && !fill ? { width, height } : {}),
        }}
      >
        <span className="text-4xl" role="img" aria-label={alt}>{catConfig.emoji}</span>
      </div>
    );
  }

  const imageProps = fill
    ? { fill: true as const, sizes: sizes || "200px" }
    : { width: width || 200, height: height || 200 };

  return (
    <Image
      {...imageProps}
      src={imgSrc}
      alt={alt}
      priority={priority}
      className={className}
      onError={() => {
        // Try OFT front image as fallback
        if (barcode && !imgSrc.includes("openfoodfacts.org")) {
          setImgSrc(`https://images.openfoodfacts.org/images/products/${barcode}/front.400.jpg`);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
