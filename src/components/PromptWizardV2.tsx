import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Loader2, Copy, Check, Moon, Sun, Settings, Brain, Zap, Unlock, Star,
  History, Save, Download, FileText, Code2, FileJson, Plus, Trash2, BookOpen,
  GitCompare, Link2, Play, Variable, Globe, ChevronDown, ChevronUp
} from 'lucide-react';

// Extended AI Models with more providers
const AI_MODELS = [
  { id: 'gemma-3-12b', name: 'Gemma 3 12B', provider: 'Google', apiModel: 'google/gemma-3-12b-it', tier: 'free' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', apiModel: 'gpt-4o', tier: 'premium' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', apiModel: 'gpt-4-turbo', tier: 'premium' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', apiModel: 'claude-3-5-sonnet-20241022', tier: 'premium' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', apiModel: 'claude-3-opus-20240229', tier: 'premium' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', apiModel: 'claude-3-haiku-20240307', tier: 'standard' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', apiModel: 'gpt-3.5-turbo', tier: 'standard' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', apiModel: 'gemini-pro', tier: 'standard' },
  { id: 'llama-3-70b', name: 'Llama 3 70B', provider: 'Meta', apiModel: 'meta-llama/llama-3-70b-instruct', tier: 'free' },
  { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', provider: 'Mistral AI', apiModel: 'mistralai/mixtral-8x7b-instruct', tier: 'free' },
];

// 32 Comprehensive Skill Templates
const SKILL_TEMPLATES = [
  { id: 'image-gen', name: '🎨 Image Generation', category: 'Creative', skill: 'Expert AI Image Generation Specialist with mastery in prompt engineering for visual content creation. Proficient in crafting detailed, technically precise prompts for DALL-E, Midjourney, Stable Diffusion, and other generative AI models.' },
  { id: 'audio-gen', name: '🎵 Audio Generation', category: 'Creative', skill: 'Professional Audio Generation and Sound Design Specialist with comprehensive expertise in AI-powered audio synthesis, music composition, and sound engineering.' },
  { id: 'video-gen', name: '🎬 Video Generation', category: 'Creative', skill: 'Advanced Video Content Specialist and Multimedia Director with extensive experience in video production, animation, cinematography, and AI-powered video generation.' },
  { id: 'creative-writer', name: '✍️ Creative Writer', category: 'Creative', skill: 'Award-Winning Creative Writer and Narrative Designer with mastery in storytelling, character development, world-building, and literary craft across all creative formats.' },
  { id: 'copywriter', name: '📢 Copywriter', category: 'Marketing', skill: 'Expert Marketing Copywriter specializing in persuasive writing, brand voice development, and conversion-focused content across all marketing channels.' },
  { id: 'seo-specialist', name: '🔍 SEO Specialist', category: 'Marketing', skill: 'SEO Expert with deep knowledge of search engine algorithms, keyword research, content optimization, and technical SEO implementation.' },
  { id: 'social-media', name: '📱 Social Media Manager', category: 'Marketing', skill: 'Social Media Strategist with expertise in content planning, engagement optimization, platform-specific best practices, and community management.' },
  { id: 'mail-write', name: '✉️ Email Writer', category: 'Business', skill: 'Professional Business Communication Expert and Email Strategist with mastery in corporate correspondence and digital etiquette.' },
  { id: 'business-analyst', name: '💼 Business Analyst', category: 'Business', skill: 'Senior Business Analyst with expertise in requirements gathering, process optimization, stakeholder management, and strategic planning.' },
  { id: 'project-manager', name: '📋 Project Manager', category: 'Business', skill: 'Certified Project Manager with proficiency in Agile, Scrum, Waterfall methodologies, and project lifecycle management.' },
  { id: 'analyst', name: '📊 Data Analyst', category: 'Technical', skill: 'Senior Data Analyst and Business Intelligence Professional with advanced expertise in statistical analysis, data visualization, and predictive modeling.' },
  { id: 'data-scientist', name: '🔬 Data Scientist', category: 'Technical', skill: 'Data Scientist with machine learning expertise, statistical modeling, and experience in building predictive models and AI systems.' },
  { id: 'code-review', name: '💻 Code Reviewer', category: 'Technical', skill: 'Principal Software Engineer and Code Quality Specialist with deep expertise in software architecture and performance optimization.' },
  { id: 'fullstack-dev', name: '⚙️ Full Stack Developer', category: 'Technical', skill: 'Full Stack Developer proficient in frontend and backend technologies, database design, API development, and cloud deployment.' },
  { id: 'devops', name: '🔧 DevOps Engineer', category: 'Technical', skill: 'DevOps Engineer specialized in CI/CD pipelines, infrastructure as code, container orchestration, and cloud platform management.' },
  { id: 'security', name: '🔒 Security Expert', category: 'Technical', skill: 'Cybersecurity Professional with expertise in penetration testing, vulnerability assessment, secure coding practices, and compliance.' },
  { id: 'research', name: '🔬 Researcher', category: 'Academic', skill: 'Senior Research Analyst and Information Scientist with advanced expertise in academic research methodology and data synthesis.' },
  { id: 'tutor', name: '🎓 Tutor', category: 'Academic', skill: 'Master Educator and Academic Tutor with advanced pedagogical training across all academic subjects.' },
  { id: 'eli5', name: '👶 ELI5 Explainer', category: 'Academic', skill: 'Master Educator and Simplification Specialist with exceptional ability to deconstruct complex concepts into simple explanations.' },
  { id: 'academic-writer', name: '📚 Academic Writer', category: 'Academic', skill: 'Academic Writing Expert specializing in research papers, dissertations, literature reviews, and scholarly publications.' },
  { id: 'translator', name: '🌐 Translator', category: 'Language', skill: 'Professional Multilingual Translator and Localization Expert with native-level fluency and deep cultural competency.' },
  { id: 'editor', name: '✏️ Editor', category: 'Language', skill: 'Professional Editor with expertise in proofreading, copyediting, developmental editing, and style guide adherence.' },
  { id: 'summarizer', name: '📝 Summarizer', category: 'Language', skill: 'Expert Content Synthesizer with advanced skills in extracting essential information and creating concise summaries.' },
  { id: 'legal-advisor', name: '⚖️ Legal Advisor', category: 'Professional', skill: 'Legal Professional with expertise in contract review, legal research, compliance, and regulatory analysis.' },
  { id: 'financial', name: '💰 Financial Analyst', category: 'Professional', skill: 'Financial Analyst with expertise in financial modeling, investment analysis, risk assessment, and portfolio management.' },
  { id: 'hr-specialist', name: '👥 HR Specialist', category: 'Professional', skill: 'Human Resources Professional with expertise in recruitment, employee relations, performance management, and organizational development.' },
  { id: 'consultant', name: '🎯 Management Consultant', category: 'Professional', skill: 'Management Consultant with strategic planning, organizational change, process improvement, and executive advisory expertise.' },
  { id: 'therapist', name: '💭 Therapist', category: 'Healthcare', skill: 'Licensed Mental Health Professional with expertise in therapeutic techniques, emotional support, and psychological assessment.' },
  { id: 'medical', name: '⚕️ Medical Professional', category: 'Healthcare', skill: 'Healthcare Professional with medical knowledge, patient care expertise, and clinical decision-making skills.' },
  { id: 'fitness', name: '💪 Fitness Coach', category: 'Lifestyle', skill: 'Certified Fitness Coach with expertise in exercise programming, nutrition planning, and wellness optimization.' },
  { id: 'chef', name: '👨‍🍳 Chef', category: 'Lifestyle', skill: 'Professional Chef with culinary expertise, recipe development, nutrition knowledge, and food presentation skills.' },
  { id: 'travel', name: '✈️ Travel Advisor', category: 'Lifestyle', skill: 'Travel Expert with destination knowledge, itinerary planning, cultural insights, and travel logistics expertise.' },
];

// Prompt Templates Library
const PROMPT_TEMPLATES = [
  { 
    id: 'blog-post', 
    name: 'Blog Post Creator', 
    category: 'Content',
    template: 'Write a {tone} blog post about {topic} that is {length} words long, targeting {audience}. Include {sections} main sections and incorporate {keywords} for SEO.'
  },
  {
    id: 'product-desc',
    name: 'Product Description',
    category: 'Marketing',
    template: 'Create a compelling product description for {product_name} that highlights {key_features}, targets {target_audience}, and uses a {tone} tone. Include call-to-action.'
  },
  {
    id: 'code-generator',
    name: 'Code Generator',
    category: 'Development',
    template: 'Generate {language} code for {functionality}. Include error handling, comments, and follow {coding_standard} standards. Output should be production-ready.'
  },
  {
    id: 'email-campaign',
    name: 'Email Campaign',
    category: 'Marketing',
    template: 'Create an email for {campaign_type} targeting {audience}. Include subject line, preview text, body copy with {cta}, and follow {email_guidelines}.'
  },
  {
    id: 'social-post',
    name: 'Social Media Post',
    category: 'Social Media',
    template: 'Create a {platform} post about {topic} that is {tone}, includes {hashtags} relevant hashtags, and targets {audience}. Max {char_limit} characters.'
  },
  {
    id: 'research-summary',
    name: 'Research Summary',
    category: 'Academic',
    template: 'Summarize research on {topic} including methodology, key findings, implications, and recommendations. Target {audience} with {format} format.'
  },
];

const OUTPUT_FORMATS = [
  { id: 'text', name: 'Plain Text', icon: FileText },
  { id: 'markdown', name: 'Markdown', icon: FileText },
  { id: 'json', name: 'JSON', icon: FileJson },
  { id: 'code', name: 'Code', icon: Code2 },
];

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
];

const analyzePrompt = (prompt) => {
  const lower = prompt.toLowerCase();
  if (lower.match(/write|create|story|narrative/)) return 'creative-writing';
  if (lower.match(/code|script|program|function/)) return 'coding';
  if (lower.match(/analyze|examine|evaluate/)) return 'analytical';
  if (lower.match(/data|plot|graph|visualize/)) return 'data-science';
  return 'general';
};

const processVariables = (text, variables) => {
  let processed = text;
  Object.entries(variables).forEach(([key, value]) => {
    processed = processed.replace(new RegExp(`{${key}}`, 'g'), value || `{${key}}`);
  });
  return processed;
};

const generateRuleBasedPrompt = (input, modelId, formatId, skillId, variables = {}) => {
  const processedInput = processVariables(input, variables);
  const skill = SKILL_TEMPLATES.find(s => s.id === skillId);
  const format = OUTPUT_FORMATS.find(f => f.id === formatId);
  const intent = analyzePrompt(processedInput);

  const role = skill ? skill.skill : 'Expert Assistant';
  
  let objective = '';
  let context = '';
  let data = '';

  if (intent === 'creative-writing') {
    objective = 'Create an engaging, well-crafted piece with vivid descriptions and strong narrative flow.';
    context = `Task: ${processedInput}. Structure with clear beginning, development, and conclusion.`;
    data = 'Use descriptive language, develop thoroughly, maintain consistent tone.';
  } else if (intent === 'coding') {
    objective = 'Provide complete, working solution with clean, well-documented code.';
    context = `Task: ${processedInput}. Include error handling and examples.`;
    data = 'Code should be production-ready, commented, and follow conventions.';
  } else if (intent === 'analytical') {
    objective = 'Conduct thorough analysis with evidence-based conclusions.';
    context = `Task: ${processedInput}. Consider multiple perspectives.`;
    data = 'Support claims with evidence, maintain logical flow.';
  } else if (intent === 'data-science') {
    objective = 'Perform data science task following standard methodology.';
    context = `Task: ${processedInput}. Address data considerations.`;
    data = 'Include statistical analysis and interpretation.';
  } else {
    objective = 'Provide comprehensive, well-structured response.';
    context = `Task: ${processedInput}. Include relevant examples.`;
    data = 'Ensure accuracy, clarity, and actionable information.';
  }

  const formatNote = format.id !== 'text' ? ` Format output as ${format.name}.` : '';
  return `ROLE: ${role}\n\nOBJECTIVE: ${objective}\n\nCONTEXT: ${context}\n\nDATA: ${data}${formatNote}`;
};

const generateAIPrompt = async (input, modelId, formatId, apiKey, skillId, variables = {}) => {
  const processedInput = processVariables(input, variables);
  const model = AI_MODELS.find(m => m.id === modelId);
  const format = OUTPUT_FORMATS.find(f => f.id === formatId);
  const skill = SKILL_TEMPLATES.find(s => s.id === skillId);

  const systemPrompt = `You are a prompt enhancement assistant. Rewrite the user's prompt in this structured format:

ROLE: ${skill ? skill.skill : 'Expert Assistant'}
OBJECTIVE: [Clear goal based on user's request]
CONTEXT: [Relevant context for: ${processedInput}]
DATA: [Data requirements, constraints, guidelines]

Output ONLY in this format. Format as ${format.name} if applicable.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://prompt-wizard-seven.vercel.app',
        'X-Title': 'Prompt Wizard V2'
      },
      body: JSON.stringify({
        model: model.apiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: processedInput }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    throw error;
  }
};

export default function PromptWizardV2() {
  // Core state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gemma-3-12b');
  const [format, setFormat] = useState('text');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [useAPI, setUseAPI] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey') || '');
  const [error, setError] = useState('');

  // V2 Features
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('promptHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [savedPrompts, setSavedPrompts] = useState(() => {
    const saved = localStorage.getItem('savedPrompts');
    return saved ? JSON.parse(saved) : [];
  });
  const [variables, setVariables] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonOutputs, setComparisonOutputs] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('generate'); // generate, templates, history, saved
  
  // UI state
  const [copied, setCopied] = useState(false);
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('promptHistory', JSON.stringify(history.slice(0, 50))); // Keep last 50
  }, [history]);

  useEffect(() => {
    localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  useEffect(() => {
    setInputTokens(Math.ceil(input.split(/\s+/).filter(w => w).length * 1.3));
  }, [input]);

  useEffect(() => {
    setOutputTokens(Math.ceil(output.split(/\s+/).filter(w => w).length * 1.3));
  }, [output]);

  const generate = async () => {
    if (!input.trim()) return;
    
    if (!selectedSkill) {
      setError('Please select a skill/role first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let enhanced;

      if (useAPI) {
        if (!apiKey.trim()) {
          setError('Please enter your API key');
          setLoading(false);
          return;
        }
        enhanced = await generateAIPrompt(input, model, format, apiKey, selectedSkill, variables);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        enhanced = generateRuleBasedPrompt(input, model, format, selectedSkill, variables);
      }

      setOutput(enhanced);
      
      // Add to history
      const historyItem = {
        id: Date.now(),
        input,
        output: enhanced,
        skill: selectedSkill,
        model,
        timestamp: new Date().toISOString(),
        mode: useAPI ? 'AI' : 'Rule-based'
      };
      setHistory(prev => [historyItem, ...prev]);

    } catch (err) {
      setError(err.message || 'Failed to generate prompt');
    } finally {
      setLoading(false);
    }
  };

  const savePrompt = () => {
    if (!output) return;
    const saved = {
      id: Date.now(),
      name: `Prompt ${savedPrompts.length + 1}`,
      content: output,
      input,
      skill: selectedSkill,
      timestamp: new Date().toISOString()
    };
    setSavedPrompts(prev => [saved, ...prev]);
  };

  const loadPrompt = (prompt) => {
    setInput(prompt.input || '');
    setOutput(prompt.content || prompt.output || '');
    if (prompt.skill) setSelectedSkill(prompt.skill);
    setActiveTab('generate');
  };

  const deleteHistoryItem = (id) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const deleteSavedPrompt = (id) => {
    setSavedPrompts(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    if (confirm('Clear all history?')) {
      setHistory([]);
    }
  };

  const exportPrompt = (format) => {
    if (!output) return;
    
    let content = output;
    let filename = `prompt-${Date.now()}`;
    let mimeType = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify({ input, output, skill: selectedSkill, model, timestamp: new Date().toISOString() }, null, 2);
      filename += '.json';
      mimeType = 'application/json';
    } else if (format === 'md') {
      content = `# Enhanced Prompt\n\n## Input\n${input}\n\n## Output\n${output}\n\n---\n*Generated by Prompt Wizard V2*`;
      filename += '.md';
      mimeType = 'text/markdown';
    } else {
      filename += '.txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyTemplate = (template) => {
    setInput(template.template);
    setShowTemplates(false);
    
    // Extract variables from template
    const regex = /{([^}]+)}/g;
    const matches = template.template.match(regex);
    if (matches) {
      const newVars = {};
      matches.forEach(match => {
        const key = match.slice(1, -1);
        newVars[key] = '';
      });
      setVariables(newVars);
      setShowVariables(true);
    }
  };

  // Theme classes
  const bg = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50';
  const card = darkMode ? 'bg-gray-800' : 'bg-white';
  const text = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSec = darkMode ? 'text-gray-400' : 'text-gray-600';
  const inputClass = darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300';
  const hoverCard = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  const skillCategories = [...new Set(SKILL_TEMPLATES.map(s => s.category))];

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300 p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`${card} border rounded-xl shadow-lg p-4 md:p-6 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <img src="/favicon.ico" alt="Logo" className="w-12 md:w-16 h-12 md:h-16" />
            <div>
              <h1 className={`text-2xl md:text-4xl font-bold ${text} flex items-center gap-2`}>
                Prompt Wizard <span className="text-teal-600 text-lg">V2</span>
              </h1>
              <p className={`text-xs md:text-sm ${textSec}`}>
                Advanced Prompt Generator with History, Templates & More
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Justme017/Prompt-Wizard/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-medium text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download Extension</span>
            </a>
            <a
              href="https://github.com/Justme017/Prompt-Wizard/releases/latest"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              title="Download Extension"
            >
              <Download className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/Justme017/Prompt-Wizard"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 md:p-3 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 hover:rotate-12"
            >
              <Star className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" />
            </a>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 md:p-3 rounded-lg ${card} border shadow-lg hover:shadow-xl transition-all`}>
              {darkMode ? <Sun className="w-4 h-4 md:w-6 md:h-6 text-yellow-400" /> : <Moon className="w-4 h-4 md:w-6 md:h-6" />}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`${card} border rounded-xl shadow-lg p-2 flex gap-2 overflow-x-auto`}>
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'generate'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
                : `${text} ${hoverCard}`
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Generate
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'templates'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
                : `${text} ${hoverCard}`
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
                : `${text} ${hoverCard}`
            }`}
          >
            <History className="w-4 h-4 inline mr-2" />
            History ({history.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white'
                : `${text} ${hoverCard}`
            }`}
          >
            <Save className="w-4 h-4 inline mr-2" />
            Saved ({savedPrompts.length})
          </button>
        </div>

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Configuration */}
            <div className={`${card} border rounded-xl shadow-lg p-6 space-y-4`}>
              <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-teal-600" />
                <h2 className={`text-lg font-semibold ${text}`}>Configuration</h2>
              </div>

              {/* Mode Toggle */}
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-teal-50'} border-2 ${darkMode ? 'border-teal-500' : 'border-teal-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {useAPI ? <Zap className="w-5 h-5 text-blue-400" /> : <Unlock className="w-5 h-5 text-green-400" />}
                    <span className={`font-semibold text-sm ${text}`}>
                      {useAPI ? 'AI-Powered Mode' : 'Free Mode'}
                    </span>
                  </div>
                  <button
                    onClick={() => setUseAPI(!useAPI)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      useAPI ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {useAPI ? 'Switch to Free' : 'Enable AI'}
                  </button>
                </div>
                <p className={`text-xs ${textSec}`}>
                  {useAPI ? 'Using real AI models (requires API key)' : 'Using rule-based generation (instant, free)'}
                </p>
              </div>

              {useAPI && (
                <div>
                  <label className={`block text-sm font-medium ${text} mb-2`}>
                    OPENROUTER / GEMINI API KEY <span className="text-xs opacity-75">(
                      <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">OpenRouter</a>
                      {" or "}
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">Gemini</a>
                    )</span>
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-... or AIza..."
                    className={`w-full p-3 border rounded-lg ${inputClass} focus:ring-2 focus:ring-teal-500 text-sm`}
                  />
                </div>
              )}

              {/* Skill Selection */}
              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>
                  Select Role/Skill <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className={`w-full p-3 border rounded-lg ${inputClass} focus:ring-2 focus:ring-teal-500 text-sm`}
                >
                  <option value="">Select a role/skill...</option>
                  {skillCategories.map(category => (
                    <optgroup key={category} label={category}>
                      {SKILL_TEMPLATES.filter(s => s.category === category).map(skill => (
                        <option key={skill.id} value={skill.id}>{skill.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Model Selection */}
              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>AI Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className={`w-full p-3 border rounded-lg ${inputClass} focus:ring-2 focus:ring-teal-500 text-sm`}
                >
                  {AI_MODELS.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.provider}) {m.tier === 'free' ? '🆓' : m.tier === 'premium' ? '⭐' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Output Format */}
              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Output Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {OUTPUT_FORMATS.map(fmt => (
                    <button
                      key={fmt.id}
                      onClick={() => setFormat(fmt.id)}
                      className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        format === fmt.id
                          ? 'border-teal-600 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400'
                          : `border-gray-300 dark:border-gray-600 ${text} ${hoverCard}`
                      }`}
                    >
                      <fmt.icon className="w-4 h-4 inline mr-1" />
                      {fmt.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variables */}
              {Object.keys(variables).length > 0 && (
                <div>
                  <button
                    onClick={() => setShowVariables(!showVariables)}
                    className={`flex items-center justify-between w-full text-sm font-medium ${text} mb-2`}
                  >
                    <span>
                      <Variable className="w-4 h-4 inline mr-2" />
                      Variables ({Object.keys(variables).length})
                    </span>
                    {showVariables ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {showVariables && (
                    <div className="space-y-2">
                      {Object.keys(variables).map(key => (
                        <input
                          key={key}
                          type="text"
                          value={variables[key]}
                          onChange={(e) => setVariables(prev => ({ ...prev, [key]: e.target.value }))}
                          placeholder={key}
                          className={`w-full p-2 border rounded-lg ${inputClass} focus:ring-2 focus:ring-teal-500 text-xs`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Input */}
              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>
                  Your Prompt <span className="text-xs ${textSec}">({inputTokens} tokens)</span>
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your prompt here..."
                  rows={6}
                  className={`w-full p-3 border rounded-lg ${inputClass} focus:ring-2 focus:ring-teal-500 resize-none text-sm`}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-500 text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={generate}
                disabled={loading || !input.trim() || !selectedSkill}
                className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  loading || !input.trim() || !selectedSkill
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Enhanced Prompt
                  </>
                )}
              </button>
            </div>

            {/* Output */}
            <div className={`${card} border rounded-xl shadow-lg p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-teal-600" />
                  <h2 className={`text-lg font-semibold ${text}`}>Enhanced Output</h2>
                  <span className="text-xs ${textSec}">({outputTokens} tokens)</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={savePrompt}
                    disabled={!output}
                    className={`p-2 rounded-lg transition-all ${
                      output ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    title="Save prompt"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={copy}
                    disabled={!output}
                    className={`p-2 rounded-lg transition-all ${
                      output ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <div className="relative group">
                    <button
                      disabled={!output}
                      className={`p-2 rounded-lg transition-all ${
                        output ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {output && (
                      <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-10">
                        <div className={`${card} border rounded-lg shadow-xl p-2 space-y-1 min-w-[120px]`}>
                          <button onClick={() => exportPrompt('txt')} className={`w-full text-left px-3 py-2 rounded ${hoverCard} text-sm ${text}`}>
                            .TXT
                          </button>
                          <button onClick={() => exportPrompt('json')} className={`w-full text-left px-3 py-2 rounded ${hoverCard} text-sm ${text}`}>
                            .JSON
                          </button>
                          <button onClick={() => exportPrompt('md')} className={`w-full text-left px-3 py-2 rounded ${hoverCard} text-sm ${text}`}>
                            .MD
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={`h-[500px] overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} border-2 ${darkMode ? 'border-teal-500' : 'border-teal-200'} rounded-lg p-4`}>
                {output ? (
                  <pre className={`whitespace-pre-wrap text-sm ${text} font-mono`}>{output}</pre>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Sparkles className={`w-16 h-16 mx-auto mb-4 ${textSec}`} />
                      <p className={`text-sm ${textSec}`}>Your enhanced prompt will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className={`${card} border rounded-xl shadow-lg p-6`}>
            <h2 className={`text-xl font-bold ${text} mb-4`}>Prompt Templates</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {PROMPT_TEMPLATES.map(template => (
                <div key={template.id} className={`${card} border-2 rounded-lg p-4 ${hoverCard} cursor-pointer transition-all`} onClick={() => applyTemplate(template)}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${text}`}>{template.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
                      {template.category}
                    </span>
                  </div>
                  <p className={`text-sm ${textSec} line-clamp-2`}>{template.template}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className={`${card} border rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-bold ${text}`}>Prompt History</h2>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-red-600 hover:text-red-700 text-sm font-medium">
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Clear All
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <History className={`w-16 h-16 mx-auto mb-4 ${textSec}`} />
                <p className={`${textSec}`}>No history yet. Generate some prompts!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map(item => (
                  <div key={item.id} className={`${card} border-2 rounded-lg p-4 ${hoverCard} transition-all`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-1 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
                            {SKILL_TEMPLATES.find(s => s.id === item.skill)?.name || item.skill}
                          </span>
                          <span className={`text-xs ${textSec}`}>
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            {item.mode}
                          </span>
                        </div>
                        <p className={`text-sm ${text} line-clamp-2 mb-2`}>{item.input}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadPrompt(item)}
                          className="p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-all"
                          title="Load"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteHistoryItem(item.id)}
                          className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <div className={`${card} border rounded-xl shadow-lg p-6`}>
            <h2 className={`text-xl font-bold ${text} mb-4`}>Saved Prompts</h2>
            {savedPrompts.length === 0 ? (
              <div className="text-center py-12">
                <Save className={`w-16 h-16 mx-auto mb-4 ${textSec}`} />
                <p className={`${textSec}`}>No saved prompts. Save some for later!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedPrompts.map(item => (
                  <div key={item.id} className={`${card} border-2 rounded-lg p-4 ${hoverCard} transition-all`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${text}`}>{item.name}</h3>
                          <span className={`text-xs ${textSec}`}>
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={`text-sm ${textSec} line-clamp-3`}>{item.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadPrompt(item)}
                          className="p-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-all"
                          title="Load"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSavedPrompt(item.id)}
                          className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className={`${card} border rounded-xl shadow-lg p-4 text-center`}>
          <p className={`text-sm ${textSec}`}>
            Made with ❤️ by{' '}
            <a href="https://github.com/Justme017" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-medium">
              Shubham Mehta
            </a>
            {' • '}
            <a href="https://github.com/Justme017/Prompt-Wizard" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline font-medium">
              Open Source on GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
