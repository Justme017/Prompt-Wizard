// Popup script for Prompt Wizard Extension

// Load settings
async function loadSettings() {
  const settings = await chrome.storage.sync.get({
    autoDetect: true,
    showNotifications: true,
    aiModeOnly: false,
    apiProvider: 'none',
    defaultModel: 'gemma-3-12b',
    geminiModel: 'gemini-1.5-flash',
    apiKey: '',
    promptsEnhanced: 0,
    timeSaved: 0
  });

  // Update UI
  document.getElementById('toggle-auto-detect').classList.toggle('active', settings.autoDetect);
  document.getElementById('toggle-notifications').classList.toggle('active', settings.showNotifications);
  document.getElementById('toggle-ai-mode').classList.toggle('active', settings.aiModeOnly);
  document.getElementById('api-provider').value = settings.apiProvider;
  document.getElementById('default-model').value = settings.defaultModel;
  document.getElementById('gemini-model').value = settings.geminiModel;
  document.getElementById('api-key').value = settings.apiKey;
  document.getElementById('prompts-enhanced').textContent = settings.promptsEnhanced;
  document.getElementById('time-saved').textContent = Math.floor(settings.timeSaved / 60) + 'h';

  // Show/hide provider-specific fields
  updateProviderUI(settings.apiProvider);

  return settings;
}

// Update UI based on selected provider
function updateProviderUI(provider) {
  const modelSelector = document.getElementById('model-selector');
  const geminiModelSelector = document.getElementById('gemini-model-selector');
  const apiKeyGroup = document.getElementById('api-key-group');
  const apiKeyLabel = document.getElementById('api-key-label');
  const apiKeyInput = document.getElementById('api-key');
  const apiKeyHelp = document.getElementById('api-key-help');

  // Hide all provider-specific elements
  modelSelector.style.display = 'none';
  geminiModelSelector.style.display = 'none';
  apiKeyGroup.style.display = 'none';

  if (provider === 'openrouter') {
    modelSelector.style.display = 'block';
    apiKeyGroup.style.display = 'block';
    apiKeyLabel.textContent = 'OpenRouter API Key';
    apiKeyInput.placeholder = 'sk-or-...';
    apiKeyHelp.innerHTML = 'Free tier available. Get key from <a href="https://openrouter.ai/keys" target="_blank" style="color: #fff; text-decoration: underline;">openrouter.ai/keys</a>';
  } else if (provider === 'gemini') {
    geminiModelSelector.style.display = 'block';
    apiKeyGroup.style.display = 'block';
    apiKeyLabel.textContent = 'Google AI API Key';
    apiKeyInput.placeholder = 'AIza...';
    apiKeyHelp.innerHTML = 'Free tier: 15 RPM, 1M TPM. Get key from <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #fff; text-decoration: underline;">Google AI Studio</a>';
  }
}

// Verify API key based on provider
async function verifyApiKey(apiKey, provider) {
  if (!apiKey || !apiKey.trim()) {
    return { valid: false, message: '' };
  }

  try {
    if (provider === 'openrouter') {
      const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return { valid: true, message: 'Valid API key', data };
      } else if (response.status === 401) {
        return { valid: false, message: 'Invalid API key' };
      } else {
        return { valid: false, message: 'Could not verify' };
      }
    } else if (provider === 'gemini') {
      // Verify Gemini API key with a simple test request
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
      
      if (response.ok) {
        return { valid: true, message: 'Valid API key' };
      } else if (response.status === 400) {
        return { valid: false, message: 'Invalid API key format' };
      } else if (response.status === 403) {
        return { valid: false, message: 'API key not authorized' };
      } else {
        return { valid: false, message: 'Could not verify' };
      }
    }
  } catch (error) {
    console.error('API verification error:', error);
    return { valid: false, message: 'Verification failed' };
  }
  
  return { valid: false, message: 'Unknown provider' };
}

// Update API key status indicator
function updateApiKeyStatus(status, message = '') {
  const statusDiv = document.getElementById('api-verify-status');
  const iconSpan = document.getElementById('verify-icon');
  const helpText = document.getElementById('api-key-help');

  if (status === 'verifying') {
    statusDiv.style.display = 'block';
    iconSpan.textContent = '⏳';
    iconSpan.title = 'Verifying...';
    helpText.textContent = 'Verifying API key...';
    helpText.style.color = '#fbbf24';
  } else if (status === 'valid') {
    statusDiv.style.display = 'block';
    iconSpan.textContent = '✅';
    iconSpan.title = 'Valid API key';
    helpText.innerHTML = '✓ Valid API key - AI enhancement enabled';
    helpText.style.color = '#10b981';
  } else if (status === 'invalid') {
    statusDiv.style.display = 'block';
    iconSpan.textContent = '❌';
    iconSpan.title = message || 'Invalid API key';
    helpText.innerHTML = '✗ ' + (message || 'Invalid API key') + ' - Using rule-based mode';
    helpText.style.color = '#ef4444';
  } else if (status === 'empty') {
    statusDiv.style.display = 'none';
    // Help text is already set by updateProviderUI
  }
}

// Save settings
async function saveSetting(key, value) {
  await chrome.storage.sync.set({ [key]: value });
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  const settings = await loadSettings();

  // Verify API key on load if present and provider is selected
  if (settings.apiKey && settings.apiKey.trim() && settings.apiProvider !== 'none') {
    updateApiKeyStatus('verifying');
    const result = await verifyApiKey(settings.apiKey, settings.apiProvider);
    updateApiKeyStatus(result.valid ? 'valid' : 'invalid', result.message);
  } else {
    updateApiKeyStatus('empty');
  }

  // Provider selection
  document.getElementById('api-provider').addEventListener('change', function() {
    const provider = this.value;
    saveSetting('apiProvider', provider);
    updateProviderUI(provider);
    
    // Re-verify API key for new provider
    const apiKey = document.getElementById('api-key').value.trim();
    if (apiKey && provider !== 'none') {
      updateApiKeyStatus('verifying');
      verifyApiKey(apiKey, provider).then(result => {
        updateApiKeyStatus(result.valid ? 'valid' : 'invalid', result.message);
      });
    } else {
      updateApiKeyStatus('empty');
    }
  });

  // Toggle switches
  document.getElementById('toggle-auto-detect').addEventListener('click', function() {
    this.classList.toggle('active');
    saveSetting('autoDetect', this.classList.contains('active'));
  });

  document.getElementById('toggle-notifications').addEventListener('click', function() {
    this.classList.toggle('active');
    saveSetting('showNotifications', this.classList.contains('active'));
  });

  document.getElementById('toggle-ai-mode').addEventListener('click', function() {
    this.classList.toggle('active');
    const isActive = this.classList.contains('active');
    saveSetting('aiModeOnly', isActive);
    
    // Show warning if AI mode enabled but no API configured
    if (isActive) {
      const provider = document.getElementById('api-provider').value;
      const apiKey = document.getElementById('api-key').value;
      if (provider === 'none' || !apiKey) {
        alert('⚠️ AI Mode Only requires an API provider and key. Please configure below.');
      }
    }
  });

  // Model selection
  document.getElementById('default-model').addEventListener('change', function() {
    saveSetting('defaultModel', this.value);
  });

  document.getElementById('gemini-model').addEventListener('change', function() {
    saveSetting('geminiModel', this.value);
  });

  // API key with verification
  let verifyTimeout;
  document.getElementById('api-key').addEventListener('input', function() {
    const apiKey = this.value.trim();
    
    // Clear previous timeout
    clearTimeout(verifyTimeout);
    
    if (!apiKey) {
      updateApiKeyStatus('empty');
      saveSetting('apiKey', '');
      return;
    }
    
    // Show verifying status immediately
    updateApiKeyStatus('verifying');
    
    // Debounce verification (wait 1 second after user stops typing)
    verifyTimeout = setTimeout(async () => {
      const provider = document.getElementById('api-provider').value;
      if (provider === 'none') {
        updateApiKeyStatus('empty');
        return;
      }
      
      const result = await verifyApiKey(apiKey, provider);
      updateApiKeyStatus(result.valid ? 'valid' : 'invalid', result.message);
      
      // Only save if valid or if user explicitly wants to save invalid key
      if (result.valid) {
        saveSetting('apiKey', apiKey);
      }
    }, 1000);
  });
  
  // Save on blur regardless of validity (user might want to save and fix later)
  document.getElementById('api-key').addEventListener('blur', function() {
    saveSetting('apiKey', this.value.trim());
  });

  // Quick actions
  document.getElementById('open-webapp').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://prompt-wizard-seven.vercel.app' });
  });

  document.getElementById('view-history').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://prompt-wizard-seven.vercel.app?tab=history' });
  });

  document.getElementById('clear-data').addEventListener('click', async () => {
    if (confirm('Clear all extension data? This cannot be undone.')) {
      await chrome.storage.sync.clear();
      await loadSettings();
      showNotification('Data cleared successfully');
    }
  });

  document.getElementById('report-bug').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://github.com/Justme017/Prompt-Wizard/issues/new' });
  });

  // Test enhancement
  document.getElementById('test-enhance').addEventListener('click', async () => {
    const btn = document.getElementById('test-enhance');
    btn.textContent = '⏳ Testing...';
    btn.disabled = true;

    try {
      // Send message to active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      await chrome.tabs.sendMessage(tab.id, {
        action: 'testEnhance',
        text: 'Write a blog post about AI'
      });
      
      btn.textContent = '✓ Check the page!';
      setTimeout(() => {
        btn.textContent = '✨ Test Enhancement';
        btn.disabled = false;
      }, 2000);
    } catch (error) {
      console.error('Test failed:', error);
      btn.textContent = '✗ Test Failed';
      setTimeout(() => {
        btn.textContent = '✨ Test Enhancement';
        btn.disabled = false;
      }, 2000);
    }
  });

  // Advanced settings
  document.getElementById('open-settings').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://prompt-wizard-seven.vercel.app?tab=generate' });
  });

  // Update stats every second
  setInterval(async () => {
    const stats = await chrome.storage.sync.get(['promptsEnhanced', 'timeSaved']);
    document.getElementById('prompts-enhanced').textContent = stats.promptsEnhanced || 0;
    document.getElementById('time-saved').textContent = Math.floor((stats.timeSaved || 0) / 60) + 'h';
  }, 1000);

  // Check if extension is active on current tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab.url);
    const aiPlatforms = ['chat.openai.com', 'claude.ai', 'gemini.google.com', 'copilot.microsoft.com'];
    const isAIPlatform = aiPlatforms.some(domain => url.hostname.includes(domain));
    
    if (isAIPlatform) {
      document.getElementById('status-text').textContent = `Active on ${url.hostname}`;
    } else {
      document.getElementById('status-text').textContent = 'Ready (works on all sites)';
    }
  } catch (error) {
    document.getElementById('status-text').textContent = 'Extension Active';
  }
});

function showNotification(message) {
  const status = document.querySelector('.status');
  const originalText = status.querySelector('span').textContent;
  status.querySelector('span').textContent = message;
  status.style.background = 'rgba(16, 185, 129, 0.3)';
  
  setTimeout(() => {
    status.querySelector('span').textContent = originalText;
    status.style.background = 'rgba(16, 185, 129, 0.2)';
  }, 2000);
}
