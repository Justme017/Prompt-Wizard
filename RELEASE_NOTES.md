# Prompt Wizard Extension v3.2.0

## 🎉 What's New

### Multi-API Support
- **OpenRouter Integration**: Access 200+ AI models including GPT-4, Claude, Llama
- **Google Gemini Support**: Native Gemini API integration (1.5 Flash, Pro, 2.0)
- **Provider Selection**: Easy switching between APIs in settings

### Enhanced User Experience
- **Compact Modal**: Smaller, more elegant enhancement preview
- **Mode Indicator**: Visual feedback showing which enhancement mode is active
- **Better Button Handling**: Fixed all modal buttons (close, copy, apply)
- **Improved Debugging**: Console logging for API troubleshooting

### Features

✨ **Multiple Triggers**
- Floating button (auto-detect on AI platforms)
- Right-click context menu
- Keyboard shortcut: `Ctrl+Shift+E`

🤖 **Three Enhancement Modes**
1. Rule-based (instant, offline, free)
2. OpenRouter AI (200+ models)
3. Google Gemini AI (fast & free tier)

🌐 **Works Everywhere**
- ChatGPT (chat.openai.com)
- Claude (claude.ai)
- Google Gemini (gemini.google.com)
- Microsoft Copilot (copilot.microsoft.com)
- **All other websites!**

🔒 **Privacy-First**
- No data collection
- Local processing for rule-based mode
- API keys stored locally only

## 📦 Installation

### Chrome / Brave / Edge / Opera

1. Download `prompt-wizard-extension-v3.2.0.zip`
2. Extract the ZIP file
3. Open `chrome://extensions` (or `brave://extensions`, `edge://extensions`)
4. Enable "Developer mode" (top-right toggle)
5. Click "Load unpacked"
6. Select the extracted `extension` folder
7. Done! 🎉

### Firefox

1. Download `prompt-wizard-extension-v3.2.0.zip`
2. Extract the ZIP file
3. Open `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on"
5. Select `manifest.json` in the extension folder
6. Note: Removed when Firefox closes (Firefox limitation)

## 🚀 Quick Start

### Basic Usage (No API Key Needed)

1. Go to any AI platform (ChatGPT, Claude, etc.)
2. Type your prompt
3. Click the ✨ floating button or press `Ctrl+Shift+E`
4. Copy or apply the enhanced prompt!

### AI-Powered Enhancement (Optional)

**For OpenRouter:**
1. Get free key: https://openrouter.ai/keys
2. Click extension icon in toolbar
3. Select "OpenRouter" provider
4. Paste API key (format: `sk-or-...`)
5. Choose model (Gemma 3 12B is free!)

**For Gemini:**
1. Get free key: https://aistudio.google.com/app/apikey
2. Click extension icon in toolbar
3. Select "Gemini" provider
4. Paste API key (format: `AIza...`)
5. Choose model (1.5 Flash recommended)

## 🔧 Settings

Access settings by clicking the extension icon:
- **Auto-Detect**: Toggle floating button on/off
- **Notifications**: Enable/disable alerts
- **AI Provider**: None, OpenRouter, or Gemini
- **Model Selection**: Choose your preferred AI model
- **API Key**: Add/verify your API credentials
- **Stats**: View prompts enhanced & time saved

## 🐛 Troubleshooting

**Button not appearing?**
- Check Auto-Detect is enabled in settings
- Try typing more text (minimum 10 characters)
- Refresh the page

**API not working?**
1. Open browser console (F12)
2. Trigger enhancement
3. Check logs for "📋 Settings:"
4. Verify `hasKey: true` and `provider` is correct

**Modal buttons not working?**
- This version fixes all button issues
- Try reloading the extension if issues persist

## 📝 Technical Details

- **Version**: 3.2.0
- **Manifest**: V3
- **Size**: ~45KB
- **Permissions**:
  - `activeTab`: Detect and interact with text fields
  - `storage`: Save settings locally
  - `contextMenus`: Right-click integration
  - `commands`: Keyboard shortcuts
- **No Remote Code**: All code is local
- **No Data Collection**: 100% private

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/Justme017/Prompt-Wizard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Justme017/Prompt-Wizard/discussions)
- **Web App**: https://prompt-wizard-seven.vercel.app

## 📜 Changelog

### v3.2.0 (2026-02-06)
- ✨ Added Google Gemini API support
- ✨ Added OpenRouter multi-model support
- 🎨 Redesigned modal (compact, 600px width)
- 🎨 Added mode indicator badge
- 🐛 Fixed copy button text display bug
- 🐛 Fixed apply button not working
- 🐛 Fixed close button not closing modal
- 🐛 Fixed API detection issues
- 📝 Improved API key validation
- 📝 Added debug logging for troubleshooting

### v3.1.0 (2026-02-05)
- 🚀 Complete architecture rebuild
- ✨ Added multiple trigger methods
- ✨ Added keyboard shortcut support
- ✨ Added context menu integration
- 🎨 Simplified from 400+ to 250 lines
- 🐛 Fixed service worker reliability issues

### v3.0.0 (2026-02-04)
- 🎉 Initial browser extension release
- ✨ Auto-detect floating button
- ✨ Rule-based enhancement engine
- ✨ Cross-platform support

---

**Made with ❤️ by [Shubham Mehta](https://github.com/Justme017)**

⭐ Star the project on GitHub: https://github.com/Justme017/Prompt-Wizard
