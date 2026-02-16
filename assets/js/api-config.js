// House In Meta - API Configuration
// Configure your backend URL here

// Development: http://localhost:3000
// Production: https://your-domain.com

const API_CONFIG = {
  // Set this to your backend server URL
  // For local development: 'http://localhost:3000'
  // For production: 'https://yourdomain.com'
  baseURL: typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : window.location.origin,
  
  // API Endpoints
  endpoints: {
    sendEmail: '/api/send-email',
    orders: '/api/orders',
    paymentIntent: '/api/create-payment-intent',
    health: '/api/health',
    welcomeEmail: '/api/send-welcome-email'
  },

  // Timeout for API requests (ms)
  timeout: 30000,

  // Retry configuration
  retry: {
    maxAttempts: 3,
    delayMs: 1000
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_CONFIG, apiCall };
}
