const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ReflectionService {
  // Create a new reflection
  async createReflection(userId, reflectionData) {
    const { date, prompt, group, answer } = reflectionData;

    const reflection = await prisma.reflection.create({
      data: {
        userId,
        date,
        prompt,
        group,
        answer,
      },
    });

    return reflection;
  }

  // Get all reflections for a user with pagination
  async getUserReflections(userId, pagination = { page: 1, limit: 10 }) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [reflections, total] = await Promise.all([
      prisma.reflection.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.reflection.count({ where: { userId } }),
    ]);

    return {
      reflections,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get a single reflection by ID
  async getReflectionById(reflectionId, userId) {
    const reflection = await prisma.reflection.findFirst({
      where: {
        id: reflectionId,
        userId, // Ensure user can only access their own reflections
      },
    });

    return reflection;
  }

  // Update a reflection
  async updateReflection(reflectionId, userId, updateData) {
    // First check if reflection exists and belongs to user
    const existingReflection = await prisma.reflection.findFirst({
      where: {
        id: reflectionId,
        userId,
      },
    });

    if (!existingReflection) {
      return null;
    }

    const updatedReflection = await prisma.reflection.update({
      where: { id: reflectionId },
      data: updateData,
    });

    return updatedReflection;
  }

  // Delete a reflection
  async deleteReflection(reflectionId, userId) {
    // First check if reflection exists and belongs to user
    const existingReflection = await prisma.reflection.findFirst({
      where: {
        id: reflectionId,
        userId,
      },
    });

    if (!existingReflection) {
      return null;
    }

    await prisma.reflection.delete({
      where: { id: reflectionId },
    });

    return { success: true };
  }

  // Get reflection statistics
  async getReflectionStats(userId) {
    const total = await prisma.reflection.count({ where: { userId } });

    // Get reflections grouped by category
    const reflections = await prisma.reflection.findMany({
      where: { userId },
      select: { group: true },
    });

    const groupCounts = reflections.reduce((acc, reflection) => {
      acc[reflection.group] = (acc[reflection.group] || 0) + 1;
      return acc;
    }, {});

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCount = await prisma.reflection.count({
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    return {
      total,
      groupCounts,
      recentCount,
    };
  }

  // Get rotation state for a user
  async getRotationState(userId) {
    let rotationState = await prisma.rotationState.findUnique({
      where: { userId },
    });

    // If no rotation state exists, create default one
    if (!rotationState) {
      rotationState = await prisma.rotationState.create({
        data: {
          userId,
          currentGroupIndex: 0,
          promptIndexes: [0, 0, 0, 0], // Default for 4 groups
        },
      });
    }

    return rotationState;
  }

  // Update rotation state for a user
  async updateRotationState(userId, rotationData) {
    const { currentGroupIndex, promptIndexes } = rotationData;

    // Check if rotation state exists
    const existingState = await prisma.rotationState.findUnique({
      where: { userId },
    });

    let rotationState;
    if (existingState) {
      rotationState = await prisma.rotationState.update({
        where: { userId },
        data: {
          currentGroupIndex,
          promptIndexes,
        },
      });
    } else {
      rotationState = await prisma.rotationState.create({
        data: {
          userId,
          currentGroupIndex,
          promptIndexes,
        },
      });
    }

    return rotationState;
  }
}

module.exports = new ReflectionService();
