# 🚀 Deployment Checklist - Prevent Issues

## ⚠️ **Critical Issues Found & Fixed**

### 1. **Vite Configuration Hardcoded Proxy** ✅ FIXED
- **Problem**: `frontend/vite.config.js` had hardcoded `localhost:5000`
- **Fix**: Made it environment-aware with fallback
- **Impact**: Could cause build failures in production

### 2. **Backend Port Configuration** ✅ SAFE
- **Status**: Uses `process.env.PORT || 5000` (safe for Render)
- **Note**: Render will set its own PORT environment variable

### 3. **Google OAuth Callback URLs** ✅ FIXED
- **Problem**: Hardcoded localhost URLs in some places
- **Fix**: Environment-aware callback URL handling
- **Impact**: OAuth failures in production

## 🔍 **Pre-Deployment Checks**

### **Frontend (Vercel)**
- [ ] ✅ Vite config uses environment variables
- [ ] ✅ API service handles both environments
- [ ] ✅ Vercel.json proxy configuration correct
- [ ] ✅ Build script works without localhost dependencies

### **Backend (Render)**
- [ ] ✅ PORT configuration uses environment variable
- [ ] ✅ CORS origins include production domain
- [ ] ✅ Google OAuth callback URLs are dynamic
- [ ] ✅ Database connection uses production URI

## 🚨 **Potential Deployment Issues**

### **1. Environment Variables Missing**
```bash
# Required in Render dashboard:
NODE_ENV=production
FRONTEND_URL=https://bingov.vercel.app
GOOGLE_CALLBACK_URL=https://bingov-backend.onrender.com/api/auth/google/callback
MONGODB_URI_PROD=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### **2. Google Console Configuration**
- [ ] Add `https://bingov-backend.onrender.com/api/auth/google/callback` to authorized redirect URIs
- [ ] Remove old localhost callback URLs if no longer needed

### **3. MongoDB Connection**
- [ ] Ensure production MongoDB URI is accessible from Render
- [ ] Check if IP whitelist includes Render's IP ranges

### **4. Email Service**
- [ ] Verify Gmail app password works
- [ ] Check if email service works from Render's servers

## 🧪 **Testing Strategy**

### **Local Testing (Before Deployment)**
```bash
# Test backend
cd backend
npm start
# Should start on PORT from environment or default 5000

# Test frontend
cd frontend
npm run build
# Should build without errors
npm run preview
# Should work with local backend
```

### **Production Testing (After Deployment)**
1. **Health Check**: Visit `https://bingov-backend.onrender.com/api/health`
2. **Frontend Load**: Visit `https://bingov.vercel.app`
3. **Google OAuth**: Test sign-in flow
4. **API Calls**: Check Network tab for successful requests

## 🔧 **Rollback Plan**

### **If Frontend Issues Occur**
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Check if Vercel proxy is working
4. Test backend health endpoint directly

### **If Backend Issues Occur**
1. Check Render service logs
2. Verify environment variables
3. Check MongoDB connection
4. Test health endpoints

### **If OAuth Issues Occur**
1. Verify Google Console configuration
2. Check callback URLs match exactly
3. Verify environment variables
4. Check CORS configuration

## 📋 **Final Deployment Steps**

1. **Set Environment Variables** in Render dashboard
2. **Update Google Console** with production callback URLs
3. **Commit and push** all changes to GitHub
4. **Monitor deployments** on both Vercel and Render
5. **Test production** functionality thoroughly
6. **Monitor logs** for any errors

## ✅ **Success Indicators**

- [ ] Frontend loads without errors
- [ ] Backend health check returns 200
- [ ] Google OAuth flow completes successfully
- [ ] API calls work in production
- [ ] No CORS errors in browser console
- [ ] All features function as expected

## 🆘 **Emergency Contacts**

- **Vercel Support**: Check deployment logs and status
- **Render Support**: Check service logs and health
- **Google OAuth**: Verify console configuration
- **MongoDB**: Check connection and access logs 