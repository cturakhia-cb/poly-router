import { NextRequest } from "next/server";
import { PlaceOrderRequest } from "@/types/trade";

export async function POST(request: NextRequest) {
  try {
    const payload: PlaceOrderRequest = await request.json();
    
    if (!payload.marketId || !payload.outcome || !payload.side || !payload.size || !payload.orderType) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    console.log("Trade request received:", {
      marketId: payload.marketId,
      outcome: payload.outcome,
      side: payload.side,
      size: payload.size,
      orderType: payload.orderType,
      price: payload.price,
    });
    
    return Response.json(
      {
        error: "Not Implemented",
        message: "Trading functionality requires wallet integration. This will be implemented in a future update.",
        payload,
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Error processing trade request:", error);
    return Response.json(
      { error: "Failed to process trade request" },
      { status: 500 }
    );
  }
}
