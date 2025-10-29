const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { ApiError } = require('../utils/error');

const prisma = new PrismaClient();

class UserService {
  // Get all users
  async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          fname: true,
          lname: true,
          email: true,
          profilePic: true,
          isVerified: true,
          googleId: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get user by ID
  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fname: true,
        lname: true,
        email: true,
        profilePic: true,
        isVerified: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  // Update user
  async updateUser(id, updateData) {
    const { fname, lname, email, password, profilePic } = updateData;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new ApiError(404, 'User not found');
    }

    // Check if email is being changed and already exists
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        throw new ApiError(400, 'Email already in use');
      }
    }

    // Prepare update data
    const data = {};
    if (fname) data.fname = fname;
    if (lname) data.lname = lname;
    if (email) data.email = email;
    if (profilePic !== undefined) data.profilePic = profilePic;
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        fname: true,
        lname: true,
        email: true,
        profilePic: true,
        isVerified: true,
        googleId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  // Delete user
  async deleteUser(id) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}

module.exports = new UserService();
