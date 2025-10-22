import { polyrouter } from "@/lib/polyrouter";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Try to fetch from API first
    const response = await polyrouter("/platform/get-platform-information");
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    // If API endpoint doesn't exist, return static list of known platforms
    console.log("Platform endpoint not available, returning static list");
    return Response.json({
      platforms: [
        {
          id: "polymarket",
          name: "Polymarket",
          type: "market",
          features: { markets: true, price_history: true, real_time: true },
          health_status: "operational",
        },
        {
          id: "kalshi",
          name: "Kalshi",
          type: "market",
          features: { markets: true, price_history: true, real_time: true },
          health_status: "operational",
        },
        {
          id: "manifold",
          name: "Manifold Markets",
          type: "market",
          features: { markets: true, real_time: true },
          health_status: "operational",
        },
        {
          id: "limitless",
          name: "Limitless",
          type: "market",
          features: { markets: true, price_history: true, real_time: true },
          health_status: "operational",
        },
        {
          id: "prophetx",
          name: "ProphetX",
          type: "both",
          features: { markets: true, sports: true, real_time: true },
          health_status: "operational",
        },
        {
          id: "novig",
          name: "Novig",
          type: "both",
          features: { markets: true, sports: true, real_time: true },
          health_status: "operational",
        },
        {
          id: "sxbet",
          name: "SX.bet",
          type: "both",
          features: { markets: true, sports: true, real_time: true },
          health_status: "operational",
        },
      ],
    });
  }
}
