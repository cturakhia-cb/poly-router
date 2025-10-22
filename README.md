# PolyRouter Markets

A modern web application that aggregates prediction market data from multiple platforms using the PolyRouter API.

## Features

- 📊 **Real-time Markets**: View markets across 7 platforms (Polymarket, Kalshi, Manifold, Limitless, ProphetX, Novig, SX.bet)
- 🏈 **Sports Betting**: NFL game markets with odds from multiple platforms
- 🔍 **Global Search**: Search markets across all platforms
- 🎨 **Modern UI**: Clean design with dark mode support
- 📝 **API Logging**: In-app request logger for debugging
- 💱 **Trade Placeholder**: UI for Polymarket trading (backend implementation coming soon)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom shadcn/ui components
- **Icons**: Lucide React
- **API**: PolyRouter

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd polyrouter-markets
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
POLYROUTER_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `POLYROUTER_API_KEY`: Your PolyRouter API key (required)

**Important**: Never commit your `.env.local` file or expose your API key in client-side code. The API key is only used in server-side API routes.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── polyrouter/      # Proxy routes for PolyRouter API
│   │   │   ├── markets/
│   │   │   ├── search/
│   │   │   ├── platforms/
│   │   │   └── sports/
│   │   └── trade/           # Trading endpoint (placeholder)
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Main page with tabs
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── sports/              # Sports-specific components
│   ├── trade/               # Trading dialog component
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   ├── Filters.tsx
│   ├── MarketCard.tsx
│   ├── MarketsGrid.tsx
│   └── LogDrawer.tsx
├── lib/
│   ├── polyrouter.ts        # Server-side API wrapper
│   ├── clientFetch.ts       # Client-side fetch with logging
│   └── utils.ts             # Utility functions
└── types/
    ├── market.ts
    ├── sports.ts
    ├── platform.ts
    └── trade.ts
```

## API Routes

All PolyRouter API calls are proxied through Next.js API routes to keep the API key secure:

- `GET /api/polyrouter/markets` - Fetch markets
- `GET /api/polyrouter/search` - Search markets
- `GET /api/polyrouter/platforms` - Get platform info
- `GET /api/polyrouter/sports/leagues` - Get league information
- `GET /api/polyrouter/sports/games` - List available games
- `GET /api/polyrouter/sports/game-markets` - Get markets for a specific game
- `POST /api/trade/polymarket` - Place order (not implemented, returns 501)

## Deploying to Vercel

### Method 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variable:
```bash
vercel env add POLYROUTER_API_KEY
```

### Method 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable:
   - Key: `POLYROUTER_API_KEY`
   - Value: Your PolyRouter API key
6. Click "Deploy"

### Method 3: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add environment variables under "Environment Variables"
6. Deploy

## Features to Implement

### Trading Integration (Future)

To enable actual trading on Polymarket:

1. Install wallet libraries:
```bash
npm install wagmi viem @wagmi/core
```

2. Integrate wallet connection (MetaMask, WalletConnect, etc.)
3. Implement Polymarket CLOB authentication
4. Complete the `lib/trading/polymarket.ts` implementation
5. Update the trade API route to handle real orders

### Additional Features

- [ ] Price history charts
- [ ] Market detail pages
- [ ] User watchlists
- [ ] Email/push notifications
- [ ] More sports leagues (NBA, MLB, NHL)
- [ ] Advanced filters and sorting
- [ ] Portfolio tracking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub or contact the PolyRouter team.
