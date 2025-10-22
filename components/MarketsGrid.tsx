"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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

const sortMarkets = (markets: Market[], sortBy: string): Market[] => {
  const sorted = [...markets];

  switch (sortBy) {
    case "volume":
      return sorted.sort((a, b) => (b.volume || 0) - (a.volume || 0));
    case "liquidity":
      return sorted.sort((a, b) => (b.liquidity || 0) - (a.liquidity || 0));
    case "change":
      return sorted.sort(
        (a, b) => (b.price_change_24h || 0) - (a.price_change_24h || 0)
      );
    case "change-low":
      return sorted.sort(
        (a, b) => (a.price_change_24h || 0) - (b.price_change_24h || 0)
      );
    default:
      return sorted;
  }
};

const filterByStatus = (markets: Market[], status: string): Market[] => {
  if (status === "all") return markets;

  return markets.filter((market) => {
    const marketStatus = market.status?.toLowerCase() || "active";
    return marketStatus === status;
  });
};

export function MarketsGrid() {
  const searchParams = useSearchParams();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [displayedMarkets, setDisplayedMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 12;

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

  // Apply filtering and sorting whenever markets or params change
  useEffect(() => {
    const timeFilter = searchParams.get("timeFilter") || "all";
    const sortBy = searchParams.get("sort") || "default";
    const status = searchParams.get("status") || "all";
    const limit = parseInt(searchParams.get("limit") || "25");

    let filtered = filterMarketsByTime(markets, timeFilter);
    filtered = filterByStatus(filtered, status);
    filtered = sortMarkets(filtered, sortBy);

    // Apply limit after all filtering and sorting
    setFilteredMarkets(filtered.slice(0, limit));
    setPage(1); // Reset pagination
  }, [markets, searchParams]);

  // Update displayed markets for infinite scroll
  useEffect(() => {
    const itemsToShow = page * ITEMS_PER_PAGE;
    setDisplayedMarkets(filteredMarkets.slice(0, itemsToShow));
  }, [filteredMarkets, page]);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (
        target.isIntersecting &&
        displayedMarkets.length < filteredMarkets.length
      ) {
        setPage((prev) => prev + 1);
      }
    },
    [displayedMarkets.length, filteredMarkets.length]
  );

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

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

  if (displayedMarkets.length === 0 && !loading) {
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

  const showCount = filteredMarkets.length > 0;
  const hasMore = displayedMarkets.length < filteredMarkets.length;

  return (
    <>
      {showCount && (
        <div className="text-sm text-muted-foreground mb-4">
          Showing {displayedMarkets.length} of {filteredMarkets.length} market
          {filteredMarkets.length !== 1 ? "s" : ""}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedMarkets.map((market) => (
          <MarketCard key={`${market.platform}-${market.id}`} market={market} />
        ))}
      </div>

      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
