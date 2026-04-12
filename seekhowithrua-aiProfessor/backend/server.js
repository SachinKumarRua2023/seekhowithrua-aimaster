const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// AI Provider Configuration - Gemma 4 Only
const AI_PROVIDER = 'gemma';

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'AI Professor API is running', 
    version: '1.0.0',
    provider: 'Gemma 4 (Google AI)'
  });
});

// System Prompt Constructor
function buildSystemPrompt(subject, level) {
  return `You are an AI Professor for SeekhoWithRua, an educational platform powered by Gemma 4. 
You help students understand concepts in ${subject || 'various subjects'} at ${level || 'beginner'} level.
Be patient, encouraging, and explain concepts step by step. Use examples when helpful.
If you don't know something, admit it honestly. Keep responses concise but thorough.

IMPORTANT: Always respond in a helpful, educational tone. Break down complex topics into simpler parts.`;
}

// Google Gemma 4 API
async function callGemmaAPI(message, systemPrompt, context) {
  const fullMessage = context 
    ? `${systemPrompt}\n\nContext: ${context}\n\nQuestion: ${message}`
    : `${systemPrompt}\n\nQuestion: ${message}`;

  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemma-4-9b-it:generateContent',
    {
      contents: [
        {
          role: 'user',
          parts: [{ text: fullMessage }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.9,
        topK: 40
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMMA_API_KEY}`
      }
    }
  );

  return response.data.candidates?.[0]?.content?.parts?.[0]?.text || 
         'I apologize, but I could not generate a response at this time.';
}

// Main Chat Endpoint - Gemma 4 Only
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context, subject, level } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMMA_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemma API key not configured',
        details: 'Please set GEMMA_API_KEY environment variable'
      });
    }

    const systemPrompt = buildSystemPrompt(subject, level);
    const aiResponse = await callGemmaAPI(message, systemPrompt, context);

    res.json({
      success: true,
      response: aiResponse,
      provider: 'Gemma 4',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemma API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to get response from Gemma 4',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

// Streaming chat endpoint (for real-time responses)
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { message, context, subject, level } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are an AI Professor for SeekhoWithRua. Help students understand ${subject || 'concepts'} at ${level || 'beginner'} level.`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemma-4-9b-it:generateContent',
      {
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { text: context ? `Context: ${context}\n\nQuestion: ${message}` : message }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          topP: 0.9,
          topK: 40
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEMMA_API_KEY}`
        }
      }
    );

    res.json({
      success: true,
      response: response.data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Streaming Error:', error);
    res.status(500).json({ error: 'Streaming failed', details: error.message });
  }
});

// Explain concept with examples
app.post('/api/explain', async (req, res) => {
  try {
    const { concept, subject, difficulty } = req.body;
    
    const prompt = `Explain the concept of "${concept}" in ${subject || 'general'} 
    at ${difficulty || 'beginner'} level. Include:
    1. Simple definition
    2. Real-world analogy
    3. 2-3 examples
    4. Key points to remember`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemma-4-9b-it:generateContent',
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 1500 }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEMMA_API_KEY}`
        }
      }
    );

    res.json({
      success: true,
      explanation: response.data.candidates?.[0]?.content?.parts?.[0]?.text,
      concept,
      subject
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to explain concept', details: error.message });
  }
});

// Quiz generation endpoint
app.post('/api/quiz', async (req, res) => {
  try {
    const { topic, numQuestions, difficulty } = req.body;
    
    const prompt = `Generate ${numQuestions || 5} ${difficulty || 'beginner'} level quiz questions about ${topic}. 
    Format each question as:
    Q: [Question]
    A: [Answer]
    Explanation: [Brief explanation]`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemma-4-9b-it:generateContent',
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 2000 }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEMMA_API_KEY}`
        }
      }
    );

    res.json({
      success: true,
      quiz: response.data.candidates?.[0]?.content?.parts?.[0]?.text,
      topic,
      numQuestions: numQuestions || 5
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`AI Professor API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
