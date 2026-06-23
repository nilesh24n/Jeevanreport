const SCAN_HISTORY_KEY = "jeevanreport_scan_history";
const WATCHLIST_KEY = "jeevanreport_watchlist";
const ALERT_PREFS_KEY = "jeevanreport_alert_prefs";
const MAX_HISTORY = 20;

export interface ScanHistoryEntry {
  productId: string;
  name: string;
  barcode: string;
  scannedAt: string;
}

export interface WatchlistEntry {
  productId: string;
  name: string;
  brand: string;
  addedAt: string;
  alertTypes: ("size" | "formula" | "price" | "nutrition")[];
}

export interface AlertPreferences {
  sizeChanges: boolean;
  formulaChanges: boolean;
  priceChanges: boolean;
  nutritionUpdates: boolean;
}

const defaultAlertPrefs: AlertPreferences = {
  sizeChanges: true,
  formulaChanges: true,
  priceChanges: true,
  nutritionUpdates: true,
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getScanHistory(): ScanHistoryEntry[] {
  return readJson<ScanHistoryEntry[]>(SCAN_HISTORY_KEY, []);
}

export function addScanHistory(entry: Omit<ScanHistoryEntry, "scannedAt">): void {
  const history = getScanHistory().filter((h) => h.productId !== entry.productId);
  history.unshift({ ...entry, scannedAt: new Date().toISOString() });
  writeJson(SCAN_HISTORY_KEY, history.slice(0, MAX_HISTORY));
}

export function clearScanHistory(): void {
  writeJson(SCAN_HISTORY_KEY, []);
}

export function getWatchlist(): WatchlistEntry[] {
  return readJson<WatchlistEntry[]>(WATCHLIST_KEY, []);
}

export function isOnWatchlist(productId: string): boolean {
  return getWatchlist().some((w) => w.productId === productId);
}

export function toggleWatchlist(entry: Omit<WatchlistEntry, "addedAt" | "alertTypes">): boolean {
  const list = getWatchlist();
  const idx = list.findIndex((w) => w.productId === entry.productId);
  if (idx >= 0) {
    list.splice(idx, 1);
    writeJson(WATCHLIST_KEY, list);
    return false;
  }
  list.unshift({
    ...entry,
    addedAt: new Date().toISOString(),
    alertTypes: ["size", "formula", "price", "nutrition"],
  });
  writeJson(WATCHLIST_KEY, list);
  return true;
}

export function removeFromWatchlist(productId: string): void {
  writeJson(
    WATCHLIST_KEY,
    getWatchlist().filter((w) => w.productId !== productId)
  );
}

export function getAlertPreferences(): AlertPreferences {
  return readJson<AlertPreferences>(ALERT_PREFS_KEY, defaultAlertPrefs);
}

export function saveAlertPreferences(prefs: AlertPreferences): void {
  writeJson(ALERT_PREFS_KEY, prefs);
}

export function exportWatchlistJson(): string {
  return JSON.stringify(getWatchlist(), null, 2);
}
