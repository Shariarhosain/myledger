const authService = require('../Services/authService');
const { ApiError } = require('../utils/error');

class AuthController {
  // Send email verification OTP
  async sendVerificationOTP(req, res, next) {
    try {
      const { email } = req.body;

      if (!email) {
        throw new ApiError(400, 'Email is required');
      }

      const result = await authService.sendEmailVerification(email);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify email OTP
  async verifyOTP(req, res, next) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        throw new ApiError(400, 'Email and OTP are required');
      }

      const result = await authService.verifyEmail(email, otp);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Simple registration - no verification, no unique constraints
  async simpleRegister(req, res, next) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        throw new ApiError(400, 'Username, email, and password are required');
      }

      const result = await authService.simpleRegister(username, email, password);
      
      // Set token in cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Register with email and password
  async register(req, res, next) {
    try {
      const { fname, lname, email, password } = req.body;

      if (!fname || !lname || !email || !password) {
        throw new ApiError(400, 'All fields are required');
      }

      const result = await authService.register(fname, lname, email, password);
      
      // Set token in cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Login with email and password
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(400, 'Email and password are required');
      }

      const result = await authService.login(email, password);
      
      // Set token in cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Google OAuth callback
  async googleCallback(req, res, next) {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Google authentication failed');
      }

      // Set token in cookie
      res.cookie('token', req.user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/success?token=${req.user.token}`);
    } catch (error) {
      next(error);
    }
  }

  // Forgot password
  async forgotPassword(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(400, 'Email and new password are required');
      }

      const result = await authService.forgotPassword(email, password);
      
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout
  async logout(req, res, next) {
    try {
      res.clearCookie('token');
      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      next(error);
    }
  }

  // Google Sign-Up
  async googleSignUp(req, res, next) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        throw new ApiError(400, 'Google ID token is required');
      }

      const result = await authService.googleSignUp(idToken);
      
      // Set token in cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        success: true,
        message: 'Google sign-up successful',
        data: {
          user: result.user,
          token: result.token,
          isNewUser: result.isNewUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Google Sign-In
  async googleSignIn(req, res, next) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        throw new ApiError(400, 'Google ID token is required');
      }

      const result = await authService.googleSignIn(idToken);
      
      // Set token in cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(200).json({
        success: true,
        message: 'Google sign-in successful',
        data: {
          user: result.user,
          token: result.token,
          isNewUser: result.isNewUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
