import crypto from 'crypto';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface EmailService {
  sendVerificationEmail(
    email: string,
    token: string,
    name?: string
  ): Promise<void>;
}

/**
 * Production email service using Nodemailer with Gmail SMTP
 */
class NodemailerEmailService implements EmailService {
  private transporter: Transporter;

  constructor() {
    // Create transporter for Gmail SMTP
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not regular password)
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    token: string,
    name?: string
  ): Promise<void> {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Plinkoo!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name || 'there'}!</h2>
            <p>Thank you for signing up for Plinkoo. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #e9ecef; padding: 10px; border-radius: 4px;">
              ${verificationUrl}
            </p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account with us, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The Plinkoo Team</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textTemplate = `
Hello ${name || 'there'},

Thank you for signing up for Plinkoo! Please verify your email address by visiting:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account with us, you can safely ignore this email.

Best regards,
The Plinkoo Team
    `;

    try {
      await this.transporter.sendMail({
        from: `"Plinkoo" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Verify your email address - Plinkoo',
        text: textTemplate,
        html: htmlTemplate,
      });

      console.log(`✅ Verification email sent to ${email}`);
    } catch (error) {
      console.error('❌ Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}

/**
 * Development email service that logs to console
 */
class ConsoleEmailService implements EmailService {
  async sendVerificationEmail(
    email: string,
    token: string,
    name?: string
  ): Promise<void> {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    console.log('=== EMAIL VERIFICATION (DEV MODE) ===');
    console.log(`To: ${email}`);
    console.log(`Subject: Verify your email address`);
    console.log(`
Hello ${name || 'there'},

Please click the link below to verify your email address:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

Best regards,
Plinkoo Team
    `);
    console.log('====================================');
  }
}

/**
 * Generate a secure verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Get verification token expiration date (24 hours from now)
 */
export function getVerificationExpiry(): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry;
}

// Export the appropriate service based on environment
export const emailService: EmailService = new NodemailerEmailService();
