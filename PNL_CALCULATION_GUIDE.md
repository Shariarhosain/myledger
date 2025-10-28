# P&L Calculation Reference

## ✅ Fixed P&L Calculation Formula

### Formula:
```javascript
// Long Trade
pointDifference = exitPrice - entryPrice
P&L = pointDifference × quantity × pointValue

// Short Trade
pointDifference = entryPrice - exitPrice
P&L = pointDifference × quantity × pointValue
```

---

## 📊 Point Values by Ticker

| Ticker | Contract Name         | Point Value | Type    |
|--------|-----------------------|-------------|---------|
| **NQ** | Nasdaq 100 E-mini     | **$20**     | Regular |
| **ES** | S&P 500 E-mini        | **$50**     | Regular |
| **YM** | Dow Jones E-mini      | **$5**      | Regular |
| **MNQ**| Nasdaq 100 Micro      | **$2**      | Micro   |
| **MES**| S&P 500 Micro         | **$5**      | Micro   |
| **MYM**| Dow Jones Micro       | **$0.5**    | Micro   |

---

## 🧮 Example Calculations

### Example 1: NQ Long (WIN) ✅
```
Entry:    16,000
Exit:     16,100
Quantity: 2
Ticker:   NQ (Point Value = $20)

Point Difference = 16,100 - 16,000 = 100 points
P&L = 100 × 2 × $20 = $4,000 profit ✅
```

### Example 2: YM Short (WIN) ✅
```
Entry:    38,000
Exit:     37,900
Quantity: 2
Ticker:   YM (Point Value = $5)

Point Difference = 38,000 - 37,900 = 100 points
P&L = 100 × 2 × $5 = $1,000 profit ✅
```

### Example 3: NQ Long (LOSS) ❌
```
Entry:    16,000
Exit:     15,950
Quantity: 1
Ticker:   NQ (Point Value = $20)

Point Difference = 15,950 - 16,000 = -50 points
P&L = -50 × 1 × $20 = -$1,000 loss ❌
```

### Example 4: ES Short (LOSS) ❌
```
Entry:    4,500
Exit:     4,520
Quantity: 1
Ticker:   ES (Point Value = $50)

Point Difference = 4,500 - 4,520 = -20 points
P&L = -20 × 1 × $50 = -$1,000 loss ❌
```

### Example 5: MNQ Long (Micro Contract) ✅
```
Entry:    16,000
Exit:     16,050
Quantity: 5
Ticker:   MNQ (Point Value = $2)

Point Difference = 16,050 - 16,000 = 50 points
P&L = 50 × 5 × $2 = $500 profit ✅
```

### Example 6: MES Short (Micro Contract) ✅
```
Entry:    4,500
Exit:     4,480
Quantity: 10
Ticker:   MES (Point Value = $5)

Point Difference = 4,500 - 4,480 = 20 points
P&L = 20 × 10 × $5 = $1,000 profit ✅
```

---

## 📝 Code Implementation

```javascript
// Get point value for ticker
getPointValue(ticker) {
  const pointValues = {
    'NQ': 20,    // Nasdaq 100 E-mini
    'ES': 50,    // S&P 500 E-mini
    'YM': 5,     // Dow Jones E-mini
    'MNQ': 2,    // Nasdaq 100 Micro
    'MES': 5,    // S&P 500 Micro
    'MYM': 0.5,  // Dow Jones Micro
  };
  return pointValues[ticker.toUpperCase()] || 1;
}

// Calculate P&L
calculatePnL(direction, entryPrice, exitPrice, quantity, ticker) {
  let pointDifference = 0;
  
  if (direction === 'Long') {
    pointDifference = exitPrice - entryPrice;
  } else if (direction === 'Short') {
    pointDifference = entryPrice - exitPrice;
  }
  
  const pointValue = this.getPointValue(ticker);
  const pnl = pointDifference * quantity * pointValue;
  
  return parseFloat(pnl.toFixed(2));
}
```

---

## 🎯 Quick Reference Table

### Long Position P&L:

| Entry  | Exit   | Points | Qty | Ticker | Point Value | P&L        |
|--------|--------|--------|-----|--------|-------------|------------|
| 16,000 | 16,100 | +100   | 1   | NQ     | $20         | +$2,000 ✅ |
| 16,000 | 16,100 | +100   | 2   | NQ     | $20         | +$4,000 ✅ |
| 16,000 | 15,950 | -50    | 1   | NQ     | $20         | -$1,000 ❌ |
| 4,500  | 4,520  | +20    | 1   | ES     | $50         | +$1,000 ✅ |
| 38,000 | 38,050 | +50    | 2   | YM     | $5          | +$500 ✅   |

### Short Position P&L:

| Entry  | Exit   | Points | Qty | Ticker | Point Value | P&L        |
|--------|--------|--------|-----|--------|-------------|------------|
| 16,000 | 15,950 | +50    | 1   | NQ     | $20         | +$1,000 ✅ |
| 16,000 | 16,100 | -100   | 1   | NQ     | $20         | -$2,000 ❌ |
| 4,500  | 4,480  | +20    | 1   | ES     | $50         | +$1,000 ✅ |
| 38,000 | 38,100 | -100   | 1   | YM     | $5          | -$500 ❌   |

---

## ✅ All Fixed!

The backend now correctly calculates P&L using:
1. ✅ Point difference calculation
2. ✅ Correct ticker point values
3. ✅ Quantity multiplier
4. ✅ Direction-based logic (Long vs Short)

Test with your dashboard to verify! 🚀
