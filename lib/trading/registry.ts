import { PlaceOrderRequest, PlaceOrderResponse } from "@/types/trade";
import * as polymarket from "./polymarket";

export interface TradingAdapter {
  placeOrder: (order: PlaceOrderRequest) => Promise<PlaceOrderResponse>;
  validateOrder: (order: PlaceOrderRequest) => string | null;
  isSupported: boolean;
}

const adapters: Record<string, TradingAdapter> = {
  polymarket: {
    placeOrder: polymarket.placeOrder,
    validateOrder: polymarket.validateOrder,
    isSupported: false, // Will be true when wallet integration is ready
  },
  // Placeholder for future platforms
  kalshi: {
    placeOrder: async () => {
      throw new Error("Kalshi trading not yet implemented");
    },
    validateOrder: () => "Kalshi trading not yet implemented",
    isSupported: false,
  },
  manifold: {
    placeOrder: async () => {
      throw new Error("Manifold trading not yet implemented");
    },
    validateOrder: () => "Manifold trading not yet implemented",
    isSupported: false,
  },
};

export function getTradingAdapter(platform: string): TradingAdapter | null {
  const normalized = platform.toLowerCase();
  return adapters[normalized] || null;
}

export function isTradingSupported(platform: string): boolean {
  const adapter = getTradingAdapter(platform);
  return adapter ? adapter.isSupported : false;
}

export function getSupportedPlatforms(): string[] {
  return Object.keys(adapters).filter(
    (platform) => adapters[platform].isSupported
  );
}
