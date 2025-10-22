"use client"

import { useEffect, useState } from "react";
import { api } from "@/lib/clientFetch";
import { Market, MarketsResponse } from "@/types/market";
import { MarketCard } from "@/components/MarketCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

export function MarketsGrid() {
  const searchParams = useSearchParams();
  const [markets, setMarkets] = useState<Market[]>([]);
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

        if (platform && platform !== "all") {
          params.set("platform", platform);
        }
        params.set("limit", limit);

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
  }, [searchParams]);

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

  if (markets.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No markets found. Try adjusting your filters or search query.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {markets.map((market) => (
        <MarketCard key={`${market.platform}-${market.id}`} market={market} />
      ))}
    </div>
  );
}
