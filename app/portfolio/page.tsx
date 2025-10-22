"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/clientFetch";
import { Market, MarketsResponse } from "@/types/market";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getWatchlist } from "@/lib/watchlist";
import { formatPercent, formatCurrency, clampPrice } from "@/lib/utils";
import { TrendingUp, TrendingDown, Briefcase, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Position {
  market: Market;
  shares: number;
  avgPrice: number;
  currentValue: number;
  costBasis: number;
  pnl: number;
  pnlPercent: number;
}

export default function PortfolioPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      setError(null);

      try {
        const watchlist = getWatchlist();

        if (watchlist.length === 0) {
          setPositions([]);
          setLoading(false);
          return;
        }

        // Fetch markets for watchlist
        const data: MarketsResponse = await api(
          `/api/polyrouter/markets?limit=100`
        );

        const watchedMarkets = (data.markets || []).filter((market) =>
          watchlist.some(
            (item) =>
              item.platform === market.platform && item.marketId === market.id
          )
        );

        // Create mock positions (in production, this would come from a real portfolio API)
        const mockPositions: Position[] = watchedMarkets.map((market) => {
          const currentPrice = clampPrice(market.current_prices?.yes?.price);
          const shares = 100; // Mock: 100 shares
          const avgPrice = Math.max(
            0.3,
            currentPrice - (Math.random() * 0.2 - 0.1)
          ); // Mock avg price
          const costBasis = shares * avgPrice;
          const currentValue = shares * currentPrice;
          const pnl = currentValue - costBasis;
          const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

          return {
            market,
            shares,
            avgPrice,
            currentValue,
            costBasis,
            pnl,
            pnlPercent,
          };
        });

        setPositions(mockPositions);
      } catch (err: any) {
        setError(err.message || "Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();

    // Refresh every 30 seconds
    const interval = setInterval(fetchPortfolio, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalCost = positions.reduce((sum, pos) => sum + pos.costBasis, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
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
          <Briefcase className="h-8 w-8" />
          <h1 className="text-4xl font-bold">Portfolio</h1>
        </div>
        <p className="text-muted-foreground">
          Track your positions and P&L (Demo mode - showing mock data)
        </p>
      </div>

      {positions.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-lg mb-2">No positions yet</p>
          <p className="text-sm">
            Add markets to your watchlist to see mock positions here
          </p>
          <Link href="/">
            <Button className="mt-4">Browse Markets</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Summary Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Portfolio Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Total Value
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalValue)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">
                    Cost Basis
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalCost)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total P&L</div>
                  <div
                    className={`text-2xl font-bold ${
                      totalPnl >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {totalPnl >= 0 ? "+" : ""}
                    {formatCurrency(totalPnl)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">P&L %</div>
                  <div
                    className={`text-2xl font-bold flex items-center gap-2 ${
                      totalPnlPercent >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {totalPnlPercent >= 0 ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                    {totalPnlPercent >= 0 ? "+" : ""}
                    {totalPnlPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Positions */}
          <div className="space-y-4">
            {positions.map((position, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">
                          {position.market.platform}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        {position.market.title}
                      </CardTitle>
                    </div>
                    <div
                      className={`text-right ${
                        position.pnl >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      <div className="text-xl font-bold">
                        {position.pnl >= 0 ? "+" : ""}
                        {formatCurrency(position.pnl)}
                      </div>
                      <div className="text-sm">
                        {position.pnlPercent >= 0 ? "+" : ""}
                        {position.pnlPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Shares</div>
                      <div className="font-semibold">{position.shares}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Avg Price</div>
                      <div className="font-semibold">
                        {formatPercent(position.avgPrice)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Current Price</div>
                      <div className="font-semibold">
                        {formatPercent(
                          clampPrice(position.market.current_prices?.yes?.price)
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Cost Basis</div>
                      <div className="font-semibold">
                        {formatCurrency(position.costBasis)}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Current Value</div>
                      <div className="font-semibold">
                        {formatCurrency(position.currentValue)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
