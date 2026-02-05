// Prompt Wizard Extension - Content Script
// Detects text inputs and offers prompt enhancement like Grammarly

let currentActiveElement = null;
let enhancerButton = null;
let isProcessing = false;

// Supported AI platforms
const AI_PLATFORMS = {
  'chat.openai.com': 'ChatGPT',
  'claude.ai': 'Claude',
  'gemini.google.com': 'Gemini',
  'copilot.microsoft.com': 'Copilot',
  'chat.mistral.ai': 'Mistral',
  'poe.com': 'Poe',
  'perplexity.ai': 'Perplexity',
  'huggingface.co/chat': 'HuggingChat'
};

// Detect if we're on a supported AI platform
const isAIPlatform = () => {
  const hostname = window.location.hostname;
  return Object.keys(AI_PLATFORMS).some(domain => hostname.includes(domain));
};

// Create the enhancement button (like Grammarly's icon)
function createEnhancerButton() {
  const button = document.createElement('div');
  button.id = 'prompt-wizard-enhancer-btn';
  button.className = 'pw-enhancer-button';
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span>Enhance</span>
  `;
  button.title = 'Enhance with Prompt Wizard';
  
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    enhanceCurrentPrompt();
  });
  
  return button;
}

// Position the enhancer button near the text input
function positionEnhancerButton(element) {
  if (!enhancerButton) {
    enhancerButton = createEnhancerButton();
    document.body.appendChild(enhancerButton);
  }
  
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  
  // Position in bottom-right corner of the text input
  enhancerButton.style.position = 'absolute';
  enhancerButton.style.top = `${rect.bottom + scrollTop - 40}px`;
  enhancerButton.style.left = `${rect.right + scrollLeft - 120}px`;
  enhancerButton.style.display = 'flex';
  enhancerButton.style.zIndex = '999999';
}

// Hide the enhancer button
function hideEnhancerButton() {
  if (enhancerButton) {
    enhancerButton.style.display = 'none';
  }
}

// Check if element is a text input suitable for prompts
function isPromptInput(element) {
  if (!element) return false;
  
  const tagName = element.tagName.toLowerCase();
  const isTextarea = tagName === 'textarea';
  const isContentEditable = element.contentEditable === 'true';
  const isInput = tagName === 'input' && (
    element.type === 'text' || 
    element.type === 'search' ||
    !element.type
  );
  
  // Platform-specific selectors for better detection
  const platformSelectors = [
    '.ProseMirror',           // Claude.ai
    '[data-slate-editor]',    // Various platforms
    '[role="textbox"]',       // Accessibility-aware inputs
    '#prompt-textarea',       // ChatGPT
    '[contenteditable="true"][role="textbox"]'
  ];
  
  // Check if element matches any platform-specific selector
  const isPlatformSpecific = platformSelectors.some(selector => {
    try {
      return element.matches(selector) || element.closest(selector);
    } catch (e) {
      return false;
    }
  });
  
  // On AI platforms, be more lenient with size requirements
  const onAIPlatform = isAIPlatform();
  const isLargeEnough = onAIPlatform ? 
    (element.offsetHeight > 30 || element.offsetWidth > 150) :
    (element.offsetHeight > 40 || element.offsetWidth > 200);
  
  return (isTextarea || isContentEditable || isInput || isPlatformSpecific) && isLargeEnough;
}

// Get text content from element
function getElementText(element) {
  if (element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'input') {
    return element.value;
  } else if (element.contentEditable === 'true' || element.getAttribute('contenteditable') === 'true') {
    // For ProseMirror and similar editors, prefer innerText
    return element.innerText || element.textContent || '';
  }
  return '';
}

// Set text content to element
function setElementText(element, text) {
  if (element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'input') {
    element.value = text;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  } else if (element.contentEditable === 'true' || element.getAttribute('contenteditable') === 'true') {
    // For contenteditable elements like ProseMirror
    element.focus();
    
    // Try to clear and set text
    if (element.innerText !== undefined) {
      element.innerText = text;
    } else {
      element.textContent = text;
    }
    
    // Trigger events that frameworks listen to
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
  }
}

// Enhance the current prompt
async function enhanceCurrentPrompt() {
  if (isProcessing || !currentActiveElement) return;
  
  const originalText = getElementText(currentActiveElement);
  if (!originalText || originalText.length < 10) {
    showNotification('Please enter a longer prompt to enhance (min 10 characters)');
    return;
  }
  
  isProcessing = true;
  showLoadingState();
  console.log('🎯 Starting enhancement for:', originalText.substring(0, 50) + '...');
  
  try {
    // Add timeout to prevent infinite loading
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Enhancement timed out after 30 seconds')), 30000)
    );
    
    const enhancePromise = chrome.runtime.sendMessage({
      action: 'enhancePrompt',
      text: originalText
    });
    
    // Race between enhancement and timeout
    const response = await Promise.race([enhancePromise, timeoutPromise]);
    
    console.log('✅ Enhancement response:', response);
    
    if (response && response.success) {
      // Show preview panel with enhanced prompt
      showEnhancedPromptPanel(originalText, response.enhanced);
      showNotification('✨ Prompt enhanced successfully!');
    } else {
      const errorMsg = response?.error || 'Unknown error occurred';
      console.error('❌ Enhancement failed:', errorMsg);
      showNotification('Failed to enhance: ' + errorMsg);
    }
  } catch (error) {
    console.error('❌ Enhancement error:', error);
    showNotification('Error: ' + error.message);
  } finally {
    isProcessing = false;
    hideLoadingState();
    console.log('🏁 Enhancement process completed');
  }
}

// Show loading state on button
function showLoadingState() {
  if (enhancerButton) {
    enhancerButton.classList.add('pw-loading');
    enhancerButton.innerHTML = `
      <div class="pw-spinner"></div>
      <span>Enhancing...</span>
    `;
  }
}

// Hide loading state
function hideLoadingState() {
  if (enhancerButton && currentActiveElement) {
    enhancerButton.classList.remove('pw-loading');
    enhancerButton.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Enhance</span>
    `;
  }
}

// Show enhanced prompt in a panel
function showEnhancedPromptPanel(original, enhanced) {
  // Remove existing panel if any
  const existingPanel = document.getElementById('pw-enhanced-panel');
  if (existingPanel) {
    existingPanel.remove();
  }
  
  const panel = document.createElement('div');
  panel.id = 'pw-enhanced-panel';
  panel.className = 'pw-panel';
  panel.innerHTML = `
    <div class="pw-panel-header">
      <h3>✨ Enhanced Prompt</h3>
      <button class="pw-close-btn" id="pw-close-panel">✕</button>
    </div>
    <div class="pw-panel-content">
      <div class="pw-section">
        <label>Original:</label>
        <div class="pw-text-preview">${escapeHtml(original)}</div>
      </div>
      <div class="pw-section">
        <label>Enhanced:</label>
        <div class="pw-text-preview pw-enhanced">${escapeHtml(enhanced)}</div>
      </div>
    </div>
    <div class="pw-panel-footer">
      <button class="pw-btn pw-btn-secondary" id="pw-copy-btn">📋 Copy</button>
      <button class="pw-btn pw-btn-primary" id="pw-apply-btn">✓ Apply</button>
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // Add event listeners
  document.getElementById('pw-close-panel').addEventListener('click', () => panel.remove());
  document.getElementById('pw-copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(enhanced);
    showNotification('Copied to clipboard!');
  });
  document.getElementById('pw-apply-btn').addEventListener('click', () => {
    if (currentActiveElement) {
      setElementText(currentActiveElement, enhanced);
      showNotification('Enhanced prompt applied!');
      panel.remove();
    }
  });
  
  // Close on outside click
  panel.addEventListener('click', (e) => {
    if (e.target === panel) {
      panel.remove();
    }
  });
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'pw-notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('pw-show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('pw-show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Monitor focus changes
function handleFocusChange(e) {
  const element = e.target;
  
  if (isPromptInput(element)) {
    currentActiveElement = element;
    
    // Show button if there's content
    const text = getElementText(element);
    if (text && text.length >= 10) {
      positionEnhancerButton(element);
    } else {
      hideEnhancerButton();
    }
    
    // Monitor input changes
    element.addEventListener('input', handleInputChange);
    element.addEventListener('scroll', handleScroll);
  } else {
    if (currentActiveElement) {
      currentActiveElement.removeEventListener('input', handleInputChange);
      currentActiveElement.removeEventListener('scroll', handleScroll);
    }
    currentActiveElement = null;
    hideEnhancerButton();
  }
}

// Handle input changes
function handleInputChange(e) {
  const text = getElementText(e.target);
  if (text && text.length >= 10) {
    positionEnhancerButton(e.target);
  } else {
    hideEnhancerButton();
  }
}

// Handle scroll to reposition button
function handleScroll(e) {
  if (currentActiveElement && enhancerButton && enhancerButton.style.display !== 'none') {
    positionEnhancerButton(currentActiveElement);
  }
}

// Handle window resize
function handleResize() {
  if (currentActiveElement && enhancerButton && enhancerButton.style.display !== 'none') {
    positionEnhancerButton(currentActiveElement);
  }
}

// Initialize
function init() {
  console.log('🪄 Prompt Wizard extension loaded');
  
  // Check if background script is available
  try {
    chrome.runtime.sendMessage({ action: 'ping' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('❌ Background script not responding:', chrome.runtime.lastError);
      } else {
        console.log('✅ Background script connected');
      }
    });
  } catch (error) {
    console.error('❌ Failed to connect to background script:', error);
  }
  
  // Add event listeners
  document.addEventListener('focusin', handleFocusChange);
  document.addEventListener('focusout', (e) => {
    // Small delay to allow clicking the button
    setTimeout(() => {
      if (!document.activeElement || !isPromptInput(document.activeElement)) {
        hideEnhancerButton();
      }
    }, 200);
  });
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', () => {
    if (currentActiveElement && enhancerButton && enhancerButton.style.display !== 'none') {
      positionEnhancerButton(currentActiveElement);
    }
  });
  
  // Show welcome notification on AI platforms
  if (isAIPlatform()) {
    setTimeout(() => {
      showNotification('🪄 Prompt Wizard is active! Focus on any text input to enhance your prompts.');
    }, 1000);
  }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enhanceSuccess') {
    showEnhancedPromptPanel(request.original, request.enhanced);
    sendResponse({ success: true });
  }
  return true;
});
