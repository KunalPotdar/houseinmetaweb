# Lambda API Invocation Guide

Your Node.js backend is now configured to work with AWS Lambda. Use this fetch pattern for all API calls:

## Standard Lambda Fetch Pattern

```javascript
await fetch("YOUR_API_URL", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name,
    email,
    projectName,
    pdfBase64
  })
});
```

## Updated Configuration

All your API calls now automatically use the Lambda endpoint through `API_CONFIG`.

### Before (Hardcoded):
```javascript
fetch('http://localhost:3000/api/orders', { ... })
fetch('/api/send-email', { ... })
```

### After (Lambda-compatible):
```javascript
fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}`, { ... })
fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.sendEmail}`, { ... })
```

## Files Updated

✅ **assets/js/api-config.js**
- Added Lambda endpoint detection
- Added `lambdaFetch()` helper function
- Supports both localhost and Lambda endpoints

✅ **assets/js/order-processing.js**
- Updated all fetch calls to use `API_CONFIG.baseURL`
- Maintains existing functionality
- Works with both local and Lambda deployment

✅ **assets/js/floor-plan-submission.js**
- Updated endpoint to use `API_CONFIG`
- File uploads work with Lambda

## How to Use

### 1. Set Your Lambda Endpoint

Edit `assets/js/api-config.js`:

```javascript
baseURL: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000'
  : 'https://YOUR_LAMBDA_ID.execute-api.us-east-1.amazonaws.com', // Replace with your Lambda endpoint
```

### 2. Update After Lambda Deployment

After running `npm run deploy`, copy the endpoint:

```
endpoint: https://xxxxx.execute-api.us-east-1.amazonaws.com
```

Replace `YOUR_LAMBDA_ID` with your actual ID.

## API Endpoints Configuration

All endpoints are centralized in `API_CONFIG.endpoints`:

```javascript
const API_CONFIG = {
  endpoints: {
    sendEmail: '/api/send-email',           // Send order confirmation
    orders: '/api/orders',                   // Save order data
    paymentIntent: '/api/create-payment-intent', // Stripe payment
    health: '/api/health',                   // Health check
    welcomeEmail: '/api/send-welcome-email', // Welcome email
    submitFloorPlan: '/api/submit-floor-plan'   // Floor plan upload
  }
};
```

## Example API Calls

### Send Order to Lambda

```javascript
const orderPayload = {
  orderId: 'ORD-123456',
  user: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890'
  },
  package: 'Professional',
  price: 149.99,
  tax: 15.00,
  total: 164.99,
  files: []
};

const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.orders}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderPayload)
});

const data = await response.json();
console.log('Order response:', data);
```

### Send Email via Lambda

```javascript
const emailPayload = {
  to: 'customer@example.com',
  customerName: 'John Doe',
  orderId: 'ORD-123456',
  packageName: 'Professional',
  price: 149.99,
  tax: 15.00,
  total: 164.99,
  files: [
    { name: 'floor-plan.pdf', size: '2.5 MB' }
  ]
};

const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.sendEmail}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(emailPayload)
});

const data = await response.json();
console.log('Email response:', data);
```

### Submit Floor Plan (File Upload)

```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('email', 'john@example.com');
formData.append('projectName', 'My Floor Plan');
formData.append('files', fileObject); // File object from input

const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.submitFloorPlan}`, {
  method: 'POST',
  body: formData
  // Don't set Content-Type header for FormData
});

const data = await response.json();
console.log('Floor plan response:', data);
```

## Lambda Function Handler

Your Lambda handler automatically converts API Gateway events to Express format:

```javascript
// lambda.js
const serverless = require('serverless-http');
const app = require('./server');

exports.handler = serverless(app);
```

This wraps your Express app and allows it to:
- Receive API Gateway events
- Process requests like normal Express server
- Return responses in Lambda format

## Testing with Lambda

### Test locally first:
```bash
npm start
```

Then call endpoints at `http://localhost:3000/api/*`

### Deploy to Lambda:
```bash
npm run deploy
```

### Test Lambda:
```bash
npm run logs
```

Check CloudWatch logs for any errors.

## Environment Variables

Lambda automatically loads environment variables you set:

```powershell
# In AWS Lambda Console:
# Configuration → Environment variables

STRIPE_SECRET_KEY = sk_live_...
GMAIL_USER = your-email@gmail.com
GMAIL_APP_PASSWORD = your-app-password
NODE_ENV = production
```

## Debugging Lambda

### View Logs:
```bash
npm run logs
```

### Invoke Function:
```bash
npm run invoke
```

### Check Function Config:
```bash
aws lambda get-function-configuration --function-name houseinmeta-backend-api-prod
```

## Performance Comparison

| Operation | Local Server | Lambda |
|-----------|--------------|--------|
| Cold start | Instant | 1-3 seconds (first call) |
| Warm start | <50ms | <100ms |
| File uploads | Limited | 10 MB via API Gateway |
| Email sending | Real-time | Real-time |
| Cost | $0/month (local) | ~$0.20/1000 orders |

## Migration Checklist

- [ ] Update `API_CONFIG.baseURL` with Lambda endpoint
- [ ] Test all endpoints locally
- [ ] Run `npm run deploy`
- [ ] Verify Lambda function created
- [ ] Check environment variables set
- [ ] Test each API endpoint
- [ ] Update frontend configuration
- [ ] Monitor CloudWatch logs
- [ ] Test email functionality
- [ ] Verify Stripe payments work

## Next Steps

1. ✅ Deploy Lambda: `npm run deploy`
2. ✅ Get endpoint from deployment output
3. ✅ Update `API_CONFIG.baseURL` 
4. ✅ Test with Postman or curl
5. ✅ Deploy frontend with new endpoint
6. ✅ Monitor logs for errors

## Support

For issues:
- Check `QUICKSTART_LAMBDA.md` for setup help
- View logs: `npm run logs`
- Check serverless.yml configuration
- Verify environment variables are set
- Look at Lambda function timeout settings

---

**Your Lambda API is now ready to handle production requests! 🚀**
