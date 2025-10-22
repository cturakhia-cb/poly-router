"use client"

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Game, GameMarket, GameMarketsResponse } from "@/types/sports";
import { api } from "@/lib/clientFetch";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GameMarketsProps {
  game: Game;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameMarkets({ game, open, onOpenChange }: GameMarketsProps) {
  const [markets, setMarkets] = useState<GameMarket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !game.polyrouter_id) return;

    const fetchMarkets = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: GameMarketsResponse = await api(
          `/api/polyrouter/sports/game-markets?game_id=${game.polyrouter_id}`
        );
        const marketsList = response.data?.markets || response.markets || [];
        setMarkets(marketsList);
      } catch (err: any) {
        setError(err.message || "Failed to load markets");
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, [open, game.polyrouter_id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {game.away_team.name} @ {game.home_team.name}
          </DialogTitle>
          <DialogDescription>
            Markets available across platforms
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && markets.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No markets available for this game.
          </div>
        )}

        {!loading && !error && markets.length > 0 && (
          <div className="space-y-3">
            {markets.map((market, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 space-y-2 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{market.platform}</Badge>
                      <span className="text-sm font-medium">{market.market_type}</span>
                    </div>
                    <p className="text-sm">{market.title}</p>
                  </div>
                  {market.url && (
                    <a
                      href={market.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "hover:bg-accent hover:text-accent-foreground",
                        "h-9 px-3"
                      )}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                
                {market.odds && Object.keys(market.odds).length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {Object.entries(market.odds).map(([outcome, odd]) => (
                      <div key={outcome} className="flex justify-between">
                        <span className="text-muted-foreground">{outcome}:</span>
                        <span className="font-semibold">
                          {typeof odd === "number" ? (odd * 100).toFixed(1) + "%" : odd}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
