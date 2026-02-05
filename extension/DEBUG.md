# 🐛 DEBUG GUIDE - Extension Stuck on "Enhancing..."

## Issue: Loading State Doesn't Complete

If the extension shows "Enhancing..." but never completes, follow these steps:

---

## 🔧 IMMEDIATE FIX - Reload Extension

**Step 1: Open Extension Manager**
- Brave: `brave://extensions/`
- Chrome: `chrome://extensions/`
- Edge: `edge://extensions/`

**Step 2: Reload Prompt Wizard**
1. Find "Prompt Wizard" in the list
2. Click the **reload icon** (↻ circular arrow)
3. Wait for it to reload

**Step 3: Reload Claude.ai**
1. Go back to Claude.ai tab
2. Press **F5** or **Ctrl+R** to refresh
3. Try again!

---

## 🔍 CHECK SERVICE WORKER STATUS

### View Background Script Logs

**In Brave/Chrome:**
1. Go to `brave://extensions/` (or `chrome://extensions/`)
2. Make sure "Developer mode" is **ON**
3. Find "Prompt Wizard"
4. Click **"service worker"** (blue link)
5. Console window opens

**What to look for:**
```
✅ Good Signs:
🪄 Prompt Wizard background service worker loaded
📨 Background received message: enhancePrompt
🔄 Processing enhancement request...
✅ Enhancement complete: true

❌ Problem Signs:
Service worker (inactive)
No logs appearing
Error messages
❌ Enhancement error: ...
```

### View Content Script Logs

**While on Claude.ai:**
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Try enhancing a prompt

**What to look for:**
```
✅ Good Signs:
🪄 Prompt Wizard extension loaded
✅ Background script connected
🎯 Starting enhancement for: ...
✅ Enhancement response: { success: true }
✨ Prompt enhanced successfully!
🏁 Enhancement process completed

❌ Problem Signs:
❌ Background script not responding
❌ Enhancement error: ...
Enhancement timed out after 30 seconds
```

---

## 🚨 COMMON CAUSES & FIXES

### 1. Service Worker Inactive

**Problem:** Background script stopped running
**Fix:**
```
1. brave://extensions/ → Click "service worker" link
2. If it says "(inactive)", reload the extension
3. Try enhancement again
```

### 2. Message Passing Failure

**Problem:** Content script can't reach background script
**Fix:**
```
1. Check both Console logs (F12 + Service Worker)
2. Look for chrome.runtime.lastError messages
3. Reload extension + page
```

### 3. Storage API Issue

**Problem:** Can't read/write settings
**Fix:**
```
1. Right-click extension icon → Inspect popup
2. Console → Type: chrome.storage.sync.get(console.log)
3. Should show settings object
4. If error, clear storage: chrome.storage.sync.clear()
```

### 4. Claude.ai Specific Issues

**Problem:** Text extraction fails from ProseMirror
**Fix:**
```
1. F12 Console on Claude.ai
2. Type: document.activeElement
3. Should show ProseMirror div
4. Type: document.activeElement.innerText
5. Should show your typed text
```

---

## 🧪 MANUAL TEST SCRIPT

Paste this in Claude.ai console (F12) to test manually:

```javascript
// Test 1: Check extension loaded
console.log('Extension loaded?', !!document.querySelector('.pw-enhancer-button'));

// Test 2: Check active element
const el = document.activeElement;
console.log('Active element:', el.tagName, el.className);

// Test 3: Check text extraction
console.log('Text content:', el.innerText || el.textContent || el.value);

// Test 4: Test message passing
chrome.runtime.sendMessage(
  { action: 'ping' }, 
  (response) => {
    if (chrome.runtime.lastError) {
      console.error('❌ Error:', chrome.runtime.lastError.message);
    } else {
      console.log('✅ Response:', response);
    }
  }
);

// Test 5: Trigger enhancement manually
chrome.runtime.sendMessage(
  { action: 'enhancePrompt', text: 'Write a test story' }, 
  (response) => {
    if (chrome.runtime.lastError) {
      console.error('❌ Error:', chrome.runtime.lastError.message);
    } else {
      console.log('✅ Enhanced:', response);
    }
  }
);
```

---

## 📊 DIAGNOSTIC CHECKLIST

Run through this checklist:

**Extension Status:**
- [ ] Extension enabled in brave://extensions/
- [ ] Developer mode is ON
- [ ] Service worker shows "active"
- [ ] No errors in service worker console

**Page Status:**
- [ ] On Claude.ai (logged in)
- [ ] Page fully loaded
- [ ] Clicked in message box
- [ ] Typed 10+ characters

**Button Status:**
- [ ] Enhance button appeared
- [ ] Button positioned correctly
- [ ] Button clickable (not hidden)

**Console Logs:**
- [ ] Page console (F12): "🪄 Prompt Wizard extension loaded"
- [ ] Page console: "✅ Background script connected"
- [ ] Service worker: "🪄 Prompt Wizard background service worker loaded"

**When Clicked:**
- [ ] Button changes to "Enhancing..."
- [ ] Service worker receives message
- [ ] Enhancement processes (check logs)
- [ ] Response sent back
- [ ] Modal appears OR error shown

---

## 🔧 ADVANCED FIXES

### Reinstall Extension

If nothing works, try clean reinstall:

```
1. brave://extensions/
2. Remove Prompt Wizard (trash icon)
3. Close all Brave tabs
4. Restart Brave
5. brave://extensions/
6. Enable Developer mode
7. Load unpacked → Select extension folder
8. Go to Claude.ai
9. Test again
```

### Check Permissions

```
1. brave://extensions/
2. Click "Details" on Prompt Wizard
3. Scroll to "Site access"
4. Should be: "On all sites"
5. If not: Change to "On all sites"
```

### Clear Extension Data

```javascript
// In service worker console or popup inspect:
chrome.storage.sync.clear(() => {
  console.log('Storage cleared');
  chrome.runtime.reload();
});
```

---

## 💬 GET HELP

If still stuck, collect this info:

**System:**
- Browser: Brave [version]
- OS: Windows 11
- Extension Version: 3.0.1

**Console Output:**
```
[Paste service worker logs]
[Paste page console logs]
```

**Steps to Reproduce:**
1. Loaded extension
2. Went to Claude.ai
3. Clicked message box
4. Typed "test prompt"
5. Clicked Enhance button
6. Got stuck on "Enhancing..."

**Screenshot:**
[Attach screenshot of stuck state]

---

## ✅ SUCCESS INDICATORS

You'll know it's working when you see:

**In Service Worker Console:**
```
🪄 Prompt Wizard background service worker loaded
📨 Background received message: enhancePrompt
🔄 Processing enhancement request...
✅ Enhancement complete: true
```

**In Page Console (F12):**
```
🪄 Prompt Wizard extension loaded
✅ Background script connected
🎯 Starting enhancement for: test prompt...
✅ Enhancement response: {success: true, enhanced: "..."}
✨ Prompt enhanced successfully!
🏁 Enhancement process completed
```

**On Screen:**
- Button changes from "Enhancing..." back to "Enhance"
- Modal appears with enhanced prompt
- Toast notification: "✨ Prompt enhanced successfully!"

---

**Last Updated:** v3.0.1  
**Issue:** Loading state timeout fix added
