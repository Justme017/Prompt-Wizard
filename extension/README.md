# 🪄 Prompt Wizard - Browser Extension (V3)

> Transform your AI prompts automatically. Works like Grammarly but for AI prompts!

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/Justme017/Prompt-Wizard)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome](https://img.shields.io/badge/Chrome-Compatible-brightgreen.svg)](https://www.google.com/chrome/)
[![Edge](https://img.shields.io/badge/Edge-Compatible-brightgreen.svg)](https://www.microsoft.com/edge)

## 🎯 What is Prompt Wizard Extension?

Prompt Wizard is a browser extension that automatically detects when you're typing AI prompts and offers to enhance them in real-time. Just like Grammarly helps with writing, Prompt Wizard helps you create better AI prompts!

## ✨ Features

### 🔍 **Auto-Detection**
- Automatically detects text inputs on **any website**
- Special optimization for popular AI platforms:
  - ChatGPT (chat.openai.com)
  - Claude (claude.ai)
  - Gemini (gemini.google.com)
  - Microsoft Copilot
  - Perplexity AI
  - Poe
  - And more!

### 🚀 **Smart Enhancement**
- **Rule-Based Mode**: Free, instant enhancements (no API key needed)
- **AI-Powered Mode**: Advanced enhancements using OpenRouter API
- Intelligent intent detection (creative writing, coding, analysis, etc.)
- Structured output with ROLE, OBJECTIVE, CONTEXT, and DATA

### 🎨 **Beautiful UI**
- Non-intrusive floating button (like Grammarly)
- Elegant preview panel
- Dark mode support
- Smooth animations

### 💾 **Local Storage**
- All settings saved locally
- Privacy-first: No data sent to external servers (except when using AI mode)
- Usage statistics tracking

### ⚡ **Quick Actions**
- One-click enhancement
- Copy enhanced prompt
- Apply to current text field
- Export to web app

## 📦 Installation

### Option 1: Chrome Web Store (Coming Soon)
*Extension will be available on Chrome Web Store soon*

### Option 2: Manual Installation (Developer Mode)

1. **Download the Extension**
   ```bash
   git clone https://github.com/Justme017/Prompt-Wizard.git
   cd Prompt-Wizard/extension
   ```

2. **Open Chrome/Edge Extensions Page**
   - Chrome: Navigate to `chrome://extensions/`
   - Edge: Navigate to `edge://extensions/`

3. **Enable Developer Mode**
   - Toggle "Developer mode" in the top right corner

4. **Load Extension**
   - Click "Load unpacked"
   - Select the `extension` folder
   - The extension icon should appear in your toolbar!

## 🎮 How to Use

### Basic Usage

1. **Go to any website** (ChatGPT, Claude, or any text input)
2. **Click on a text field** and start typing your prompt
3. **Wait for the "Enhance" button** to appear (requires 10+ characters)
4. **Click "Enhance"** to see your improved prompt
5. **Review and Apply** the enhanced version

### Settings

Click the extension icon in your toolbar to access:
- **Auto-Detect**: Toggle automatic prompt detection
- **Notifications**: Enable/disable notifications
- **AI Model**: Choose from 6 AI models (free and premium)
- **API Key**: Optional OpenRouter API key for AI-powered mode
- **Stats**: View your enhancement statistics

### Keyboard Shortcuts (Coming Soon)
- `Ctrl+Shift+E` (Windows/Linux) or `Cmd+Shift+E` (Mac): Enhance current prompt

## 🤖 Supported AI Models

### Free Models (No API Key Required)
- ✅ Rule-based enhancement (instant)

### With API Key (OpenRouter)
- 🆓 Gemma 3 12B (Free)
- 🆓 Llama 3 70B (Free)
- 🆓 Mixtral 8x7B (Free)
- 💰 GPT-3.5 Turbo
- ⭐ GPT-4o
- ⭐ Claude 3.5 Sonnet

[Get your free OpenRouter API key](https://openrouter.ai/keys)

## 🎯 Intent Detection

The extension automatically detects your prompt type:
- 📝 **Creative Writing**: Stories, articles, narratives
- 💻 **Coding**: Programming, scripts, algorithms
- 📊 **Data Analysis**: Charts, statistics, insights
- ✉️ **Email Writing**: Professional correspondence
- 🔬 **Research**: Academic, investigation
- 🎓 **Tutoring**: Teaching, explanations
- 🌐 **Translation**: Language conversion
- 📢 **Marketing**: Ads, campaigns, copy

## 🛠️ Technical Details

### Architecture
```
extension/
├── manifest.json          # Extension configuration
├── content.js            # Content script (detects text inputs)
├── content.css           # Styling for enhancement UI
├── background.js         # Service worker (handles enhancement)
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic
├── icons/                # Extension icons
└── README.md             # This file
```

### Permissions Required
- `activeTab`: To detect text inputs on current page
- `storage`: To save settings and statistics
- `scripting`: To inject enhancement UI
- `host_permissions`: To work on all websites

### Privacy
- ✅ No tracking or analytics
- ✅ Settings stored locally only
- ✅ API key encrypted in local storage
- ✅ Rule-based mode works 100% offline
- ⚠️ AI mode sends text to OpenRouter API (only when enabled)

## 🆚 Comparison

| Feature | Prompt Wizard | Grammarly | Other Extensions |
|---------|---------------|-----------|------------------|
| AI Prompt Enhancement | ✅ | ❌ | ❌ |
| Auto-Detection | ✅ | ✅ | ⚠️ |
| Free Mode | ✅ | ⚠️ | ⚠️ |
| Privacy-First | ✅ | ⚠️ | ⚠️ |
| Works on All Sites | ✅ | ✅ | ❌ |
| Structured Output | ✅ | ❌ | ❌ |
| Open Source | ✅ | ❌ | ⚠️ |

## 🐛 Troubleshooting

### Extension not detecting text inputs?
- Make sure "Auto-Detect" is enabled in settings
- Try refreshing the page
- Check that you have at least 10 characters typed

### Enhancement not working?
- Check your internet connection (for AI mode)
- Verify API key is correct (if using AI mode)
- Try using rule-based mode (works offline)

### Button not appearing?
- Text field must be large enough (>40px height or >200px width)
- Must have 10+ characters typed
- Try clicking in the text field again

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Changelog

### Version 3.0.0 (Current)
- 🎉 Initial browser extension release
- ✨ Auto-detection of text inputs
- 🤖 Rule-based and AI-powered modes
- 🎨 Beautiful enhancement UI
- 📊 Usage statistics
- ⚙️ Comprehensive settings

## 🔮 Roadmap

- [ ] Chrome Web Store publication
- [ ] Firefox support
- [ ] Keyboard shortcuts
- [ ] Custom skill templates
- [ ] Prompt history sync
- [ ] Team collaboration features
- [ ] Prompt templates library

## 📄 License

MIT License - see [LICENSE](../LICENSE) file for details

## 👨‍💻 Author

**Shubham Mehta**
- GitHub: [@Justme017](https://github.com/Justme017)
- Web App: [Prompt Wizard](https://prompt-wizard-seven.vercel.app)

## 🌟 Support

If you find this extension helpful, please:
- ⭐ Star the [GitHub repository](https://github.com/Justme017/Prompt-Wizard)
- 🐛 Report bugs via [GitHub Issues](https://github.com/Justme017/Prompt-Wizard/issues)
- 💡 Suggest features
- 📣 Share with friends!

---

Made with ❤️ for the AI community
