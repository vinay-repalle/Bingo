# Deployment Setup Guide - Fix 404 Error

## Problem
Your frontend is deployed on Vercel and trying to call `/api/auth/google`, but Vercel doesn't have a backend server. This causes a 404 error because Vercel is looking for an API route that doesn't exist.

## Solution
You need to configure your frontend to call your Render backend directly, or use Vercel's proxy functionality.

## Step 1: Get Your Render Backend URL
1. Go to your Render dashboard
2. Find your backend service
3. Copy the URL: `https://bingov-backend.onrender.com`

## Step 2: Update Frontend API Configuration
In `frontend/src/services/api.js`, the URL is already configured:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname === 'localhost' ? '/api' : 'https://bingov-backend.onrender.com/api');
```

## Step 3: Update Vercel Configuration
In `vercel.json`, the URL is already configured:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://bingov-backend.onrender.com/api/:path*"
    }
  ]
}
```

## Step 4: Update Backend Environment Variables
In your Render dashboard, set these environment variables:

```
FRONTEND_URL=https://bingov.vercel.app
CORS_ORIGIN=https://bingov.vercel.app
GOOGLE_CALLBACK_URL=https://bingov-backend.onrender.com/api/auth/google/callback
```

## Step 5: Redeploy
1. Commit and push your changes
2. Redeploy your frontend on Vercel
3. Restart your backend on Render

## Alternative Solution: Direct API Calls
If you prefer not to use Vercel's proxy, you can remove the vercel.json file and let your frontend call the Render backend directly. The API service is already configured to do this.

## Testing
After deployment:
1. Go to your Vercel frontend
2. Try to sign in with Google
3. Check the Network tab to ensure API calls go to your Render backend
4. Verify that the Google OAuth flow works

## Common Issues
1. **CORS errors**: Make sure your backend CORS configuration includes `https://bingov.vercel.app`
2. **404 errors**: Ensure the Render URL in vercel.json is correct
3. **Google OAuth errors**: Verify the callback URL in your Google Console matches your Render backend

## Support
If you still have issues, check:
1. Render service logs for backend errors
2. Vercel deployment logs for frontend issues
3. Browser console for JavaScript errors
4. Network tab for failed API requests 