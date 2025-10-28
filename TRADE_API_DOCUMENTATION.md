# Trade API Documentation

## Overview
Complete trading system API with CRUD operations and dashboard analytics.

**Base URL**: `http://localhost:5000/api/trades`

**Authentication**: All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## API Endpoints

### 1. Create Trade (POST)
**Endpoint**: `POST /api/trades`

**Description**: Create a new trade entry

**Request Body**:
```json
{
  "date": "2025-10-28",
  "time": "09:30:00",
  "ticker": "NQ",
  "direction": "Long",
  "entryPrice": 16000,
  "exitPrice": 16100,
  "stopLoss": 15950,
  "takeProfit": 16150,
  "quantity": 1,
  "notes": "Strong breakout pattern"
}
```

**Required Fields**:
- `date` (string): Date of the trade
- `time` (string): Time of the trade (HH:MM:SS format)
- `ticker` (string): Ticker symbol (e.g., "NQ", "ES")
- `direction` (string): Either "Long" or "Short"
- `entryPrice` (number): Entry price
- `exitPrice` (number): Exit price

**Optional Fields**:
- `stopLoss` (number): Stop loss price (optional)
- `takeProfit` (number): Take profit price (optional)
- `quantity` (number): Number of contracts (default: 1)
- `notes` (string): Additional notes about the trade

**Notes**:
- `period` (AM/PM) is automatically calculated from `time`
- `pnl` is automatically calculated based on direction, entry/exit prices, and quantity
- `direction` must be either "Long" or "Short"

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Trade created successfully",
  "data": {
    "id": "uuid-here",
    "userId": "user-uuid",
    "date": "2025-10-28",
    "time": "09:30:00",
    "period": "AM",
    "ticker": "NQ",
    "direction": "Long",
    "entryPrice": 16000,
    "exitPrice": 16100,
    "stopLoss": 15950,
    "takeProfit": 16150,
    "quantity": 1,
    "notes": "Strong breakout pattern",
    "pnl": 100,
    "createdAt": "2025-10-28T09:30:00.000Z",
    "updatedAt": "2025-10-28T09:30:00.000Z"
  }
}
```

---

### 2. Get All Trades (GET)
**Endpoint**: `GET /api/trades`

**Description**: Retrieve all trades for the authenticated user with pagination

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Examples**:
- `GET /api/trades` - Get first page with 10 items
- `GET /api/trades?page=2&limit=20` - Get page 2 with 20 items per page
- `GET /api/trades?limit=50` - Get first page with 50 items

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Trades retrieved successfully",
  "data": [
    {
      "id": "uuid-1",
      "userId": "user-uuid",
      "date": "2025-10-28",
      "time": "09:30:00",
      "period": "AM",
      "ticker": "NQ",
      "direction": "Long",
      "entryPrice": 16000,
      "exitPrice": 16100,
      "stopLoss": 15950,
      "takeProfit": 16150,
      "quantity": 1,
      "notes": "Strong breakout",
      "pnl": 2000,
      "createdAt": "2025-10-28T09:30:00.000Z",
      "updatedAt": "2025-10-28T09:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "limit": 10,
    "totalCount": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Pagination Fields**:
- `currentPage`: Current page number
- `limit`: Items per page
- `totalCount`: Total number of trades
- `totalPages`: Total number of pages
- `hasNextPage`: `true` if there are more pages, `false` if last page
- `hasPreviousPage`: `true` if not on first page, `false` if on first page

---

### 3. Get Single Trade (GET)
**Endpoint**: `GET /api/trades/:id`

**Description**: Retrieve a specific trade by ID

**URL Parameters**:
- `id`: Trade UUID

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Trade retrieved successfully",
  "data": {
    "id": "uuid-here",
    "userId": "user-uuid",
    "date": "2025-10-28",
    "time": "09:30:00",
    "period": "AM",
    "ticker": "NQ",
    "direction": "Long",
    "entryPrice": 16000,
    "exitPrice": 16100,
    "stopLoss": 15950,
    "takeProfit": 16150,
    "quantity": 1,
    "notes": "Strong breakout",
    "pnl": 100,
    "createdAt": "2025-10-28T09:30:00.000Z",
    "updatedAt": "2025-10-28T09:30:00.000Z"
  }
}
```

---

### 4. Update Trade (PUT)
**Endpoint**: `PUT /api/trades/:id`

**Description**: Update an existing trade

**URL Parameters**:
- `id`: Trade UUID

**Request Body** (all fields optional):
```json
{
  "date": "2025-10-28",
  "time": "10:00:00",
  "ticker": "ES",
  "direction": "Short",
  "entryPrice": 16100,
  "exitPrice": 16050,
  "stopLoss": 16150,
  "takeProfit": 16000,
  "quantity": 2,
  "notes": "Updated notes"
}
```

**Notes**:
- Only send fields you want to update
- `period` is recalculated if `time` is updated
- `pnl` is recalculated if price or quantity fields are updated

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Trade updated successfully",
  "data": {
    "id": "uuid-here",
    "userId": "user-uuid",
    "date": "2025-10-28",
    "time": "10:00:00",
    "period": "AM",
    "ticker": "ES",
    "direction": "Short",
    "entryPrice": 16100,
    "exitPrice": 16050,
    "stopLoss": 16150,
    "takeProfit": 16000,
    "quantity": 2,
    "notes": "Updated notes",
    "pnl": 100,
    "createdAt": "2025-10-28T09:30:00.000Z",
    "updatedAt": "2025-10-28T10:05:00.000Z"
  }
}
```

---

### 5. Delete Trade (DELETE)
**Endpoint**: `DELETE /api/trades/:id`

**Description**: Delete a trade

**URL Parameters**:
- `id`: Trade UUID

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Trade deleted successfully"
}
```

---

### 6. Get Dashboard Statistics (GET) ⭐
**Endpoint**: `GET /api/trades/dashboard`

**Description**: Get comprehensive dashboard analytics including win rate, profit stats, equity curve, and profit by direction

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "winRate": 42.86,
    "totalProfit": 6000.0,
    "avgWinProfit": 3000.0,
    "totalTrades": 7,
    "winningTrades": 3,
    "losingTrades": 4,
    "equityCurve": [
      {
        "tradeId": "000",
        "balance": 10000
      },
      {
        "tradeId": "001",
        "balance": 13500,
        "pnl": 3500
      },
      {
        "tradeId": "002",
        "balance": 13200,
        "pnl": -300
      },
      {
        "tradeId": "003",
        "balance": 12000,
        "pnl": -1200
      },
      {
        "tradeId": "004",
        "balance": 13500,
        "pnl": 1500
      },
      {
        "tradeId": "005",
        "balance": 18000,
        "pnl": 4500
      },
      {
        "tradeId": "006",
        "balance": 17500,
        "pnl": -500
      },
      {
        "tradeId": "007",
        "balance": 16000,
        "pnl": -1500
      }
    ],
    "profitByDirection": {
      "long": {
        "wins": 2,
        "losses": 2,
        "totalPnL": 5500.0,
        "winRate": 50.0,
        "totalTrades": 4
      },
      "short": {
        "wins": 1,
        "losses": 2,
        "totalPnL": 700.0,
        "winRate": 33.33,
        "totalTrades": 3
      }
    }
  }
}
```

**Dashboard Metrics Explained**:

1. **Win Rate**: Percentage of profitable trades
   - Formula: `(winningTrades / totalTrades) × 100`
   - Example: `(3 / 7) × 100 = 42.9%`

2. **Total Profit**: Sum of all P&L
   - Formula: `sum of all trade.pnl`
   - Example: `$3500 + (-$300) + (-$1200) + ... = $3500`

3. **Avg Win Profit**: Average profit from winning trades only
   - Formula: `sum of positive pnl / number of winning trades`
   - Example: `($3500 + $1500 + $4500) / 3 = $3166.67`

4. **Equity Curve**: Account balance progression over time
   - Starting balance: $10,000 (default)
   - Each point shows cumulative balance after each trade

5. **Profit by Direction**: Performance breakdown by Long/Short
   - **Long**: Stats for all Long positions
   - **Short**: Stats for all Short positions
   - Each includes: wins, losses, total P&L, win rate

---

## P&L Calculation Logic

### Point Values by Ticker

| Ticker | Name                  | Point Value | Contract Type |
|--------|-----------------------|-------------|---------------|
| NQ     | Nasdaq 100 E-mini     | $20/point   | Regular       |
| ES     | S&P 500 E-mini        | $50/point   | Regular       |
| YM     | Dow Jones E-mini      | $5/point    | Regular       |
| MNQ    | Nasdaq 100 Micro      | $2/point    | Micro         |
| MES    | S&P 500 Micro         | $5/point    | Micro         |
| MYM    | Dow Jones Micro       | $0.5/point  | Micro         |

### For Long Positions:
```javascript
pointDifference = exitPrice - entryPrice
P&L = pointDifference × quantity × pointValue
```

**Example (NQ Long)**:
- Entry: 16,000
- Exit: 16,100
- Quantity: 2
- Point Value: $20
- Point Difference = 16,100 - 16,000 = 100 points
- P&L = 100 × 2 × $20 = **$4,000 profit** ✅

### For Short Positions:
```javascript
pointDifference = entryPrice - exitPrice
P&L = pointDifference × quantity × pointValue
```

**Example (YM Short)**:
- Entry: 38,000
- Exit: 37,900
- Quantity: 2
- Point Value: $5
- Point Difference = 38,000 - 37,900 = 100 points
- P&L = 100 × 2 × $5 = **$1,000 profit** ✅

### Loss Examples

**Long Loss (NQ)**:
- Entry: 16,000
- Exit: 15,950
- Quantity: 1
- Point Difference = 15,950 - 16,000 = -50 points
- P&L = -50 × 1 × $20 = **-$1,000 loss** ❌

**Short Loss (ES)**:
- Entry: 4,500
- Exit: 4,520
- Quantity: 1
- Point Difference = 4,500 - 4,520 = -20 points
- P&L = -20 × 1 × $50 = **-$1,000 loss** ❌

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "date is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Trade not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error message details"
}
```

---

## Testing with Postman/Thunder Client

### Example: Create a Trade
```bash
POST http://localhost:5000/api/trades
Headers:
  Authorization: Bearer your_jwt_token_here
  Content-Type: application/json

Body:
{
  "date": "2025-10-28",
  "time": "09:30:00",
  "ticker": "NQ",
  "direction": "Long",
  "entryPrice": 16000,
  "exitPrice": 16100,
  "stopLoss": 15950,
  "takeProfit": 16150,
  "quantity": 1,
  "notes": "Test trade"
}
```

### Example: Get Dashboard
```bash
GET http://localhost:5000/api/trades/dashboard
Headers:
  Authorization: Bearer your_jwt_token_here
```

---

## Database Schema

```prisma
model Trade {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date        String
  time        String
  period      String   // AM or PM (auto-calculated)
  ticker      String   // e.g., 'NQ', 'ES'
  direction   String   // 'Long' or 'Short'
  entryPrice  Float
  exitPrice   Float
  stopLoss    Float?   // Optional
  takeProfit  Float?   // Optional
  quantity    Int      @default(1)
  notes       String?
  pnl         Float    // Profit and Loss (auto-calculated)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@map("trades")
}
```

---

## Notes
- All trades are user-specific (filtered by authenticated user ID)
- Timestamps are automatically managed by Prisma
- P&L and period calculations are handled automatically by the backend
- Dashboard endpoint provides all analytics in a single API call
- All price values should be in decimal format
- Quantity must be a positive integer
