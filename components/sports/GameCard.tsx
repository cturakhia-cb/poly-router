"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Game } from "@/types/sports";
import { ChevronRight } from "lucide-react";
import { GameMarkets } from "./GameMarkets";
import Image from "next/image";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const [showMarkets, setShowMarkets] = useState(false);

  const gameDate = new Date(game.scheduled_at);
  const isLive = game.status === "live" || game.status === "in_progress";
  const isPast = gameDate < new Date() && !isLive;

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {game.away_team.logo_url && (
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src={game.away_team.logo_url}
                      alt={game.away_team.name}
                      fill
                      className="object-contain rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <span className="font-medium truncate">
                  {game.away_team.abbreviation || game.away_team.name}
                </span>
              </div>
              <span className="text-muted-foreground">@</span>
              <div className="flex items-center gap-2">
                {game.home_team.logo_url && (
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src={game.home_team.logo_url}
                      alt={game.home_team.name}
                      fill
                      className="object-contain rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <span className="font-medium truncate">
                  {game.home_team.abbreviation || game.home_team.name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isLive && <Badge variant="destructive">LIVE</Badge>}
              {game.tournament && (
                <Badge variant="outline" className="hidden sm:inline-flex">
                  {game.tournament.name}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div
                className="text-sm text-muted-foreground"
                title={gameDate.toISOString()}
              >
                {gameDate.toLocaleDateString()}{" "}
                {gameDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {(game.home_score !== undefined ||
                game.away_score !== undefined) && (
                <div className="text-lg font-semibold">
                  {game.away_team.abbreviation || game.away_team.name}{" "}
                  {game.away_score} - {game.home_score}{" "}
                  {game.home_team.abbreviation || game.home_team.name}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMarkets(true)}
            >
              View Markets
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <GameMarkets
        game={game}
        open={showMarkets}
        onOpenChange={setShowMarkets}
      />
    </>
  );
}
