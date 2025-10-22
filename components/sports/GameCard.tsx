"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Game } from "@/types/sports";
import { ChevronRight } from "lucide-react";
import { GameMarkets } from "./GameMarkets";

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
            <CardTitle className="text-lg">
              {game.away_team.name} @ {game.home_team.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              {isLive && <Badge variant="destructive">LIVE</Badge>}
              {game.tournament && (
                <Badge variant="outline">{game.tournament.name}</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                {gameDate.toLocaleDateString()} {gameDate.toLocaleTimeString()}
              </div>
              {(game.home_score !== undefined || game.away_score !== undefined) && (
                <div className="text-lg font-semibold">
                  {game.away_team.abbreviation} {game.away_score} - {game.home_score} {game.home_team.abbreviation}
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
