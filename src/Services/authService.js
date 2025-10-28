const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { generateToken } = require('../Middlewares/jwt');
const { ApiError } = require('../utils/error');
const { sendOTPEmail } = require('../utils/email');

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
  // Generate 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send email verification OTP
  async sendEmailVerification(email) {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create verification record
    await prisma.emailVerification.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    // Send email
    await sendOTPEmail(email, otp);

    return { message: 'OTP sent to email successfully' };
  }

  // Verify email OTP
  async verifyEmail(email, otp) {
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        otp,
        expiresAt: {
          gte: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!verification) {
      throw new ApiError(400, 'Invalid or expired OTP');
    }

    // Mark as verified
    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { verified: true },
    });

    return { message: 'Email verified successfully' };
  }

  // Check if email is verified
  async isEmailVerified(email) {
    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        verified: true,
      },
    });

    return !!verification;
  }

  // Register user with email and password
  async register(fname, lname, email, password) {
    // Check if email is verified
    const isVerified = await this.isEmailVerified(email);
    if (!isVerified) {
      throw new ApiError(400, 'Please verify your email first');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(400, 'User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        fname,
        lname,
        email,
        password: hashedPassword,
        isVerified: true,
      },
      select: {
        id: true,
        fname: true,
        lname: true,
        email: true,
        isVerified: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    return { user, token };
  }

  // Login with email and password
  async login(email, password) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  // Google OAuth login/register
  async googleAuth(profile) {
    const email = profile.emails[0].value;
    const googleId = profile.id;

    // Check if user exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { googleId }],
      },
    });

    if (user) {
      // Update googleId if not set
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          fname: profile.name.givenName,
          lname: profile.name.familyName,
          email,
          googleId,
          isVerified: true, // Google accounts are pre-verified
        },
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  // Google Sign-Up (Register with Google)
  async googleSignUp(idToken) {
    try {
      // Verify Google ID token
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, given_name, family_name, sub: googleId } = payload;

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { googleId }],
        },
      });

      if (existingUser) {
        throw new ApiError(400, 'User already exists with this email or Google account');
      }

      // Create new user
      const user = await prisma.user.create({
        data: {
          fname: given_name || 'User',
          lname: family_name || '',
          email,
          googleId,
          isVerified: true, // Google accounts are pre-verified
        },
        select: {
          id: true,
          fname: true,
          lname: true,
          email: true,
          googleId: true,
          isVerified: true,
          createdAt: true,
        },
      });

      // Generate JWT token
      const token = generateToken(user.id);

      return { 
        user, 
        token,
        isNewUser: true 
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new ApiError(401, 'Invalid Google token');
    }
  }

  // Google Sign-In (Login with Google)
  async googleSignIn(idToken) {
    try {
      // Verify Google ID token
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, sub: googleId } = payload;

      // Find user by email or googleId
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { googleId }],
        },
        select: {
          id: true,
          fname: true,
          lname: true,
          email: true,
          googleId: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new ApiError(404, 'User not found. Please sign up first.');
      }

      // Update googleId if not set
      if (!user.googleId && googleId) {
        await prisma.user.update({
          where: { id: user.id },
          data: { googleId },
        });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      return { 
        user, 
        token,
        isNewUser: false 
      };
    } catch (error) {
      if (error.statusCode) {
        throw error;
      }
      throw new ApiError(401, 'Invalid Google token');
    }
  }

  // Forgot password
  async forgotPassword(email, newPassword) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(404, 'User not found with this email');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }
}

module.exports = new AuthService();
