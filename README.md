<p align="center">
  <img src="./public/banner.png" alt="Prompt Wizard Banner" width="100%">
</p>

# Advanced Prompt Generator

A modern, AI-powered prompt optimization tool that helps you craft better prompts for various AI models. Features both free rule-based generation and AI-powered enhancement with support for multiple models and output formats.

## ✨ Features

- **Hybrid Generation Modes**: Choose between free rule-based generation or AI-powered enhancement
- **Multiple AI Models**: Support for GPT-4o, GPT-4 Turbo, Claude 3.5 Sonnet, GPT-3.5 Turbo, and Gemini Pro
- **Smart Intent Analysis**: Automatically detects prompt intent (creative writing, coding, analytical, data science, general)
- **Output Formats**: Generate prompts optimized for plain text, JSON, Markdown, or code
- **Dark Mode**: Toggle between light and dark themes with smooth transitions
- **Real-time Token Counting**: See token usage estimates for input and output
- **Copy to Clipboard**: Easily copy enhanced prompts
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Vercel-Ready**: Deploy instantly with no backend configuration needed

## 🚀 Live Demo

Visit the live application: [https://prompt-wizard-seven.vercel.app](https://prompt-wizard-seven.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom dark mode support
- **Icons**: Lucide React
- **Deployment**: Vercel with serverless functions
- **AI Integration**: OpenRouter API for AI-powered generation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd advanced-prompt-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

## 🚀 Deployment

The app is configured for deployment on Vercel:

```bash
npm run build
npx vercel --prod
```

## 📁 Project Structure

```
src/
├── components/
│   └── PromptEnhancer.tsx          # Main AdvancedPromptGenerator component
├── pages/
│   ├── Index.tsx                   # Home page
│   └── NotFound.tsx                # 404 page
├── hooks/                          # Custom React hooks
├── lib/                           # Utility functions
└── main.tsx                       # Application entry point

public/                            # Static assets
```

## 🎨 Features Overview

### Generation Modes

1. **Free Rule-Based Mode** (⚡)
   - Instant generation with no API costs
   - Smart intent analysis and context-aware prompt structuring
   - Optimized for different content types (writing, coding, analysis, etc.)

2. **AI-Powered Mode** (🤖)
   - Uses OpenRouter API for intelligent prompt enhancement
   - Requires API key from [openrouter.ai](https://openrouter.ai/keys)
   - Advanced prompt engineering with AI assistance
   - Supports multiple AI models including GPT-4o, Claude 3.5, Gemini Pro, and more

### Intent Analysis

The tool automatically analyzes your prompt to determine the intent:
- **Creative Writing**: Stories, articles, narratives
- **Coding**: Scripts, programs, algorithms
- **Analytical**: Research, evaluation, comparison
- **Data Science**: Visualization, plotting, analysis
- **General**: All other types of prompts

### Model Optimization

Each AI model gets tailored optimization:
- **OpenAI Models**: Clear structure, logical flow, concrete examples
- **Anthropic Models**: Step-by-step reasoning, structured thinking
- **Google Models**: Research-backed information, clear queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Creative Commons Attribution-ShareAlike 4.0 International License.

## 👨‍💻 Author

**Shubham Mehta**

Made with ❤️ by Shubham Mehta

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vercel](https://vercel.com/) for the amazing deployment platform
- [Lucide](https://lucide.dev/) for the beautiful icons
- [OpenRouter](https://openrouter.ai/) for the AI integration
