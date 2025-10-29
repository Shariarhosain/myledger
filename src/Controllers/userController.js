const userService = require('../Services/userService');
const { ApiError } = require('../utils/error');

class UserController {
  // Get all users
  async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await userService.getAllUsers(page, limit);
      
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);
      
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user (profile)
  async getCurrentUser(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user
  async updateUser(req, res, next) {
    try {
      const id = req.user.id;
      const updateData = req.body;

      // If profile picture is uploaded, add the URL to updateData
      if (req.file) {
        const baseUrl = process.env.BASE_URL || 'https://backend-therellwalker.mtscorporate.com';
        updateData.profilePic = `${baseUrl}/uploads/profiles/${req.file.filename}`;
      }

      const user = await userService.updateUser(id, updateData);
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete user
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // Users can only delete their own profile unless they're admin
      if (req.user.id !== id) {
        throw new ApiError(403, 'You can only delete your own profile');
      }

      const result = await userService.deleteUser(id);
      
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
