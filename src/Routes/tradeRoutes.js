const express = require('express');
const router = express.Router();
const tradeController = require('../Controllers/tradeController');
const { authenticate } = require('../Middlewares/verify');

// All routes require authentication
router.use(authenticate);

// POST /api/trades - Create a new trade
router.post('/', tradeController.createTrade.bind(tradeController));

// GET /api/trades - Get all trades for the logged-in user
router.get('/', tradeController.getUserTrades.bind(tradeController));

// GET /api/trades/dashboard - Get dashboard statistics
router.get('/dashboard', tradeController.getDashboardStats.bind(tradeController));

// GET /api/trades/:id - Get a single trade by ID
router.get('/:id', tradeController.getTradeById.bind(tradeController));

// PUT /api/trades/:id - Update a trade
router.put('/:id', tradeController.updateTrade.bind(tradeController));

// DELETE /api/trades/:id - Delete a trade
router.delete('/:id', tradeController.deleteTrade.bind(tradeController));

module.exports = router;
