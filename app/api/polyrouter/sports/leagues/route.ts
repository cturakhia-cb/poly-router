import { polyrouter } from "@/lib/polyrouter";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    
    const endpoint = `/sports-api-v1/get-league-information${queryString ? `?${queryString}` : ""}`;
    const response = await polyrouter(endpoint);
    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching league info:", error);
    return Response.json(
      { error: "Failed to fetch league information" },
      { status: 500 }
    );
  }
}
