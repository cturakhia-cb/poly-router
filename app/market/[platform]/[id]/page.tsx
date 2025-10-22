"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/clientFetch";
import { Market, MarketsResponse } from "@/types/market";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Star,
} from "lucide-react";
import Link from "next/link";
import {
  formatPercent,
  formatCurrency,
  formatRelativeTime,
  clampPrice,
} from "@/lib/utils";
import { toggleWatchlist, isInWatchlist } from "@/lib/watchlist";
import { PlaceOrderDialog } from "@/components/trade/PlaceOrderDialog";

export default function MarketDetailPage() {
  const params = useParams();
  const [market, setMarket] = useState<Market | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watched, setWatched] = useState(false);
  const [showTradeDialog, setShowTradeDialog] = useState(false);

  const platform = params.platform as string;
  const id = params.id as string;

  useEffect(() => {
    const fetchMarket = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch markets and find the specific one
        const data: MarketsResponse = await api(
          `/api/polyrouter/markets?platform=${platform}&limit=100`
        );

        const foundMarket = data.markets?.find(
          (m) =>
            m.id === id && m.platform.toLowerCase() === platform.toLowerCase()
        );

        if (!foundMarket) {
          setError("Market not found");
        } else {
          setMarket(foundMarket);
          setWatched(isInWatchlist(foundMarket.platform, foundMarket.id));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load market");
      } finally {
        setLoading(false);
      }
    };

    if (platform && id) {
      fetchMarket();
    }
  }, [platform, id]);

  const handleToggleWatch = () => {
    if (market) {
      const newState = toggleWatchlist(market);
      setWatched(newState);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !market) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Button>
        </Link>
        <div className="p-8 text-center">
          <p className="text-destructive">{error || "Market not found"}</p>
        </div>
      </div>
    );
  }

  const yesPrice = clampPrice(market.current_prices?.yes?.price);
  const noPrice = clampPrice(market.current_prices?.no?.price);
  const priceChange = market.price_change_24h || 0;
  const isPolymarket = market.platform?.toLowerCase() === "polymarket";

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Markets
        </Button>
      </Link>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {market.platform}
                  </Badge>
                  {market.status && (
                    <Badge variant="outline">{market.status}</Badge>
                  )}
                  {market.category && (
                    <Badge variant="outline">{market.category}</Badge>
                  )}
                </div>
                <CardTitle className="text-3xl mb-2">{market.title}</CardTitle>
                {market.description && (
                  <p className="text-muted-foreground">{market.description}</p>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={handleToggleWatch}>
                <Star
                  className={watched ? "fill-yellow-400 text-yellow-400" : ""}
                />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Prices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">YES</div>
                <div className="text-5xl font-bold text-green-500">
                  {formatPercent(yesPrice)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">NO</div>
                <div className="text-5xl font-bold text-red-500">
                  {formatPercent(noPrice)}
                </div>
              </div>
            </div>

            {/* 24h Change */}
            {priceChange !== 0 && (
              <div className="flex items-center gap-2">
                {priceChange > 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                <span
                  className={`text-lg font-semibold ${
                    priceChange > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {priceChange > 0 ? "+" : ""}
                  {(priceChange * 100).toFixed(2)}%
                </span>
                <span className="text-muted-foreground">24h change</span>
              </div>
            )}

            {/* Market Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
              {market.volume && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Volume</div>
                  <div className="text-xl font-semibold">
                    {formatCurrency(market.volume)}
                  </div>
                </div>
              )}
              {market.volume_24h && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    24h Volume
                  </div>
                  <div className="text-xl font-semibold">
                    {formatCurrency(market.volume_24h)}
                  </div>
                </div>
              )}
              {market.liquidity && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Liquidity</div>
                  <div className="text-xl font-semibold">
                    {formatCurrency(market.liquidity)}
                  </div>
                </div>
              )}
              {market.end_date && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">End Date</div>
                  <div className="text-sm font-medium">
                    {new Date(market.end_date).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-4 border-t">
              {market.created_at && (
                <span>Created {formatRelativeTime(market.created_at)}</span>
              )}
              {market.updated_at && (
                <span>Updated {formatRelativeTime(market.updated_at)}</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              {isPolymarket && (
                <Button size="lg" onClick={() => setShowTradeDialog(true)}>
                  Trade on Polymarket
                </Button>
              )}
              {market.url && (
                <a href={market.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on {market.platform}
                  </Button>
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Price History Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded">
              <div className="text-center">
                <p className="mb-2">Price chart coming soon</p>
                <p className="text-sm">
                  Historical price data will be displayed here
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <PlaceOrderDialog
        market={market}
        open={showTradeDialog}
        onOpenChange={setShowTradeDialog}
      />
    </div>
  );
}
