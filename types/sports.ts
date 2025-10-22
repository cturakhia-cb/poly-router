export interface Team {
  id?: string;
  name: string;
  abbreviation?: string;
  logo_url?: string;
  conference?: string;
  division?: string;
}

export interface League {
  id: string;
  name: string;
  sport: string;
  teams?: Team[];
}

export interface Game {
  polyrouter_id: string;
  prophetx_event_id?: number;
  title: string;
  away_team: Team;
  home_team: Team;
  scheduled_at: string;
  status: string;
  tournament?: {
    id: number;
    name: string;
  };
  sport?: string;
  home_score?: number;
  away_score?: number;
  week?: number;
  season?: number;
}

export interface GameMarket {
  platform: string;
  market_type: string;
  title: string;
  odds: {
    [key: string]: number;
  };
  url?: string;
  market_id?: string;
}

export interface GamesListResponse {
  data?: {
    games: Game[];
  };
  games?: Game[];
  count?: number;
}

export interface GameMarketsResponse {
  game?: Game;
  data?: {
    markets: GameMarket[];
  };
  markets?: GameMarket[];
}
