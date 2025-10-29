const reflectionService = require('../Services/reflectionService');
const { ApiError } = require('../utils/error');

class ReflectionController {
  // Create a new reflection
  async createReflection(req, res, next) {
    try {
      const userId = req.user.id; // From JWT middleware
      const reflectionData = req.body;

      // Validate required fields
      const requiredFields = ['date', 'prompt', 'group', 'answer'];
      for (const field of requiredFields) {
        if (!reflectionData[field]) {
          throw new ApiError(400, `${field} is required`);
        }
      }

      const reflection = await reflectionService.createReflection(userId, reflectionData);

      res.status(201).json({
        success: true,
        message: 'Reflection created successfully',
        data: reflection,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all reflections for the logged-in user
  async getUserReflections(req, res, next) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10000 } = req.query; // Higher default limit for reflections
      const pagination = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      };

      const result = await reflectionService.getUserReflections(userId, pagination);

      res.status(200).json({
        success: true,
        data: result.reflections,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get a single reflection by ID
  async getReflectionById(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const reflection = await reflectionService.getReflectionById(id, userId);

      if (!reflection) {
        throw new ApiError(404, 'Reflection not found');
      }

      res.status(200).json({
        success: true,
        data: reflection,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update a reflection
  async updateReflection(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const updateData = req.body;

      // Only allow updating certain fields
      const allowedFields = ['answer', 'prompt', 'group'];
      const filteredData = {};
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      }

      if (Object.keys(filteredData).length === 0) {
        throw new ApiError(400, 'No valid fields to update');
      }

      const reflection = await reflectionService.updateReflection(id, userId, filteredData);

      if (!reflection) {
        throw new ApiError(404, 'Reflection not found or you do not have permission to update it');
      }

      res.status(200).json({
        success: true,
        message: 'Reflection updated successfully',
        data: reflection,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete a reflection
  async deleteReflection(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = await reflectionService.deleteReflection(id, userId);

      if (!result) {
        throw new ApiError(404, 'Reflection not found or you do not have permission to delete it');
      }

      res.status(200).json({
        success: true,
        message: 'Reflection deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // Get reflection statistics
  async getReflectionStats(req, res, next) {
    try {
      const userId = req.user.id;
      const stats = await reflectionService.getReflectionStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get rotation state
  async getRotationState(req, res, next) {
    try {
      const userId = req.user.id;
      const rotationState = await reflectionService.getRotationState(userId);

      res.status(200).json({
        success: true,
        data: {
          currentGroupIndex: rotationState.currentGroupIndex,
          promptIndexes: rotationState.promptIndexes,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Update rotation state
  async updateRotationState(req, res, next) {
    try {
      const userId = req.user.id;
      const { currentGroupIndex, promptIndexes } = req.body;

      // Validate required fields
      if (currentGroupIndex === undefined || !promptIndexes) {
        throw new ApiError(400, 'currentGroupIndex and promptIndexes are required');
      }

      // Validate data types
      if (typeof currentGroupIndex !== 'number' || !Array.isArray(promptIndexes)) {
        throw new ApiError(400, 'Invalid data types for rotation state');
      }

      const rotationState = await reflectionService.updateRotationState(userId, {
        currentGroupIndex,
        promptIndexes,
      });

      res.status(200).json({
        success: true,
        message: 'Rotation state updated successfully',
        data: {
          currentGroupIndex: rotationState.currentGroupIndex,
          promptIndexes: rotationState.promptIndexes,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReflectionController();
