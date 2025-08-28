/**
 * 🔐 Authentication Middleware
 * 
 * This module provides authentication and authorization middleware functions.
 * It handles JWT token verification, user authentication, and route protection.
 * 
 * Functions:
 * - protect: Protects routes requiring authentication
 * - optionalAuth: Optional authentication for public routes
 * - generateToken: Creates JWT tokens for users
 * - setTokenCookie: Sets secure HTTP-only cookies
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * 🛡️ Route Protection Middleware
 * 
 * This middleware protects routes by verifying JWT tokens.
 * It checks for tokens in both Authorization headers and cookies.
 * If authentication fails, it returns a 401 Unauthorized response.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token format)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Check for token in cookies (alternative authentication method)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token found, return unauthorized error
  if (!token) {
    return res.status(401).json({ 
      error: 'Not authorized to access this route',
      message: 'No token provided'
    });
  }

  try {
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from decoded token, excluding password field
    const user = await User.findById(decoded.id).select('-password');
    
    // If user not found, return unauthorized error
    if (!user) {
      return res.status(401).json({ 
        error: 'Not authorized to access this route',
        message: 'User not found'
      });
    }

    // Attach user object to request for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    // If token verification fails, return unauthorized error
    return res.status(401).json({ 
      error: 'Not authorized to access this route',
      message: 'Invalid token'
    });
  }
};

/**
 * 🔓 Optional Authentication Middleware
 * 
 * This middleware provides optional authentication for public routes.
 * It attempts to authenticate users if tokens are provided, but doesn't
 * block requests if authentication fails. Useful for routes that show
 * different content for authenticated vs anonymous users.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Check for token in cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If token exists, try to authenticate user
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user; // Attach user if found
      }
    } catch (error) {
      // Token is invalid, but we don't block the request
      console.log('Invalid token in optional auth:', error.message);
    }
  }

  next(); // Always continue to next middleware
};

/**
 * 🎫 Generate JWT Token
 * 
 * Creates a JSON Web Token for user authentication.
 * The token contains the user's ID and expires after a specified time.
 * 
 * @param {string} id - User ID to encode in token
 * @returns {string} JWT token string
 */
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d' // Default expiration: 7 days
  });
};

/**
 * 🍪 Set Token Cookie
 * 
 * Sets a secure HTTP-only cookie containing the JWT token.
 * The cookie is configured for security and proper domain handling.
 * 
 * @param {Object} res - Express response object
 * @param {string} token - JWT token to store in cookie
 * @returns {void}
 */
export const setTokenCookie = (res, token) => {
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    httpOnly: true,                                           // Prevent XSS attacks
    secure: process.env.NODE_ENV === 'production',            // HTTPS only in production
    sameSite: 'strict'                                        // Prevent CSRF attacks
  };

  res.cookie('token', token, options);
}; 