"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Market } from "@/types/market";
import {
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Star,
  BarChart3,
} from "lucide-react";
import { PlaceOrderDialog } from "@/components/trade/PlaceOrderDialog";
import { useState, useEffect } from "react";
import {
  cn,
  formatPercent,
  formatCurrency,
  formatRelativeTime,
  normalizeText,
  clampPrice,
} from "@/lib/utils";
import { toggleWatchlist, isInWatchlist } from "@/lib/watchlist";
import Link from "next/link";

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const [showTradeDialog, setShowTradeDialog] = useState(false);
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    setWatched(isInWatchlist(market.platform, market.id));
  }, [market.platform, market.id]);

  const yesPrice = clampPrice(market.current_prices?.yes?.price);
  const noPrice = clampPrice(market.current_prices?.no?.price);
  const priceChange = market.price_change_24h || 0;
  const isPolymarket = market.platform?.toLowerCase() === "polymarket";

  const handleToggleWatch = () => {
    const newState = toggleWatchlist(market);
    setWatched(newState);
  };

  // Create compare link from normalized keywords
  const keywords = normalizeText(market.title).split(" ").slice(0, 5).join("-");
  const compareLink = `/compare/${keywords}`;

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base line-clamp-2">
              {market.title}
            </CardTitle>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleToggleWatch}
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    watched && "fill-yellow-400 text-yellow-400"
                  )}
                />
              </Button>
              <Badge variant="secondary">{market.platform}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">YES</div>
              <div className="text-2xl font-bold text-green-500">
                {formatPercent(yesPrice)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">NO</div>
              <div className="text-2xl font-bold text-red-500">
                {formatPercent(noPrice)}
              </div>
            </div>
          </div>

          {priceChange !== 0 && (
            <div className="flex items-center gap-1 text-sm">
              {priceChange > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={priceChange > 0 ? "text-green-500" : "text-red-500"}
              >
                {priceChange > 0 ? "+" : ""}
                {(priceChange * 100).toFixed(2)}%
              </span>
              <span className="text-muted-foreground">24h</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {market.volume && <span>Vol: {formatCurrency(market.volume)}</span>}
            {market.updated_at && (
              <span className="text-xs">
                {formatRelativeTime(market.updated_at)}
              </span>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Link
              href={compareLink}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                "h-9 px-3 flex-1"
              )}
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Compare
            </Link>
          </div>
          <div className="flex gap-2">
            {isPolymarket && (
              <Button
                size="sm"
                variant="default"
                className="flex-1"
                onClick={() => setShowTradeDialog(true)}
              >
                Trade
              </Button>
            )}
            {market.url && (
              <a
                href={market.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                  "h-9 px-3",
                  isPolymarket ? "flex-1" : "w-full"
                )}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      <PlaceOrderDialog
        market={market}
        open={showTradeDialog}
        onOpenChange={setShowTradeDialog}
      />
    </>
  );
}
