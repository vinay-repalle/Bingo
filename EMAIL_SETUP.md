# 📧 Email Setup Guide for BingoV

This guide will help you set up email notifications for your BingoV application using Gmail and nodemailer.

## 🚀 Features Implemented

### 1. **Email Verification (OTP)**
- Users receive a 6-digit OTP when signing up with email/password
- OTP expires after 10 minutes
- Account creation only completes after OTP verification

### 2. **Welcome Emails**
- **Email/Password Users**: Welcome email after successful OTP verification
- **Google Users**: Welcome email after successful Google OAuth signup

### 3. **Password Reset**
- Users can request password reset via email
- 6-digit OTP sent for password reset
- Password change confirmation email sent after successful reset

### 4. **Professional Email Templates**
- Beautiful HTML emails with BingoV branding
- Responsive design for all devices
- Professional styling with gradients and icons

## ⚙️ Setup Instructions

### Step 1: Install Dependencies

The required packages are already installed:
- `nodemailer` - For sending emails
- `validator` - For email validation

### Step 2: Configure Gmail App Password

#### 2.1 Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to "Security" → "2-Step Verification"
3. Enable 2-Step Verification if not already enabled

#### 2.2 Generate App Password
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to "Security" → "App passwords"
3. Select "Mail" and "Other (Custom name)"
4. Enter "BingoV" as the app name
5. Click "Generate"
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables

Add these variables to your `.env` file in the `backend` folder:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-character-app-password
```

**Example:**
```env
EMAIL_USER=myapp@gmail.com
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

### Step 4: Test Email Functionality

1. **Start your backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test email sending:**
   - Try signing up with a new email address
   - Check your email for the OTP
   - Verify the OTP to complete registration

## 🔧 Configuration Options

### Email Service Configuration

The email service is configured in `backend/services/emailService.js`:

```javascript
this.transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});
```

### OTP Configuration

OTP settings are in `backend/models/OTP.js`:

- **Expiration**: 10 minutes (configurable)
- **Length**: 6 digits
- **Auto-cleanup**: Expired OTPs are automatically removed

### Email Templates

All email templates are in `backend/services/emailService.js`:

- **OTP Emails**: Clean, professional design with OTP display
- **Welcome Emails**: Engaging welcome messages with call-to-action
- **Password Reset**: Security-focused with clear instructions

## 📱 Frontend Integration

### OTP Verification Component

The `OTPVerification` component handles:
- 6-digit OTP input with auto-focus
- Paste functionality for OTP
- Resend OTP with countdown timer
- Form validation and error handling

### Signup Flow

1. User fills signup form
2. OTP sent to email
3. User enters OTP + username + password
4. Account created and verified
5. Welcome email sent
6. User redirected to dashboard

### Password Reset Flow

1. User clicks "Forgot Password"
2. User enters email address
3. OTP sent to email
4. User enters OTP + new password
5. Password updated
6. Confirmation email sent

## 🚨 Troubleshooting

### Common Issues

#### 1. **"Invalid credentials" error**
- Check that `EMAIL_USER` and `EMAIL_APP_PASSWORD` are correct
- Ensure 2FA is enabled on your Gmail account
- Verify the app password was generated correctly

#### 2. **Emails not sending**
- Check backend console for error messages
- Verify Gmail account has sufficient storage
- Check if Gmail is blocking the connection

#### 3. **OTP not working**
- Check MongoDB connection
- Verify OTP model is properly imported
- Check if OTP collection exists in database

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
NODE_ENV=development
DEBUG=nodemailer:*
```

### Testing with Different Email Providers

To use other email providers, modify the transporter configuration:

```javascript
// For Outlook/Hotmail
this.transporter = nodemailer.createTransporter({
  service: 'outlook',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// For custom SMTP
this.transporter = nodemailer.createTransporter({
  host: 'smtp.yourprovider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

## 🔒 Security Considerations

### OTP Security
- OTPs expire after 10 minutes
- OTPs can only be used once
- Rate limiting prevents abuse
- OTPs are automatically cleaned up

### Email Security
- Use app passwords, not main account passwords
- Emails are sent over secure connections
- No sensitive data stored in email content

### Rate Limiting
- Implemented to prevent email spam
- Configurable limits in environment variables

## 📊 Monitoring

### Email Logs
Check backend console for email sending logs:
```
OTP email sent successfully: <message-id>
Welcome email sent successfully: <message-id>
Password change email sent successfully: <message-id>
```

### Database Monitoring
Monitor the `otps` collection for:
- OTP creation and usage
- Expired OTP cleanup
- Rate limiting effectiveness

## 🎯 Next Steps

After setting up email functionality:

1. **Test all flows** thoroughly
2. **Customize email templates** if needed
3. **Set up email monitoring** for production
4. **Configure backup email service** for reliability
5. **Add email preferences** for users

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check backend console for error messages
4. Ensure Gmail account settings are correct

---

**Happy coding! 🎯✨**

Your BingoV application now has professional email functionality with OTP verification, welcome emails, and password reset capabilities.
