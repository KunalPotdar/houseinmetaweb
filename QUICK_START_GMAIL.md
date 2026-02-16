# Quick Start - Gmail Backend Setup (5 minutes)

## Prerequisites
- Node.js v16+ installed ([Download](https://nodejs.org))
- Gmail account (personal or business)

## Quick Setup

### 1️⃣ Enable 2-Step Verification (2 min)
```
Go to: https://myaccount.google.com/security
→ Click "2-Step Verification"
→ Complete setup with your phone
```

### 2️⃣ Create App Password (1 min)
```
Go to: https://myaccount.google.com/apppasswords
→ Select: Mail + Your Device
→ Generate password
→ Copy the 16-character password
```

### 3️⃣ Create .env File (1 min)
Create `.env` file in project root:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your16characterpassword
SUPPORT_EMAIL=support@houseinmeta.com
STRIPE_SECRET_KEY=sk_test_your_stripe_key
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 4️⃣ Install & Start (1 min)
```bash
npm install
npm start
```

You should see:
```
✓ Gmail transporter configured successfully
Server running on: http://localhost:3000
```

### 5️⃣ Test It
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@gmail.com","customerName":"Test User","orderId":"ORD-TEST","packageName":"Professional","price":149.99,"tax":15,"total":164.99,"filesCount":1,"files":[{"name":"test.pdf","size":"2MB"}],"timestamp":"2026-01-20T10:00:00Z","phone":"1234567890","paymentMethod":"card"}'
```

✅ Check your email inbox for confirmation!

---

## What's Included

✅ Full Node.js/Express backend server  
✅ Gmail SMTP integration for transactional emails  
✅ Professional HTML email templates  
✅ Stripe payment processing endpoints  
✅ Order management endpoints  
✅ Error handling & logging  
✅ Security best practices  

## Production Deployment

Update `.env` for production:
```env
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
PORT=your-production-port
```

Then deploy using:
- Heroku
- Railway
- AWS EC2
- DigitalOcean
- Replit
- Or your preferred hosting

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Invalid credentials" | Use App Password, not Gmail password |
| "2-Step Verification required" | Enable 2FA on Gmail account |
| "Connection timeout" | Check internet, disable VPN if needed |
| "Email not received" | Check spam folder, verify email is valid |

For detailed help, see [GMAIL_SETUP_GUIDE.md](GMAIL_SETUP_GUIDE.md)

---

## Next: Configure Frontend

Update frontend base URL (if not localhost:3000):

In `convert2DTo3D.html` or `assets/js/main.js`, set:
```javascript
const API_BASE_URL = 'http://localhost:3000'; // or your production URL
```

Then emails will be sent automatically after payment!

🎉 **Done!** Your email system is now live.
