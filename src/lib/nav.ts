export type NavItem = {
  href: string;
  labelKey: string;
  badge?: number;
};

export type NavContext = {
  pathname: string;
  watchlistCount: number;
  scanHistoryCount: number;
};

export type DynamicNav = {
  /** Up to 2 links shown in the header bar */
  visible: NavItem[];
  /** One primary CTA button, or null if current page is already that action */
  primaryAction: NavItem | null;
  /** Everything else, grouped for the menu */
  menuSections: { titleKey: string; items: NavItem[] }[];
};

const CORE: NavItem[] = [
  { href: "/scan", labelKey: "nav.scan" },
  { href: "/search", labelKey: "nav.search" },
  { href: "/compare", labelKey: "nav.compare" },
  { href: "/dashboard", labelKey: "nav.dashboard" },
];

const BROWSE: NavItem[] = [
  { href: "/products", labelKey: "nav.products" },
  { href: "/brands", labelKey: "nav.brands" },
  { href: "/categories", labelKey: "nav.categories" },
  { href: "/countries", labelKey: "nav.countries" },
  { href: "/ingredients", labelKey: "nav.ingredients" },
  { href: "/leaderboard", labelKey: "nav.leaderboard" },
  { href: "/latest-changes", labelKey: "nav.latest_changes" },
];

const ACCOUNT: NavItem[] = [
  { href: "/watchlist", labelKey: "nav.watchlist" },
  { href: "/submit", labelKey: "nav.submit_evidence" },
  { href: "/methodology", labelKey: "nav.methodology" },
  { href: "/about", labelKey: "nav.about" },
];

function item(href: string, labelKey: string, badge?: number): NavItem {
  return badge ? { href, labelKey, badge } : { href, labelKey };
}

function exclude(items: NavItem[], ...hrefs: string[]): NavItem[] {
  return items.filter((i) => !hrefs.includes(i.href));
}

function pickVisible(pathname: string, ctx: NavContext): NavItem[] {
  if (pathname.startsWith("/scan")) {
    return [item("/search", "nav.search")];
  }
  if (pathname.startsWith("/search")) {
    return [item("/scan", "nav.scan")];
  }
  if (pathname.startsWith("/compare")) {
    return [item("/scan", "nav.scan"), item("/search", "nav.search")];
  }
  if (pathname.startsWith("/products/")) {
    return [item("/compare", "nav.compare"), item("/search", "nav.search")];
  }
  if (pathname === "/dashboard" || pathname === "/watchlist") {
    const links: NavItem[] = [item("/scan", "nav.scan")];
    if (ctx.watchlistCount > 0) {
      links.push(item("/watchlist", "nav.watchlist", ctx.watchlistCount));
    } else if (ctx.scanHistoryCount > 0) {
      links.push(item("/dashboard", "nav.dashboard"));
    }
    return links.slice(0, 2);
  }
  if (pathname.startsWith("/leaderboard") || pathname.startsWith("/latest-changes")) {
    return [item("/scan", "nav.scan"), item("/leaderboard", "nav.leaderboard")];
  }
  if (pathname.startsWith("/products") || pathname.startsWith("/brands") || pathname.startsWith("/categories")) {
    return [item("/scan", "nav.scan"), item("/search", "nav.search")];
  }
  // Home and everything else
  if (ctx.scanHistoryCount > 0) {
    return [item("/dashboard", "nav.dashboard"), item("/scan", "nav.scan")];
  }
  return [item("/scan", "nav.scan"), item("/search", "nav.search")];
}

function pickPrimaryAction(pathname: string, ctx: NavContext): NavItem | null {
  if (pathname.startsWith("/scan")) return null;
  if (pathname.startsWith("/search")) return item("/scan", "nav.scan_now");
  if (pathname.startsWith("/products/")) return item("/scan", "nav.scan_now");
  if (pathname === "/watchlist" || pathname === "/dashboard") {
    return item("/scan", "nav.scan_now");
  }
  if (ctx.watchlistCount > 0 && !pathname.startsWith("/watchlist")) {
    return item("/watchlist", "nav.watchlist", ctx.watchlistCount);
  }
  return item("/scan", "nav.scan_now");
}

export function getDynamicNav(ctx: NavContext): DynamicNav {
  const visible = pickVisible(ctx.pathname, ctx);
  const visibleHrefs = new Set(visible.map((i) => i.href));
  const primary = pickPrimaryAction(ctx.pathname, ctx);
  if (primary) visibleHrefs.add(primary.href);

  const menuCore = exclude(CORE, ...Array.from(visibleHrefs));
  const menuBrowse = exclude(BROWSE, ...Array.from(visibleHrefs));
  const menuAccount = ACCOUNT.map((i) =>
    i.href === "/watchlist" && ctx.watchlistCount > 0
      ? { ...i, badge: ctx.watchlistCount }
      : i
  ).filter((i) => !visibleHrefs.has(i.href));

  const menuSections = [
    menuCore.length > 0 ? { titleKey: "nav.section.main", items: menuCore } : null,
    menuBrowse.length > 0 ? { titleKey: "nav.section.browse", items: menuBrowse } : null,
    menuAccount.length > 0 ? { titleKey: "nav.section.more", items: menuAccount } : null,
  ].filter(Boolean) as DynamicNav["menuSections"];

  return { visible, primaryAction: primary, menuSections };
}

/** Mobile bottom bar — max 3 items, context-aware */
export function getMobileBarItems(ctx: NavContext): NavItem[] {
  const { pathname } = ctx;

  if (pathname.startsWith("/scan")) {
    return [
      item("/search", "nav.search"),
      item("/products", "nav.products"),
      item("/dashboard", "nav.dashboard"),
    ];
  }
  if (pathname.startsWith("/search")) {
    return [
      item("/scan", "nav.scan"),
      item("/compare", "nav.compare"),
      item("/products", "nav.products"),
    ];
  }
  if (pathname.startsWith("/products/")) {
    return [
      item("/scan", "nav.scan"),
      item("/compare", "nav.compare"),
      item("/watchlist", "nav.watchlist", ctx.watchlistCount || undefined),
    ];
  }
  if (pathname === "/dashboard" || pathname === "/watchlist") {
    return [
      item("/scan", "nav.scan"),
      item("/search", "nav.search"),
      item("/leaderboard", "nav.leaderboard"),
    ];
  }

  return [
    item("/scan", "nav.scan"),
    item("/search", "nav.search"),
    ctx.watchlistCount > 0
      ? item("/watchlist", "nav.watchlist", ctx.watchlistCount)
      : item("/products", "nav.products"),
  ];
}
