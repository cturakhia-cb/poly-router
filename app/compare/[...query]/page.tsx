"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/clientFetch";
import { Market, MarketsResponse } from "@/types/market";
import { MarketCard } from "@/components/MarketCard";
import { Skeleton } from "@/components/ui/skeleton";
import { groupSimilarMarkets, normalizeText } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ComparePage() {
  const params = useParams();
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryStr = Array.isArray(params.query)
    ? params.query.join(" ")
    : params.query || "";

  useEffect(() => {
    const fetchMarkets = async () => {
      setLoading(true);
      setError(null);

      try {
        const searchQuery = queryStr.replace(/-/g, " ");
        const data: MarketsResponse = await api(
          `/api/polyrouter/search?query=${encodeURIComponent(
            searchQuery
          )}&limit=100`
        );
        setMarkets(data.markets || []);
      } catch (err: any) {
        setError(err.message || "Failed to load markets for comparison");
      } finally {
        setLoading(false);
      }
    };

    if (queryStr) {
      fetchMarkets();
    }
  }, [queryStr]);

  const groupedMarkets = groupSimilarMarkets(markets, 0.3);
  const topGroups = groupedMarkets
    .filter((group) => group.length > 1)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
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

  if (topGroups.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Button>
        </Link>
        <div className="p-8 text-center text-muted-foreground">
          <p>No similar markets found for "{queryStr.replace(/-/g, " ")}"</p>
          <p className="text-sm mt-2">
            Try a different search or browse all markets.
          </p>
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
        <h1 className="text-4xl font-bold mb-2">Compare Markets</h1>
        <p className="text-muted-foreground">
          Similar markets for: {queryStr.replace(/-/g, " ")}
        </p>
      </div>

      <div className="space-y-8">
        {topGroups.map((group, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="text-xl">
                Group {idx + 1} ({group.length} markets)
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {group[0].title}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.map((market) => (
                  <MarketCard
                    key={`${market.platform}-${market.id}`}
                    market={market}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {markets.length > 0 && topGroups.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Search Results</CardTitle>
            <p className="text-sm text-muted-foreground">
              No similar markets found, showing all results
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {markets.slice(0, 12).map((market) => (
                <MarketCard
                  key={`${market.platform}-${market.id}`}
                  market={market}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
