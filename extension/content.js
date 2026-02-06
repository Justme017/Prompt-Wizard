// 🪄 Prompt Wizard - Simplified & Reliable
// Multiple Ways to Enhance: Auto-detect Button | Right-click | Ctrl+Shift+E

console.log('🪄 Prompt Wizard loaded!');

// ==========================================
// ENHANCEMENT ENGINE (Runs Locally - No Service Worker Issues!)
// ==========================================

const SKILLS = {
  creative: { name: 'Creative Writer & Storyteller', keywords: /write|story|creative|narrative|blog|article|essay/i },
  code: { name: 'Senior Software Engineer', keywords: /code|program|function|script|debug|api|implement|refactor/i },
  data: { name: 'Data Analyst', keywords: /analyze|data|chart|graph|statistics|metrics/i },
  business: { name: 'Business Strategist', keywords: /business|strategy|market|sales|roi|profit/i },
  research: { name: 'Research Analyst', keywords: /research|study|investigate|findings|evidence/i },
  teacher: { name: 'Expert Educator', keywords: /teach|explain|learn|tutorial|guide/i },
  email: { name: 'Communication Specialist', keywords: /email|message|correspondence|letter/i },
  general: { name: 'Expert Assistant', keywords: /.*/ }
};

function detectSkill(text) {
  for (const [key, skill] of Object.entries(SKILLS)) {
    if (skill.keywords.test(text)) return skill.name;
  }
  return SKILLS.general.name;
}

function enhancePrompt(originalText) {
  const skill = detectSkill(originalText);
  
  return `**ROLE:** ${skill}

**OBJECTIVE:**
Provide a comprehensive, well-structured response that directly addresses the user's request with exceptional clarity and depth.

**CONTEXT:**
User Request: "${originalText}"

**REQUIREMENTS:**
• Structure the response with clear sections and logical flow
• Provide specific, actionable examples and insights
• Use appropriate formatting (headings, lists, code blocks) for maximum readability
• Ensure accuracy, completeness, and professional quality
• Include relevant context and background information
• Conclude with practical next steps or recommendations

**EXPECTED OUTPUT:**
A detailed, expert-level response that fully satisfies the request while maintaining engagement and clarity.`;
}

// AI Enhancement (OpenRouter)
async function enhanceWithOpenRouter(text, apiKey, model) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.href
    },
    body: JSON.stringify({
      model: `openrouter/auto`,
      messages: [{
        role: 'system',
        content: 'You are an expert prompt engineer. Transform user prompts into detailed, structured prompts following the ROLE-OBJECTIVE-CONTEXT-REQUIREMENTS format.'
      }, {
        role: 'user',
        content: `Enhance this prompt: "${text}"`
      }],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// AI Enhancement (Gemini)
async function enhanceWithGemini(text, apiKey, model) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are an expert prompt engineer. Transform this user prompt into a detailed, structured prompt following the ROLE-OBJECTIVE-CONTEXT-REQUIREMENTS format:\n\n"${text}"`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// ==========================================
// UI: ENHANCEMENT MODAL
// ==========================================

let enhanceModal = null;

function showEnhancementModal(original, enhanced, mode = 'rule-based') {
  // Remove existing
  if (enhanceModal) enhanceModal.remove();
  
  const modeLabel = mode === 'openrouter' ? '🤖 AI-Enhanced (OpenRouter)' : 
                   mode === 'gemini' ? '🤖 AI-Enhanced (Gemini)' : 
                   '📝 Rule-Based Enhancement';
  
  enhanceModal = document.createElement('div');
  enhanceModal.id = 'pw-modal';
  enhanceModal.innerHTML = `
    <div class="pw-overlay"></div>
    <div class="pw-modal-content">
      <div class="pw-modal-header">
        <h3>✨ Enhanced Prompt</h3>
        <button class="pw-close">×</button>
      </div>
      <div class="pw-modal-body">
        <div class="pw-mode-indicator">${modeLabel}</div>
        <div class="pw-section">
          <label>Original:</label>
          <div class="pw-text">${escapeHtml(original)}</div>
        </div>
        <div class="pw-section">
          <label>Enhanced:</label>
          <div class="pw-text pw-enhanced">${escapeHtml(enhanced)}</div>
        </div>
      </div>
      <div class="pw-modal-footer">
        <button class="pw-btn pw-btn-secondary pw-copy-btn">📋 Copy</button>
        <button class="pw-btn pw-btn-primary pw-apply-btn">✓ Apply</button>
      </div>
    </div>
  `;
  document.body.appendChild(enhanceModal);
  
  // Add event listeners (avoid inline onclick to prevent escaping issues)
  const closeBtn = enhanceModal.querySelector('.pw-close');
  const overlay = enhanceModal.querySelector('.pw-overlay');
  const copyBtn = enhanceModal.querySelector('.pw-copy-btn');
  const applyBtn = enhanceModal.querySelector('.pw-apply-btn');
  
  // Close handlers
  closeBtn.addEventListener('click', () => enhanceModal.remove());
  overlay.addEventListener('click', () => enhanceModal.remove());
  
  // Copy handler
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(enhanced);
    copyBtn.textContent = '✓ Copied!';
    setTimeout(() => {
      copyBtn.textContent = '📋 Copy';
    }, 2000);
  });
  
  // Apply handler
  applyBtn.addEventListener('click', () => {
    if (currentInput) {
      setTextTo(currentInput, enhanced);
      alert('✅ Enhanced prompt applied!');
    } else {
      navigator.clipboard.writeText(enhanced);
      alert('✅ Copied to clipboard! (No active input to apply to)');
    }
    enhanceModal.remove();
  });
  
  // Update stats
  chrome.runtime.sendMessage({ action: 'updateStats' });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/\n/g, '<br>');
}

// ==========================================
// UI: AUTO-DETECT FLOATING BUTTON
// ==========================================

let floatingBtn = null;
let currentInput = null;

const AI_SITES = ['chat.openai.com', 'claude.ai', 'gemini.google.com', 'copilot.microsoft.com'];
const isAISite = AI_SITES.some(site => window.location.hostname.includes(site));

function createFloatingButton() {
  if (floatingBtn) return floatingBtn;
  
  floatingBtn = document.createElement('button');
  floatingBtn.id = 'pw-float-btn';
  floatingBtn.innerHTML = '✨ Enhance';
  floatingBtn.style.display = 'none';
  floatingBtn.onclick = () => handleEnhance();
  document.body.appendChild(floatingBtn);
  return floatingBtn;
}

function positionButton(element) {
  if (!floatingBtn) createFloatingButton();
  
  const rect = element.getBoundingClientRect();
  floatingBtn.style.top = `${rect.bottom + window.scrollY - 40}px`;
  floatingBtn.style.left = `${rect.right + window.scrollX - 120}px`;
  floatingBtn.style.display = 'flex';
}

function hideButton() {
  if (floatingBtn) floatingBtn.style.display = 'none';
}

// Detect suitable input fields
function isPromptInput(el) {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return (
    tag === 'textarea' ||
    (tag === 'input' && (el.type === 'text' || el.type === 'search')) ||
    el.contentEditable === 'true' ||
    el.matches?.('.ProseMirror, [role="textbox"], [data-slate-editor]')
  );
}

function getTextFrom(el) {
  if (!el) return '';
  const tag = el.tagName?.toLowerCase();
  if (tag === 'textarea' || tag === 'input') return el.value;
  return el.innerText || el.textContent || '';
}

function setTextTo(el, text) {
  if (!el) return;
  const tag = el.tagName?.toLowerCase();
  if (tag === 'textarea' || tag === 'input') {
    el.value = text;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    el.innerText = text;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

// Monitor focus for auto-detect
document.addEventListener('focusin', (e) => {
  if (isPromptInput(e.target)) {
    currentInput = e.target;
    
    // Show button after typing
    const checkText = () => {
      const text = getTextFrom(currentInput);
      if (text && text.length > 10) {
        positionButton(currentInput);
      } else {
        hideButton();
      }
    };
    
    currentInput.addEventListener('input', checkText);
    checkText();
  }
});

document.addEventListener('focusout', () => {
  setTimeout(() => {
    if (!document.activeElement || !isPromptInput(document.activeElement)) {
      hideButton();
      currentInput = null;
    }
  }, 200);
});

// ==========================================
// ENHANCE FUNCTION (Main Logic)
// ==========================================

async function handleEnhance(text = null) {
  let originalText = text;
  
  // Get text from various sources
  if (!originalText) {
    // Try selected text first
    originalText = window.getSelection()?.toString()?.trim();
  }
  if (!originalText && currentInput) {
    // Try current input
    originalText = getTextFrom(currentInput);
  }
  if (!originalText) {
    // Try focused element
    originalText = getTextFrom(document.activeElement);
  }
  
  if (!originalText || originalText.length < 3) {
    alert('⚠️ Please select or enter text to enhance (minimum 3 characters)');
    return;
  }
  
  console.log('🎯 Enhancing:', originalText.substring(0, 50) + '...');
  
  // Get settings to check if AI enhancement is enabled
  const settings = await chrome.storage.sync.get(['aiModeOnly', 'apiProvider', 'apiKey', 'defaultModel', 'geminiModel']);
  
  console.log('📋 Settings:', {
    aiModeOnly: settings.aiModeOnly,
    provider: settings.apiProvider,
    hasKey: !!settings.apiKey,
    keyLength: settings.apiKey?.length || 0,
    model: settings.defaultModel || settings.geminiModel
  });
  
  let enhanced;
  let usedMode = 'rule-based';
  
  try {
    // Use AI if provider is configured and API key exists
    const hasValidKey = settings.apiKey && settings.apiKey.trim().length > 0;
    
    if (settings.apiProvider === 'openrouter' && hasValidKey) {
      console.log('🤖 Using OpenRouter AI enhancement with model:', settings.defaultModel);
      enhanced = await enhanceWithOpenRouter(originalText, settings.apiKey.trim(), settings.defaultModel);
      usedMode = 'openrouter';
      console.log('✅ OpenRouter enhancement received');
    } else if (settings.apiProvider === 'gemini' && hasValidKey) {
      console.log('🤖 Using Gemini AI enhancement with model:', settings.geminiModel);
      enhanced = await enhanceWithGemini(originalText, settings.apiKey.trim(), settings.geminiModel);
      usedMode = 'gemini';
      console.log('✅ Gemini enhancement received');
    } else {
      // Check if AI Mode Only is enabled
      if (settings.aiModeOnly) {
        alert('❌ AI Mode Only is enabled but no API is configured.\n\nPlease:\n1. Click extension icon\n2. Select AI Provider (OpenRouter or Gemini)\n3. Add your API key\n\nOr disable "AI Mode Only" to use free rule-based mode.');
        return;
      }
      // Fallback to rule-based enhancement
      console.log('📝 Using rule-based enhancement (provider:', settings.apiProvider, ', hasKey:', hasValidKey, ')');
      enhanced = enhancePrompt(originalText);
    }
  } catch (error) {
    console.error('❌ AI enhancement failed:', error);
    
    // If AI Mode Only is enabled, show error and don't fallback
    if (settings.aiModeOnly) {
      alert('❌ AI enhancement failed: ' + error.message + '\n\nAI Mode Only is enabled. Please check your API key and try again.\n\nOr disable "AI Mode Only" in settings to use rule-based mode as fallback.');
      return;
    }
    
    console.log('📝 Falling back to rule-based enhancement');
    enhanced = enhancePrompt(originalText);
    usedMode = 'rule-based';
  }
  
  // Show modal with mode indicator
  showEnhancementModal(originalText, enhanced, usedMode);
  
  console.log('✅ Enhancement complete!');
}

// ==========================================
// MESSAGE LISTENERS (Context Menu & Keyboard)
// ==========================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Content script received:', request.action);
  
  if (request.action === 'enhanceFromContextMenu') {
    handleEnhance(request.text);
    sendResponse({ success: true });
  }
  
  if (request.action === 'enhanceFromKeyboard') {
    handleEnhance();
    sendResponse({ success: true });
  }
  
  return false;
});

// ==========================================
// INITIALIZATION
// ==========================================

createFloatingButton();

if (isAISite) {
  setTimeout(() => {
    console.log('✅ Prompt Wizard active on AI platform!');
  }, 1000);
}

console.log('🚀 Prompt Wizard ready! Use: Auto-button | Right-click | Ctrl+Shift+E');
