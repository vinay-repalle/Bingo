# 🎯 Bingo Game

A modern, full-stack Bingo game built with React, Node.js, and MongoDB. Features authentication, Google OAuth, real-time gameplay, and comprehensive statistics tracking.

## ✨ Features

### 🎮 Game Features
- **Classic Bingo Gameplay**: 5x5 grid with numbers 1-75
- **Multiple Game Modes**: Classic, Speed, and Challenge modes
- **Real-time Progress Tracking**: Visual progress indicators
- **Score System**: Time-based scoring with bonuses
- **Win Detection**: Automatic row, column, and diagonal win detection

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Google OAuth**: One-click sign-in with Google
- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: Secure cookie handling
- **Rate Limiting**: Protection against abuse

### 👥 User Management
- **User Profiles**: Customizable usernames and avatars
- **Game Statistics**: Track games played, wins, scores, and times
- **Leaderboards**: Compare performance with other players
- **Preferences**: Theme, sound, and notification settings

### 🛡️ Security Features
- **CORS Protection**: Configurable cross-origin requests
- **Input Validation**: Comprehensive data sanitization
- **Helmet Security**: HTTP security headers
- **Error Handling**: Consistent error responses

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas)
- **Google OAuth** credentials

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BingoGame
```

### 2. Quick Setup (Recommended)

```bash
# Install all dependencies and setup the project
npm run setup

# Start both frontend and backend servers
npm run dev
```

### 3. Manual Setup

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your configuration
# (See Backend Configuration section below)

# Start the server
npm run dev
```

The backend will start on `http://localhost:5000`

#### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bingo-game
# For production: mongodb+srv://username:password@cluster.mongodb.net/bingo-game

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

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

## 📁 Project Structure

```
BingoGame/
├── frontend/               # Frontend React app
│   ├── src/
│   │   ├── Components/     # Reusable components
│   │   ├── Pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.jsx        # Main app component
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   └── tailwind.config.js  # Tailwind CSS configuration
├── backend/                # Backend API
│   ├── config/
│   │   └── database.js     # MongoDB connection
│   ├── middleware/
│   │   └── auth.js         # Authentication middleware
│   ├── models/
│   │   ├── User.js         # User model
│   │   └── Game.js         # Game model
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   ├── users.js        # User management routes
│   │   └── games.js        # Game routes
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend documentation
├── package.json            # Root project configuration
├── setup.js               # Setup script
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/leaderboard` - Get leaderboard

### Games
- `POST /api/games/start` - Start new game
- `GET /api/games/current` - Get current game
- `POST /api/games/:id/move` - Make a move
- `POST /api/games/:id/end` - End game

## 🎮 How to Play

1. **Sign Up/Login**: Create an account or sign in with Google
2. **Start a Game**: Choose game type and difficulty
3. **Mark Numbers**: Click on numbers that are called
4. **Win Conditions**: Complete a row, column, or diagonal
5. **Track Progress**: View your statistics and leaderboard position

## 🛠️ Development

### Running in Development

```bash
# Start both frontend and backend simultaneously
npm run dev

# Or run separately:
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

### Building for Production

```bash
# Build frontend
npm run build

# Start backend in production
cd backend
npm start
```

## 🚀 Deployment

### Backend Deployment

1. Set `NODE_ENV=production`
2. Use MongoDB Atlas or production database
3. Configure proper CORS origins
4. Set secure session and JWT secrets
5. Use HTTPS in production

### Frontend Deployment

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service
3. Configure environment variables for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check that Google OAuth credentials are properly configured

## 🎯 Future Features

- [ ] Multiplayer support
- [ ] Real-time chat
- [ ] Tournament mode
- [ ] Custom board themes
- [ ] Mobile app
- [ ] Push notifications
- [ ] Advanced statistics
- [ ] Social features

---

**Happy Gaming! 🎮**
