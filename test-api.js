// Simple test script to verify API handler locally
const handler = require('./api/index.ts').default;

// Mock Vercel request/response objects
const mockReq = {
  method: 'GET',
  url: '/channels',
  headers: {}
};

const mockRes = {
  headers: {},
  statusCode: 200,
  setHeader: function(key, value) {
    this.headers[key] = value;
  },
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log('Response Status:', this.statusCode);
    console.log('Response Headers:', this.headers);
    console.log('Response Data:', JSON.stringify(data, null, 2));
  },
  end: function() {
    console.log('Response ended');
  }
};

console.log('Testing API handler locally...');
handler(mockReq, mockRes);
