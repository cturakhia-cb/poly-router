"use client"

import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filters } from "@/components/Filters";
import { MarketsGrid } from "@/components/MarketsGrid";
import { GamesList } from "@/components/sports/GamesList";
import { LogDrawer } from "@/components/LogDrawer";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Prediction Markets</h1>
          <p className="text-muted-foreground">
            Real-time market data across 7 platforms
          </p>
        </div>

        <Tabs defaultValue="markets" className="w-full">
          <TabsList>
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
          </TabsList>

          <TabsContent value="markets" className="space-y-6">
            <Suspense fallback={<div className="h-10" />}>
              <Filters />
            </Suspense>
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            }>
              <MarketsGrid />
            </Suspense>
          </TabsContent>

          <TabsContent value="sports" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">NFL Games</h2>
              <p className="text-sm text-muted-foreground">
                View betting markets across multiple platforms for upcoming NFL games
              </p>
            </div>
            <GamesList />
          </TabsContent>
        </Tabs>
      </div>

      <LogDrawer />
    </div>
  );
}
