// House In Meta - Backend Server with Gmail Email Service
// Node.js/Express server with email notifications

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const multer = require('multer');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
// CORS configuration
app.use(cors({
  origin: true, // Reflect the request origin (respects preflight)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400 // 24 hours
}));

// Explicit OPTIONS handler for preflight requests
app.options('*', cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.static('.'));

// Request logging middleware (optional)
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//   next();
// });

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

// Create Gmail transporter with SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS, not SSL
  auth: {
    user: process.env.GMAIL_USER || 'noemail@example.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'noapassword'
  },
  pool: {
    maxConnections: 3,
    maxMessages: 10,
    rateDelta: 20000,
    rateLimit: 3
  },
  connectionTimeout: 5000,
  socketTimeout: 5000,
  tls: {
    rejectUnauthorized: false
  }
});

// Test Gmail connection asynchronously without blocking startup
setTimeout(() => {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    transporter.verify((error) => {
      if (error) {
        console.error('Gmail SMTP Error:', error.message);
      } else {
        console.log('Gmail service ready');
      }
    });
  }
}, 1000);

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

// Save Order (to database/file)
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;

    // Log order (in production, save to database)
    console.log('Order received:', orderData.orderId);

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

    // Try to send email with timeout
    let emailSent = false;
    let emailError = null;

    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      try {
        const info = await Promise.race([
          transporter.sendMail(mailOptions),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Email send timeout')), 8000)
          )
        ]);

        console.log('Email sent:', orderId);
        emailSent = true;
      } catch (emailErr) {
        emailError = emailErr.message;
        console.warn('Email delivery failed:', emailErr.message);
      }
    } else {
      console.warn('Gmail not configured - skipping email');
    }

    // Always return success since order is saved
    res.json({
      success: true,
      orderId: orderId,
      message: emailSent 
        ? `Confirmation email sent to ${to}`
        : `Order saved. Email service unavailable - we'll send confirmation when service is available.`,
      emailSent: emailSent,
      emailError: emailError
    });
  } catch (error) {
    console.error('Send email error:', error);
    
    // Still return success if order was saved
    res.json({
      success: true,
      message: 'Order saved successfully. Email delivery pending.',
      note: error.message
    });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const escapeHtml = (value) =>
      String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, subject, message'
      });
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : 'Not provided';
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    const receiver = process.env.CONTACT_RECEIVER_EMAIL || 'amruta@houseinmeta.com';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #222; line-height: 1.5; }
          .card { max-width: 640px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
          .head { background: #4e8ce1; color: #fff; padding: 16px 20px; }
          .body { padding: 20px; }
          .row { margin-bottom: 10px; }
          .label { font-weight: 700; }
          .message { white-space: pre-wrap; background: #f7f7f7; border-radius: 6px; padding: 12px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="head"><h2 style="margin:0">New Contact Message</h2></div>
          <div class="body">
            <div class="row"><span class="label">Name:</span> ${safeName}</div>
            <div class="row"><span class="label">Email:</span> ${safeEmail}</div>
            <div class="row"><span class="label">Phone:</span> ${safePhone}</div>
            <div class="row"><span class="label">Subject:</span> ${safeSubject}</div>
            <div class="row"><span class="label">Message:</span></div>
            <div class="message">${safeMessage}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return res.status(500).json({
        success: false,
        error: 'Email service not configured'
      });
    }

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: receiver,
      subject: `Contact Form: ${safeSubject}`,
      html: htmlContent,
      replyTo: email,
      headers: {
        'X-Contact-Source': 'website-contact-form'
      }
    });

    res.json({
      success: true,
      message: 'Contact request sent successfully'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send contact request'
    });
  }
});

// ============================================
// FLOOR PLAN UPLOAD AND EMAIL WITH ATTACHMENTS
// ============================================

app.post('/api/submit-floor-plan', upload.array('files', 10), async (req, res) => {
  try {
    const { projectName, personName, projectEmail } = req.body;
    const files = req.files || [];

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

    // Send email to customer with attachments
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: projectEmail,
        subject: `Floor Plan Submission Received - ${projectName}`,
        html: emailHTML,
        attachments: attachments,
        replyTo: process.env.SUPPORT_EMAIL || 'support@houseinmeta.com'
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

// ============================================
// FLOOR PLAN SUBMISSION WITH BASE64 PDF
// ============================================
// This endpoint accepts JSON payload with base64-encoded PDF (used by floor-plan-submission.js)

app.post('/api/submit', async (req, res) => {
  try {
    const { projectName, name, email, pdfBase64 } = req.body;

    // Validate required fields
    if (!projectName || !name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: projectName, name, email'
      });
    }

    // Validate email
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    // Validate PDF
    if (!pdfBase64) {
      return res.status(400).json({
        success: false,
        error: 'No PDF file provided'
      });
    }

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Validate PDF size (max 50MB)
    if (pdfBuffer.length > 50 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'PDF file is too large (max 50MB)'
      });
    }

    // Generate PDF filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const pdfFilename = `floorplan-${projectName.replace(/\s+/g, '_')}-${timestamp}.pdf`;

    // Prepare attachment
    const attachment = {
      filename: pdfFilename,
      content: pdfBuffer,
      contentType: 'application/pdf'
    };

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
            <p>Hello ${name},</p>
            <p>Thank you for submitting your project! We have received your floor plan and will process it shortly.</p>
            
            <div class="section">
              <h3>📋 Project Details</h3>
              <div class="info-row">
                <span class="info-label">Project Name:</span>
                <span class="info-value">${projectName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Your Name:</span>
                <span class="info-value">${name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Submission Time:</span>
                <span class="info-value">${new Date().toLocaleString()}</span>
              </div>
            </div>

            <div class="section">
              <h3>📁 Floor Plan File</h3>
              <p>File: <strong>${pdfFilename}</strong></p>
              <p>Size: <strong>${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB</strong></p>
            </div>

            <div class="section">
              <h3>⏱️ What's Next?</h3>
              <p>Our team will review your floor plan and begin the 3D conversion process. You will receive updates via email about your project status within 24-48 hours.</p>
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

    // Send email to customer with attachment
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Floor Plan Submission Received - ${projectName}`,
        html: emailHTML,
        attachments: [attachment],
        replyTo: process.env.SUPPORT_EMAIL || 'support@houseinmeta.com'
      });
    }

    res.json({
      success: true,
      message: 'Floor plan submitted successfully',
      projectName: projectName,
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
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
