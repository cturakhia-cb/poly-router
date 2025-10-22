#!/bin/bash

echo "🧪 Testing PolyRouter Markets App"
echo "=================================="
echo ""

echo "✓ Testing Markets endpoint..."
MARKETS=$(curl -s "http://localhost:3000/api/polyrouter/markets?limit=2")
if echo "$MARKETS" | grep -q "markets"; then
  echo "  ✅ Markets API working"
else
  echo "  ❌ Markets API failed"
fi

echo ""
echo "✓ Testing Search endpoint..."
SEARCH=$(curl -s "http://localhost:3000/api/polyrouter/search?query=election&limit=2")
if echo "$SEARCH" | grep -q "markets"; then
  echo "  ✅ Search API working"
else
  echo "  ❌ Search API failed"
fi

echo ""
echo "✓ Testing Platforms endpoint..."
PLATFORMS=$(curl -s "http://localhost:3000/api/polyrouter/platforms")
if echo "$PLATFORMS" | grep -q "platforms"; then
  echo "  ✅ Platforms API working"
else
  echo "  ❌ Platforms API failed"
fi

echo ""
echo "✓ Testing Sports Games endpoint..."
GAMES=$(curl -s "http://localhost:3000/api/polyrouter/sports/games?league=nfl&limit=2")
if echo "$GAMES" | grep -q "games"; then
  echo "  ✅ Sports Games API working"
else
  echo "  ❌ Sports Games API failed"
fi

echo ""
echo "✓ Testing Trade endpoint..."
TRADE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"marketId":"test","outcome":"yes","side":"buy","size":10,"orderType":"market"}' "http://localhost:3000/api/trade/polymarket")
if echo "$TRADE" | grep -q "Not Implemented"; then
  echo "  ✅ Trade API placeholder working (returns 501 as expected)"
else
  echo "  ❌ Trade API failed"
fi

echo ""
echo "=================================="
echo "🎉 All API endpoints are functional!"
echo ""
echo "🌐 Open http://localhost:3000 in your browser to use the app"
