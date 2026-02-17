# Quick Start Guide: AWS Lambda Deployment (Windows PowerShell)

## 🚀 5-Minute Quick Start

### Step 1: Install Prerequisites
```powershell
# Install AWS CLI (if not already installed)
choco install awscli

# Verify installation
aws --version
```

### Step 2: Configure AWS Credentials
```powershell
# Configure AWS CLI with your credentials
aws configure

# When prompted, enter:
# AWS Access Key ID: [your-access-key]
# AWS Secret Access Key: [your-secret-key]
# Default region name: us-east-1
# Default output format: json
```

### Step 3: Update Environment Variables
```powershell
# Edit .env file with your actual values
notepad .env
```

Add these values:
```
STRIPE_SECRET_KEY=sk_live_your_actual_key
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

### Step 4: Install Dependencies
```powershell
npm install
```

### Step 5: Deploy to Lambda
```powershell
npm run deploy
```

After deployment succeeds, you'll see:
```
endpoint: https://xxxxxx.execute-api.us-east-1.amazonaws.com
```

### Step 6: Update Frontend Configuration
Update `assets/js/api-config.js`:
```javascript
const API_BASE_URL = 'https://xxxxxx.execute-api.us-east-1.amazonaws.com/api';
```

## 📋 Detailed Steps

### 1. Download and Install AWS CLI
- Download from: https://aws.amazon.com/cli/
- Or use Chocolatey: `choco install awscli`
- Verify: `aws --version`

### 2. Get AWS Credentials
1. Go to https://console.aws.amazon.com/
2. Login with your AWS account
3. Go to **IAM** → **Users** → Click your username
4. Go to **Security credentials** tab
5. Click **Create access key**
6. Download the CSV file (keep it safe!)
7. Copy Access Key ID and Secret Access Key

### 3. Set Up AWS Credentials
```powershell
aws configure
```

This creates `~\.aws\credentials` and `~\.aws\config`

### 4. Verify Configuration
```powershell
aws sts get-caller-identity
```

Should show your AWS account ID.

### 5. Install Node Dependencies
```powershell
# Go to your project directory
cd C:\MyData\SoftwareTools\git\houseinmetaweb

# Install all npm packages
npm install
```

### 6. Deploy to Lambda
```powershell
# First deployment
npm run deploy

# Future deployments
npm run deploy:prod
```

### 7. View Your API Endpoint
After deployment completes, you'll see:
```
endpoint: https://xxxxx.execute-api.us-east-1.amazonaws.com
```

Your API base URL is:
```
https://xxxxx.execute-api.us-east-1.amazonaws.com/api
```

## 🔍 Testing Your Deployment

### Test Health Endpoint
```powershell
$url = "https://xxxxx.execute-api.us-east-1.amazonaws.com/api/health"
Invoke-WebRequest -Uri $url
```

### View Logs
```powershell
npm run logs
```

### View in AWS Console
1. Go to https://console.aws.amazon.com/lambda
2. Find your function: `houseinmeta-backend-api-prod`
3. Click **Monitoring** tab
4. View CloudWatch logs

## 🐛 Troubleshooting

### Problem: "Cannot find module 'serverless'"
```powershell
npm install --save-dev serverless
npm run deploy
```

### Problem: AWS Credentials Not Found
```powershell
# Check if configured
aws configure list

# If missing, run:
aws configure

# Or set environment variables:
$env:AWS_ACCESS_KEY_ID = "your-key"
$env:AWS_SECRET_ACCESS_KEY = "your-secret"
$env:AWS_DEFAULT_REGION = "us-east-1"
```

### Problem: Email Not Sending
1. Check Gmail credentials in Lambda:
   - AWS Lambda Console → Your Function → Configuration → Environment variables
   - Verify GMAIL_USER and GMAIL_APP_PASSWORD

2. Gmail requires App Password:
   - https://myaccount.google.com/apppasswords
   - Must have 2FA enabled
   - Use the 16-character password

### Problem: Timeout or Slow Response
Edit `serverless.yml`:
```yaml
provider:
  memorySize: 2048  # Increase from 1024
  timeout: 120      # Increase from 60
```

Then redeploy:
```powershell
npm run deploy
```

### Problem: CORS Errors
Already configured in `serverless.yml`:
```yaml
provider:
  cors: true
```

If still having issues, check your frontend is using the correct API URL.

## 📝 Useful Commands

```powershell
# Deploy
npm run deploy

# View logs
npm run logs

# Invoke function locally
npm run invoke

# Test locally (requires serverless-offline)
npm run offline

# Delete Lambda function
serverless remove

# Check if AWS credentials are configured
aws sts get-caller-identity

# List Lambda functions
aws lambda list-functions --region us-east-1
```

## 💰 Cost Tracking

Check your AWS costs:
1. AWS Console → **Billing & Cost Management**
2. Check **Cost Explorer** for Lambda usage
3. Lambda free tier includes:
   - 1,000,000 requests/month
   - 400,000 GB-seconds/month
   - Most small projects fit in free tier

## 📚 Next Steps

1. ✅ Deploy Lambda function
2. ✅ Test with health endpoint
3. ✅ Update frontend API URL
4. ✅ Test file uploads, payments, emails
5. ✅ Monitor CloudWatch logs
6. 🔍 Enable X-Ray tracing (optional)
7. 📊 Set up CloudWatch alarms (optional)

## 🆘 Still Having Issues?

1. Check CloudWatch Logs: `npm run logs`
2. View function configuration in AWS Console
3. Test each endpoint individually
4. Check environment variables are set
5. Verify file sizes are within limits
6. Look for recent AWS service issues

## 🔗 Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Serverless Framework Guide](https://www.serverless.com/framework/docs)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)
- [Lambda Limits & Quotas](https://docs.aws.amazon.com/lambda/latest/dg/limits.html)
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

---

**Happy deploying! 🎉**
