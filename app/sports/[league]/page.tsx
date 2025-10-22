"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/clientFetch";
import { Game, GamesListResponse } from "@/types/sports";
import { GameCard } from "@/components/sports/GameCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SportsLeaguePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const league = params.league as string;

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: GamesListResponse = await api(
          `/api/polyrouter/sports/games?league=${league}&limit=100`
        );
        const gamesList = response.data?.games || response.games || [];
        setGames(gamesList);
      } catch (err: any) {
        setError(err.message || "Failed to load games");
      } finally {
        setLoading(false);
      }
    };

    if (league) {
      fetchGames();
    }
  }, [league]);

  useEffect(() => {
    const liveOnly = searchParams.get("live") === "true";
    const dateFilter = searchParams.get("date") || "all";

    let filtered = [...games];

    // Filter by live status
    if (liveOnly) {
      filtered = filtered.filter(
        (game) => game.status === "live" || game.status === "in_progress"
      );
    }

    // Filter by date
    const now = new Date();
    if (dateFilter === "today") {
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      filtered = filtered.filter((game) => {
        const gameDate = new Date(game.scheduled_at);
        return gameDate >= startOfDay && gameDate < endOfDay;
      });
    } else if (dateFilter === "week") {
      const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter((game) => {
        const gameDate = new Date(game.scheduled_at);
        return gameDate >= now && gameDate <= weekAhead;
      });
    } else if (dateFilter === "upcoming") {
      filtered = filtered.filter((game) => new Date(game.scheduled_at) >= now);
    }

    setFilteredGames(filtered);
  }, [games, searchParams]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all" && value !== "false") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/sports/${league}?${params.toString()}`);
  };

  const liveGamesCount = games.filter(
    (g) => g.status === "live" || g.status === "in_progress"
  ).length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
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
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold capitalize">{league} Games</h1>
          {liveGamesCount > 0 && (
            <Badge variant="destructive" className="text-base px-3 py-1">
              {liveGamesCount} LIVE
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          View betting markets for {league.toUpperCase()} games
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-6 p-4 border rounded-lg bg-card">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Date:</label>
          <Select
            value={searchParams.get("date") || "all"}
            onChange={(e) => updateParam("date", e.target.value)}
          >
            <option value="all">All Games</option>
            <option value="today">Today</option>
            <option value="week">Next 7 Days</option>
            <option value="upcoming">Upcoming</option>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Status:</label>
          <Select
            value={searchParams.get("live") === "true" ? "live" : "all"}
            onChange={(e) =>
              updateParam("live", e.target.value === "live" ? "true" : "false")
            }
          >
            <option value="all">All</option>
            <option value="live">Live Only</option>
          </Select>
        </div>
      </div>

      {filteredGames.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="text-lg mb-2">No games found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredGames.length} game
            {filteredGames.length !== 1 ? "s" : ""}
          </div>
          <div className="space-y-4">
            {filteredGames.map((game) => (
              <GameCard key={game.polyrouter_id} game={game} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
