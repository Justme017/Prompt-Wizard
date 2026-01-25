# Prompt Optimizer (React + Vercel)

A modern, full-stack prompt optimization tool built with React, TypeScript, Tailwind CSS, and shadcn/ui components. Deployed serverlessly on Vercel's free tier.

## Features

- **Modern React UI**: Built with TypeScript, Tailwind CSS, and shadcn/ui components
- **Intelligent Prompt Optimization**: Context-aware prompt enhancement with model-specific instructions
- **Multiple AI Models**: Support for OpenAI, Anthropic, Google, Meta, and Mistral models
- **Output Formats**: Plain text, JSON, Markdown, and YAML output options
- **Dark Mode**: Built-in theme switching with localStorage persistence
- **Cost Estimation**: Real-time token and cost calculation
- **Responsive Design**: Mobile-first design that works on all devices
- **Serverless API**: Vercel Functions with automatic scaling

## Supported Models

### OpenAI
- GPT-4
- GPT-3.5

### Anthropic
- Claude 3
- Claude 2

### Google
- Gemini Pro
- Gemini Ultra

### Meta
- Llama 3

### Mistral AI
- Mistral

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **Icons**: Lucide React
- **Backend**: Vercel Serverless Functions
- **Tokenization**: tiktoken for OpenAI models
- **Deployment**: Vercel (free tier)

## Project Structure

```
prompt-optimizer/
│
├─ api/
│   └─ optimize.js        # Serverless API route
│
├─ src/
│   ├─ components/
│   │   ├─ ui/            # shadcn/ui components
│   │   └─ PromptEnhancer.tsx
│   ├─ pages/
│   │   ├─ Index.tsx
│   │   └─ NotFound.tsx
│   ├─ hooks/             # Custom React hooks
│   ├─ lib/               # Utilities
│   ├─ App.tsx
│   └─ main.tsx
│
├─ public/
│   └─ index.html         # Vite entry point
│
├─ package.json           # Dependencies
├─ vercel.json            # Vercel configuration
├─ vite.config.ts         # Vite configuration
├─ tailwind.config.ts     # Tailwind configuration
└─ README.md
```

## Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd prompt-optimizer
   npm install
   ```

2. **Run locally**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

## API Usage

POST to `/api/optimize` with JSON body:
```json
{
  "prompt": "Your prompt here",
  "model": "gpt-4" | "claude-3" | "gemini-pro",
  "mode": "recommended" | "strict" | "balanced" | "creative",
  "format": "plain" | "markdown" | "json" | "yaml"
}
```

Returns:
```json
{
  "optimized": "...",
  "tokens": 123,
  "cost": "0.000123",
  "modeUsed": "balanced",
  "format": "plain"
}
```

## Development

- **Linting**: `npm run lint`
- **Type checking**: Built into Vite
- **Testing**: Vitest setup included

## Notes

- Do not use `express.listen()` or write to the filesystem in API routes
- Always use relative API paths in frontend code
- Tokenizers are imported inside the API route for Vercel compatibility
- See `vercel.json` for function memory/duration tuning

## Next Steps

- Add per-model system prompt templates
- Output token estimation
- Cost cap warnings
- User auth & quotas
- Prompt history & diff

---

Built for Vercel. Fast, serverless, and cost-aware.
