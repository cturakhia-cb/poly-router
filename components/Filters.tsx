"use client";

import { Select } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const PLATFORMS = [
  { value: "all", label: "All Platforms" },
  { value: "polymarket", label: "Polymarket" },
  { value: "kalshi", label: "Kalshi" },
  { value: "manifold", label: "Manifold" },
  { value: "limitless", label: "Limitless" },
  { value: "prophetx", label: "ProphetX" },
  { value: "novig", label: "Novig" },
  { value: "sxbet", label: "SX.bet" },
];

const LIMITS = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
];

const TIME_FILTERS = [
  { value: "all", label: "All Time" },
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "newest", label: "Newest First" },
];

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "volume", label: "Volume (High to Low)" },
  { value: "liquidity", label: "Liquidity (High to Low)" },
  { value: "change", label: "24h Change (High to Low)" },
  { value: "change-low", label: "24h Change (Low to High)" },
];

const STATUS_FILTERS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
  { value: "resolved", label: "Resolved" },
];

export function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Platform:</label>
          <Select
            value={searchParams.get("platform") || "all"}
            onChange={(e) => updateParam("platform", e.target.value)}
          >
            {PLATFORMS.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Status:</label>
          <Select
            value={searchParams.get("status") || "all"}
            onChange={(e) => updateParam("status", e.target.value)}
          >
            {STATUS_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Time:</label>
          <Select
            value={searchParams.get("timeFilter") || "all"}
            onChange={(e) => updateParam("timeFilter", e.target.value)}
          >
            {TIME_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort:</label>
          <Select
            value={searchParams.get("sort") || "default"}
            onChange={(e) => updateParam("sort", e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Limit:</label>
          <Select
            value={searchParams.get("limit") || "25"}
            onChange={(e) => updateParam("limit", e.target.value)}
          >
            {LIMITS.map((limit) => (
              <option key={limit.value} value={limit.value}>
                {limit.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
