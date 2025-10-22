import { useEffect, useRef } from "react";
import { Market } from "@/types/market";
import { getWatchlist } from "./watchlist";

export interface AlertRule {
  marketId: string;
  platform: string;
  type: "price_above" | "price_below" | "change_above" | "change_below";
  threshold: number;
  triggered: boolean;
}

const ALERT_STORAGE_KEY = "alerts:v1";
const ALERT_HISTORY_KEY = "alert_history:v1";

export function getAlertRules(): AlertRule[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(ALERT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveAlertRules(rules: AlertRule[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ALERT_STORAGE_KEY, JSON.stringify(rules));
}

export function addAlertRule(rule: Omit<AlertRule, "triggered">): void {
  const rules = getAlertRules();
  rules.push({ ...rule, triggered: false });
  saveAlertRules(rules);
}

export function removeAlertRule(marketId: string, platform: string): void {
  const rules = getAlertRules();
  const filtered = rules.filter(
    (r) => !(r.marketId === marketId && r.platform === platform)
  );
  saveAlertRules(filtered);
}

function checkAlert(market: Market, rule: AlertRule): boolean {
  const yesPrice = market.current_prices?.yes?.price || 0;
  const priceChange = market.price_change_24h || 0;

  switch (rule.type) {
    case "price_above":
      return yesPrice >= rule.threshold;
    case "price_below":
      return yesPrice <= rule.threshold;
    case "change_above":
      return priceChange >= rule.threshold;
    case "change_below":
      return priceChange <= rule.threshold;
    default:
      return false;
  }
}

function getAlertHistory(): Set<string> {
  if (typeof window === "undefined") return new Set();

  try {
    const stored = localStorage.getItem(ALERT_HISTORY_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function addToAlertHistory(key: string): void {
  if (typeof window === "undefined") return;

  const history = getAlertHistory();
  history.add(key);
  localStorage.setItem(ALERT_HISTORY_KEY, JSON.stringify([...history]));
}

export function useAlerts(
  markets: Market[],
  onAlert: (market: Market, rule: AlertRule) => void
) {
  const previousPrices = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (markets.length === 0) return;

    const rules = getAlertRules();
    if (rules.length === 0) return;

    const history = getAlertHistory();

    markets.forEach((market) => {
      const marketKey = `${market.platform}-${market.id}`;
      const currentPrice = market.current_prices?.yes?.price || 0;
      const previousPrice = previousPrices.current.get(marketKey);

      // Update previous price
      previousPrices.current.set(marketKey, currentPrice);

      // Skip first check (no previous price to compare)
      if (previousPrice === undefined) return;

      // Check rules for this market
      rules
        .filter(
          (rule) =>
            rule.platform === market.platform && rule.marketId === market.id
        )
        .forEach((rule) => {
          const alertKey = `${marketKey}-${rule.type}-${rule.threshold}`;

          // Skip if already triggered in this session
          if (history.has(alertKey)) return;

          if (checkAlert(market, rule)) {
            onAlert(market, rule);
            addToAlertHistory(alertKey);

            // Mark as triggered
            rule.triggered = true;
          }
        });

      saveAlertRules(rules);
    });
  }, [markets, onAlert]);
}
