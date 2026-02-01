import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Copy, Check, Moon, Sun, Settings, Brain, Zap, Lock, Unlock, Star } from 'lucide-react';

const AI_MODELS = [
  { id: 'gemma-3-12b', name: 'Gemma 3 12B', provider: 'Google', apiModel: 'google/gemma-3-12b-it' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', apiModel: 'gpt-4o' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', apiModel: 'gpt-4-turbo' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', apiModel: 'claude-3-5-sonnet-20241022' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', apiModel: 'gpt-3.5-turbo' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', apiModel: 'gemini-pro' },
];

const SKILL_TEMPLATES = [
  { id: 'image-gen', name: '🎨 Image Generation', skill: 'Image Generation: Create detailed, high-quality images based on text descriptions using AI image generation models.' },
  { id: 'audio-gen', name: '🎵 Audio Generation', skill: 'Audio Generation: Generate music, sound effects, or voice synthesis based on textual descriptions.' },
  { id: 'video-gen', name: '🎬 Video Generation', skill: 'Video Generation: Create video content, animations, or video editing suggestions from text prompts.' },
  { id: 'mail-write', name: '✉️ Email Writing', skill: 'Professional Email Writing: Compose clear, professional emails for various contexts (business, personal, formal, casual).' },
  { id: 'research', name: '🔬 Research', skill: 'Research & Information Synthesis: Gather, analyze, and synthesize information from multiple sources on any topic.' },
  { id: 'eli5', name: '👶 ELI5', skill: 'Explain Like I\'m 5: Break down complex topics into simple, easy-to-understand explanations suitable for beginners.' },
  { id: 'analyst', name: '📊 Data Analyst', skill: 'Data Analysis: Analyze data, identify patterns, create visualizations, and provide actionable insights.' },
  { id: 'code-review', name: '💻 Code Review', skill: 'Code Review: Review code for best practices, bugs, performance issues, and suggest improvements.' },
  { id: 'translator', name: '🌐 Translator', skill: 'Language Translation: Translate text accurately between languages while preserving context and nuance.' },
  { id: 'creative-writer', name: '✍️ Creative Writer', skill: 'Creative Writing: Write stories, poems, scripts, or creative content with engaging narratives and vivid descriptions.' },
  { id: 'tutor', name: '🎓 Tutor', skill: 'Educational Tutoring: Explain concepts, provide examples, answer questions, and help with learning any subject.' },
  { id: 'summarizer', name: '📝 Summarizer', skill: 'Content Summarization: Condense long texts into concise summaries while retaining key information.' },
];

const OUTPUT_FORMATS = [
  { id: 'text', name: 'Plain Text' },
  { id: 'json', name: 'JSON' },
  { id: 'markdown', name: 'Markdown' },
  { id: 'code', name: 'Code' },
];

const analyzePrompt = (prompt) => {
  const lower = prompt.toLowerCase();
  if (lower.match(/write|create|story|narrative|tale|article/)) return 'creative-writing';
  if (lower.match(/code|script|program|function|algorithm/)) return 'coding';
  if (lower.match(/analyze|examine|evaluate|compare|research/)) return 'analytical';
  if (lower.match(/data|plot|graph|visualize|chart/)) return 'data-science';
  return 'general';
};

const generateRuleBasedPrompt = (input, modelId, formatId) => {
  const model = AI_MODELS.find(m => m.id === modelId);
  const format = OUTPUT_FORMATS.find(f => f.id === formatId);
  const intent = analyzePrompt(input);

  let prompt = '';

  // Simple, concise enhancement based on intent
  if (intent === 'creative-writing') {
    prompt = `Create an engaging, well-crafted piece about: ${input}. Use vivid descriptions, compelling characters, and strong narrative flow. Structure with a clear beginning, development, and satisfying conclusion.`;
  } else if (intent === 'coding') {
    prompt = `Provide a complete, working solution for: ${input}. Include clean, well-documented code following best practices, with error handling and usage examples. Explain the approach briefly.`;
  } else if (intent === 'analytical') {
    prompt = `Conduct a thorough analysis of: ${input}. Support conclusions with evidence, consider multiple perspectives, and provide actionable insights. Structure the response with clear sections and logical flow.`;
  } else if (intent === 'data-science') {
    prompt = `Perform data science task: ${input}. Follow standard methodology, explain key concepts clearly, address data considerations, and provide relevant visualizations or descriptions.`;
  } else {
    // General enhancement - just improve clarity and add structure
    prompt = `Please help with: ${input}. Provide a comprehensive, well-structured response with clear explanations, relevant examples, and practical insights.`;
  }

  // Add format specification if needed
  if (format.id !== 'text') {
    prompt += ` Format the output as ${format.name}.`;
  }

  return prompt;
};

const generateAIPrompt = async (input, modelId, formatId, apiKey) => {
  const model = AI_MODELS.find(m => m.id === modelId);
  const format = OUTPUT_FORMATS.find(f => f.id === formatId);

  const systemPrompt = `You are a prompt enhancement assistant. The user will give you a brief prompt. Rewrite it to be more detailed, clear, and effective. Output ONLY the enhanced prompt, nothing else. Do not explain your changes or add commentary. Just return the improved version of their prompt as ${format.name}.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://prompt-wizard-seven.vercel.app',
        'X-Title': 'Prompt Wizard'
      },
      body: JSON.stringify({
        model: model.apiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input }
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

export default function AdvancedPromptGenerator() {
  const [darkMode, setDarkMode] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gemma-3-12b');
  const [format, setFormat] = useState('text');
  const [copied, setCopied] = useState(false);
  const [inputTokens, setInputTokens] = useState(0);
  const [outputTokens, setOutputTokens] = useState(0);
  const [useAPI, setUseAPI] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [skillCopied, setSkillCopied] = useState(false);

  useEffect(() => {
    setInputTokens(Math.ceil(input.split(/\s+/).filter(w => w).length * 1.3));
  }, [input]);

  useEffect(() => {
    setOutputTokens(Math.ceil(output.split(/\s+/).filter(w => w).length * 1.3));
  }, [output]);

  const generate = async () => {
    if (!input.trim()) return;

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
        enhanced = await generateAIPrompt(input, model, format, apiKey);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        enhanced = generateRuleBasedPrompt(input, model, format);
      }

      setOutput(enhanced);
    } catch (err) {
      setError(err.message || 'Failed to generate prompt');
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copySkill = () => {
    if (!selectedSkill) return;
    const skill = SKILL_TEMPLATES.find(s => s.id === selectedSkill);
    if (skill) {
      navigator.clipboard.writeText(skill.skill);
      setSkillCopied(true);
      setTimeout(() => setSkillCopied(false), 2000);
    }
  };

  const bg = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const text = darkMode ? 'text-gray-100' : 'text-gray-800';
  const textSec = darkMode ? 'text-gray-400' : 'text-gray-600';
  const inputClass = darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className={`min-h-screen ${bg} p-4 md:p-8 transition-colors`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <Brain className="w-6 md:w-8 h-6 md:h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-4xl font-bold ${text}`}>Advanced Prompt Generator</h1>
              <p className={`text-xs md:text-sm ${textSec}`}>
                {useAPI ? '🤖 AI-Powered Mode' : '⚡ Free Rule-Based Mode'} • Vercel-Ready
              </p>
            </div>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-lg ${card} border shadow-lg hover:shadow-xl transition-all`}>
            {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`${card} border rounded-xl shadow-lg p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-purple-600" />
              <h2 className={`text-lg font-semibold ${text}`}>Configuration</h2>
            </div>

            <div className="space-y-4">
              <div className={`p-3 rounded-lg ${useAPI ? 'bg-blue-50 dark:bg-blue-900' : 'bg-green-50 dark:bg-green-900'} border-2 ${useAPI ? 'border-blue-200 dark:border-blue-700' : 'border-green-200 dark:border-green-700'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {useAPI ? <Zap className="w-5 h-5 text-blue-600" /> : <Unlock className="w-5 h-5 text-green-600" />}
                    <span className={`font-semibold text-sm ${text}`}>
                      {useAPI ? 'AI-Powered Mode' : 'Free Mode'}
                    </span>
                  </div>
                  <button
                    onClick={() => setUseAPI(!useAPI)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      useAPI
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {useAPI ? 'Switch to Free' : 'Enable AI'}
                  </button>
                </div>
                <p className={`text-xs ${textSec}`}>
                  {useAPI
                    ? 'Using real AI for intelligent enhancement (requires API key)'
                    : 'Using smart rule-based generation (instant, no cost)'}
                </p>
              </div>

              {useAPI && (
                <div>
                  <label className={`block text-sm font-medium ${text} mb-2`}>
                    OpenRouter API Key <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline text-xs">(Get free key)</a>
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className={`w-full p-3 border rounded-lg ${inputClass} focus:ring-2 focus:ring-purple-500 text-sm`}
                  />
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Target AI Model</label>
                <select value={model} onChange={(e) => setModel(e.target.value)} className={`w-full p-3 border rounded-lg ${inputClass} focus:ring-2 focus:ring-purple-500 text-sm`}>
                  {AI_MODELS.map(m => <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>)}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Output Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)} className={`w-full p-3 border rounded-lg ${inputClass} focus:ring-2 focus:ring-purple-500 text-sm`}>
                  {OUTPUT_FORMATS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={`text-sm font-medium ${text}`}>Add Skill to Chat</label>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={selectedSkill} 
                    onChange={(e) => setSelectedSkill(e.target.value)} 
                    className={`flex-1 p-3 border rounded-lg ${inputClass} focus:ring-2 focus:ring-purple-500 text-sm`}
                  >
                    <option value="">Select a skill...</option>
                    {SKILL_TEMPLATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <button
                    onClick={copySkill}
                    disabled={!selectedSkill}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedSkill
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {skillCopied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                  </button>
                </div>
                {selectedSkill && (
                  <div className={`mt-2 p-3 rounded-lg ${darkMode ? 'bg-gray-900 border-purple-500' : 'bg-purple-50 border-purple-200'} border text-xs ${text}`}>
                    {SKILL_TEMPLATES.find(s => s.id === selectedSkill)?.skill}
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={`text-sm font-medium ${text}`}>Your Prompt</label>
                  <span className={`text-xs ${textSec}`}>~{inputTokens} tokens</span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., 'create a story about apple' or 'write a python script to plot fibonacci spiral'"
                  className={`w-full h-48 p-3 border rounded-lg ${inputClass} focus:ring-2 focus:ring-purple-500 resize-none text-sm`}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              <button
                onClick={generate}
                disabled={loading || !input.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />Generating...</>
                ) : (
                  <><Sparkles className="w-5 h-5" />{useAPI ? 'Generate with AI' : 'Generate Enhanced Prompt'}</>
                )}
              </button>
            </div>
          </div>

          <div className={`${card} border rounded-xl shadow-lg p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${text}`}>Enhanced Output</h2>
              {output && (
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${textSec} bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded`}>
                    ~{outputTokens} tokens
                  </span>
                  <button onClick={copy} className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 px-3 py-1 rounded bg-purple-50 dark:bg-purple-900">
                    {copied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                  </button>
                </div>
              )}
            </div>

            <div className={`${darkMode ? 'bg-gray-900 border-purple-500' : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'} p-4 rounded-lg border-2 h-96 overflow-y-auto`}>
              {output ? (
                <pre className={`${text} whitespace-pre-wrap text-xs md:text-sm font-mono leading-relaxed`}>{output}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className={`w-12 h-12 ${textSec} mb-3`} />
                  <p className={`${textSec} text-sm`}>Enter a prompt and click Generate to see the enhanced version</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`mt-6 ${card} border rounded-xl shadow-lg p-4`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-xs ${textSec} text-center md:text-left`}>
              🚀 Hybrid Mode: Free Rule-Based OR AI-Powered • Deploy on Vercel • No Backend Needed
            </p>
            <a
              href="https://github.com/Justme017/Prompt-Wizard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Give a Star for Prompt Wizard!</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-8 ${card} border rounded-xl shadow-lg p-6 text-center`}>
          <div className="space-y-2">
            <p className={`text-sm ${text}`}>
              Made with ❤️ by Shubham Mehta
            </p>
            <p className={`text-xs ${textSec}`}>
              Licensed under Creative Commons (CC) Attribution-ShareAlike 4.0 International
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
