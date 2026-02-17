// AWS Lambda Handler for House In Meta Backend
// Wraps Express app to work with API Gateway events

const serverless = require('serverless-http');
const app = require('./server');

// Export Lambda handler
exports.handler = serverless(app);
