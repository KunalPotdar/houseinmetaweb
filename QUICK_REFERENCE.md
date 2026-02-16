# 🚀 Gmail Backend - Quick Reference Card

## ⚡ 5-Minute Setup

```bash
# 1. Create .env file (2 min)
# Copy from .env.example, add your Gmail credentials:
# GMAIL_USER=your-email@gmail.com
# GMAIL_APP_PASSWORD=your16charpassword

# 2. Install dependencies (1 min)
npm install

# 3. Start server (1 min)
npm start

# 4. Test it (1 min)
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to":"your-email@gmail.com",
    "customerName":"Test",
    "orderId":"ORD-TEST",
    "packageName":"Professional",
    "price":149.99,
    "tax":15,
    "total":164.99,
    "filesCount":1,
    "files":[{"name":"test.pdf","size":"2MB"}],
    "timestamp":"2026-01-20T10:00:00Z",
    "phone":"1234567890",
    "paymentMethod":"card"
  }'
```

---

## 📋 Gmail Setup Checklist

- [ ] Go to https://myaccount.google.com/security
- [ ] Enable 2-Step Verification
- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Select "Mail" + Your Device
- [ ] Copy 16-character password
- [ ] Add to `.env` as `GMAIL_APP_PASSWORD`

---

## 📝 .env Template

```env
# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your16charpassword
SUPPORT_EMAIL=support@houseinmeta.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLIC_KEY=pk_test_your_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

---

## 🔌 API Endpoints Quick Reference

| Endpoint | Method | Use Case |
|----------|--------|----------|
| `/api/send-email` | POST | Send order confirmation email |
| `/api/orders` | POST | Save order to backend |
| `/api/create-payment-intent` | POST | Create Stripe payment |
| `/api/send-welcome-email` | POST | Send welcome email |
| `/api/health` | GET | Check server status |
| `/api/orders/:orderId` | GET | Get order status |

---

## 📧 Email API Request

```json
POST /api/send-email

{
  "to": "customer@example.com",
  "customerName": "John Doe",
  "orderId": "ORD-1234567890",
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
}
```

---

## 💾 Save Order API Request

```json
POST /api/orders

{
  "orderId": "ORD-1234567890",
  "timestamp": "2026-01-20T10:30:00Z",
  "user": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  },
  "package": "Professional",
  "price": 149.99,
  "tax": 15.00,
  "total": 164.99,
  "filesCount": 2,
  "paymentMethod": "card",
  "files": [
    {"name": "floor-plan.pdf", "size": 2560000},
    {"name": "blueprint.dwg", "size": 5242880}
  ],
  "paymentProcessor": "stripe"
}
```

---

## 🐛 Troubleshooting Quick Guide

| Problem | Solution |
|---------|----------|
| Invalid credentials | Use App Password, not Gmail password |
| 2FA required | Enable 2-Step Verification on Gmail |
| Connection timeout | Check internet, disable VPN |
| Email not received | Check spam folder, verify email address |
| CORS error | Check backend is running on correct port |
| Module not found | Run `npm install` |
| Port already in use | Change PORT in .env or kill process |

---

## 📞 Key Commands

```bash
# Install dependencies
npm install

# Start server
npm start

# Start in development mode with auto-reload
npm run dev

# Test health endpoint
curl http://localhost:3000/api/health

# Check if port is in use
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows
```

---

## 🎯 Email Flow

```
Customer pays → Payment confirmed → handlePaymentSuccess()
    ↓
sendOrderToBackend() → Saves to /api/orders
    ↓
sendOrderConfirmationEmail() → Calls /api/send-email
    ↓
Backend generates HTML email
    ↓
Nodemailer connects Gmail SMTP
    ↓
Email sent to customer
    ↓
✅ Confirmation email in inbox
```

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success ✅ |
| 201 | Created ✅ |
| 400 | Bad request ❌ |
| 401 | Unauthorized ❌ |
| 403 | Forbidden ❌ |
| 404 | Not found ❌ |
| 500 | Server error ❌ |

---

## 🔐 Security Reminders

✅ Never commit `.env` to Git  
✅ Use App Password, not Gmail password  
✅ Add `.env` to `.gitignore`  
✅ Rotate credentials periodically  
✅ Monitor Gmail activity  
✅ Use HTTPS in production  

---

## 📦 Dependencies

```json
"dependencies": {
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "nodemailer": "^6.9.7",
  "stripe": "^14.11.0"
}
```

---

## 🚀 Production Checklist

- [ ] Update `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Update `CLIENT_URL` to your domain
- [ ] Test email sending
- [ ] Deploy backend server
- [ ] Update frontend backend URL
- [ ] Enable HTTPS
- [ ] Monitor email delivery
- [ ] Set up error tracking
- [ ] Configure rate limiting

---

## 📚 Documentation

| Doc | Purpose |
|-----|---------|
| QUICK_START_GMAIL.md | 5-min setup |
| GMAIL_SETUP_GUIDE.md | Gmail details |
| README_GMAIL_BACKEND.md | Overview |
| IMPLEMENTATION_COMPLETE.md | Technical |
| ARCHITECTURE.md | Design |
| DOCUMENTATION_INDEX.md | Navigation |

---

## 🎓 Useful Links

- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [Nodemailer Docs](https://nodemailer.com)
- [Express.js Guide](https://expressjs.com)
- [Stripe API](https://stripe.com/docs)

---

## ✨ Features

✅ Automatic email after payment  
✅ Professional email template  
✅ Customer details included  
✅ File information shown  
✅ Price breakdown displayed  
✅ Next steps explained  
✅ Production-ready code  
✅ Complete documentation  

---

## 🎊 You're Ready!

With Gmail setup complete, your email system is ready to:

1. Accept customer payments (Stripe)
2. Automatically send confirmation emails (Gmail)
3. Include all order details
4. Track orders
5. Scale to production

**Status**: ✅ Ready to deploy

Start with [QUICK_START_GMAIL.md](QUICK_START_GMAIL.md) → 5 minutes → Success! 🚀
