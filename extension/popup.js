// Popup script for Prompt Wizard Extension

// Load settings
async function loadSettings() {
  const settings = await chrome.storage.sync.get({
    autoDetect: true,
    showNotifications: true,
    defaultModel: 'gemma-3-12b',
    apiKey: '',
    promptsEnhanced: 0,
    timeSaved: 0
  });

  // Update UI
  document.getElementById('toggle-auto-detect').classList.toggle('active', settings.autoDetect);
  document.getElementById('toggle-notifications').classList.toggle('active', settings.showNotifications);
  document.getElementById('default-model').value = settings.defaultModel;
  document.getElementById('api-key').value = settings.apiKey;
  document.getElementById('prompts-enhanced').textContent = settings.promptsEnhanced;
  document.getElementById('time-saved').textContent = Math.floor(settings.timeSaved / 60) + 'h';

  return settings;
}

// Save settings
async function saveSetting(key, value) {
  await chrome.storage.sync.set({ [key]: value });
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  const settings = await loadSettings();

  // Toggle switches
  document.getElementById('toggle-auto-detect').addEventListener('click', function() {
    this.classList.toggle('active');
    saveSetting('autoDetect', this.classList.contains('active'));
  });

  document.getElementById('toggle-notifications').addEventListener('click', function() {
    this.classList.toggle('active');
    saveSetting('showNotifications', this.classList.contains('active'));
  });

  // Model selection
  document.getElementById('default-model').addEventListener('change', function() {
    saveSetting('defaultModel', this.value);
  });

  // API key
  document.getElementById('api-key').addEventListener('change', function() {
    saveSetting('apiKey', this.value);
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
