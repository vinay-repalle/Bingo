/**
 * 👑 Admin Authentication Middleware
 * 
 * This module provides authentication for admin-only routes.
 * It uses HTTP Basic Authentication to verify admin credentials.
 * 
 * Security Features:
 * - Basic authentication with username/password
 * - Environment variable configuration
 * - Base64 encoded credentials
 * 
 * Environment Variables Required:
 * - ADMIN_USERNAME: Admin username for authentication
 * - ADMIN_PASSWORD: Admin password for authentication
 */

import dotenv from 'dotenv';
dotenv.config();

// Load admin credentials from environment variables
// You MUST set these in your .env file for security
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

/**
 * 🛡️ Admin Authentication Middleware
 * 
 * Protects admin routes by requiring valid admin credentials.
 * Uses HTTP Basic Authentication (Authorization: Basic base64(username:password)).
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const adminAuth = (req, res, next) => {
  // Check if admin credentials are configured
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error('❌ Admin authentication not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD environment variables.');
    return res.status(500).json({ 
      error: 'Admin authentication not configured',
      message: 'Please contact the system administrator to configure admin access.'
    });
  }

  // Extract the Authorization header from the request
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header exists and starts with 'Basic '
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Admin authentication required' });
  }
  
  // Extract the base64 encoded credentials from the header
  // Format: "Basic base64(username:password)"
  const base64Credentials = authHeader.split(' ')[1];
  
  // Decode the base64 credentials to get username:password string
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  
  // Split the credentials into username and password
  const [username, password] = credentials.split(':');
  
  // Verify admin credentials against environment variables
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return next(); // Authentication successful, continue to next middleware
  }
  
  // Authentication failed, return forbidden error
  return res.status(403).json({ error: 'Invalid admin credentials' });
};
