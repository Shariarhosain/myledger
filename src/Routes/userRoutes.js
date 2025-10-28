const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { authenticate } = require('../Middlewares/verify');

// All routes require authentication
router.use(authenticate);

// Get current user profile
router.get('/profile', userController.getCurrentUser);

// CRUD operations
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
