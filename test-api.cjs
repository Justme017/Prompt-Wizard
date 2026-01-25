// Test the API
const handler = require('./api/optimize.cjs');

const testReq = {
  method: 'POST',
  body: {
    prompt: 'Write a hello world program',
    model: 'gpt-4',
    mode: 'balanced',
    format: 'plain'
  }
};

const testRes = {
  status: (code) => ({
    json: (data) => {
      console.log('Status:', code);
      console.log('Response:', JSON.stringify(data, null, 2));
    }
  })
};

handler(testReq, testRes).catch(err => console.error('Error:', err));