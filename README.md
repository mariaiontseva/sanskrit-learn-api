# Sanskrit Learn API

Backend server for the Sanskrit Learning application that handles OpenAI API calls securely.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with:
```
OPENAI_API_KEY=your_api_key_here
PORT=3001
CLIENT_URL=https://mariaiontseva.github.io
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### POST /api/chat
Handles chat completions with the OpenAI API.

Request body:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "string"
    }
  ],
  "systemPrompt": "string"
}
```

Response:
```json
{
  "role": "assistant",
  "content": "string"
}
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Port number for the server (default: 3001)
- `CLIENT_URL`: URL of the frontend application

## Deployment

This server is designed to be deployed on Render.com. 