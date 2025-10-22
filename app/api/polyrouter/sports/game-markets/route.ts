import { polyrouter } from "@/lib/polyrouter";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const gameId = searchParams.get("game_id");
    
    if (!gameId) {
      return Response.json(
        { error: "game_id parameter is required" },
        { status: 400 }
      );
    }
    
    const endpoint = `/games-v1/${gameId}`;
    const response = await polyrouter(endpoint);
    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching game markets:", error);
    return Response.json(
      { error: "Failed to fetch game markets" },
      { status: 500 }
    );
  }
}
