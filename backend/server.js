/**
 * 🚀 BingoV Backend Server
 * 
 * This is the main entry point for the BingoV game backend.
 * It handles:
 * - Express server setup and configuration
 * - Database connection and initialization
 * - Middleware setup (security, CORS, rate limiting)
 * - Authentication with Google OAuth
 * - Route registration for all API endpoints
 * - WebSocket server for multiplayer games
 * - Health check endpoints
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import http from 'http';

// Import route modules for different API endpoints
import authRoutes from './routes/auth.js';        // Authentication routes (login, register, OAuth)
import userRoutes from './routes/users.js';       // User management routes (profile, preferences)
import gameRoutes from './routes/games.js';       // Game logic routes (start, play, end game)
import statisticsRoutes from './routes/statistics.js'; // Statistics and leaderboard routes
import Achievement from './models/Achievement.js'; // Achievement model for initialization
import adminRoutes from './routes/admin.js';      // Admin-only routes (statistics, management)

// Import database connection utility
import connectDB from './config/database.js';

// Load environment variables from .env file
dotenv.config();

// Create Express application instance
const app = express();

// Set server port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// Establish connection to MongoDB database
connectDB();

/**
 * 🏆 Initialize Achievement System
 * 
 * This function sets up the default achievements in the database.
 * It runs after the database connection is established to ensure
 * all achievement data is available for new users.
 */
const initializeAchievements = async () => {
  try {
    await Achievement.initializeAchievements();
    console.log('✅ Achievements initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize achievements:', error);
  }
};

// Initialize achievements after database connection (2 second delay to ensure DB is ready)
setTimeout(initializeAchievements, 2000);

/**
 * 🔒 Security Middleware Setup
 * 
 * helmet(): Adds various HTTP headers for security
 * - XSS protection, content security policy, etc.
 */
app.use(helmet());

/**
 * 🌐 CORS (Cross-Origin Resource Sharing) Configuration
 * 
 * Allows the frontend to communicate with the backend from different domains.
 * Supports both development (localhost) and production (Vercel) origins.
 */
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173', // Primary frontend URL
    'https://bingov.vercel.app',                         // Production frontend
    'http://localhost:3000',                             // Alternative dev port
    'http://localhost:5174',                             // Vite dev server alternative port
    'http://127.0.0.1:5173',                            // Localhost IP variants
    'http://127.0.0.1:3000'
  ],
  credentials: true,                                      // Allow cookies and authentication
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed headers
  optionsSuccessStatus: 200                              // Success status for preflight requests
}));

/**
 * 🚦 Rate Limiting Middleware
 * 
 * Prevents abuse by limiting the number of requests per IP address.
 * Default: 100 requests per 15 minutes per IP address.
 */
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

/**
 * 📝 Body Parsing Middleware
 * 
 * Parse incoming request bodies into JavaScript objects.
 * - JSON parsing with 10MB limit
 * - URL-encoded form data parsing
 * - Cookie parsing for session management
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * 🍪 Session Configuration
 * 
 * Sets up user sessions for authentication and state management.
 * Sessions are stored server-side and identified by cookies.
 */
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret', // Secret for signing session cookies
  resave: false,                                          // Don't save session if unchanged
  saveUninitialized: false,                               // Don't create session until something stored
  cookie: {
    secure: process.env.NODE_ENV === 'production',        // HTTPS only in production
    httpOnly: true,                                       // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000                          // Session expires in 24 hours
  }
}));

/**
 * 🔐 Passport Authentication Middleware
 * 
 * Passport is used for authentication strategies (local, Google OAuth, etc.)
 * It handles user login, session management, and authentication state.
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * 🌐 Google OAuth Strategy Configuration
 * 
 * Sets up Google OAuth 2.0 authentication for users to sign in with their Google accounts.
 * The callback URL handles the OAuth flow after Google authentication.
 */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,           // Google OAuth client ID
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,   // Google OAuth client secret
  callbackURL: process.env.GOOGLE_CALLBACK_URL ||   // OAuth callback URL
    (process.env.NODE_ENV === 'production' 
      ? 'https://bingov-backend.onrender.com/api/auth/google/callback'  // Production callback
      : 'http://localhost:5000/api/auth/google/callback'),              // Development callback
  prompt: 'select_account'                          // Force account selection dialog
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Import User model here to avoid circular dependency
    const User = (await import('./models/User.js')).default;
    
    // Use the new static method to find or create user
    const user = await User.findOrCreateGoogleUser(profile);
    return done(null, user);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

/**
 * 🔄 Passport User Serialization
 * 
 * Converts user object to user ID for session storage.
 * This ID is stored in the session cookie.
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * 🔄 Passport User Deserialization
 * 
 * Retrieves user object from user ID stored in session.
 * This happens on every request to restore user context.
 */
passport.deserializeUser(async (id, done) => {
  try {
    const User = (await import('./models/User.js')).default;
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

/**
 * 📊 Logging Middleware
 * 
 * Morgan provides HTTP request logging for debugging and monitoring.
 * Only enabled in development mode to avoid production log noise.
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * 🛣️ API Route Registration
 * 
 * Mounts different route modules to specific URL paths.
 * All routes are prefixed with '/api' for organization.
 */
app.use('/api/auth', authRoutes);        // Authentication endpoints (/api/auth/*)
app.use('/api/users', userRoutes);       // User management endpoints (/api/users/*)
app.use('/api/games', gameRoutes);       // Game logic endpoints (/api/games/*)
app.use('/api/statistics', statisticsRoutes); // Statistics endpoints (/api/statistics/*)
app.use('/api/admin', adminRoutes);      // Admin-only endpoints (/api/admin/*)

/**
 * 🏥 Health Check Endpoints
 * 
 * These endpoints allow monitoring services to check if the backend is running.
 * Useful for load balancers, health monitoring, and deployment checks.
 */

// Main health check endpoint for general monitoring
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'BingoV Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Render-specific health check endpoint (required by Render hosting)
app.get('/healthz', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'BingoV Backend is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * 🚨 Error Handling Middleware
 * 
 * Catches any errors that occur during request processing.
 * Provides appropriate error responses and logs errors for debugging.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

/**
 * 🚫 404 Route Handler
 * 
 * Catches any requests to undefined routes.
 * Returns a JSON error response for API consistency.
 */
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/**
 * 🎮 Multiplayer Game Server Setup
 * 
 * Initializes Socket.IO server for real-time multiplayer game functionality.
 * The GameServer module handles WebSocket connections and game logic.
 */
import { initGameServer } from './GameServer.js';

// Create HTTP server instance from Express app
const server = http.createServer(app);

// Initialize Socket.IO game server with the HTTP server
initGameServer(server); // Pass the HTTP server to Socket.IO

/**
 * 🚀 Server Startup
 * 
 * Starts the HTTP server and begins listening for incoming requests.
 * Logs server status and configuration information.
 */
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}); 