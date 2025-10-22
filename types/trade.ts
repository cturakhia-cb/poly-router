export type OrderType = "market" | "limit";
export type OrderSide = "buy" | "sell";
export type Outcome = "yes" | "no";

export interface PlaceOrderRequest {
  marketId: string;
  outcome: Outcome;
  side: OrderSide;
  size: number;
  price?: number; // Required for limit orders
  orderType: OrderType;
}

export interface PlaceOrderResponse {
  success: boolean;
  orderId?: string;
  message?: string;
  error?: string;
}
