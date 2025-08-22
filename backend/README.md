# Bingo Game Backend

A complete backend API for the Bingo Game with authentication, Google OAuth, and game management.

## Features

- 🔐 **Authentication System**
  - JWT-based authentication
  - Google OAuth integration
  - Password hashing with bcrypt
  - Session management

- 🎮 **Game Management**
  - Start new Bingo games
  - Make moves (call/mark numbers)
  - Track game progress
  - Calculate scores and statistics

- 👥 **User Management**
  - User registration and login
  - Profile management
  - Game statistics tracking
  - Leaderboard system

- 🛡️ **Security Features**
  - Rate limiting
  - Input validation
  - CORS protection
  - Helmet security headers

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Passport.js
- **OAuth**: Google OAuth 2.0
- **Security**: bcrypt, helmet, rate-limiting

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google OAuth credentials

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bingo-game

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Session Configuration
SESSION_SECRET=your-session-secret-key-change-this-in-production
```

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/google/callback` | Google OAuth callback |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |
| PUT | `/api/auth/preferences` | Update user preferences |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update user profile |
| GET | `/api/users/stats` | Get user statistics |
| GET | `/api/users/games` | Get user game history |
| GET | `/api/users/leaderboard` | Get leaderboard |
| GET | `/api/users/:id` | Get public user profile |

### Games

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/games/start` | Start new game |
| GET | `/api/games/current` | Get current game |
| POST | `/api/games/:id/move` | Make a move |
| POST | `/api/games/:id/end` | End game |

## Database Models

### User Model
- Basic info (username, email, password)
- Google OAuth integration
- Game statistics
- User preferences
- Timestamps

### Game Model
- Game state and board
- Move history
- Scoring and timing
- Win conditions
- Player association

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Sanitizes all inputs
- **CORS Protection**: Configurable origins
- **Helmet**: Security headers
- **Session Management**: Secure cookie handling

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

## Development

### Project Structure

```
backend/
├── config/
│   └── database.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   └── Game.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   └── games.js
├── server.js
├── package.json
└── README.md
```

### Adding New Features

1. Create models in `models/` directory
2. Add routes in `routes/` directory
3. Update middleware as needed
4. Test with Postman or similar tool

## Production Deployment

1. Set `NODE_ENV=production`
2. Use MongoDB Atlas or production database
3. Configure proper CORS origins
4. Set secure session and JWT secrets
5. Use HTTPS in production
6. Set up proper logging and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details 