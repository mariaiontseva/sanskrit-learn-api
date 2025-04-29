const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('DEBUG: Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('All env variables:', Object.keys(process.env));
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);
console.log('First 4 chars of key:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 4) : 'none');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mariaiontseva.github.io'
  ],
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Initialize OpenAI with more detailed error handling
try {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  
  if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
    throw new Error('OPENAI_API_KEY appears to be invalid (should start with sk-)');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('OpenAI client initialized successfully');
} catch (error) {
  console.error('Error initializing OpenAI client:', error.message);
  // Don't exit immediately to allow debugging
}

// Health check endpoint with debug info
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    debug: {
      apiKeyExists: !!process.env.OPENAI_API_KEY,
      apiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
      apiKeyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 4) : 'none',
      nodeEnv: process.env.NODE_ENV,
      envVarCount: Object.keys(process.env).length
    }
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    res.json(response.choices[0].message);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: error.message || 'An error occurred while processing your request'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 