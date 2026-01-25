# Prompt Optimizer (React + Vercel)

A modern, full-stack prompt optimization tool built with React, TypeScript, Tailwind CSS, and shadcn/ui components. Deployed serverlessly on Vercel's free tier.

## Features

- **Modern React UI**: Built with TypeScript, Tailwind CSS, and shadcn/ui components
- **Intelligent Prompt Optimization**: Context-aware prompt enhancement with model-specific instructions
- **Multiple AI Models**: Support for OpenAI, Anthropic, Google, Meta, and Mistral models
- **Output Formats**: Plain text, JSON, Markdown, and XML output options
- **Dark Mode**: Built-in theme switching with localStorage persistence
- **Cost Estimation**: Real-time token and cost calculation
- **Responsive Design**: Mobile-first design that works on all devices
- **Serverless API**: Vercel Functions with automatic scaling

## Supported Models

### OpenAI
- GPT-4 Turbo
- GPT-3.5 Turbo

### Anthropic
- Claude 3 Opus
- Claude 2

### Google
- Gemini Pro
- Gemini Ultra

### Meta
- Llama 3 70B

### Mistral AI
- Mistral Large

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **Backend**: Vercel Serverless Functions
- **Tokenization**: tiktoken for OpenAI models
- **Deployment**: Vercel (free tier)

## Supported Models

### OpenAI
- GPT-4o
- GPT-4o Mini
- GPT-4.1

### Anthropic
- Claude 3 Opus
- Claude 3 Sonnet
- Claude 3 Haiku

### Groq
- Llama 3 8B
- Llama 3 70B
- Mixtral 8x7B
- Gemma 7B

## Project Structure

```
prompt-optimizer/
│
├─ api/
│   └─ optimize.js        # Serverless API route
│
├─ public/
│   └─ index.html         # Frontend UI
│
├─ package.json           # Dependencies
├─ vercel.json            # (Optional) Function config
└─ README.md
```

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```
   - Framework: Other
   - Output directory: public
   - Build command: (leave empty)

3. **Test locally**
   - Open `public/index.html` in your browser
   - Or deploy and open your Vercel URL

## API Usage

POST to `/api/optimize` with JSON body:
```json
{
  "prompt": "Your prompt here",
  "model": "gpt-4o" | "gpt-4.1" | "claude-3-opus",
  "mode": "recommended" | "strict" | "balanced" | "creative"
}
```

Returns:
```json
{
  "optimized": "...",
  "tokens": 123,
  "cost": "0.000123",
  "modeUsed": "balanced"
}
```

## Notes
- Do not use `express.listen()` or write to the filesystem.
- Always use relative API paths in frontend code.
- Tokenizers are imported inside the API route for Vercel compatibility.
- See `vercel.json` for function memory/duration tuning.

## Next Steps
- Add per-model system prompt templates
- Output token estimation
- Cost cap warnings
- User auth & quotas
- Prompt history & diff

---

Built for Vercel. Fast, serverless, and cost-aware.
