# Email Configuration Setup

## Gmail SMTP Setup

The application uses Gmail SMTP for sending verification emails in production. Follow these steps to configure it:

### 1. Enable 2-Factor Authentication

- Go to your [Google Account Settings](https://myaccount.google.com/)
- Navigate to Security > 2-Step Verification
- Enable 2-factor authentication if not already enabled

### 2. Generate App Password

- Go to [App Passwords](https://support.google.com/accounts/answer/185833)
- Select "Mail" and "Other (custom name)"
- Enter "Plinkoo API" as the custom name
- Copy the generated 16-character password

### 3. Configure Environment Variables

Add these to your production `.env` file:

```bash
# Gmail SMTP Configuration
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

### 4. Environment Behavior

- **Development**: Emails are logged to console (no actual sending)
- **Production**: Emails are sent via Gmail SMTP when both `GMAIL_USER` and `GMAIL_APP_PASSWORD` are configured

### 5. Security Notes

- Never use your regular Gmail password - always use App Password
- Keep your App Password secure and never commit it to version control
- Consider using environment-specific email addresses for different deployments

### 6. Alternative Providers

To switch to other email providers, modify `emailService.ts`:

- **SendGrid**: Use `@sendgrid/mail`
- **AWS SES**: Use `aws-sdk` with SES
- **Custom SMTP**: Update Nodemailer configuration

## Testing Email Verification

### Development Testing

1. Register a new user
2. Check console logs for verification link
3. Copy the verification URL and test in browser

### Production Testing

1. Ensure Gmail SMTP is configured
2. Register with a real email address
3. Check email inbox for verification message
4. Click verification link to complete process

## Troubleshooting

### Common Issues

1. **"Invalid login"**: Check App Password is correct and 2FA is enabled
2. **"Less secure app access"**: Use App Password instead of regular password
3. **Rate limiting**: Gmail has sending limits; consider SendGrid for high volume
4. **Firewall issues**: Ensure port 587 (or 465) is open for SMTP

### Email Not Received

1. Check spam/junk folder
2. Verify `GMAIL_USER` matches sender address
3. Check server logs for sending errors
4. Ensure recipient email is valid

## Rate Limits

Gmail SMTP has these limits:

- 500 emails per day for regular accounts
- 2000 emails per day for Google Workspace accounts
- 100 recipients per message

For higher volumes, consider:

- SendGrid (99,000 free emails/month)
- AWS SES (62,000 free emails/month)
- Mailgun (5,000 free emails/month)
