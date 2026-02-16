# Email Service Setup Guide

## Overview
The website now sends automated confirmation emails after successful Stripe payment. This guide explains how to set up the backend email service.

## Required Backend Endpoints

### 1. `/api/orders` (Enhanced)
**Purpose:** Save order and trigger email notification  
**Method:** POST  
**Request Body:**
```json
{
  "orderId": "ORD-1234567890",
  "timestamp": "2024-01-15T10:30:00Z",
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
    {"name": "floor-plan.pdf", "size": 2048000},
    {"name": "building-plan.dwg", "size": 5120000}
  ],
  "paymentProcessor": "stripe",
  "sendEmail": true,
  "emailTemplate": "order_confirmation"
}
```

**Response:**
```json
{
  "success": true,
  "orderId": "ORD-1234567890",
  "message": "Order saved successfully"
}
```

### 2. `/api/send-email` (New)
**Purpose:** Send transactional confirmation email to customer  
**Method:** POST  
**Request Body:**
```json
{
  "to": "john@example.com",
  "customerName": "John Doe",
  "orderId": "ORD-1234567890",
  "packageName": "Professional",
  "price": 149.99,
  "tax": 15.00,
  "total": 164.99,
  "filesCount": 2,
  "files": [
    {"name": "floor-plan.pdf", "size": "2 MB"},
    {"name": "building-plan.dwg", "size": "5 MB"}
  ],
  "timestamp": "2024-01-15T10:30:00Z",
  "phone": "1234567890",
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "email-id-123456",
  "message": "Email sent successfully to john@example.com"
}
```

## Email Service Options

### Option 1: SendGrid (Recommended)
**Advantages:** Reliable, affordable, easy to use

**Setup Steps:**
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API key (Settings → API Keys)
3. Install Node.js package: `npm install @sendgrid/mail`

**Backend Implementation (Node.js/Express):**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/send-email', async (req, res) => {
  const { to, customerName, orderId, packageName, price, tax, total, files, timestamp } = req.body;

  const emailContent = `
    <h2>Order Confirmation</h2>
    <p>Dear ${customerName},</p>
    <p>Thank you for your order! Here are your order details:</p>
    
    <h3>Order Information</h3>
    <ul>
      <li><strong>Order ID:</strong> ${orderId}</li>
      <li><strong>Date:</strong> ${new Date(timestamp).toLocaleDateString()}</li>
      <li><strong>Package:</strong> ${packageName}</li>
    </ul>
    
    <h3>Uploaded Files (${files.length})</h3>
    <ul>
      ${files.map(f => `<li>${f.name} (${f.size})</li>`).join('')}
    </ul>
    
    <h3>Order Total</h3>
    <ul>
      <li>Subtotal: €${price.toFixed(2)}</li>
      <li>Tax (10%): €${tax.toFixed(2)}</li>
      <li><strong>Total: €${total.toFixed(2)}</strong></li>
    </ul>
    
    <p>Your 3D conversion will begin shortly. You'll receive email updates as your project progresses.</p>
    <p>If you have any questions, please contact us at support@houseinmeta.com</p>
    
    <p>Best regards,<br/>House In Meta Team</p>
  `;

  const msg = {
    to: to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `Order Confirmation - ${orderId}`,
    html: emailContent
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true, messageId: 'sent' });
  } catch (error) {
    console.error('SendGrid error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Option 2: AWS SES (Simple Email Service)
**Advantages:** Scalable, cost-effective for high volume

**Setup Steps:**
1. Sign up for AWS account
2. Verify sender email in SES
3. Install package: `npm install aws-sdk`

**Backend Implementation:**
```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'eu-west-1' });

app.post('/api/send-email', async (req, res) => {
  const { to, customerName, orderId, packageName, price, tax, total, files, timestamp } = req.body;

  const params = {
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: `Order Confirmation - ${orderId}` },
      Body: {
        Html: { Data: generateEmailHTML(customerName, orderId, packageName, price, tax, total, files, timestamp) }
      }
    }
  };

  try {
    const result = await ses.sendEmail(params).promise();
    res.json({ success: true, messageId: result.MessageId });
  } catch (error) {
    console.error('SES error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Option 3: Resend (Modern Email API)
**Advantages:** Simple, modern, great for transactional emails

**Setup Steps:**
1. Sign up at [resend.com](https://resend.com)
2. Create API key
3. Install package: `npm install resend`

**Backend Implementation:**
```javascript
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/send-email', async (req, res) => {
  const { to, customerName, orderId, packageName, price, tax, total, files, timestamp } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'noreply@houseinmeta.com',
      to: to,
      subject: `Order Confirmation - ${orderId}`,
      html: generateEmailHTML(customerName, orderId, packageName, price, tax, total, files, timestamp)
    });

    res.json({ success: true, messageId: data.id });
  } catch (error) {
    console.error('Resend error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## Email Template Function

```javascript
function generateEmailHTML(customerName, orderId, packageName, price, tax, total, files, timestamp) {
  const filesList = files.map(f => `<li>${f.name} (${f.size})</li>`).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
        .section { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
        .section h3 { color: #667eea; margin-top: 0; }
        ul { list-style: none; padding-left: 0; }
        li { padding: 5px 0; border-bottom: 1px solid #ddd; }
        li:last-child { border-bottom: none; }
        .total { font-size: 18px; font-weight: bold; color: #764ba2; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for choosing House In Meta!</p>
        </div>
        
        <p>Dear ${customerName},</p>
        <p>Your order has been successfully placed and paid. Below are your order details:</p>
        
        <div class="section">
          <h3>Order Information</h3>
          <ul>
            <li><strong>Order ID:</strong> ${orderId}</li>
            <li><strong>Date:</strong> ${new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</li>
            <li><strong>Package:</strong> ${packageName}</li>
          </ul>
        </div>
        
        <div class="section">
          <h3>Uploaded Files (${files.length})</h3>
          <ul>
            ${filesList}
          </ul>
        </div>
        
        <div class="section">
          <h3>Order Total</h3>
          <ul>
            <li>Subtotal: <strong>€${price.toFixed(2)}</strong></li>
            <li>Tax (10%): <strong>€${tax.toFixed(2)}</strong></li>
            <li class="total">Total: €${total.toFixed(2)}</li>
          </ul>
        </div>
        
        <p><strong>What happens next?</strong></p>
        <p>Your 3D floor plan conversion will begin shortly. Our team will process your files and you'll receive email updates on the progress.</p>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
        
        <div class="footer">
          <p>© 2024 House In Meta. All rights reserved.</p>
          <p>Questions? Contact us at support@houseinmeta.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
```

## Environment Variables

Add these to your `.env` file:

```
# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@houseinmeta.com

# AWS SES
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_SES_FROM_EMAIL=noreply@houseinmeta.com

# Resend
RESEND_API_KEY=your_resend_api_key_here
```

## Testing the Email Functionality

### Test with SendGrid:
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "customerName": "John Doe",
    "orderId": "ORD-TEST-001",
    "packageName": "Professional",
    "price": 149.99,
    "tax": 15.00,
    "total": 164.99,
    "filesCount": 1,
    "files": [{"name": "test.pdf", "size": "2 MB"}],
    "timestamp": "2024-01-15T10:30:00Z",
    "phone": "1234567890",
    "paymentMethod": "card"
  }'
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Emails not being sent | Check API key and email verification in service settings |
| Emails going to spam | Add SPF and DKIM records, check sender domain |
| 403 Forbidden error | Verify API key has correct permissions |
| Email sender mismatch | Ensure 'from' address matches verified sender in email service |
| High bounce rates | Check recipient email addresses are valid |

## Frontend Changes Made

The frontend now includes:
1. Enhanced `handlePaymentSuccess()` function that waits for email to send
2. New `sendOrderConfirmationEmail()` function that calls the `/api/send-email` endpoint
3. Updated `sendOrderToBackend()` to return promises and trigger email sending
4. Error handling that gracefully fails if email sending has issues (order is still saved)

## Next Steps

1. Choose an email service provider (SendGrid recommended for ease)
2. Set up the API key and backend endpoint
3. Test with the curl command above
4. Deploy to production
5. Monitor email delivery in the service provider's dashboard

## Notes

- Order is saved even if email fails, ensuring customer payment is never lost
- Email template includes professional styling matching the website design
- All customer information is included in the email for their records
- Email service is called after successful payment validation
- Error handling is graceful - order completes even if email service is temporarily down
