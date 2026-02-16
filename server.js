// House In Meta - Backend Server with Gmail Email Service
// Node.js/Express server with Stripe payment processing and Gmail email notifications

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const stripe = require('stripe');
const multer = require('multer');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Stripe
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.static('.'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Configure multer for in-memory file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 100 * 1024 * 1024, // 100MB max file size
    files: 10 // Max 10 files
  }
});

// ============================================
// GMAIL CONFIGURATION
// ============================================

// Check if Gmail credentials are set
if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.warn('⚠️  WARNING: Gmail credentials not set in environment variables');
  console.warn('   Set GMAIL_USER and GMAIL_APP_PASSWORD in Railway dashboard');
}

// Create Gmail transporter with SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS, not SSL
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD // App-specific password for Gmail
  },
  pool: {
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 20000,
    rateLimit: 5 // 5 messages per 20 seconds
  },
  connectionTimeout: 10000, // 10s timeout
  socketTimeout: 10000      // 10s timeout
});

// Verify Gmail connection (don't block startup)
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Gmail configuration error:', error.message);
    console.log('   Check that GMAIL_USER and GMAIL_APP_PASSWORD are set correctly');
  } else {
    console.log('✓ Gmail transporter verified successfully');
  }
});

// ============================================
// EMAIL TEMPLATE FUNCTION
// ============================================

function generateOrderConfirmationEmail(customerName, orderId, packageName, price, tax, total, files, timestamp) {
  const filesList = files.map(f => `<li>${f.name} (${f.size})</li>`).join('');
  const orderDate = new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          margin-bottom: 20px;
        }
        .section {
          margin: 25px 0;
          padding: 20px;
          background: #f9f9f9;
          border-left: 4px solid #667eea;
          border-radius: 4px;
        }
        .section h3 {
          color: #667eea;
          margin: 0 0 15px 0;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #555;
        }
        .info-value {
          color: #333;
        }
        .files-list {
          list-style: none;
          padding-left: 0;
        }
        .files-list li {
          padding: 8px 0;
          border-bottom: 1px solid #eee;
          color: #555;
        }
        .files-list li:last-child {
          border-bottom: none;
        }
        .files-list li:before {
          content: "📄 ";
          margin-right: 8px;
        }
        .price-breakdown {
          background-color: white;
          padding: 15px;
          border-radius: 4px;
          margin-top: 15px;
        }
        .price-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .price-row:last-child {
          border-bottom: none;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          margin-top: 10px;
          border-top: 2px solid #667eea;
          font-size: 18px;
          font-weight: bold;
          color: #764ba2;
        }
        .next-steps {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          padding: 20px;
          border-radius: 4px;
          margin: 20px 0;
        }
        .next-steps h3 {
          color: #667eea;
          margin-top: 0;
        }
        .next-steps ol {
          padding-left: 20px;
          color: #555;
        }
        .next-steps li {
          margin-bottom: 10px;
        }
        .footer {
          margin-top: 30px;
          padding: 20px 0;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
        .cta-button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
        }
        .cta-button:hover {
          opacity: 0.9;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 Order Confirmation</h1>
          <p>Thank you for choosing House In Meta!</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            <p>Dear <strong>${customerName}</strong>,</p>
            <p>Your order has been successfully placed and paid. Your 3D floor plan conversion has been scheduled and will begin processing shortly. Below are your complete order details for your records.</p>
          </div>
          
          <div class="section">
            <h3>📋 Order Information</h3>
            <div class="info-row">
              <span class="info-label">Order ID:</span>
              <span class="info-value"><strong>${orderId}</strong></span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${orderDate}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Package:</span>
              <span class="info-value"><strong>${packageName}</strong></span>
            </div>
          </div>
          
          <div class="section">
            <h3>📁 Uploaded Files (${files.length})</h3>
            <ul class="files-list">
              ${filesList}
            </ul>
          </div>
          
          <div class="section">
            <h3>💰 Order Total</h3>
            <div class="price-breakdown">
              <div class="price-row">
                <span>Subtotal:</span>
                <span>€${price.toFixed(2)}</span>
              </div>
              <div class="price-row">
                <span>Tax (10%):</span>
                <span>€${tax.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>Total Amount:</span>
                <span>€${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div class="next-steps">
            <h3>🚀 What Happens Next?</h3>
            <ol>
              <li><strong>Files Processing:</strong> Our team will review your uploaded floor plans and architectural files</li>
              <li><strong>Quality Check:</strong> We'll verify the file quality and completeness of the designs</li>
              <li><strong>3D Conversion:</strong> Using advanced software, we'll convert your 2D plans into immersive 3D models</li>
              <li><strong>Delivery:</strong> Your 3D files will be delivered via email with comprehensive viewing instructions</li>
            </ol>
          </div>
          
          <p><strong>📧 Stay Connected:</strong> You'll receive email updates on your order progress. Watch for notifications as we complete each stage of your project.</p>
          
          <p><strong>❓ Need Help?</strong> If you have any questions or need to make changes to your order, please don't hesitate to contact our support team.</p>
          
          <p>Best regards,<br/><strong>The House In Meta Team</strong></p>
          
          <div class="footer">
            <p>© 2024-2026 House In Meta. All rights reserved.<br/>
            <a href="mailto:support@houseinmeta.com" style="color: #667eea; text-decoration: none;">support@houseinmeta.com</a> | 
            <a href="https://houseinmeta.com" style="color: #667eea; text-decoration: none;">houseinmeta.com</a></p>
            <p>This is an automated message. Please do not reply directly to this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ============================================
// API ENDPOINTS
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Create Payment Intent (Stripe)
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, paymentMethodId, orderData } = req.body;

    // Create payment intent with Stripe
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amount,
      currency: currency,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.CLIENT_URL}/convert2DTo3D.html`,
      metadata: {
        orderId: orderData.orderId,
        customerEmail: orderData.user.email,
        packageName: orderData.package
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Save Order (to database/file)
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;

    // Log order (in production, save to database)
    console.log('Order received:', {
      orderId: orderData.orderId,
      customer: `${orderData.user.firstName} ${orderData.user.lastName}`,
      email: orderData.user.email,
      package: orderData.package,
      total: orderData.total,
      filesCount: orderData.filesCount
    });

    // If sendEmail flag is set, also trigger email
    if (orderData.sendEmail) {
      console.log('Email notification queued for:', orderData.user.email);
    }

    res.json({
      success: true,
      orderId: orderData.orderId,
      message: 'Order saved successfully'
    });
  } catch (error) {
    console.error('Order Save Error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Send Confirmation Email
app.post('/api/send-email', async (req, res) => {
  try {
    const {
      to,
      customerName,
      orderId,
      packageName,
      price,
      tax,
      total,
      files,
      timestamp,
      phone,
      paymentMethod
    } = req.body;

    // Validate email address
    if (!to || !to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    // Generate HTML email content
    const htmlContent = generateOrderConfirmationEmail(
      customerName,
      orderId,
      packageName,
      price,
      tax,
      total,
      files,
      timestamp
    );

    // Configure email message
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: to,
      subject: `Order Confirmation - ${orderId} | House In Meta`,
      html: htmlContent,
      replyTo: process.env.SUPPORT_EMAIL || 'support@houseinmeta.com',
      headers: {
        'X-Order-ID': orderId,
        'X-Customer-Email': to
      }
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('✓ Email sent successfully');
    console.log(`  To: ${to}`);
    console.log(`  Order: ${orderId}`);
    console.log(`  Message ID: ${info.messageId}`);

    res.json({
      success: true,
      messageId: info.messageId,
      message: `Confirmation email sent successfully to ${to}`
    });
  } catch (error) {
    console.error('✗ Email send error:', error);
    
    // Don't fail the order if email fails - order should be saved regardless
    res.status(500).json({
      success: false,
      error: error.message,
      note: 'Order was saved successfully. Email delivery failed, but order is secure.'
    });
  }
});

// ============================================
// FLOOR PLAN UPLOAD AND EMAIL WITH ATTACHMENTS
// ============================================

app.post('/api/submit-floor-plan', upload.array('files', 10), async (req, res) => {
  try {
    console.log('Floor plan submission request received');
    console.log('Body:', req.body);
    console.log('Files:', req.files ? `${req.files.length} files` : 'No files');

    const { projectName, personName, projectEmail } = req.body;
    const files = req.files || [];

    console.log('Extracted data:', { projectName, personName, projectEmail, filesCount: files.length });

    // Validate required fields
    if (!projectName || !personName || !projectEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: projectName, personName, projectEmail'
      });
    }

    // Validate email
    if (!projectEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    // Validate files
    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    // Prepare attachments array
    const attachments = files.map(file => ({
      filename: file.originalname,
      content: file.buffer,
      contentType: file.mimetype
    }));

    // Generate email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content {
            padding: 30px;
          }
          .section {
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
            border-left: 4px solid #667eea;
            border-radius: 4px;
          }
          .section h3 {
            color: #667eea;
            margin: 0 0 10px 0;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-weight: 600;
            color: #555;
          }
          .info-value {
            color: #333;
          }
          .files-list {
            list-style: none;
            padding-left: 0;
          }
          .files-list li {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            color: #555;
          }
          .files-list li:before {
            content: "📎 ";
            margin-right: 8px;
          }
          .files-list li:last-child {
            border-bottom: none;
          }
          .footer {
            margin-top: 30px;
            padding: 20px 0;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 Floor Plan Submission Received</h1>
          </div>
          <div class="content">
            <p>Hello ${personName},</p>
            <p>Thank you for submitting your project! We have received your floor plans and will process them shortly.</p>
            
            <div class="section">
              <h3>📋 Project Details</h3>
              <div class="info-row">
                <span class="info-label">Project Name:</span>
                <span class="info-value">${projectName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Your Name:</span>
                <span class="info-value">${personName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${projectEmail}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Files Uploaded:</span>
                <span class="info-value">${files.length}</span>
              </div>
            </div>

            <div class="section">
              <h3>📁 Uploaded Files</h3>
              <ul class="files-list">
                ${files.map(f => `<li>${f.originalname} (${(f.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('')}
              </ul>
            </div>

            <div class="section">
              <h3>⏱️ What's Next?</h3>
              <p>Our team will review your floor plans and begin the 3D conversion process. You will receive updates via email about your project status within 24-48 hours.</p>
            </div>

            <div class="footer">
              <p>Thank you for choosing House In Meta!</p>
              <p>&copy; 2026 House In Meta. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to customer
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: projectEmail,
      subject: `Floor Plan Submission Received - ${projectName}`,
      html: emailHTML,
      attachments: attachments,
      replyTo: process.env.SUPPORT_EMAIL || 'support@houseinmeta.com'
    });

    // Send notification email to admin/team
    const adminEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
          .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #667eea; border-radius: 4px; }
          .section h3 { color: #667eea; margin: 0 0 10px 0; font-weight: 600; }
          .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .info-label { font-weight: 600; color: #555; }
          .info-value { color: #333; }
        </style>
      </head>
      <body>
        <h2>📥 New Floor Plan Submission</h2>
        <div class="section">
          <h3>Submission Details</h3>
          <div class="info-row">
            <span class="info-label">Project Name:</span>
            <span class="info-value">${projectName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Person Name:</span>
            <span class="info-value">${personName}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${projectEmail}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Number of Files:</span>
            <span class="info-value">${files.length}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Submission Time:</span>
            <span class="info-value">${new Date().toLocaleString()}</span>
          </div>
        </div>
        <div class="section">
          <h3>📁 Files Included</h3>
          <ul>
            ${files.map(f => `<li>${f.originalname} (${(f.size / 1024 / 1024).toFixed(2)} MB)</li>`).join('')}
          </ul>
        </div>
      </body>
      </html>
    `;

    // Send to admin email
    const adminEmail = 'houseinmeta@gmail.com';
    if (adminEmail !== projectEmail) {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: adminEmail,
        subject: `[NEW SUBMISSION] Floor Plan - ${projectName} from ${personName}`,
        html: adminEmailHTML,
        attachments: attachments
      });
    }

    res.json({
      success: true,
      message: 'Floor plan submitted successfully',
      projectName: projectName,
      filesCount: files.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Floor plan submission error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send Welcome Email (optional - when user first visits)
app.post('/api/send-welcome-email', async (req, res) => {
  try {
    const { email, firstName } = req.body;

    const welcomeHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to House In Meta! 🏠</h1>
          </div>
          <p>Hi ${firstName},</p>
          <p>We're excited to help you transform your 2D floor plans into stunning 3D experiences!</p>
          <p>Our service makes it easy to convert architectural drawings into interactive 3D models for presentations, virtual tours, and property showcasing.</p>
          <p>Simply upload your floor plans, choose your package, and we'll handle the rest.</p>
          <p>Best regards,<br/>House In Meta Team</p>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Welcome to House In Meta - Transform Your 2D Plans to 3D!',
      html: welcomeHTML
    });

    res.json({ success: true, message: 'Welcome email sent' });
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order status (placeholder)
app.get('/api/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  
  // In production, query database
  res.json({
    orderId: orderId,
    status: 'processing',
    message: 'Your 3D conversion is being processed. You will receive updates via email.'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(port, () => {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║      House In Meta - Backend Server (with Gmail)         ║');
  console.log('╠═══════════════════════════════════════════════════════════╣');
  console.log(`║ Server running on: http://localhost:${port}                    `);
  console.log(`║ Environment: ${process.env.NODE_ENV || 'development'}                             `);
  console.log(`║ Gmail User: ${process.env.GMAIL_USER || 'Not configured'}                     `);
  console.log('║                                                           ║');
  console.log('║ Endpoints:                                                ║');
  console.log('║   POST   /api/submit-floor-plan       - Floor plan upload  ║');
  console.log('║   POST   /api/send-email              - Send email         ║');
  console.log('║   POST   /api/orders                  - Save order         ║');
  console.log('║   POST   /api/create-payment-intent   - Stripe payment     ║');
  console.log('║   POST   /api/send-welcome-email      - Welcome email      ║');
  console.log('║   GET    /api/orders/:orderId         - Order status       ║');
  console.log('║   GET    /api/health                  - Health check       ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');
});

module.exports = app;
