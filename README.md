# Prompt Wizard

A modern, AI-powered prompt optimization tool that helps you craft better prompts for various AI models. Enhance your prompts with different modes (strict, balanced, creative) and output formats.

## ✨ Features

- **Multiple AI Models**: Support for GPT-4, GPT-3.5, Claude 3, Claude 2, Gemini Pro, Gemini Ultra, Llama 3, and Mistral Large
- **Optimization Modes**: Choose from strict, balanced, or creative optimization styles
- **Output Formats**: Generate prompts in plain text, JSON, Markdown, or XML formats
- **Dark Mode**: Toggle between light and dark themes with system preference detection
- **Real-time Token Counting**: See token usage and cost estimates
- **Copy to Clipboard**: Easily copy enhanced prompts
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Live Demo

Visit the live application: [https://prompt-wizard-seven.vercel.app](https://prompt-wizard-seven.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Deployment**: Vercel with serverless functions
- **Icons**: Lucide React
- **Notifications**: Sonner for toast messages

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd prompt-wizard
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
│   ├── ui/           # Reusable UI components (shadcn/ui)
│   └── PromptEnhancer.tsx  # Main application component
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── main.tsx          # Application entry point

api/
└── optimize.js       # Serverless function for prompt optimization

public/               # Static assets
```

## 🎨 Customization

### Adding New AI Models

Edit the `AI_MODELS` array in `src/components/PromptEnhancer.tsx`:

```typescript
const AI_MODELS: { value: AIModel; label: string; provider: string }[] = [
  // Add your new model here
  { value: "your-model", label: "Your Model Name", provider: "Provider Name" },
];
```

### Modifying Optimization Logic

The API endpoint in `api/optimize.js` handles the prompt optimization. You can modify the logic there to integrate with different AI services or adjust the optimization algorithms.

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

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vercel](https://vercel.com/) for the amazing deployment platform
- [Lucide](https://lucide.dev/) for the beautiful icons
