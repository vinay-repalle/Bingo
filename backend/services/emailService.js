import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });
  }

  // Send OTP email
  async sendOTP(email, otp, purpose = 'verification') {
    try {
      const subject = purpose === 'verification' 
        ? 'BingoV - Email Verification OTP' 
        : 'BingoV - Password Reset OTP';
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎯 BingoV</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your Gaming Adventure Awaits!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px; text-align: center;">
              ${purpose === 'verification' ? 'Email Verification' : 'Password Reset'}
            </h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              ${purpose === 'verification' 
                ? 'Thank you for signing up for BingoV! Please use the OTP below to verify your email address and complete your registration.'
                : 'You requested a password reset for your BingoV account. Please use the OTP below to reset your password.'
              }
            </p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <div style="background: white; padding: 15px; border-radius: 6px; display: inline-block;">
                <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${otp}</span>
              </div>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
              <strong>Important:</strong> This OTP is valid for 10 minutes. Do not share this code with anyone.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #999; font-size: 12px;">
                If you didn't request this, please ignore this email.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>&copy; 2024 BingoV. All rights reserved.</p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `"BingoV" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending OTP email:', error);
      return false;
    }
  }

  // Send welcome email
  async sendWelcomeEmail(email, username) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎯 BingoV</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Welcome to Your Gaming Adventure!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px; text-align: center;">Welcome to BingoV! 🎉</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi <strong>${username}</strong>! 🎮
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Your account has been successfully created and verified! You're now ready to dive into the exciting world of BingoV.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
                <li>🎯 Start playing Bingo with players worldwide</li>
                <li>🏆 Compete on leaderboards and unlock achievements</li>
                <li>👥 Challenge friends and family</li>
                <li>⚡ Experience smooth, modern gameplay</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}/game" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                🚀 Start Playing Now
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>&copy; 2024 BingoV. All rights reserved.</p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `"BingoV" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to BingoV! 🎯 Your Account is Ready',
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  // Send password change notification
  async sendPasswordChangeEmail(email, username) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎯 BingoV</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Account Security Update</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px; text-align: center;">Password Changed Successfully 🔐</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi <strong>${username}</strong>! 
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Your BingoV account password has been successfully updated. This change was made at ${new Date().toLocaleString()}.
            </p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #856404; margin-top: 0;">🔒 Security Reminder</h3>
              <p style="color: #856404; margin-bottom: 0;">
                If you didn't make this change, please contact our support team immediately.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}/login" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                🔑 Sign In to Your Account
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>&copy; 2024 BingoV. All rights reserved.</p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `"BingoV" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'BingoV - Password Changed Successfully 🔐',
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Password change email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending password change email:', error);
      return false;
    }
  }

  // Send Google account creation email
  async sendGoogleWelcomeEmail(email, username) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎯 BingoV</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Welcome to Your Gaming Adventure!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px; text-align: center;">Welcome to BingoV! 🎉</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi <strong>${username}</strong>! 🎮
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Your BingoV account has been successfully created using Google! You're now ready to dive into the exciting world of BingoV.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
              <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
                <li>🎯 Start playing Bingo with players worldwide</li>
                <li>🏆 Compete on leaderboards and unlock achievements</li>
                <li>👥 Challenge friends and family</li>
                <li>⚡ Experience smooth, modern gameplay</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}/game" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                🚀 Start Playing Now
              </a>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>&copy; 2024 BingoV. All rights reserved.</p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `"BingoV" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to BingoV! 🎯 Your Google Account is Ready',
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Google welcome email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending Google welcome email:', error);
      return false;
    }
  }
}

export default new EmailService();
