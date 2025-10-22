"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/clientFetch";
import { Market, MarketsResponse } from "@/types/market";
import { MarketCard } from "@/components/MarketCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

const filterMarketsByTime = (
  markets: Market[],
  timeFilter: string
): Market[] => {
  const now = new Date();
  let filteredMarkets = [...markets];

  switch (timeFilter) {
    case "24h":
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      filteredMarkets = markets.filter(
        (market) =>
          market.created_at && new Date(market.created_at) >= yesterday
      );
      break;
    case "7d":
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredMarkets = markets.filter(
        (market) => market.created_at && new Date(market.created_at) >= lastWeek
      );
      break;
    case "30d":
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredMarkets = markets.filter(
        (market) =>
          market.created_at && new Date(market.created_at) >= lastMonth
      );
      break;
    case "newest":
      filteredMarkets = markets
        .filter((market) => market.created_at)
        .sort(
          (a, b) =>
            new Date(b.created_at!).getTime() -
            new Date(a.created_at!).getTime()
        );
      break;
    case "all":
    default:
      // No filtering, return all markets
      break;
  }

  return filteredMarkets;
};

export function MarketsGrid() {
  const searchParams = useSearchParams();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        const platform = searchParams.get("platform");
        const limit = searchParams.get("limit") || "25";
        const search = searchParams.get("search");
        const timeFilter = searchParams.get("timeFilter") || "all";

        if (platform && platform !== "all") {
          params.set("platform", platform);
        }

        // Always fetch 100 markets (API maximum) to have a pool for filtering
        params.set("limit", "100");

        let data: MarketsResponse;

        if (search) {
          params.set("query", search);
          data = await api(`/api/polyrouter/search?${params.toString()}`);
        } else {
          data = await api(`/api/polyrouter/markets?${params.toString()}`);
        }

        setMarkets(data.markets || []);
      } catch (err: any) {
        setError(err.message || "Failed to load markets");
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [
    searchParams.get("platform"),
    searchParams.get("search"),
    searchParams.get("timeFilter"),
  ]);

  // Apply time filtering whenever markets or timeFilter changes
  useEffect(() => {
    const timeFilter = searchParams.get("timeFilter") || "all";
    const limit = parseInt(searchParams.get("limit") || "25");

    const filtered = filterMarketsByTime(markets, timeFilter);
    // Apply limit after filtering
    setFilteredMarkets(filtered.slice(0, limit));
  }, [markets, searchParams]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (filteredMarkets.length === 0 && !loading) {
    const timeFilter = searchParams.get("timeFilter");
    const timeFilterLabel =
      timeFilter === "24h"
        ? "last 24 hours"
        : timeFilter === "7d"
        ? "last 7 days"
        : timeFilter === "30d"
        ? "last 30 days"
        : null;

    return (
      <div className="p-8 text-center text-muted-foreground">
        {timeFilterLabel ? (
          <>
            <p>No markets found in the {timeFilterLabel}.</p>
            <p className="text-sm mt-2">
              Try selecting "All Time" or "Newest First" to see available
              markets.
            </p>
          </>
        ) : (
          <p>No markets found. Try adjusting your filters or search query.</p>
        )}
      </div>
    );
  }

  const timeFilter = searchParams.get("timeFilter");
  const showCount =
    timeFilter && timeFilter !== "all" && filteredMarkets.length > 0;

  return (
    <>
      {showCount && (
        <div className="text-sm text-muted-foreground mb-4">
          Found {filteredMarkets.length} market
          {filteredMarkets.length !== 1 ? "s" : ""} matching your time filter
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMarkets.map((market) => (
          <MarketCard key={`${market.platform}-${market.id}`} market={market} />
        ))}
      </div>
    </>
  );
}
