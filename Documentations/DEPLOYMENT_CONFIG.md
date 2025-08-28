# Deployment Configuration Guide

## Frontend Configuration (Vercel)

### Environment Variables
Create these in your Vercel dashboard:

```bash
# For production
VITE_API_BASE_URL=https://bingov-backend.onrender.com/api
NODE_ENV=production
```

### Vercel Configuration
The `vercel.json` file is configured to:
- Proxy `/api/*` requests to your Render backend
- Handle CORS properly
- Set appropriate headers for API calls

## Backend Configuration (Render)

### Environment Variables
Set these in your Render dashboard:

```bash
# Server Configuration
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://bingov.vercel.app

# Database
MONGODB_URI_PROD=your_mongodb_connection_string

# JWT & Security
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://bingov-backend.onrender.com/api/auth/google/callback

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Development vs Production

### Development (localhost)
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:5000`
- API calls: Relative paths (`/api/*`)
- CORS: Localhost origins allowed

### Production (Deployed)
- Frontend: `https://bingov.vercel.app`
- Backend: `https://bingov-backend.onrender.com`
- API calls: Full URLs or Vercel proxy
- CORS: Vercel domain allowed

## Testing Checklist

### ✅ Local Development
- [ ] Frontend runs on `localhost:5173`
- [ ] Backend runs on `localhost:5000`
- [ ] API calls work with relative paths
- [ ] Google OAuth works locally

### ✅ Production Deployment
- [ ] Frontend deployed on Vercel
- [ ] Backend deployed on Render
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Google OAuth callback URLs match
- [ ] Health check endpoints working

## Troubleshooting

### 404 Errors
- Check if Vercel proxy is working
- Verify backend URL in configuration
- Check Network tab for actual request URLs

### CORS Errors
- Verify CORS origins in backend
- Check if frontend domain is allowed
- Ensure credentials are handled properly

### Google OAuth Issues
- Verify callback URLs in Google Console
- Check environment variables
- Ensure redirect URLs match exactly

## Health Check Endpoints

### Backend Health
- Local: `http://localhost:5000/api/health`
- Production: `https://bingov-backend.onrender.com/api/health`
- Render: `https://bingov-backend.onrender.com/healthz`

### Frontend Health
- Local: `http://localhost:5173`
- Production: `https://bingov.vercel.app` 