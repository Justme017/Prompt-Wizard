# 🧪 Extension Testing Guide

## Quick Test Steps

### 1. Load Extension in Browser

**Chrome:**
```
1. Open chrome://extensions/
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the extension folder
5. Pin the extension icon (optional)
```

**Edge:**
```
1. Open edge://extensions/
2. Enable "Developer mode" (left sidebar)
3. Click "Load unpacked"
4. Select the extension folder
5. Pin the extension icon (optional)
```

**Brave:**
```
1. Open brave://extensions/
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the extension folder
5. Pin the extension icon (optional)
```

### 2. Test on Claude.ai

1. **Open Claude**: Go to https://claude.ai
2. **Login** to your Claude account
3. **Click in the message box** at the bottom
4. **Type a prompt** (at least 10 characters): 
   ```
   Write a story about a robot
   ```
5. **Look for the "Enhance" button** - should appear in bottom-right of the text box
6. **Click "Enhance"** button
7. **Verify**: 
   - Modal panel appears
   - Shows "Original Prompt" and "Enhanced Prompt"
   - Enhanced prompt has ROLE/OBJECTIVE/CONTEXT/DATA structure
   - "Copy" and "Apply" buttons work

### 3. Test on ChatGPT

1. **Open ChatGPT**: Go to https://chat.openai.com
2. **Click in the message box**
3. **Type a prompt**: `help me write code`
4. **Verify**: Enhance button appears and works

### 4. Test on Other Websites

1. **Go to any website** with a text input (Gmail, Twitter, etc.)
2. **Click in a large text field**
3. **Type some text** (10+ characters)
4. **Verify**: Enhance button may appear if text field is large enough

### 5. Test Settings

1. **Click extension icon** in toolbar
2. **Verify settings popup** opens (400px x 600px)
3. **Test toggles**:
   - Auto-detect on/off
   - Show notifications on/off
4. **Test AI Model Selector**:
   - Dropdown shows 10 models
   - Can select different models
5. **Test API Key**:
   - Can enter/clear API key
   - Shows masked when entered

### 6. Test Enhancement Modes

**Rule-Based Mode (Default - No API Key):**
```
1. Ensure no API key is set
2. Enhance any prompt
3. Should get instant enhancement
4. Check structure: ROLE | OBJECTIVE | CONTEXT | DATA
```

**AI-Powered Mode (With API Key):**
```
1. Get OpenRouter API key from https://openrouter.ai/keys
2. Enter API key in extension settings
3. Select an AI model
4. Enhance a prompt
5. Should get AI-powered enhancement
```

## Expected Behavior

### ✅ What Should Work

- **Detection**: Enhancer button appears when typing 10+ chars
- **Positioning**: Button stays in bottom-right of text input
- **Enhancement**: Both rule-based and AI modes work
- **Apply**: Clicking "Apply" inserts enhanced prompt
- **Copy**: Clicking "Copy" copies to clipboard
- **Dark Mode**: Works automatically with system/browser theme
- **Notifications**: Toast notifications appear for feedback
- **Stats**: Usage stats increment in popup

### ❌ Common Issues

**Button doesn't appear:**
- Check if Developer Mode is enabled
- Check if text field is large enough (30px height minimum)
- Reload the page after loading extension
- Check browser console for errors

**Enhancement fails:**
- Check network tab for errors
- For AI mode: verify API key is correct
- Check background service worker logs

**Apply doesn't work on Claude:**
- Claude uses ProseMirror editor - it's more complex
- Try Copy button instead, then paste manually
- Check content.js console logs

## Testing Checklist

- [ ] Extension loads without errors
- [ ] Icon appears in browser toolbar
- [ ] Popup opens when clicking icon
- [ ] Settings save/load correctly
- [ ] Claude.ai detection works
- [ ] ChatGPT detection works
- [ ] Enhance button positions correctly
- [ ] Enhancement modal appears
- [ ] Copy button works
- [ ] Apply button works
- [ ] Rule-based mode works (no API key)
- [ ] AI mode works (with API key)
- [ ] Dark mode styles apply correctly
- [ ] Notifications show properly
- [ ] Stats increment correctly
- [ ] Extension persists after browser restart

## Debug Console Commands

Open browser console (F12) and try:

```javascript
// Check if extension loaded
console.log('Extension active:', !!document.querySelector('.pw-enhancer-button'));

// Check current active element
console.log('Active element:', document.activeElement);

// Test detection function (paste into console)
function testDetection() {
  const active = document.activeElement;
  console.log('Tag:', active.tagName);
  console.log('ContentEditable:', active.contentEditable);
  console.log('Size:', active.offsetWidth, 'x', active.offsetHeight);
  console.log('Classes:', active.className);
}
testDetection();
```

## Browser Console Logs

Look for these messages:

```
✅ Good Signs:
🪄 Prompt Wizard extension loaded
🎯 Detected input on: [platform name]
✨ Enhancement successful

❌ Problems:
Error: Cannot read property...
Failed to enhance prompt
API key not configured
```

## Testing Different Platforms

### Claude.ai
- Uses ProseMirror editor (contenteditable div)
- Class: `.ProseMirror`
- Should detect when clicking in message box
- Test with: "Write a story" → Click Enhance

### ChatGPT
- Uses textarea with ID `prompt-textarea`
- Should detect immediately
- Test with: "Help me code" → Click Enhance

### Gemini
- Uses contenteditable div
- Test with: "Explain quantum physics"

### Generic Websites
- Gmail compose
- Twitter/X post box
- GitHub issue/comment
- Should work on any large text field

## Troubleshooting

### Extension doesn't load
```powershell
# Check extension folder structure
ls extension/
# Should show: manifest.json, content.js, content.css, popup.html, background.js, icons/
```

### Icons not showing
```powershell
# Verify icon files exist
ls extension/icons/
# Should show: icon16.png, icon32.png, icon48.png, icon128.png
```

### Need to reload extension
```
1. Go to chrome://extensions/
2. Click reload button (circular arrow) on Prompt Wizard
3. Refresh the webpage you're testing
```

## Success Criteria

Extension is working correctly when:

1. ✅ Loads in browser without errors
2. ✅ Detects Claude.ai chat box
3. ✅ Detects ChatGPT chat box  
4. ✅ Shows enhance button on focus
5. ✅ Enhancement produces structured output
6. ✅ Copy/Apply buttons function
7. ✅ Settings persist
8. ✅ Dark mode works
9. ✅ No console errors
10. ✅ Works after browser restart

---

**Need Help?** 
- Check browser console (F12)
- Check extension service worker logs (chrome://extensions/ → Service Worker)
- Report issues to: https://github.com/Justme017/Prompt-Wizard/issues
