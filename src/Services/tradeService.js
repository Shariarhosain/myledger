const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TradeService {
  // Helper function to calculate period (AM/PM) from time
  calculatePeriod(time) {
    const hour = parseInt(time.split(':')[0]);
    return hour >= 12 ? 'PM' : 'AM';
  }

  // Helper function to get point value for ticker
  getPointValue(ticker) {
    const pointValues = {
      'NQ': 20,    // Nasdaq 100 E-mini
      'ES': 50,    // S&P 500 E-mini
      'YM': 5,     // Dow Jones E-mini
      'MNQ': 2,    // Nasdaq 100 Micro
      'MES': 5,    // S&P 500 Micro
      'MYM': 0.5,  // Dow Jones Micro
      'GC': 10,    // Gold
      'MGC': 1,    // Micro Gold
    };
    return pointValues[ticker.toUpperCase()] || 1; // Default to 1 if ticker not found
  }

  // Helper function to calculate P&L
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

  // Create a new trade
  async createTrade(userId, tradeData) {
    const { date, time, ticker, direction, entryPrice, exitPrice, stopLoss, takeProfit, quantity, notes } = tradeData;

    // Auto-calculate period from time
    const period = this.calculatePeriod(time);

    // Calculate P&L
    const pnl = this.calculatePnL(
      direction,
      parseFloat(entryPrice),
      parseFloat(exitPrice),
      parseInt(quantity),
      ticker
    );

    const trade = await prisma.trade.create({
      data: {
        userId,
        date,
        time,
        period,
        ticker,
        direction,
        entryPrice: parseFloat(entryPrice),
        exitPrice: parseFloat(exitPrice),
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        takeProfit: takeProfit ? parseFloat(takeProfit) : null,
        quantity: parseInt(quantity),
        notes: notes || '',
        pnl,
      },
    });

    return trade;
  }

  // Get all trades for a user
  async getUserTrades(userId, pagination) {
    const { page, limit } = pagination;

    // Get total count
    const totalCount = await prisma.trade.count({
      where: { userId },
    });

    // Get trades with pagination
    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      trades,
      pagination: {
        currentPage: page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  // Get a single trade by ID
  async getTradeById(tradeId, userId) {
    const trade = await prisma.trade.findFirst({
      where: {
        id: tradeId,
        userId,
      },
    });

    return trade;
  }

  // Update a trade
  async updateTrade(tradeId, userId, updateData) {
    // Check if trade exists and belongs to user
    const existingTrade = await this.getTradeById(tradeId, userId);
    if (!existingTrade) {
      return null;
    }

    const { date, time, ticker, direction, entryPrice, exitPrice, stopLoss, takeProfit, quantity, notes } = updateData;

    // Prepare update data
    const dataToUpdate = {};

    if (date) dataToUpdate.date = date;
    if (time) {
      dataToUpdate.time = time;
      dataToUpdate.period = this.calculatePeriod(time);
    }
    if (ticker) dataToUpdate.ticker = ticker;
    if (direction) dataToUpdate.direction = direction;
    if (entryPrice !== undefined) dataToUpdate.entryPrice = parseFloat(entryPrice);
    if (exitPrice !== undefined) dataToUpdate.exitPrice = parseFloat(exitPrice);
    if (stopLoss !== undefined) dataToUpdate.stopLoss = stopLoss ? parseFloat(stopLoss) : null;
    if (takeProfit !== undefined) dataToUpdate.takeProfit = takeProfit ? parseFloat(takeProfit) : null;
    if (quantity !== undefined) dataToUpdate.quantity = parseInt(quantity);
    if (notes !== undefined) dataToUpdate.notes = notes;

    // Recalculate P&L if price or quantity changed
    const finalDirection = direction || existingTrade.direction;
    const finalEntryPrice = entryPrice !== undefined ? parseFloat(entryPrice) : existingTrade.entryPrice;
    const finalExitPrice = exitPrice !== undefined ? parseFloat(exitPrice) : existingTrade.exitPrice;
    const finalQuantity = quantity !== undefined ? parseInt(quantity) : existingTrade.quantity;
    const finalTicker = ticker || existingTrade.ticker;

    dataToUpdate.pnl = this.calculatePnL(finalDirection, finalEntryPrice, finalExitPrice, finalQuantity, finalTicker);

    const updatedTrade = await prisma.trade.update({
      where: { id: tradeId },
      data: dataToUpdate,
    });

    return updatedTrade;
  }

  // Delete a trade
  async deleteTrade(tradeId, userId) {
    // Check if trade exists and belongs to user
    const existingTrade = await this.getTradeById(tradeId, userId);
    if (!existingTrade) {
      return null;
    }

    await prisma.trade.delete({
      where: { id: tradeId },
    });

    return true;
  }

  // Get dashboard statistics
  async getDashboardStats(userId) {
    // Get all trades without pagination for dashboard stats
    const allTrades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (allTrades.length === 0) {
      return {
        winRate: 0,
        totalProfit: 0,
        avgWinProfit: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        equityCurve: [],
        profitByDirection: {
          long: { wins: 0, losses: 0, totalPnL: 0, winRate: 0, totalTrades: 0 },
          short: { wins: 0, losses: 0, totalPnL: 0, winRate: 0, totalTrades: 0 },
        },
      };
    }

    // Calculate Win Rate
    const winningTrades = allTrades.filter((t) => t.pnl > 0);
    const losingTrades = allTrades.filter((t) => t.pnl <= 0);
    const winRate = (winningTrades.length / allTrades.length) * 100;

    // Calculate Total Profit
    const totalProfit = allTrades.reduce((sum, t) => sum + t.pnl, 0);

    // Calculate Average Win Profit (only positive P&L)
    const avgWinProfit = winningTrades.length > 0
      ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length
      : 0;

    // Calculate Equity Curve (reverse chronological order for oldest to newest)
    const startingBalance = 10000; // Default starting balance
    let currentBalance = startingBalance;
    const equityCurve = [
      { tradeId: '000', balance: startingBalance },
    ];

    // Create a copy and reverse it for equity curve calculation (oldest first)
    const tradesChronological = [...allTrades].reverse();
    
    tradesChronological.forEach((trade, index) => {
      currentBalance += trade.pnl;
      equityCurve.push({
        tradeId: String(index + 1).padStart(3, '0'),
        balance: parseFloat(currentBalance.toFixed(2)),
        pnl: parseFloat(trade.pnl.toFixed(2)),
      });
    });

    // Calculate Profit by Direction (use original trades array)
    const longTrades = allTrades.filter((t) => t.direction === 'Long');
    const shortTrades = allTrades.filter((t) => t.direction === 'Short');

    const longStats = {
      wins: longTrades.filter((t) => t.pnl > 0).length,
      losses: longTrades.filter((t) => t.pnl <= 0).length,
      totalPnL: longTrades.reduce((sum, t) => sum + t.pnl, 0),
    };
    longStats.winRate = longTrades.length > 0
      ? (longStats.wins / longTrades.length) * 100
      : 0;

    const shortStats = {
      wins: shortTrades.filter((t) => t.pnl > 0).length,
      losses: shortTrades.filter((t) => t.pnl <= 0).length,
      totalPnL: shortTrades.reduce((sum, t) => sum + t.pnl, 0),
    };
    shortStats.winRate = shortTrades.length > 0
      ? (shortStats.wins / shortTrades.length) * 100
      : 0;

    return {
      winRate: parseFloat(winRate.toFixed(2)),
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      avgWinProfit: parseFloat(avgWinProfit.toFixed(2)),
      totalTrades: allTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      equityCurve,
      profitByDirection: {
        long: {
          wins: longStats.wins,
          losses: longStats.losses,
          totalPnL: parseFloat(longStats.totalPnL.toFixed(2)),
          winRate: parseFloat(longStats.winRate.toFixed(2)),
          totalTrades: longTrades.length,
        },
        short: {
          wins: shortStats.wins,
          losses: shortStats.losses,
          totalPnL: parseFloat(shortStats.totalPnL.toFixed(2)),
          winRate: parseFloat(shortStats.winRate.toFixed(2)),
          totalTrades: shortTrades.length,
        },
      },
    };
  }
}

module.exports = new TradeService();
