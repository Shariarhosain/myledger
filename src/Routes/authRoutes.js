const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const passport = require('../config/passport');

// Email verification routes
router.post('/send-otp', authController.sendVerificationOTP);
router.post('/verify-otp', authController.verifyOTP);

// Register and login routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Google Authentication (New simplified routes)
router.post('/google-signup', authController.googleSignUp);
router.post('/google-signin', authController.googleSignIn);

// Google OAuth routes (Old passport-based routes - kept for backward compatibility)
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/google/failure',
    session: false 
  }),
  authController.googleCallback
);

router.get('/google/failure', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'Google authentication failed',
  });
});

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Logout
router.post('/logout', authController.logout);

module.exports = router;
