"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/clientFetch";
import { Market, MarketsResponse } from "@/types/market";
import { MarketCard } from "@/components/MarketCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getWatchlist } from "@/lib/watchlist";
import { useAlerts, AlertRule } from "@/lib/useAlerts";
import { useToast } from "@/components/ui/toast";
import { Star, ArrowLeft, Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPercent } from "@/lib/utils";

export default function WatchlistPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleAlert = useCallback(
    (market: Market, rule: AlertRule) => {
      const yesPrice = market.current_prices?.yes?.price || 0;
      const priceChange = market.price_change_24h || 0;

      let message = "";
      if (rule.type === "price_above") {
        message = `Price above ${formatPercent(rule.threshold)}`;
      } else if (rule.type === "price_below") {
        message = `Price below ${formatPercent(rule.threshold)}`;
      } else if (rule.type === "change_above") {
        message = `24h change above ${(rule.threshold * 100).toFixed(1)}%`;
      } else if (rule.type === "change_below") {
        message = `24h change below ${(rule.threshold * 100).toFixed(1)}%`;
      }

      addToast({
        title: `Alert: ${market.title}`,
        description: message,
        variant: "default",
        duration: 5000,
      });
    },
    [addToast]
  );

  useAlerts(markets, handleAlert);

  useEffect(() => {
    const fetchWatchlistMarkets = async () => {
      setLoading(true);
      setError(null);

      try {
        const watchlist = getWatchlist();

        if (watchlist.length === 0) {
          setMarkets([]);
          setLoading(false);
          return;
        }

        // Fetch all markets to find watched ones
        // In a production app, you'd want an API endpoint that accepts market IDs
        const data: MarketsResponse = await api(
          `/api/polyrouter/markets?limit=100`
        );

        const watchedMarkets = (data.markets || []).filter((market) =>
          watchlist.some(
            (item) =>
              item.platform === market.platform && item.marketId === market.id
          )
        );

        setMarkets(watchedMarkets);
      } catch (err: any) {
        setError(err.message || "Failed to load watchlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistMarkets();

    // Refresh every 30 seconds
    const interval = setInterval(fetchWatchlistMarkets, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-8 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
          <h1 className="text-4xl font-bold">Watchlist</h1>
          <Bell className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">
          Track your favorite markets with live price updates and alerts
        </p>
      </div>

      {markets.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
          <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg mb-2">Your watchlist is empty</p>
          <p className="text-sm">
            Click the star icon on any market card to add it to your watchlist
          </p>
          <Link href="/">
            <Button className="mt-4">Browse Markets</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground mb-4">
            {markets.length} market{markets.length !== 1 ? "s" : ""} in your
            watchlist
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {markets.map((market) => (
              <MarketCard
                key={`${market.platform}-${market.id}`}
                market={market}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
