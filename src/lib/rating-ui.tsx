export function getRatingCardClass(color: string) {
  switch (color) {
    case "green": return "border-emerald-200 bg-emerald-50/20";
    case "yellow": return "border-amber-200 bg-amber-50/20";
    case "orange": return "border-orange-200 bg-orange-50/20";
    case "red":
    default:
      return "border-rose-200 bg-rose-50/20";
  }
}

const RATING_DOT: Record<string, string> = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  orange: "bg-orange-500",
  red: "bg-rose-500",
};

const RATING_LABEL: Record<string, string> = {
  green: "Good Choice",
  yellow: "Okay Choice",
  orange: "Caution",
  red: "Be Careful",
};

const RATING_BADGE: Record<string, string> = {
  green: "badge-rating-green",
  yellow: "badge-rating-yellow",
  orange: "badge-rating-orange",
  red: "badge-rating-red",
};

export function RatingBadge({ color }: { color: string }) {
  const key = RATING_DOT[color] ? color : "red";
  return (
    <span className={RATING_BADGE[key]}>
      <span className={`rating-dot ${RATING_DOT[key]}`} aria-hidden="true" />
      {RATING_LABEL[key]}
    </span>
  );
}

export function getPointIcon(point: string) {
  const p = point.toLowerCase();
  if (
    p.includes("high sugar") || p.includes("high salt") || p.includes("high fat") ||
    p.includes("limit") || p.includes("calorie dense") || p.includes("low protein") ||
    p.includes("low fiber") || p.includes("high calorie") || p.includes("high cal") ||
    p.includes("occasional") || p.includes("moderation") || p.includes("not ideal") ||
    p.includes("less filling") || p.includes("avoid") || p.includes("highly processed")
  ) {
    return "warn";
  }
  return "ok";
}
