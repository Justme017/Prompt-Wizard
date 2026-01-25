// Simple test API
module.exports = async function handler(req, res) {
  console.log('API called with method:', req.method);
  console.log('Request body:', req.body);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  res.status(200).json({
    optimized: "Test response - API is working!",
    tokens: 10,
    cost: "0.000100",
    modeUsed: "test",
    format: "plain"
  });
}
