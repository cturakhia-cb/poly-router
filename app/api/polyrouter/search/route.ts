import { polyrouter } from "@/lib/polyrouter";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || "";
    
    // Try the v2 search endpoint first
    try {
      const searchEndpoint = `/v2/search-markets?query=${encodeURIComponent(query)}`;
      const response = await polyrouter(searchEndpoint);
      const data = await response.json();
      return Response.json(data);
    } catch (searchError) {
      // Fallback: use markets endpoint with all platforms if search doesn't work
      console.log("Search endpoint not available, falling back to markets filter");
      const limit = searchParams.get("limit") || "25";
      const marketsEndpoint = `/markets-v2?limit=${limit}`;
      const response = await polyrouter(marketsEndpoint);
      const data = await response.json();
      
      // Client-side filtering if query exists
      if (query && data.markets) {
        const filtered = data.markets.filter((m: any) => 
          m.title?.toLowerCase().includes(query.toLowerCase()) ||
          m.description?.toLowerCase().includes(query.toLowerCase())
        );
        return Response.json({ markets: filtered });
      }
      
      return Response.json(data);
    }
  } catch (error) {
    console.error("Error searching markets:", error);
    return Response.json(
      { error: "Failed to search markets" },
      { status: 500 }
    );
  }
}
