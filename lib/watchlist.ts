import { Market } from "@/types/market";

const WATCHLIST_KEY = "watchlist:v1";

export interface WatchlistItem {
  platform: string;
  marketId: string;
  title: string;
  addedAt: string;
}

// Get watchlist from localStorage
export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Check if market is in watchlist
export function isInWatchlist(platform: string, marketId: string): boolean {
  const watchlist = getWatchlist();
  return watchlist.some(
    (item) => item.platform === platform && item.marketId === marketId
  );
}

// Add market to watchlist
export function addToWatchlist(market: Market): void {
  if (typeof window === "undefined") return;

  const watchlist = getWatchlist();
  const exists = watchlist.some(
    (item) => item.platform === market.platform && item.marketId === market.id
  );

  if (!exists) {
    watchlist.push({
      platform: market.platform,
      marketId: market.id,
      title: market.title,
      addedAt: new Date().toISOString(),
    });
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }
}

// Remove market from watchlist
export function removeFromWatchlist(platform: string, marketId: string): void {
  if (typeof window === "undefined") return;

  const watchlist = getWatchlist();
  const filtered = watchlist.filter(
    (item) => !(item.platform === platform && item.marketId === marketId)
  );
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
}

// Toggle market in watchlist
export function toggleWatchlist(market: Market): boolean {
  const inWatchlist = isInWatchlist(market.platform, market.id);

  if (inWatchlist) {
    removeFromWatchlist(market.platform, market.id);
    return false;
  } else {
    addToWatchlist(market);
    return true;
  }
}
