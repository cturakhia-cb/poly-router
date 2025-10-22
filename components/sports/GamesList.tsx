"use client"

import { useEffect, useState } from "react";
import { api } from "@/lib/clientFetch";
import { Game, GamesListResponse } from "@/types/sports";
import { GameCard } from "./GameCard";
import { Skeleton } from "@/components/ui/skeleton";

export function GamesList() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: GamesListResponse = await api("/api/polyrouter/sports/games?league=nfl&limit=10");
        const gamesList = response.data?.games || response.games || [];
        setGames(gamesList);
      } catch (err: any) {
        setError(err.message || "Failed to load games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
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

  if (games.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No games available at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <GameCard key={game.polyrouter_id} game={game} />
      ))}
    </div>
  );
}
