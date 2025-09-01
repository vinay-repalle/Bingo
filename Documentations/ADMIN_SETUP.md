# 🔐 Admin Panel Setup Guide

## 📋 **How to Set Up Admin Access**

### **1. Local Development**
Create a `.env` file in your `backend` folder with:
```env
ADMIN_USERNAME=youradmin
ADMIN_PASSWORD=yourstrongpassword
```

### **2. Production (Render)**
1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add these environment variables:
   - `ADMIN_USERNAME` = your chosen admin username
   - `ADMIN_PASSWORD` = your chosen strong password
5. Redeploy your service

### **3. Access Admin Panel**
- **URL**: `/admin/statistics`
- **Username**: Your `ADMIN_USERNAME` value
- **Password**: Your `ADMIN_PASSWORD` value

## ⚠️ **Security Requirements**
- **No hardcoded credentials** in the code
- **Strong passwords** (at least 8 characters, mix of letters/numbers/symbols)
- **Unique credentials** for each environment
- **Never commit** `.env` files to version control

## 🔍 **Testing**
1. Set your environment variables
2. Go to `/admin/statistics`
3. Login with your credentials
4. Verify admin functionality works

## 🆘 **Troubleshooting**
- **"Admin authentication not configured"**: Set environment variables
- **"Invalid admin credentials"**: Check username/password spelling
- **"Admin authentication required"**: Make sure you're logged in
