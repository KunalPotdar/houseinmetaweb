// House In Meta - API Configuration
// Configure your backend URL here

// ARCHITECTURE: Frontend → API Gateway → Lambda → Express.js → Gmail/Database
//
// API Gateway automatically invokes your Lambda function for all requests.
// Your Lambda function wraps Express.js with serverless-http.
// No code changes needed - it all works transparently!
//
// FRONTEND: https://houseinmeta.com (Static hosting)
// BACKEND Development: http://localhost:3000 (Local Node.js server)
// BACKEND Production: AWS API Gateway endpoint → invokes Lambda

const API_CONFIG = {
  // Backend Server Configuration
  // When deployed to Lambda, API Gateway creates an HTTPS endpoint
  // API Gateway automatically routes all requests to your Lambda function
  // Lambda handler (lambda.js) uses serverless-http to invoke Express
  //
  // Development: http://localhost:3000
  // Production: API Gateway endpoint created by serverless.yml
  baseURL: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : 'https://pdiwz330sk.execute-api.eu-west-3.amazonaws.com', // Replace with your API Gateway endpoint after deploy
  
  // API Endpoints (same for both local and Lambda)
  endpoints: {
    sendEmail: '/api/send-email',
    orders: '/api/orders',
    paymentIntent: '/api/create-payment-intent',
    health: '/api/health',
    welcomeEmail: '/api/send-welcome-email',
    submit: '/api/submit'
  },

  // Timeout for API requests (ms)
  timeout: 30000,

  // Retry configuration
  retry: {
    maxAttempts: 3,
    delayMs: 1000
  },

  // API Gateway Detection
  // Automatically detects if running on Lambda or local
  isLambda: typeof window !== 'undefined' && !window.location.hostname.includes('localhost'),
  
  // API Gateway Info
  apiGateway: {
    type: 'HTTP API v2', // Uses AWS API Gateway HTTP API (faster than REST API)
    cors: true,           // CORS headers enabled by serverless.yml
    invokesLambda: true   // All requests go through Lambda
  }
};

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  const defaultOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: API_CONFIG.timeout
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, finalOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Call Failed: ${endpoint}`, error);
    throw error;
  }
}

// Lambda-specific fetch helper
async function lambdaFetch(endpoint, payload) {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Lambda Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Lambda API Call Failed: ${endpoint}`, error);
    throw error;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_CONFIG, apiCall, lambdaFetch };
}
