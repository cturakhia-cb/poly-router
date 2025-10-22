import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Market } from "@/types/market";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Normalize text for comparison
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Calculate similarity between two strings (0-1)
export function calculateSimilarity(a: string, b: string): number {
  const normA = normalizeText(a);
  const normB = normalizeText(b);

  if (normA === normB) return 1;

  const wordsA = new Set(normA.split(" "));
  const wordsB = new Set(normB.split(" "));

  const intersection = new Set([...wordsA].filter((x) => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);

  return intersection.size / union.size;
}

// Group similar markets by title
export function groupSimilarMarkets(
  markets: Market[],
  threshold: number = 0.4
): Market[][] {
  const groups: Market[][] = [];
  const used = new Set<string>();

  for (const market of markets) {
    const key = `${market.platform}-${market.id}`;
    if (used.has(key)) continue;

    const group = [market];
    used.add(key);

    for (const other of markets) {
      const otherKey = `${other.platform}-${other.id}`;
      if (used.has(otherKey)) continue;

      const similarity = calculateSimilarity(market.title, other.title);
      if (similarity >= threshold) {
        group.push(other);
        used.add(otherKey);
      }
    }

    groups.push(group);
  }

  return groups.sort((a, b) => b.length - a.length);
}

// Safe number formatting with fallbacks
export function formatNumber(
  value: number | undefined | null,
  decimals: number = 2
): string {
  if (value == null || isNaN(value)) return "—";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Safe percentage formatting
export function formatPercent(
  value: number | undefined | null,
  decimals: number = 1
): string {
  if (value == null || isNaN(value)) return "—";
  const clamped = Math.max(0, Math.min(1, value));
  return `${(clamped * 100).toFixed(decimals)}%`;
}

// Format currency
export function formatCurrency(value: number | undefined | null): string {
  if (value == null || isNaN(value)) return "—";
  return `$${value.toLocaleString()}`;
}

// Format relative time
export function formatRelativeTime(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";

  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  } catch {
    return "—";
  }
}

// Clamp price to valid range
export function clampPrice(price: number | undefined | null): number {
  if (price == null || isNaN(price)) return 0;
  return Math.max(0, Math.min(1, price));
}
