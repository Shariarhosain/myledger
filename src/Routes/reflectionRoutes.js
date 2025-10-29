const express = require('express');
const router = express.Router();
const reflectionController = require('../Controllers/reflectionController');
const { authenticate } = require('../Middlewares/verify');

// All routes require authentication
router.use(authenticate);

// POST /api/reflections - Create a new reflection
router.post('/', reflectionController.createReflection.bind(reflectionController));

// GET /api/reflections - Get all reflections for the logged-in user
router.get('/', reflectionController.getUserReflections.bind(reflectionController));

// GET /api/reflections/stats - Get reflection statistics
router.get('/stats', reflectionController.getReflectionStats.bind(reflectionController));

// GET /api/reflections/rotation-state - Get prompt rotation state
router.get('/rotation-state', reflectionController.getRotationState.bind(reflectionController));

// PUT /api/reflections/rotation-state - Update rotation state
router.put('/rotation-state', reflectionController.updateRotationState.bind(reflectionController));

// GET /api/reflections/:id - Get a single reflection by ID
router.get('/:id', reflectionController.getReflectionById.bind(reflectionController));

// PUT /api/reflections/:id - Update a reflection
router.put('/:id', reflectionController.updateReflection.bind(reflectionController));

// DELETE /api/reflections/:id - Delete a reflection
router.delete('/:id', reflectionController.deleteReflection.bind(reflectionController));

module.exports = router;
