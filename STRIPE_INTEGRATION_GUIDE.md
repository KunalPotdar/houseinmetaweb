# Stripe Payment Integration Guide for Dream Home 3D

## Overview
This guide explains how to set up Stripe payment processing for your Dream Home 3D service.

---

## 1. Getting Started with Stripe

### 1.1 Create a Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Click "Sign Up" and create your account
3. Verify your email and complete your profile
4. Enable your Stripe account for production

### 1.2 Get Your API Keys
1. Go to **Dashboard → Developers → API Keys**
2. You'll see two sets of keys:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

**⚠️ IMPORTANT:**
- **Publishable Key**: Safe to use in frontend code
- **Secret Key**: NEVER share or expose in frontend - keep on backend only

---

## 2. Frontend Integration (Already Implemented)

### 2.1 Update Your Stripe Public Key

In `convert2DTo3D.html`, find this line in the script section:

```javascript
const STRIPE_PUBLIC_KEY = 'pk_test_YOUR_STRIPE_PUBLIC_KEY';
```

Replace `pk_test_YOUR_STRIPE_PUBLIC_KEY` with your actual Stripe publishable key:

```javascript
const STRIPE_PUBLIC_KEY = 'pk_test_51234567890abcdef';
```

### 2.2 What the Frontend Does

✅ **Card Element**: Securely collects card details from users
✅ **Payment Method Creation**: Converts card data to a payment method token
✅ **Error Handling**: Displays card errors to users
✅ **Payment Intent Communication**: Sends secure payment requests to backend

---

## 3. Backend Integration (You Need to Implement)

### 3.1 Create Payment Intent Endpoint

Create an API endpoint: `POST /api/create-payment-intent`

**This endpoint should:**

```javascript
// Example Node.js/Express implementation
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency, paymentMethodId, orderData } = req.body;

        // Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in cents (e.g., 5000 = €50.00)
            currency: currency, // 'eur' for Euro
            payment_method: paymentMethodId,
            confirm: true, // Automatically confirm the payment
            return_url: 'https://yourdomain.com/payment-success', // For 3D Secure
            metadata: {
                orderId: orderData.orderId,
                userEmail: orderData.user.email,
                package: orderData.package
            },
            description: `Dream Home 3D - ${orderData.package} Package`,
            receipt_email: orderData.user.email // Send receipt to user
        });

        res.json({
            status: paymentIntent.status,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
```

### 3.2 Create Orders Endpoint

Create an API endpoint: `POST /api/orders`

**This endpoint should:**

```javascript
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;

        // Save order to database
        const order = await Order.create({
            orderId: orderData.orderId,
            userId: req.user.id, // If user is authenticated
            firstName: orderData.user.firstName,
            lastName: orderData.user.lastName,
            email: orderData.user.email,
            phone: orderData.user.phone,
            package: orderData.package,
            price: orderData.price,
            tax: orderData.tax,
            total: orderData.total,
            filesCount: orderData.filesCount,
            paymentMethod: orderData.paymentProcessor,
            files: orderData.files,
            gdprConsent: orderData.gdpr,
            status: 'pending', // Will be updated to 'completed' after payment
            createdAt: new Date()
        });

        // Send confirmation email
        await sendConfirmationEmail({
            to: orderData.user.email,
            firstName: orderData.user.firstName,
            orderId: orderData.orderId,
            total: orderData.total
        });

        res.json({
            success: true,
            orderId: order.orderId,
            message: 'Order saved successfully'
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
```

---

## 4. Environment Variables Setup

### 4.1 Create `.env` File

In your backend root directory, create a `.env` file:

```env
# Stripe Keys
STRIPE_PUBLIC_KEY=pk_test_51234567890abcdef
STRIPE_SECRET_KEY=sk_test_9876543210fedcba

# Environment
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=your_database_url

# Email Service
SENDGRID_API_KEY=your_sendgrid_key
```

### 4.2 Load Environment Variables

```javascript
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

---

## 5. Payment Flow Diagram

```
User fills form
        ↓
Clicks "Proceed to Payment"
        ↓
Stripe.js creates payment method (card data stays with Stripe)
        ↓
Frontend sends payment method ID + order data to backend
        ↓
Backend creates Payment Intent with Stripe
        ↓
Stripe processes payment
        ↓
Payment succeeds or fails
        ↓
Backend saves order to database
        ↓
Frontend shows success message
        ↓
Confirmation email sent to user
```

---

## 6. Testing Stripe Integration

### 6.1 Use Stripe Test Cards

Stripe provides test card numbers:

| Card Number | CVC | Exp | Result |
|---|---|---|---|
| 4242 4242 4242 4242 | Any 3 digits | Any future date | Successful payment |
| 4000 0000 0000 0002 | Any 3 digits | Any future date | Card declined |
| 4000 0025 0000 3155 | Any 3 digits | Any future date | 3D Secure required |

**Example:**
- Card: 4242 4242 4242 4242
- Expiry: 12/25
- CVC: 123
- Name: Test User

### 6.2 Test Workflow

1. Open your conversion page
2. Fill in all required fields
3. Upload a test file
4. Select a package
5. Use test card 4242 4242 4242 4242
6. Check your Stripe dashboard for the payment

---

## 7. Production Deployment

### 7.1 Switch to Live Keys

When ready for production:

1. In Stripe Dashboard → API Keys
2. Toggle to "Live" mode
3. Copy your live keys (`pk_live_*` and `sk_live_*`)
4. Update your `.env` file with live keys
5. Update the frontend public key

### 7.2 Enable Live Stripe Account

1. Complete Stripe's onboarding process
2. Add your business details
3. Set up bank account for payouts
4. Enable live payments

### 7.3 Security Checklist

- [ ] HTTPS enabled on all pages
- [ ] API keys stored in environment variables (never in code)
- [ ] Secret key never exposed to frontend
- [ ] CORS properly configured
- [ ] Rate limiting on payment endpoints
- [ ] Input validation on all fields
- [ ] Logging of all payment attempts
- [ ] Webhook handler implemented (see section 8)

---

## 8. Webhook Setup (Important!)

Webhooks notify your server when payment events occur.

### 8.1 Create Webhook Handler

```javascript
// Express webhook handler
const express = require('express');
const app = express();

app.post('/webhook/stripe', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle different event types
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id);
            
            // Update order status in database
            await Order.updateOne(
                { orderId: paymentIntent.metadata.orderId },
                { status: 'completed', paymentIntentId: paymentIntent.id }
            );
            break;

        case 'payment_intent.payment_failed':
            const failedIntent = event.data.object;
            console.log('Payment failed:', failedIntent.id);
            
            // Update order status
            await Order.updateOne(
                { orderId: failedIntent.metadata.orderId },
                { status: 'failed' }
            );
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
});
```

### 8.2 Register Webhook in Stripe Dashboard

1. Go to **Developers → Webhooks**
2. Click "Add Endpoint"
3. Enter your webhook URL: `https://yourdomain.com/webhook/stripe`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the signing secret and add to `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef
```

---

## 9. Error Handling

### 9.1 Common Errors

| Error | Cause | Solution |
|---|---|---|
| Invalid API Key | Wrong or expired key | Verify key in dashboard |
| Card declined | Card doesn't have sufficient funds | User needs different card |
| 3D Secure required | Additional verification needed | User must complete verification |
| Missing parameter | Required field not sent | Check all required fields |

### 9.2 User-Friendly Error Messages

```javascript
const errorMessages = {
    'card_declined': 'Your card was declined. Please try another card.',
    'generic_decline': 'Your payment was declined. Please contact your bank.',
    'invalid_expiry_year': 'Your card expiration year is invalid.',
    'invalid_expiry_month': 'Your card expiration month is invalid.',
    'processing_error': 'An error occurred while processing. Please try again.'
};
```

---

## 10. Compliance & Security

### 10.1 PCI Compliance

✅ **Your app is PCI compliant because:**
- Stripe.js handles card data
- Card numbers never touch your server
- You only process payment method IDs

### 10.2 GDPR Compliance

✅ **Data handling:**
- Email used for receipts (with user consent)
- Order data retained per your retention policy
- Payment data handled by Stripe
- Delete user data on request

### 10.3 CVE & Security Updates

- Always use latest Stripe.js version
- Keep Stripe SDK updated
- Monitor security advisories

---

## 11. Monitoring & Analytics

### 11.1 View Payments in Stripe Dashboard

1. Go to **Payments**
2. See all transactions
3. Click on any payment to see details
4. Download reports

### 11.2 Track in Your Database

```javascript
const orderSchema = new Schema({
    orderId: String,
    paymentIntentId: String,
    amount: Number,
    currency: String,
    status: String, // 'pending', 'completed', 'failed'
    userEmail: String,
    createdAt: Date,
    completedAt: Date
});
```

---

## 12. Troubleshooting

### 12.1 Payment Not Processing

**Check:**
1. Stripe account is active
2. API keys are correct
3. Amount is in correct format (cents)
4. Currency is correct ('eur' for Euro)
5. Card is a valid test card
6. Browser console for errors

### 12.2 Webhook Not Triggering

**Check:**
1. Webhook URL is correct
2. Webhook secret is correct
3. Server is accepting POST requests
4. Firewall not blocking Stripe IPs

### 12.3 Card Element Not Showing

**Check:**
1. Stripe.js is loaded
2. API key is valid
3. JavaScript errors in console
4. CSS not hiding the element

---

## 13. Production Checklist

- [ ] HTTPS enabled
- [ ] Live Stripe keys obtained
- [ ] Payment Intent endpoint created
- [ ] Orders endpoint created
- [ ] Webhook handler implemented
- [ ] Error handling implemented
- [ ] Email confirmations working
- [ ] User data encrypted
- [ ] GDPR compliance verified
- [ ] PCI compliance verified
- [ ] Payment testing completed
- [ ] Failure scenarios tested
- [ ] Refund process defined
- [ ] Support email configured
- [ ] Terms updated with payment info

---

## 14. Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe API Reference**: https://stripe.com/docs/api
- **Test Cards**: https://stripe.com/docs/testing#test-cards
- **Webhooks Guide**: https://stripe.com/docs/webhooks
- **Payment Intents**: https://stripe.com/docs/payments/payment-intents

---

## 15. Support & Questions

If you have questions:
1. Check Stripe's documentation
2. Review error logs
3. Check Stripe Dashboard for payment status
4. Contact Stripe Support: https://support.stripe.com

---

**Last Updated:** January 2024  
**Stripe API Version:** Latest
