module.exports = (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const axios = require('axios');
  const { message, subject } = req.body || {};
  
  if (!message) return res.status(400).json({ error: 'Message required' });
  if (!process.env.GEMMA_API_KEY) return res.status(500).json({ error: 'API key not set' });

  const prompt = `You are an AI Professor for SeekhoWithRua. Help with ${subject || 'programming'}:\n\n${message}`;

  axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemma-4-9b-it:generateContent', {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
  }, {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GEMMA_API_KEY}` },
    timeout: 30000
  }).then(response => {
    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    res.json({ success: true, response: text, provider: 'Gemma 4' });
  }).catch(err => {
    console.error('API Error:', err.message);
    res.status(500).json({ error: 'Gemma API failed', details: err.message });
  });
};
