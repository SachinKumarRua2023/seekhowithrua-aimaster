# AI Professor | SeekhoWithRua

AI-powered learning assistant using **Gemma 4** to help students understand programming, data science, algorithms, and more.

## Environment Variables

### For Backend (Render/Vercel)

Add this to your **Render** or **Vercel** environment variables:

```
GEMMA_API_KEY=your_google_ai_studio_api_key
NODE_ENV=production
PORT=3000
```

**Variable Name to use:** `GEMMA_API_KEY`

### How to get GEMMA_API_KEY:

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it in your environment variables

## Deployment

### Option 1: Deploy Backend to Render (Recommended)

1. Push code to GitHub
2. Go to [Render](https://render.com)
3. Create "New Web Service"
4. Connect your GitHub repo
5. Set build command: `npm install`
6. Set start command: `node server.js`
7. Add environment variable: `GEMMA_API_KEY`
8. Deploy!

**Render URL will be:** `https://ai-professor-api.onrender.com`

### Option 2: Deploy Backend to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. In `backend` folder, run: `vercel`
3. Add environment variable in Vercel dashboard: `GEMMA_API_KEY`
4. Deploy!

### Deploy Frontend

The frontend (`index.html`) can be deployed to:
- **Vercel**: Connect repo and deploy
- **Netlify**: Drag and drop folder
- **Subdomain**: Set up `aiprofessor.seekhowithrua.com`

## File Structure

```
seekhowithrua-aiProfessor/
├── index.html          # Frontend chat interface
├── js/
│   └── auth.js         # Authentication with COSMOS_AUTH
├── backend/
│   ├── server.js       # Express API (Gemma 4 only)
│   ├── package.json    # Dependencies
│   └── .env.example    # Environment template
└── README.md           # This file
```

## Features

- Chat with AI Professor powered by Gemma 4
- Subject selector (Python, JavaScript, Data Science, AI/ML)
- Explain topics with examples
- Generate quizzes
- Code help
- Full integration with SeekhoWithRua auth system

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/chat` | POST | Chat with AI |
| `/api/chat/stream` | POST | Streaming chat |
| `/api/explain` | POST | Explain a concept |
| `/api/quiz` | POST | Generate quiz |

## Important Notes

- Backend **ONLY** uses Gemma 4 (no Groq/Ollama)
- Frontend requires user login via COSMOS_AUTH
- Set `GEMMA_API_KEY` in your hosting platform
- API costs apply based on usage
