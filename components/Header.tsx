"use client";

import { Moon, Sun, Activity, Star, Briefcase } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            <span className="font-bold text-lg">PolyRouter</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/watchlist">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2",
                  pathname === "/watchlist" && "bg-accent"
                )}
              >
                <Star className="h-4 w-4" />
                Watchlist
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2",
                  pathname === "/portfolio" && "bg-accent"
                )}
              >
                <Briefcase className="h-4 w-4" />
                Portfolio
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex-1 max-w-xl mx-6">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
