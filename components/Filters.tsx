"use client"

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
  );
}
