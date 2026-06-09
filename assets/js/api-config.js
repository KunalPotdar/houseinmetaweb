// House In Meta - API Configuration
// Development uses localhost backend, production uses same-origin routes.

const API_CONFIG = {
  // Development: http://localhost:3000
  // Production: same-origin API routes
  baseURL: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : '',
  
  // API Endpoints (same for both local and Lambda)
  endpoints: {
    sendEmail: '/api/send-email',
    orders: '/api/orders',
    health: '/api/health',
    welcomeEmail: '/api/send-welcome-email',
    submit: '/api/submit',
    contact: '/api/contact'
  },

  // Timeout for API requests (ms)
  timeout: 30000,

  // Retry configuration
  retry: {
    maxAttempts: 3,
    delayMs: 1000
  },

  isLocal: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
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
