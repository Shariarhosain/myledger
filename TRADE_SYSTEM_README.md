# 📊 Trading System - Complete Guide

## Overview
A comprehensive trading journal and analytics system with automatic P&L calculation, dashboard statistics, and performance tracking.

## Features

### ✅ Core Features
- **Trade Management**: Full CRUD operations for trades
- **Automatic Calculations**: 
  - Auto-calculate AM/PM period from time
  - Auto-calculate P&L based on direction and prices
- **Dashboard Analytics**: Comprehensive statistics in one API call
  - Win Rate
  - Total Profit
  - Average Win Profit
  - Equity Curve
  - Profit by Direction (Long/Short)

### 🎯 Trade Tracking
- Date and time logging
- Ticker symbol (NQ, ES, etc.)
- Direction (Long/Short)
- Entry/Exit prices
- Stop Loss/Take Profit levels
- Quantity/Contracts
- Trade notes

### 📈 Dashboard Metrics
1. **Win Rate**: Percentage of profitable trades
2. **Total Profit**: Cumulative P&L across all trades
3. **Avg Win Profit**: Average profit from winning trades only
4. **Equity Curve**: Account balance progression over time
5. **Profit by Direction**: Separate stats for Long and Short positions

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trades` | Create a new trade |
| GET | `/api/trades` | Get all user trades |
| GET | `/api/trades/:id` | Get single trade |
| PUT | `/api/trades/:id` | Update a trade |
| DELETE | `/api/trades/:id` | Delete a trade |
| GET | `/api/trades/dashboard` | Get dashboard statistics ⭐ |

## Quick Start

### 1. Database Migration
```bash
cd "d:\Office\mern\client work\therellwalker_backend"
npx prisma migrate dev
```

### 2. Start Server
```bash
npm start
# or
npm run dev
```

### 3. Test API
Use the provided Thunder Client collection: `trade-api-collection.json`

## Example Usage

### Create a Trade
```javascript
POST /api/trades
Headers: {
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
Body: {
  "date": "2025-10-28",
  "time": "09:30:00",
  "ticker": "NQ",
  "direction": "Long",
  "entryPrice": 16000,
  "exitPrice": 16100,
  "stopLoss": 15950,
  "takeProfit": 16150,
  "quantity": 1,
  "notes": "Strong breakout"
}
```

### Get Dashboard
```javascript
GET /api/trades/dashboard
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}

Response: {
  "success": true,
  "data": {
    "winRate": 50.0,
    "totalProfit": 3500.0,
    "avgWinProfit": 2500.0,
    "totalTrades": 7,
    "winningTrades": 3,
    "losingTrades": 4,
    "equityCurve": [...],
    "profitByDirection": {
      "long": {
        "wins": 2,
        "losses": 2,
        "totalPnL": 5500.0,
        "winRate": 50.0
      },
      "short": {
        "wins": 1,
        "losses": 2,
        "totalPnL": 250.0,
        "winRate": 33.33
      }
    }
  }
}
```

## P&L Calculation

### Long Position
```
P&L = (Exit Price - Entry Price) × Quantity
```
**Example**: Entry $16,000, Exit $16,100, Qty 1 = **$100 profit**

### Short Position
```
P&L = (Entry Price - Exit Price) × Quantity
```
**Example**: Entry $16,000, Exit $15,900, Qty 1 = **$100 profit**

## Dashboard Calculations

### Win Rate
```javascript
winRate = (winningTrades / totalTrades) × 100
```

### Total Profit
```javascript
totalProfit = sum of all trade.pnl
```

### Avg Win Profit
```javascript
avgWinProfit = sum of positive pnl / number of wins
```

### Equity Curve
- Starting Balance: $10,000
- Each point: Previous Balance + Trade P&L

### Profit by Direction
Separate tracking for Long and Short positions:
- Wins count
- Losses count
- Total P&L
- Win Rate

## File Structure

```
src/
├── Controllers/
│   └── tradeController.js      # Request handling
├── Services/
│   └── tradeService.js          # Business logic
├── Routes/
│   └── tradeRoutes.js           # Route definitions
└── app.js                        # Main app (updated)

prisma/
├── schema.prisma                 # Database schema (updated)
└── migrations/
    └── 20251028100952_add_trade_model/
        └── migration.sql

Docs/
├── TRADE_API_DOCUMENTATION.md    # Complete API docs
├── TRADE_SYSTEM_README.md        # This file
└── trade-api-collection.json     # Thunder Client collection
```

## Database Schema

```prisma
model Trade {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  date        String
  time        String
  period      String   // AM or PM
  ticker      String
  direction   String   // Long or Short
  entryPrice  Float
  exitPrice   Float
  stopLoss    Float
  takeProfit  Float
  quantity    Int
  notes       String?
  pnl         Float    // Auto-calculated
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Authentication

All trade endpoints require JWT authentication:
```javascript
Authorization: Bearer <your_jwt_token>
```

Get token from:
- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/google`

## Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Server Error

## Testing Scenarios

### 1. Create Multiple Trades
Use the sample requests in Thunder Client collection:
- Long Win
- Long Loss
- Short Win
- Short Loss
- Multiple Contracts
- PM Period

### 2. Verify Dashboard
After creating 5-7 trades, check dashboard to see:
- Calculated win rate
- Equity curve progression
- Direction-based performance

### 3. Update Trade
- Change exit price
- Update notes
- Verify P&L recalculation

### 4. Delete Trade
- Remove a trade
- Check dashboard updates

## Best Practices

1. **Always provide accurate data**:
   - Correct date/time format
   - Valid ticker symbols
   - Realistic prices

2. **Use notes field**:
   - Document trade setup
   - Record lessons learned
   - Track patterns

3. **Review dashboard regularly**:
   - Monitor win rate
   - Track equity curve
   - Analyze direction performance

4. **Keep quantity accurate**:
   - Record actual contracts traded
   - P&L scales with quantity

## Troubleshooting

### "Trade not found"
- Verify trade ID is correct
- Check if trade belongs to authenticated user

### "Invalid direction"
- Must be exactly "Long" or "Short" (case-sensitive)

### Wrong P&L calculation
- Verify entry/exit prices
- Check direction is correct
- Ensure quantity is accurate

### Dashboard shows 0%
- Create at least one trade first
- Ensure trades have valid P&L

## Future Enhancements

Potential additions:
- [ ] Date range filtering
- [ ] Export to CSV
- [ ] Risk/Reward ratio tracking
- [ ] Trade tags/categories
- [ ] Multi-ticker performance
- [ ] Monthly/Weekly reports
- [ ] Risk management metrics
- [ ] Trade images upload

## Support

For issues or questions:
1. Check `TRADE_API_DOCUMENTATION.md`
2. Review Thunder Client collection examples
3. Check server logs for errors

## License

Part of Therellwalker Backend System
© 2025 MTS Corporate

---

**Happy Trading! 📈**
