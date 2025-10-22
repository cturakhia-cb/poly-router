export interface Platform {
  id: string;
  name: string;
  type: "market" | "sports" | "both";
  features: {
    markets?: boolean;
    sports?: boolean;
    price_history?: boolean;
    real_time?: boolean;
  };
  health_status: "operational" | "degraded" | "down";
  id_format?: string;
  base_url?: string;
}

export interface PlatformsResponse {
  platforms: Platform[];
}
