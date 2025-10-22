import { PlaceOrderRequest, PlaceOrderResponse } from "@/types/trade";

export async function placeOrder(
  order: PlaceOrderRequest
): Promise<PlaceOrderResponse> {
  throw new Error("Trading not yet implemented. Wallet integration required.");
}

export function validateOrder(order: PlaceOrderRequest): string | null {
  if (!order.marketId) return "Market ID is required";
  if (!order.outcome || !["yes", "no"].includes(order.outcome)) {
    return "Outcome must be 'yes' or 'no'";
  }
  if (!order.side || !["buy", "sell"].includes(order.side)) {
    return "Side must be 'buy' or 'sell'";
  }
  if (!order.size || order.size <= 0) return "Size must be greater than 0";
  if (!order.orderType || !["market", "limit"].includes(order.orderType)) {
    return "Order type must be 'market' or 'limit'";
  }
  if (order.orderType === "limit" && (!order.price || order.price <= 0)) {
    return "Price is required for limit orders";
  }
  
  return null;
}
