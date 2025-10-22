"use client"

import { useState, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const updateSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== (searchParams.get("search") || "")) {
        updateSearch(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, searchParams, updateSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search markets across platforms..."
        className="pl-10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
