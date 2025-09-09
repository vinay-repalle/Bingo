# 🎯 BingoV - Modern Bingo Game

A full-stack, modern Bingo game built with React, Node.js, and MongoDB. Features real-time multiplayer gameplay, comprehensive authentication, admin portal, and a beautiful responsive UI.

## ✨ Features

### 🎮 Game Features
- **Classic Bingo Gameplay**: 5x5 grid with numbers 1-75
- **Real-time Multiplayer**: Play with friends online
- **Single Player Mode**: Practice against computer AI
- **Coins System**: Earn coins for computer games (wins: 10 coins, losses: 2 coins)
- **Win Detection**: Automatic row, column, and diagonal detection
- **Game Statistics**: Track performance and progress

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based authentication
- **Google OAuth**: One-click sign-in with Google
- **Email Verification**: OTP-based email verification
- **Password Security**: bcrypt hashing with salt rounds
- **Session Management**: Secure cookie handling
- **Rate Limiting**: Protection against abuse

### 👥 User Management
- **User Profiles**: Customizable usernames and avatars
- **Game Statistics**: Track games played, wins, scores, and times
- **Leaderboards**: Compare performance with other players
- **Coins Display**: View earned coins on dashboard
- **Preferences**: Theme, sound, and notification settings

### 🛡️ Admin Portal
- **Protected Access**: Direct URL access with admin credentials
- **User Management**: View all users and their details
- **Game Analytics**: See games played by each user
- **Statistics Dashboard**: Overall platform statistics
- **User Deletion**: Remove user accounts and associated data
- **Leaderboard Management**: View and manage leaderboards

### 🎨 UI/UX Features
- **Responsive Design**: Works perfectly on all devices
- **Dark/Light Mode**: Toggle between themes
- **Modern Navbar**: Desktop overlay with scroll behavior
- **Mobile Menu**: Professional drawer navigation
- **Smooth Animations**: Beautiful transitions and effects
- **Professional Styling**: Modern, clean design

### ⭐ Reviews & Ratings
- **Public Average Rating** on Landing page (visible to everyone)
- **Authenticated Reviews**: Logged-in users can submit/update rating and optional comment
- **Admin Reviews Panel**: Admin can see who rated how much with comments
- **Theme-aware**: Rating widgets respect dark mode and persist user theme

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

### 2. Backend Setup

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

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

#### Persisted Theme Preference
- Your theme choice is saved in `localStorage` and persists across refreshes.

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/bingov
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/bingov

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-gmail-app-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
CORS_ORIGIN=http://localhost:5173
SESSION_SECRET=your-session-secret-key

# Admin Credentials
ADMIN_USERNAME=youradmin
ADMIN_PASSWORD=yourstrongpassword
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
│   │   │   ├── Navbar.jsx  # Responsive navigation
│   │   │   ├── Footer.jsx  # Simple footer
│   │   │   └── ...
│   │   ├── Pages/          # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── GamePage.jsx
│   │   │   ├── AboutUs.jsx
│   │   │   └── AdminStatistics.jsx
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
│   │   ├── auth.js         # Authentication middleware
│   │   └── adminAuth.js    # Admin authentication
│   ├── models/
│   │   ├── User.js         # User model with coins
│   │   ├── Game.js         # Game model
│   │   └── OTP.js          # OTP model
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   ├── users.js        # User management routes
│   │   ├── games.js        # Game routes
│   │   ├── admin.js        # Admin routes
│   │   └── statistics.js   # Statistics routes
│   ├── services/
│   │   └── emailService.js # Email functionality
│   ├── server.js           # Main server file
│   ├── GameServer.js       # Socket.IO game server
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend documentation
├── package.json            # Root project configuration
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-otp` - Verify email OTP

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

### Statistics
- `POST /api/statistics/game` - Record game statistics
- `GET /api/statistics/user/:id` - Get user statistics

### Admin (Protected)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/user/:id/games` - Get user games
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/leaderboard` - Get admin leaderboard
- `DELETE /api/admin/user/:id` - Delete user

## 🎮 How to Play

1. **Sign Up/Login**: Create an account or sign in with Google
2. **Start a Game**: Choose between single player or multiplayer
3. **Mark Numbers**: Click on numbers that are called
4. **Win Conditions**: Complete a row, column, or diagonal
5. **Earn Coins**: Win coins in single player games
6. **Track Progress**: View your statistics and leaderboard position

## 🛠️ Development

### Running in Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd backend
npm start
```

## 🚀 Deployment

### Frontend Deployment

1. **Build the project**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy the `dist/` folder** to:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3
   - Any static hosting service

### Backend Deployment

1. **Set production environment**:
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with production values
   ```

2. **Deploy to**:
   - Heroku
   - Railway
   - DigitalOcean
   - AWS EC2
   - Any Node.js hosting service

### Database Setup

- **MongoDB Atlas** (recommended for production)
- **Configure connection string** in `.env`
- **Set up proper indexes** for performance
- Note: `Review` model enforces a unique index on `user` so each user has at most one review.

### Production Environment Variables

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bingov
JWT_SECRET=your-super-secure-production-secret
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
FRONTEND_URL=https://yourdomain.com
CORS_ORIGIN=https://yourdomain.com
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-admin-password
```

## 🎯 Admin Portal Access

- **URL**: `https://yourdomain.com/admin/statistics`
- **Authentication**: Basic Auth with admin credentials
- **Features**: User management, statistics, game analytics
  - Includes reviews list endpoint: `/api/admin/reviews`
- **Security**: Environment variable-based credentials

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
5. Verify admin credentials are set in environment variables

## 🎯 Future Features

- [ ] Tournament mode
- [ ] Custom board themes
- [ ] Push notifications
- [ ] Advanced statistics
- [ ] Social features
- [ ] Mobile app
- [ ] Real-time chat
- [ ] Custom game rules

## 🏆 Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - Real-time server
- **JWT** - Authentication
- **Passport.js** - OAuth
- **Nodemailer** - Email service

### Security
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **Rate Limiting** - Abuse protection
- **CORS** - Cross-origin protection
- **Input Validation** - Data sanitization

---

**Happy Gaming! 🎮**
