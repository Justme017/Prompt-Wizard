# 📝 Changelog

## [3.0.1] - 2026-02-05

### 🐛 Bug Fixes

#### Claude.ai Detection Issue - FIXED ✅
**Problem:** Extension button was not appearing on Claude.ai chat interface

**Root Cause:** 
- Claude uses a ProseMirror editor (contenteditable div with class `.ProseMirror`)
- Previous detection logic didn't include platform-specific selectors
- Size requirements were too strict for AI platform inputs

**Solution:**
- Added `.ProseMirror` selector specifically for Claude.ai
- Added multiple platform-specific selectors:
  - `[data-slate-editor]` for Slate-based editors
  - `[role="textbox"]` for accessibility-compliant inputs
  - `#prompt-textarea` for ChatGPT
  - `[contenteditable="true"][role="textbox"]` for various platforms
- Relaxed size requirements on AI platforms (30px minimum vs 40px)
- Improved `element.matches()` with `element.closest()` fallback

**Code Changes:**
```javascript
// Before
const isLargeEnough = element.offsetHeight > 40 || element.offsetWidth > 200;
return (isTextarea || isContentEditable || isInput) && isLargeEnough;

// After
const platformSelectors = ['.ProseMirror', '[role="textbox"]', ...];
const isPlatformSpecific = platformSelectors.some(selector => 
  element.matches(selector) || element.closest(selector)
);
const isLargeEnough = onAIPlatform ? 
  (element.offsetHeight > 30 || element.offsetWidth > 150) :
  (element.offsetHeight > 40 || element.offsetWidth > 200);
return (isTextarea || isContentEditable || isInput || isPlatformSpecific) && isLargeEnough;
```

#### Text Handling for ProseMirror - IMPROVED ✅
**Problem:** Apply button might not work correctly on Claude due to ProseMirror's complex DOM structure

**Solution:**
- Enhanced `getElementText()` to check for contenteditable attribute
- Enhanced `setElementText()` with:
  - Focus element before setting text
  - Multiple event dispatching (Event, InputEvent)
  - Better framework compatibility

**Code Changes:**
```javascript
// Enhanced text setting
element.focus();
element.innerText = text;
element.dispatchEvent(new Event('input', { bubbles: true }));
element.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
```

### 🎨 Assets

#### Extension Icons - FIXED ✅
**Problem:** Icon files were copied as .ico instead of proper PNG format

**Solution:**
- Used .NET System.Drawing to properly convert favicon.ico
- Created high-quality PNG icons at all required sizes
- Used HighQualityBicubic interpolation for smooth scaling

**Generated Files:**
- `icon16.png` - 781 bytes
- `icon32.png` - 2,312 bytes
- `icon48.png` - 5,020 bytes
- `icon128.png` - 32,597 bytes

### 📚 Documentation

#### New Files
- **TESTING.md** - Comprehensive testing guide with:
  - Step-by-step test procedures
  - Expected behavior checklist
  - Debug console commands
  - Troubleshooting section
  - Platform-specific testing instructions

#### Updated Files
- **README.md** - Added Claude.ai testing confirmation
- **CHANGELOG.md** - This file!

---

## [3.0.0] - 2026-02-04

### ✨ Initial Release

- Auto-detection of text inputs on any website
- Floating enhancement button (Grammarly-style)
- Rule-based and AI-powered enhancement modes
- Support for ChatGPT, Claude, Gemini, and more
- Settings popup with model selection and API key management
- Usage statistics tracking
- Dark mode support
- Export to TXT, JSON, MD formats

---

## Testing Status

| Platform | Detection | Enhancement | Apply | Status |
|----------|-----------|-------------|-------|--------|
| Claude.ai | ✅ | ✅ | ⚠️ Use Copy | **TESTED** |
| ChatGPT | ✅ | ✅ | ✅ | Verified |
| Gemini | ⏳ | ⏳ | ⏳ | Pending |
| Generic Sites | ✅ | ✅ | ✅ | Working |

⚠️ **Note on Claude.ai:** The "Apply" button may not work perfectly due to ProseMirror's complex DOM structure. Use the "Copy" button and paste manually for best results.

---

## Known Issues

1. **Claude.ai Apply Button**: May not insert text correctly. Workaround: Use Copy button.
2. **Some Complex Editors**: Rich text editors with custom implementations may need additional selectors.

## Roadmap

### v3.0.2 (Planned)
- [ ] Improve Claude.ai Apply button with ProseMirror API
- [ ] Add more AI platform selectors
- [ ] Optimize detection performance
- [ ] Add keyboard shortcuts

### v3.1.0 (Planned)
- [ ] Firefox compatibility
- [ ] Safari extension
- [ ] Advanced settings panel
- [ ] Prompt templates sync

---

**Author:** Shubham Mehta  
**Repository:** https://github.com/Justme017/Prompt-Wizard  
**License:** MIT
