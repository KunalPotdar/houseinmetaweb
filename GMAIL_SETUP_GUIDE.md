# Gmail Configuration Guide for House In Meta

## Overview
This guide walks you through setting up Gmail to send transactional emails from your House In Meta application. We use Gmail's App Passwords feature for secure authentication.

## Step-by-Step Gmail Setup

### Step 1: Enable 2-Step Verification (Required)

Gmail App Passwords require 2-Step Verification to be enabled.

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Click **"How you sign in to Google"** in the left sidebar
3. Click **"2-Step Verification"**
4. Click **"Get started"**
5. Follow the prompts to verify your identity (you'll receive a code on your phone)
6. Complete the setup by choosing a verification method

✅ You should see "2-Step Verification is on" confirmation

---

### Step 2: Create an App Password

App Passwords are special 16-character passwords for third-party applications like your backend server.

1. Go to [Google Account Security](https://myaccount.google.com/security) (or [App Passwords](https://myaccount.google.com/apppasswords) directly)
2. In the left sidebar, click **"App passwords"**
   - ⚠️ If you don't see this option, you haven't enabled 2-Step Verification
3. Select:
   - **App**: Mail
   - **Device**: Windows Computer (or select your actual operating system)
4. Click **"Generate"**
5. Google will show a 16-character password like: `abcd efgh ijkl mnop`
6. **Copy the entire password** (including spaces, or copy without spaces - both work)

---

### Step 3: Create .env File

1. In your project root directory, create a file named `.env`
2. Copy the contents of `.env.example`
3. Fill in your Gmail credentials:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
SUPPORT_EMAIL=support@houseinmeta.com
```

**Example:**
```env
GMAIL_USER=john.doe@gmail.com
GMAIL_APP_PASSWORD=qwertyuiopasdfgh
SUPPORT_EMAIL=support@houseinmeta.com
```

⚠️ **IMPORTANT**: 
- Never commit `.env` file to Git
- Add `.env` to `.gitignore` file
- App Passwords are meant for applications, not personal use

---

### Step 4: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install:
- `express` - Web server framework
- `nodemailer` - Email sending library
- `stripe` - Payment processing
- `cors` - Cross-origin request handling
- `dotenv` - Environment variable loading

---

### Step 5: Start the Backend Server

```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║      House In Meta - Backend Server (with Gmail)         ║
╠═══════════════════════════════════════════════════════════╣
║ Server running on: http://localhost:3000                  ║
║ Environment: development                                  ║
║ Gmail User: your-email@gmail.com                          ║
║                                                           ║
║ Endpoints:                                                ║
║   POST   /api/send-email              - Send email         ║
║   POST   /api/orders                  - Save order         ║
║   POST   /api/create-payment-intent   - Stripe payment     ║
║   GET    /api/health                  - Health check       ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Testing the Email Service

### Test 1: Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Test 2: Send Test Email

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@gmail.com",
    "customerName": "John Doe",
    "orderId": "ORD-TEST-20260120",
    "packageName": "Professional",
    "price": 149.99,
    "tax": 15.00,
    "total": 164.99,
    "filesCount": 2,
    "files": [
      {"name": "floor-plan.pdf", "size": "2.5 MB"},
      {"name": "blueprint.dwg", "size": "5.1 MB"}
    ],
    "timestamp": "2026-01-20T10:30:00Z",
    "phone": "1234567890",
    "paymentMethod": "card"
  }'
```

Expected response:
```json
{
  "success": true,
  "messageId": "message-id-here",
  "message": "Confirmation email sent successfully to your-email@gmail.com"
}
```

### Test 3: Welcome Email

```bash
curl -X POST http://localhost:3000/api/send-welcome-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@gmail.com",
    "firstName": "John"
  }'
```

---

## Common Issues & Solutions

### Issue: "Invalid login credentials"
**Cause**: Using regular Gmail password instead of App Password
**Solution**: 
- Go back to Step 2
- Generate a new App Password
- Use the 16-character password, not your regular Gmail password

### Issue: "Less secure apps" error
**Cause**: Google's security settings are blocking the connection
**Solution**: 
- You MUST use App Passwords (not GMAIL_APP_PASSWORD = regular password)
- Ensure 2-Step Verification is enabled
- Create a new App Password following Step 2

### Issue: Email not being received
**Cause**: Gmail spam filters or configuration issue
**Solution**:
1. Check Gmail spam folder
2. Add your sending email to contacts
3. Verify GMAIL_USER in .env matches your Gmail account
4. Check server logs for error messages

### Issue: "No recipients defined"
**Cause**: Email address validation failed
**Solution**:
- Ensure the "to" field is a valid email address
- Check for typos in email addresses
- Verify email format: `user@domain.com`

### Issue: "SMTP connection timeout"
**Cause**: Network or firewall issue
**Solution**:
- Check internet connection
- Disable VPN temporarily (some VPNs block SMTP)
- Ensure you're connected to Gmail's servers (not a corporate network with email restrictions)

---

## Advanced Configuration

### Using a Business Gmail Account

If you're using a Google Workspace (business Gmail):

1. Go to [Google Workspace Security Settings](https://admin.google.com/ac/security)
2. Ensure App Passwords are enabled
3. Follow the same steps as above
4. Some organizations may restrict app access - contact your admin

### Scaling Email Sending

For high-volume email sending (100+ emails/day), consider:

1. **SendGrid**: Professional email service (built-in rate limiting)
2. **AWS SES**: Enterprise email service (cheaper per email)
3. **Google Cloud Email**: For Google Workspace users

Gmail's free tier has limits (~500 emails/day) and may rate-limit your application.

### Email Customization

To customize the email template, edit the `generateOrderConfirmationEmail()` function in `server.js`:

```javascript
function generateOrderConfirmationEmail(customerName, orderId, packageName, price, tax, total, files, timestamp) {
  // Edit HTML here to customize email appearance
  return `<html>...</html>`;
}
```

---

## Production Deployment

### Before deploying to production:

1. ✅ Update `.env` variables for production Gmail account
2. ✅ Add `.env` to `.gitignore` file
3. ✅ Set `NODE_ENV=production`
4. ✅ Update `CLIENT_URL` to your production domain
5. ✅ Add error monitoring (Sentry, LogRocket, etc.)
6. ✅ Enable HTTPS only
7. ✅ Rate limit email endpoints to prevent abuse
8. ✅ Add authentication to API endpoints
9. ✅ Test email delivery thoroughly before launch

### .gitignore Update

Make sure your `.gitignore` file includes:

```
.env
.env.local
node_modules/
*.log
.DS_Store
.vscode/
```

---

## Email Flow Diagram

```
User submits form on convert2DTo3D.html
                    ↓
Frontend validates input
                    ↓
Frontend calls Stripe Payment API
                    ↓
Stripe processes payment
                    ↓
Payment successful → Frontend calls /api/send-email
                    ↓
Backend sends email via Gmail SMTP
                    ↓
Customer receives confirmation email
                    ↓
Order saved to database/backend
```

---

## Monitoring Email Delivery

### In Gmail:
1. Go to [Gmail Sent Mail](https://mail.google.com/mail/u/0/#sent)
2. Look for emails sent from your configured address
3. Open any email to see recipient list

### In Server Logs:
```
✓ Email sent successfully
  To: customer@example.com
  Order: ORD-1234567890
  Message ID: message-id-here
```

---

## Troubleshooting Checklist

- [ ] 2-Step Verification is enabled on Gmail account
- [ ] App Password has been created and copied
- [ ] `.env` file exists with correct credentials
- [ ] `.env` file is in `.gitignore`
- [ ] `npm install` has been run
- [ ] Server starts without errors (`npm start`)
- [ ] Health check endpoint works (`/api/health`)
- [ ] Test email sends successfully
- [ ] Received email in inbox (not spam)
- [ ] Email contains all order details correctly formatted

---

## Support

If you encounter issues:

1. Check the error messages in the console
2. Verify all environment variables in `.env`
3. Test with the curl commands above
4. Check Gmail's Activity log for blocked connections
5. Contact Gmail support if IP is blocked

---

## Next Steps

1. ✅ Backend server with Gmail is now configured
2. ✅ Frontend is set up to call `/api/send-email` after payment
3. Next: Configure your frontend to point to the correct backend URL
4. Next: Update `CLIENT_URL` in `.env` to match your domain
5. Next: Deploy backend to production

**You're all set!** Customers will now receive professional order confirmation emails after successful payment.
