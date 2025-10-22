"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Market } from "@/types/market";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { PlaceOrderDialog } from "@/components/trade/PlaceOrderDialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const [showTradeDialog, setShowTradeDialog] = useState(false);
  
  const yesPrice = market.current_prices?.yes?.price || 0;
  const noPrice = market.current_prices?.no?.price || 0;
  const priceChange = market.price_change_24h || 0;
  const isPolymarket = market.platform?.toLowerCase() === "polymarket";

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base line-clamp-2">
              {market.title}
            </CardTitle>
            <Badge variant="secondary" className="shrink-0">
              {market.platform}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">YES</div>
              <div className="text-2xl font-bold text-green-500">
                {(yesPrice * 100).toFixed(1)}%
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">NO</div>
              <div className="text-2xl font-bold text-red-500">
                {(noPrice * 100).toFixed(1)}%
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
              <span className={priceChange > 0 ? "text-green-500" : "text-red-500"}>
                {priceChange > 0 ? "+" : ""}{(priceChange * 100).toFixed(2)}%
              </span>
              <span className="text-muted-foreground">24h</span>
            </div>
          )}

          {market.volume && (
            <div className="text-sm text-muted-foreground">
              Volume: ${market.volume.toLocaleString()}
            </div>
          )}

          <div className="flex gap-2 pt-2">
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
