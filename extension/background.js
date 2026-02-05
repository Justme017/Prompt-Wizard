// Background service worker for Prompt Wizard Extension

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Prompt Wizard Extension installed!');
    
    // Initialize default settings
    chrome.storage.sync.set({
      autoDetect: true,
      showNotifications: true,
      defaultModel: 'gemma-3-12b',
      apiKey: '',
      promptsEnhanced: 0,
      timeSaved: 0
    });
    
    // Open welcome page
    chrome.tabs.create({
      url: 'https://prompt-wizard-seven.vercel.app?welcome=true'
    });
  }
});

// AI Models configuration
const AI_MODELS = [
  { id: 'gemma-3-12b', apiModel: 'google/gemma-3-12b-it' },
  { id: 'llama-3-70b', apiModel: 'meta-llama/llama-3-70b-instruct' },
  { id: 'mixtral-8x7b', apiModel: 'mistralai/mixtral-8x7b-instruct' },
  { id: 'gpt-3.5-turbo', apiModel: 'gpt-3.5-turbo' },
  { id: 'gpt-4o', apiModel: 'gpt-4o' },
  { id: 'claude-3.5-sonnet', apiModel: 'claude-3-5-sonnet-20241022' }
];

// Skill templates (simplified for extension)
const SKILL_TEMPLATES = {
  'creative-writer': 'Award-Winning Creative Writer and Narrative Designer with mastery in storytelling',
  'code-reviewer': 'Principal Software Engineer and Code Quality Specialist',
  'data-analyst': 'Senior Data Analyst and Business Intelligence Professional',
  'email-writer': 'Professional Business Communication Expert and Email Strategist',
  'researcher': 'Senior Research Analyst and Information Scientist',
  'tutor': 'Master Educator and Academic Tutor',
  'translator': 'Professional Multilingual Translator and Localization Expert',
  'copywriter': 'Expert Marketing Copywriter',
  'general': 'Expert Assistant'
};

// Detect intent from text
function analyzeIntent(text) {
  const lower = text.toLowerCase();
  if (lower.match(/write|create|story|narrative/)) return 'creative-writer';
  if (lower.match(/code|script|program|function/)) return 'code-reviewer';
  if (lower.match(/analyze|data|chart|graph/)) return 'data-analyst';
  if (lower.match(/email|message|correspondence/)) return 'email-writer';
  if (lower.match(/research|study|investigate/)) return 'researcher';
  if (lower.match(/explain|teach|learn/)) return 'tutor';
  if (lower.match(/translate|translation/)) return 'translator';
  if (lower.match(/marketing|ad|campaign/)) return 'copywriter';
  return 'general';
}

// Generate rule-based enhanced prompt
function generateRuleBasedPrompt(text) {
  const intent = analyzeIntent(text);
  const role = SKILL_TEMPLATES[intent];
  
  let objective, context, data;
  
  if (intent === 'creative-writer') {
    objective = 'Create engaging, well-crafted content with vivid descriptions and strong narrative flow.';
    context = `Task: ${text}. Structure with clear beginning, development, and conclusion.`;
    data = 'Use descriptive language, develop thoroughly, maintain consistent tone.';
  } else if (intent === 'code-reviewer') {
    objective = 'Provide complete, working solution with clean, well-documented code.';
    context = `Task: ${text}. Include error handling and examples.`;
    data = 'Code should be production-ready, commented, and follow conventions.';
  } else if (intent === 'data-analyst') {
    objective = 'Perform thorough analysis with evidence-based conclusions.';
    context = `Task: ${text}. Include relevant visualizations and insights.`;
    data = 'Support with data, maintain logical flow, provide recommendations.';
  } else {
    objective = 'Provide comprehensive, well-structured response with clear explanations.';
    context = `Task: ${text}. Include relevant examples and practical insights.`;
    data = 'Ensure accuracy, clarity, and actionable information.';
  }
  
  return `ROLE: ${role}\n\nOBJECTIVE: ${objective}\n\nCONTEXT: ${context}\n\nDATA: ${data}`;
}

// Generate AI-powered enhanced prompt
async function generateAIPrompt(text, modelId, apiKey) {
  const model = AI_MODELS.find(m => m.id === modelId);
  const intent = analyzeIntent(text);
  const role = SKILL_TEMPLATES[intent];
  
  const systemPrompt = `You are a prompt enhancement assistant. Rewrite the user's prompt in this structured format:

ROLE: ${role}
OBJECTIVE: [Clear goal based on user's request]
CONTEXT: [Relevant context for: ${text}]
DATA: [Data requirements, constraints, guidelines]

Output ONLY in this format, nothing else.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://prompt-wizard-extension',
        'X-Title': 'Prompt Wizard Extension V3'
      },
      body: JSON.stringify({
        model: model.apiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enhancePrompt') {
    handleEnhancePrompt(request.text).then(result => {
      sendResponse(result);
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep channel open for async response
  }
});

// Handle prompt enhancement
async function handleEnhancePrompt(text) {
  try {
    const settings = await chrome.storage.sync.get({
      defaultModel: 'gemma-3-12b',
      apiKey: '',
      promptsEnhanced: 0,
      timeSaved: 0
    });

    let enhanced;
    const startTime = Date.now();

    // Use AI if API key is provided, otherwise use rule-based
    if (settings.apiKey && settings.apiKey.trim()) {
      try {
        enhanced = await generateAIPrompt(text, settings.defaultModel, settings.apiKey);
      } catch (error) {
        console.error('AI enhancement failed, falling back to rule-based:', error);
        enhanced = generateRuleBasedPrompt(text);
      }
    } else {
      enhanced = generateRuleBasedPrompt(text);
    }

    // Update stats
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    await chrome.storage.sync.set({
      promptsEnhanced: settings.promptsEnhanced + 1,
      timeSaved: settings.timeSaved + Math.max(60, timeTaken * 3) // Assume 3x time saving
    });

    return {
      success: true,
      enhanced: enhanced
    };
  } catch (error) {
    console.error('Enhancement error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'enhance-prompt') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'triggerEnhance' });
      }
    });
  }
});

console.log('🪄 Prompt Wizard background service worker loaded');
