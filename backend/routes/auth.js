import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { protect, generateToken, setTokenCookie } from '../middleware/auth.js';
import emailService from '../services/emailService.js';
import validator from 'validator';

const router = express.Router();

// @desc    Send OTP for email verification
// @route   POST /api/auth/send-otp
// @access  Public
router.post('/send-otp', async (req, res) => {
  try {
    const { email, purpose = 'verification' } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
        message: 'Please provide an email address'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    if (!['verification', 'password_reset'].includes(purpose)) {
      return res.status(400).json({
        error: 'Invalid purpose',
        message: 'Purpose must be either verification or password_reset'
      });
    }

    // Check if user exists for password reset
    if (purpose === 'password_reset') {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          message: 'No account found with this email address'
        });
      }
    }

    // Check if user already exists for verification
    if (purpose === 'verification') {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser.isVerified) {
        return res.status(400).json({
          error: 'Email already verified',
          message: 'This email is already verified'
        });
      }
    }

    // Generate and send OTP
    const otp = await OTP.createOTP(email, purpose);
    const emailSent = await emailService.sendOTP(email, otp, purpose);

    if (!emailSent) {
      return res.status(500).json({
        error: 'Failed to send OTP',
        message: 'Could not send OTP email. Please try again.'
      });
    }

    res.json({
      success: true,
      message: `OTP sent to ${email}`,
      data: {
        email,
        purpose
      }
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      error: 'Failed to send OTP',
      message: 'Something went wrong while sending OTP'
    });
  }
});

// @desc    Verify OTP and complete registration
// @route   POST /api/auth/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, username, password } = req.body;

    // Validation
    if (!email || !otp || !username || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, OTP, username, and password are required'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password too short',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Verify OTP
    const isOTPValid = await OTP.verifyOTP(email, otp, 'verification');
    if (!isOTPValid) {
      return res.status(400).json({
        error: 'Invalid OTP',
        message: 'OTP is invalid, expired, or already used'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: existingUser.email === email 
          ? 'Email is already registered' 
          : 'Username is already taken'
      });
    }

    // Create verified user
    const user = new User({
      username,
      email,
      password,
      isVerified: true
    });

    await user.save();

    // Send welcome email
    emailService.sendWelcomeEmail(email, username);

    // Generate token
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account created and verified successfully',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      error: 'Verification failed',
      message: 'Something went wrong during verification'
    });
  }
});

// @desc    Forgot password - send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No account found with this email address'
      });
    }

    // Send password reset OTP
    const otp = await OTP.createOTP(email, 'password_reset');
    const emailSent = await emailService.sendOTP(email, otp, 'password_reset');

    if (!emailSent) {
      return res.status(500).json({
        error: 'Failed to send OTP',
        message: 'Could not send password reset OTP. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'Password reset OTP sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Failed to send password reset OTP',
      message: 'Something went wrong'
    });
  }
});

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, OTP, and new password are required'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Password too short',
        message: 'New password must be at least 6 characters long'
      });
    }

    // Verify OTP
    const isOTPValid = await OTP.verifyOTP(email, otp, 'password_reset');
    if (!isOTPValid) {
      return res.status(400).json({
        error: 'Invalid OTP',
        message: 'OTP is invalid, expired, or already used'
      });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No account found with this email address'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send password change notification
    emailService.sendPasswordChangeEmail(email, user.username);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      error: 'Password reset failed',
      message: 'Something went wrong during password reset'
    });
  }
});

// @desc    Register user (legacy - now redirects to OTP flow)
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Please provide all required fields',
        message: 'Username, email, and password are required'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password too short',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: existingUser.email === email 
          ? 'Email is already registered' 
          : 'Username is already taken'
      });
    }

    // Send OTP for verification
    const otp = await OTP.createOTP(email, 'verification');
    const emailSent = await emailService.sendOTP(email, otp, 'verification');

    if (!emailSent) {
      return res.status(500).json({
        error: 'Failed to send OTP',
        message: 'Could not send verification OTP. Please try again.'
      });
    }

    res.json({
      success: true,
      message: 'OTP sent for email verification. Please verify your email to complete registration.',
      data: {
        email,
        username
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Something went wrong during registration'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Please provide email and password',
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if user is Google user
    if (user.isGoogleUser) {
      return res.status(401).json({
        error: 'Google account',
        message: 'This account was created with Google. Please use Google sign-in.'
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json({
        error: 'Email not verified',
        message: 'Please verify your email address before logging in'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Something went wrong during login'
    });
  }
});

// @desc    Google OAuth login
// @route   GET /api/auth/google
// @access  Public
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // REQUIRED for Google OAuth
    prompt: 'select_account'
  })
);

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: process.env.FRONTEND_URL 
      ? `${process.env.FRONTEND_URL}/login?error=google_auth_failed`
      : 'http://localhost:5173/login?error=google_auth_failed',
    session: false 
  }),
  async (req, res) => {
    try {
      // Send welcome email for new Google users
      // Check if this is a newly created Google user (created within last 2 minutes)
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      if (req.user.isGoogleUser && req.user.createdAt > twoMinutesAgo) {
        console.log('Sending welcome email to new Google user:', req.user.email);
        try {
          await emailService.sendGoogleWelcomeEmail(req.user.email, req.user.username);
          console.log('Google welcome email sent successfully');
        } catch (emailError) {
          console.error('Failed to send Google welcome email:', emailError);
          // Don't fail the auth process if email fails
        }
      }

      const token = generateToken(req.user._id);
      setTokenCookie(res, token);
      
      // Redirect to frontend callback route with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/google/callback?token=${token}`);
    } catch (error) {
      console.error('Google callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
  }
);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to get user data',
      message: 'Something went wrong'
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  try {
    // Clear cookie
    res.clearCookie('token');
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'Something went wrong during logout'
    });
  }
});

// @desc    Update user preferences
// @route   PUT /api/auth/preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
  try {
    const { theme, soundEnabled, notifications } = req.body;

    const updateData = {};
    if (theme !== undefined) updateData['preferences.theme'] = theme;
    if (soundEnabled !== undefined) updateData['preferences.soundEnabled'] = soundEnabled;
    if (notifications !== undefined) updateData['preferences.notifications'] = notifications;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      error: 'Failed to update preferences',
      message: 'Something went wrong'
    });
  }
});

export default router; 