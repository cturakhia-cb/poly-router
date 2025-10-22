# PolyRouter Feature Guide

## Quick Reference for New Features

### 🔍 Enhanced Market Discovery

#### Sorting & Filtering

**Location:** Home page → Markets tab

**New Options:**

- **Sort by:** Volume, Liquidity, 24h Change (↑↓)
- **Status:** Active, Closed, Resolved
- Combines with existing Platform and Time filters

**Usage:**

1. Select filters from dropdowns
2. Markets update instantly
3. Scroll down for infinite loading

---

#### Compare Markets

**Location:** Any market card → "Compare" button

**How it works:**

1. Click "Compare" on any market
2. See similar markets across platforms grouped together
3. Compare prices, volume, and platforms side-by-side

**Use cases:**

- Find arbitrage opportunities
- See which platform has best liquidity
- Compare odds across bookmakers

---

#### Market Detail Pages

**Location:** Click market title or use URL: `/market/[platform]/[id]`

**Features:**

- Full market stats (volume, liquidity, 24h change)
- Large price display
- Created/updated timestamps
- Direct trade button (when supported)
- Price history chart (placeholder for future)

---

### ⭐ Watchlist System

#### Adding Markets

1. Click the **star icon** on any market card
2. Star turns yellow when added
3. Data saved to browser (localStorage)

#### Viewing Watchlist

**Location:** Header → "Watchlist" or `/watchlist`

**Features:**

- Live price updates (every 30 seconds)
- All your starred markets in one place
- Works across sessions (persisted)
- Click star again to remove

**Tip:** Watchlist feeds into Portfolio and Alerts

---

### 📊 Portfolio Tracking

**Location:** Header → "Portfolio" or `/portfolio`

**What it shows (Demo mode):**

- Total portfolio value
- Cost basis and P&L
- Individual positions with gains/losses
- Mock data: 100 shares per watched market

**Coming soon:**

- Real position tracking via wallet integration
- Trade history
- Performance charts

**Note:** Currently displays mock positions based on your watchlist to demonstrate the UI. Real portfolio requires authentication.

---

### 🔔 Price Alerts

**Location:** Automatic on Watchlist page

**How it works:**

1. Add markets to watchlist
2. System monitors price changes every 30 seconds
3. Toast notifications appear when thresholds met

**Alert Types:**

- Price above/below threshold
- 24h change above/below threshold

**Future:** Email/SMS notifications, custom alert rules UI

**Note:** Alerts are client-side and won't work across devices. Server-side alerts coming soon.

---

### 🏈 Sports Features

#### Team Logos

- Automatically shown on game cards
- 32x32px, rounded corners
- Fallback: hides if image fails

#### Sports League Pages

**URL:** `/sports/nfl` (or other leagues)

**Filters:**

- **Date:** Today, Next 7 Days, Upcoming, All
- **Status:** All, Live Only
- Live badge shows count of active games

**Navigation:** Home → Sports tab → Select game → View Markets

---

### 🎯 Navigation Shortcuts

**Header Links:**

- **PolyRouter** logo → Home
- **Watchlist** → Your starred markets
- **Portfolio** → Position tracking
- **Search bar** → Quick market search
- **Theme toggle** → Light/Dark mode

**Back buttons:** All detail pages have "← Back" navigation

---

### 🛠️ Trading System

#### Place Order Dialog

**Trigger:** Click "Trade" on Polymarket markets

**Current Status:**

- UI ready and functional
- Shows platform-specific form
- Validates orders
- Wallet integration pending

**Coming soon:** Live trading with wallet connection

#### Supported Platforms (Future)

- ✅ Polymarket (UI ready)
- ⏳ Kalshi (planned)
- ⏳ Manifold (planned)
- ⏳ Others (extensible)

---

### 💡 Tips & Tricks

1. **Find similar markets fast:**

   - Use Compare button on any market
   - Groups similar topics automatically

2. **Track favorites efficiently:**

   - Star all markets you care about
   - Visit Watchlist for quick overview
   - Alerts notify you of changes

3. **Discover new sports betting markets:**

   - Go to Sports tab
   - Filter by "Live Only" for active games
   - Click "View Markets" to see all platforms

4. **Sort for opportunities:**

   - Sort by "24h Change" to find movers
   - Sort by "Volume" for liquid markets
   - Sort by "Liquidity" for tight spreads

5. **Infinite scroll:**
   - Just keep scrolling down
   - New markets load automatically
   - All filters remain active

---

### 🎨 Visual Cues

**Icons:**

- ⭐ Yellow star = In watchlist
- 🔔 Bell = Alerts active
- 💼 Briefcase = Portfolio
- 📊 Bar chart = Compare
- 🔗 External link = View on platform
- 🔴 "LIVE" badge = Game in progress
- 📈/📉 Trend arrows = Price movement

**Colors:**

- 🟢 Green = YES price, positive change, profit
- 🔴 Red = NO price, negative change, loss
- 🟡 Yellow = Watchlist stars
- 🔵 Blue = Platform badges

---

### 📱 Responsive Design

**Desktop:**

- Full navigation in header
- 3-column grid for markets
- Side-by-side comparisons

**Tablet:**

- 2-column grid
- Collapsed navigation
- Tournament badges hidden

**Mobile:**

- Single column
- Condensed headers
- Essential info only

---

### 🔒 Data & Privacy

**What's stored locally:**

- Watchlist (market IDs + titles)
- Alert rules and history
- Theme preference

**Not stored:**

- No personal data
- No passwords
- No wallet keys

**Future:** Optional cloud sync with account

---

### 🐛 Troubleshooting

**Watchlist not saving?**

- Check browser allows localStorage
- Clear site data and re-add

**Team logos not showing?**

- Images loaded from external sources
- Some teams may not have logos in API

**Alerts not working?**

- Must have Watchlist page open
- Client-side polling only
- Check browser allows notifications

**Infinite scroll stuck?**

- Try refreshing page
- Check if you've reached the limit
- Verify filters aren't too restrictive

---

### 🚀 Keyboard Shortcuts (Future)

Planned shortcuts:

- `S` - Focus search
- `W` - Go to watchlist
- `P` - Go to portfolio
- `C` - Compare selected market
- `?` - Show help

---

### 📞 Support & Feedback

Found a bug or have a suggestion?

- Check `IMPLEMENTATION_SUMMARY.md` for known limitations
- Review `PROJECT_SUMMARY.md` for architecture
- Submit issues via your preferred channel

---

### 🎓 Learning Resources

**Key Concepts:**

- **Prediction Markets:** Binary outcome betting
- **Yes/No Prices:** Represent probability (0-1 or 0%-100%)
- **Liquidity:** How easy to buy/sell
- **Volume:** Total trading activity
- **Arbitrage:** Price differences across platforms

**Platform Links:**

- Polymarket: https://polymarket.com
- Kalshi: https://kalshi.com
- Manifold: https://manifold.markets

---

### ✨ What's Next?

**Coming Soon:**

- Real-time WebSocket updates
- Advanced charting
- Custom alert rules UI
- Portfolio analytics
- Mobile app
- API access

Stay tuned! 🚀
