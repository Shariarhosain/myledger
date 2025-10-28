const tradeService = require('../Services/tradeService');
const { ApiError } = require('../utils/error');

class TradeController {
  // Create a new trade
  async createTrade(req, res, next) {
    try {
      const userId = req.user.id; // From JWT middleware
      const tradeData = req.body;

      // Validate required fields
      const requiredFields = ['date', 'time', 'ticker', 'direction', 'entryPrice', 'exitPrice'];
      for (const field of requiredFields) {
        if (!tradeData[field]) {
          throw new ApiError(400, `${field} is required`);
        }
      }

      // Validate direction
      if (!['Long', 'Short'].includes(tradeData.direction)) {
        throw new ApiError(400, 'Direction must be either "Long" or "Short"');
      }

      const trade = await tradeService.createTrade(userId, tradeData);

      res.status(201).json({
        success: true,
        message: 'Trade created successfully',
        data: trade,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all trades for the logged-in user
  async getUserTrades(req, res, next) {
    try {
      const userId = req.user.id;
      //pagination
      const { page = 1, limit = 10 } = req.query;
      const pagination = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };

      const result = await tradeService.getUserTrades(userId, pagination);

      res.status(200).json({
        success: true,
        message: 'Trades retrieved successfully',
        data: result.trades,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get a single trade by ID
  async getTradeById(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const trade = await tradeService.getTradeById(id, userId);

      if (!trade) {
        throw new ApiError(404, 'Trade not found');
      }

      res.status(200).json({
        success: true,
        message: 'Trade retrieved successfully',
        data: trade,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update a trade
  async updateTrade(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = req.body;

      // Validate direction if provided
      if (updateData.direction && !['Long', 'Short'].includes(updateData.direction)) {
        throw new ApiError(400, 'Direction must be either "Long" or "Short"');
      }

      const updatedTrade = await tradeService.updateTrade(id, userId, updateData);

      if (!updatedTrade) {
        throw new ApiError(404, 'Trade not found');
      }

      res.status(200).json({
        success: true,
        message: 'Trade updated successfully',
        data: updatedTrade,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete a trade
  async deleteTrade(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await tradeService.deleteTrade(id, userId);

      if (!result) {
        throw new ApiError(404, 'Trade not found');
      }

      res.status(200).json({
        success: true,
        message: 'Trade deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Get dashboard statistics
  async getDashboardStats(req, res, next) {
    try {
      const userId = req.user.id;

      const stats = await tradeService.getDashboardStats(userId);

      res.status(200).json({
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TradeController();
