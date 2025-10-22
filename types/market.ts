export interface Market {
  id: string;
  platform: string;
  title: string;
  description?: string;
  current_prices: {
    yes: { price: number };
    no: { price: number };
  };
  volume?: number;
  volume_24h?: number;
  price_change_24h?: number;
  liquidity?: number;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  category?: string;
  status?: string;
  url?: string;
  event_id?: string;
  series_id?: string;
}

export interface MarketsResponse {
  markets: Market[];
  count?: number;
  next?: string;
  previous?: string;
}

export interface MarketDetails extends Market {
  outcomes?: Array<{
    name: string;
    price: number;
    volume?: number;
  }>;
  resolution?: string;
  resolved_at?: string;
}

export interface SearchResult {
  markets: Market[];
  total?: number;
}
