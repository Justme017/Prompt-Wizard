<p align="center">
  <img src="public/1769975609060.png" alt="Prompt Wizard Banner" width="100%">
</p>

<h1 align="center">Prompt Wizard</h1>

<p align="center">
  <strong>Advanced AI-Powered Prompt Generator</strong>
</p>

<p align="center">
  <a href="https://prompt-wizard-seven.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Now-blue?style=for-the-badge&logo=vercel" alt="Live Demo">
  </a>
  <a href="https://github.com/Justme017/Prompt-Wizard/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg?style=for-the-badge" alt="License">
  </a>
  <a href="https://github.com/Justme017/Prompt-Wizard/stargazers">
    <img src="https://img.shields.io/github/stars/Justme017/Prompt-Wizard?style=for-the-badge&logo=github" alt="GitHub stars">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
</p>

<p align="center">
  A modern, AI-powered prompt optimization tool that helps you craft better prompts for various AI models. Features both free rule-based generation and AI-powered enhancement with support for multiple models and output formats.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-live-demo">Demo</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

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

**Try it now:** [https://prompt-wizard-seven.vercel.app](https://prompt-wizard-seven.vercel.app)

![Demo](https://img.shields.io/badge/Status-Online-success?style=flat-square)

---

## 📚 Table of Contents

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Tech Stack](#️-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Generation Modes](#-generation-modes)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom dark mode support
- **Icons**: Lucide React
- **Deployment**: Vercel with serverless functions
- **AI Integration**: OpenRouter API for AI-powered generation

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Justme017/Prompt-Wizard.git
   cd Prompt-Wizard
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

---

## 💡 Usage

### Free Rule-Based Mode

1. Enter your prompt in the text area
2. Select your desired output format (Plain Text, JSON, Markdown, Code)
3. Click "Generate Enhanced Prompt"
4. Copy the enhanced prompt to use with any AI model

### AI-Powered Mode

1. Get your free API key from [OpenRouter](https://openrouter.ai/keys)
2. Enter the API key in the configuration section
3. Toggle to "AI-Powered Mode"
4. Select your preferred AI model (GPT-4o, Claude 3.5, Gemini Pro, etc.)
5. Enter your prompt and generate

### Skills Quick-Start

Use the "Add Skill to Chat" dropdown to instantly copy pre-configured prompts for:
- 🎨 Image Generation
- 🎵 Audio Generation  
- 🎬 Video Generation
- ✉️ Email Writing
- 🔍 Research
- 👶 ELI5 Explanations
- 📊 Data Analysis
- 💻 Code Review
- 🌐 Translation
- ✍️ Creative Writing
- 📚 Tutoring
- 📝 Summarization

---

## 🏗️ Build for Production

```bash
npm run build
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Justme017/Prompt-Wizard)

**Manual Deployment:**

```bash
# Build the project
npm run build

# Deploy to Vercel
npx vercel --prod
```

### Environment Variables

No environment variables required for the free mode. For AI-powered mode, users provide their own OpenRouter API keys directly in the UI.

---

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

#### ⚡ Free Rule-Based Mode
- ✅ Instant generation with no API costs
- ✅ Smart intent analysis and context-aware prompt structuring
- ✅ Optimized for different content types (writing, coding, analysis, etc.)
- ✅ No sign-up required

#### 🤖 AI-Powered Mode
- 🚀 Uses OpenRouter API for intelligent prompt enhancement
- 🔑 Requires API key from [openrouter.ai](https://openrouter.ai/keys)
- 🧠 Advanced prompt engineering with AI assistance
- 🎯 Supports multiple AI models:
  - **OpenAI**: GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo
  - **Anthropic**: Claude 3.5 Sonnet
  - **Google**: Gemini Pro, Gemma 3 12B (default)

### 🎯 Smart Intent Detection

The tool automatically analyzes your prompt to determine the intent:

| Intent | Description | Examples |
|--------|-------------|----------|
| 🎨 **Creative Writing** | Stories, articles, narratives | "Write a sci-fi story" |
| 💻 **Coding** | Scripts, programs, algorithms | "Create a Python script" |
| 📊 **Analytical** | Research, evaluation, comparison | "Analyze market trends" |
| 📈 **Data Science** | Visualization, plotting, analysis | "Create a data dashboard" |
| 🌐 **General** | All other types of prompts | "Explain quantum physics" |

### ⚙️ Output Formats

Choose from multiple output formats for your enhanced prompts:
- 📝 **Plain Text**: Simple, readable format
- 🔗 **JSON**: Structured data format
- 📄 **Markdown**: Formatted documentation
- 💻 **Code**: Programming-specific format

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### How to Contribute

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. ✍️ Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🎉 Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write clear commit messages
- Update documentation as needed
- Test your changes thoroughly

---

## 📄 License

This project is licensed under the **Creative Commons Attribution-ShareAlike 4.0 International License**.

[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)

You are free to:
- ✅ Share — copy and redistribute the material
- ✅ Adapt — remix, transform, and build upon the material

Under the following terms:
- 📝 Attribution — Give appropriate credit
- 🔄 ShareAlike — Distribute under the same license

---

## 👨‍💻 Author

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge" alt="Made with love">
</p>

**Shubham Mehta**

[![GitHub](https://img.shields.io/badge/GitHub-Justme017-181717?style=flat-square&logo=github)](https://github.com/Justme017)

---

## 🙏 Acknowledgments

Special thanks to:

- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- ⚡ [Vite](https://vitejs.dev/) - Next generation frontend tooling
- ⚛️ [React](https://react.dev/) - JavaScript library for building user interfaces
- 🚀 [Vercel](https://vercel.com/) - Deployment and hosting platform
- 🎭 [Lucide](https://lucide.dev/) - Beautiful & consistent icons
- 🤖 [OpenRouter](https://openrouter.ai/) - Unified API for multiple AI models

---

## 📊 Stats

![GitHub repo size](https://img.shields.io/github/repo-size/Justme017/Prompt-Wizard?style=flat-square)
![GitHub language count](https://img.shields.io/github/languages/count/Justme017/Prompt-Wizard?style=flat-square)
![GitHub top language](https://img.shields.io/github/languages/top/Justme017/Prompt-Wizard?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/Justme017/Prompt-Wizard?style=flat-square)

---

## ⚙️ Repository Setup

### About Section
To complete your GitHub repository setup, update the **About** section with:

**Description:**
```
Advanced AI-powered prompt generator with hybrid modes, multiple AI models, and smart intent detection. Built with React, TypeScript, and Tailwind CSS.
```

**Website:**
```
https://prompt-wizard-seven.vercel.app
```

**Topics:**
```
ai, prompt-engineering, openrouter, react, typescript, vite, tailwind-css, prompt-generator, llm, gpt-4, claude, gemini, ai-tools, prompt-optimization, vercel, openai, anthropic, google-ai, developer-tools, productivity
```

---

<p align="center">
  <strong>⭐ If you find this project useful, please consider giving it a star! ⭐</strong>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/Justme017">Shubham Mehta</a>
</p>
