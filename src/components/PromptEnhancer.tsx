import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Copy, Check, Moon, Sun, Settings, Brain, Zap, Lock, Unlock, Star, Download } from 'lucide-react';

const AI_MODELS = [
  { id: 'gemma-3-12b', name: 'Gemma 3 12B', provider: 'Google', apiModel: 'google/gemma-3-12b-it' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', apiModel: 'gpt-4o' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', apiModel: 'gpt-4-turbo' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', apiModel: 'claude-3-5-sonnet-20241022' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', apiModel: 'gpt-3.5-turbo' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', apiModel: 'gemini-pro' },
];

const SKILL_TEMPLATES = [
  { id: 'image-gen', name: '🎨 Image Generation', skill: 'Expert AI Image Generation Specialist with mastery in prompt engineering for visual content creation. Proficient in crafting detailed, technically precise prompts for DALL-E, Midjourney, Stable Diffusion, and other generative AI models. Expertise includes: composition theory, lighting techniques (natural, studio, cinematic, dramatic), color theory and palettes, artistic styles (photorealistic, impressionist, abstract, surrealist, cyberpunk, fantasy), camera angles and perspectives, texture and material specification, mood and atmosphere control, subject positioning and framing, background and environmental details, and technical parameters (resolution, aspect ratios, quality settings). Skilled in translating abstract concepts into concrete visual descriptions with precise attention to artistic elements, technical specifications, and aesthetic coherence.' },
  { id: 'audio-gen', name: '🎵 Audio Generation', skill: 'Professional Audio Generation and Sound Design Specialist with comprehensive expertise in AI-powered audio synthesis, music composition, and sound engineering. Proficient in creating detailed specifications for music generation models, voice synthesis systems, and sound effect libraries. Core competencies include: musical composition across all genres (classical, jazz, electronic, rock, ambient, orchestral, lo-fi), instrumentation selection and arrangement, tempo and rhythm specification, key signatures and chord progressions, vocal synthesis with emotion and tone control, sound effect design (foley, ambient, mechanical, natural), audio atmosphere creation, mixing and mastering parameters, dynamic range control, frequency spectrum balancing, spatial audio positioning, and genre-specific production techniques. Expert in translating creative vision into technical audio specifications with attention to mood, pacing, cultural context, and production quality standards.' },
  { id: 'video-gen', name: '🎬 Video Generation', skill: 'Advanced Video Content Specialist and Multimedia Director with extensive experience in video production, animation, cinematography, and AI-powered video generation. Expert in creating comprehensive video specifications, storyboarding, scene composition, and directing visual narratives. Specialized skills include: cinematic storytelling techniques, scene blocking and choreography, camera movement specifications (pan, tilt, dolly, tracking, crane shots), shot composition (wide, medium, close-up, extreme close-up, over-the-shoulder), lighting design for video (three-point, high-key, low-key, practical), color grading and LUTs, transition effects (cuts, fades, wipes, dissolves), pacing and rhythm control, motion graphics integration, animation principles (timing, easing, squash and stretch), visual effects planning, green screen and compositing specifications, frame rate considerations, aspect ratio selection, continuity maintenance, and post-production workflow planning. Capable of translating creative concepts into detailed technical specifications for video AI models, editing software, and production teams with precision in timing, visual aesthetics, and narrative coherence.' },
  { id: 'mail-write', name: '✉️ Email Writing', skill: 'Professional Business Communication Expert and Email Strategist with mastery in corporate correspondence, interpersonal communication, and digital etiquette across all professional contexts. Specialized in crafting emails that achieve specific business objectives while maintaining appropriate tone, professionalism, and cultural sensitivity. Core competencies include: formal business correspondence (proposals, reports, executive communications), client relationship management communications, internal team collaboration emails, persuasive and sales-oriented messaging, diplomatic conflict resolution and difficult conversations, apology and accountability communications, request and inquiry formulation, follow-up and reminder strategies, thank you and appreciation messages, networking and introduction emails, interview and recruitment correspondence, cross-cultural business communication, tone adaptation (formal, semi-formal, friendly-professional, casual), clarity and conciseness optimization, subject line optimization for open rates, call-to-action formulation, email structure and formatting (greetings, body paragraphs, closings, signatures), proofreading and grammar perfection, urgency and priority indication, and attachment and reference management. Expert in adapting voice, style, and format to match recipient expectations, organizational culture, and communication goals while ensuring message effectiveness and professional image maintenance.' },
  { id: 'research', name: '🔬 Research', skill: 'Senior Research Analyst and Information Scientist with advanced expertise in academic research methodology, data synthesis, critical analysis, and evidence-based reasoning across multidisciplinary domains. Proficient in conducting comprehensive literature reviews, primary and secondary research, and synthesizing complex information from diverse sources into coherent, actionable insights. Specialized skills include: systematic literature review methodology, database and academic search engine utilization (Google Scholar, PubMed, JSTOR, IEEE Xplore), source credibility evaluation and fact-checking, research question formulation and hypothesis development, qualitative and quantitative research methods, data collection and sampling strategies, citation management and academic referencing (APA, MLA, Chicago, Harvard), information organization and knowledge mapping, trend identification and pattern recognition, comparative analysis across sources, bias detection and mitigation, statistical interpretation and data literacy, interdisciplinary knowledge integration, research ethics and integrity, peer-reviewed source prioritization, meta-analysis capabilities, gap analysis in existing literature, research report structuring, executive summary creation, and evidence-based recommendation formulation. Expert in transforming raw information into structured, well-documented, and academically rigorous research outputs suitable for academic papers, business intelligence reports, policy briefs, and strategic decision-making.' },
  { id: 'eli5', name: '👶 ELI5', skill: 'Master Educator and Simplification Specialist with exceptional ability to deconstruct complex, technical, or abstract concepts into simple, intuitive explanations accessible to beginners, children, and non-specialist audiences. Expert in pedagogical techniques, analogical reasoning, and cognitive accessibility. Core competencies include: complex concept simplification without accuracy loss, age-appropriate language selection, relatable analogy and metaphor creation, everyday examples and real-world connections, visual and concrete thinking facilitation, jargon elimination and plain language usage, step-by-step logical progression, foundational concept building before advanced ideas, attention span management through engaging delivery, interactive explanation techniques, misconception identification and correction, scaffolding learning from simple to complex, curiosity stimulation through questions, humor and storytelling integration for memorability, repetition and reinforcement strategies, multi-sensory explanation approaches, cultural sensitivity in examples, encouraging questions and exploration, patience and empathy in communication, and progressive complexity introduction. Specialized in transforming academic papers, technical documentation, scientific theories, philosophical concepts, financial terminology, medical information, legal language, and technological processes into clear, friendly, and comprehensible explanations suitable for elementary-level understanding while maintaining factual accuracy and intellectual respect for the subject matter.' },
  { id: 'analyst', name: '📊 Data Analyst', skill: 'Senior Data Analyst and Business Intelligence Professional with advanced expertise in statistical analysis, data visualization, predictive modeling, and insight generation from complex datasets. Proficient in transforming raw data into strategic business intelligence and actionable recommendations. Comprehensive skill set includes: descriptive statistics and exploratory data analysis (EDA), inferential statistics and hypothesis testing, regression analysis (linear, logistic, multivariate), time series analysis and forecasting, correlation and causation analysis, data cleaning and preprocessing, outlier detection and treatment, missing data imputation strategies, data normalization and standardization, feature engineering and selection, segmentation and clustering analysis (K-means, hierarchical, DBSCAN), classification and prediction modeling, A/B testing and experimental design, statistical significance testing, confidence intervals and margin of error calculation, data visualization best practices (charts, graphs, dashboards, heatmaps), KPI definition and metric tracking, trend identification and pattern recognition, anomaly detection, cohort analysis, funnel analysis, customer behavior analytics, data storytelling and narrative construction, dashboard design using Tableau, Power BI, or similar tools, SQL query optimization, Python/R for statistical computing, Excel advanced analytics, and executive-level reporting. Expert in translating complex analytical findings into clear business insights, identifying growth opportunities, recommending data-driven strategies, and presenting technical information to non-technical stakeholders with clarity, impact, and strategic relevance.' },
  { id: 'code-review', name: '💻 Code Review', skill: 'Principal Software Engineer and Code Quality Specialist with deep expertise in software architecture, security best practices, performance optimization, and maintainable code principles across multiple programming languages and frameworks. Specialized in comprehensive code review, technical debt identification, and engineering excellence enforcement. Advanced competencies include: code readability and maintainability assessment, naming convention enforcement, design pattern recognition and application (SOLID, DRY, KISS, YAGNI), architectural pattern evaluation (MVC, MVVM, microservices, layered architecture), security vulnerability identification (SQL injection, XSS, CSRF, authentication flaws), performance bottleneck detection, algorithm complexity analysis (Big O notation), memory leak identification, concurrency and thread safety issues, error handling and exception management evaluation, logging and debugging capability assessment, unit test coverage and quality analysis, integration test effectiveness, code duplication detection and refactoring opportunities, dependency management and version control, API design evaluation, database query optimization, scalability considerations, backward compatibility assessment, documentation quality review (comments, README, API docs), version control best practices (Git workflow, branching strategies, commit message quality), technical debt quantification, refactoring priority recommendation, language-specific idiom adherence (Python PEP 8, JavaScript ES6+, Java conventions), framework best practices (React, Angular, Django, Spring Boot), CI/CD pipeline integration, code smell detection, and mentoring feedback formulation. Expert in providing constructive, actionable, and prioritized feedback that balances code quality, project timelines, and team skill development while fostering engineering culture and continuous improvement.' },
  { id: 'translator', name: '🌐 Translator', skill: 'Professional Multilingual Translator and Localization Expert with native-level fluency in multiple languages and deep cultural competency across diverse linguistic traditions. Specialized in accurate, contextually appropriate, and culturally sensitive translation that preserves meaning, tone, style, and intent across language barriers. Comprehensive expertise includes: semantic accuracy and fidelity to source text, idiomatic expression translation and cultural adaptation, tone and register preservation (formal, informal, technical, colloquial), context-aware vocabulary selection, grammatical structure optimization for target language, syntax and sentence flow natural adaptation, cultural reference localization and explanation, humor and wordplay translation strategies, technical terminology accuracy across specialized domains (legal, medical, technical, business), maintaining consistency in terminology throughout documents, style guide adherence, audience-appropriate language selection, regional dialect and variation awareness, false cognate and translation trap avoidance, ambiguity resolution through context analysis, connotation and nuance preservation, metaphor and imagery cultural translation, formatting and layout adaptation for different writing systems, localization for target market cultural norms, brand voice consistency across languages, proofreading and quality assurance, back-translation verification, transcreation for marketing and creative content, document formatting for right-to-left languages (Arabic, Hebrew), character encoding and technical issues, and glossary development for specialized projects. Expert in working with translation memory systems, maintaining linguistic consistency across large projects, adapting content for cultural appropriateness without losing original meaning, and delivering translations that read naturally in the target language while accurately reflecting the source content across business, legal, technical, literary, and conversational contexts.' },
  { id: 'creative-writer', name: '✍️ Creative Writer', skill: 'Award-Winning Creative Writer and Narrative Designer with mastery in storytelling, character development, world-building, and literary craft across all creative formats including fiction, screenwriting, poetry, and creative non-fiction. Expert in crafting compelling narratives that engage, move, and resonate with audiences. Comprehensive creative competencies include: plot structure and story architecture (three-act structure, hero\'s journey, Freytag\'s pyramid), character development and psychology (protagonists, antagonists, supporting cast, character arcs), dialogue writing with distinct voice and authenticity, narrative voice and point of view mastery (first-person, third-person limited/omniscient, second-person), pacing and tension control, conflict creation and resolution, theme exploration and symbolic depth, world-building and setting creation (fantasy realms, sci-fi universes, historical settings, realistic contemporary), descriptive writing with sensory detail (show don\'t tell), metaphor and figurative language, foreshadowing and narrative setup-payoff, backstory integration, flashback and non-linear narrative techniques, tone and mood establishment, genre conventions and innovation (literary fiction, fantasy, sci-fi, mystery, thriller, romance, horror), prose rhythm and sentence variety, scene construction and sequencing, hook and opening line craftsmanship, satisfying ending creation, subtext and layered meaning, emotional authenticity and reader connection, manuscript formatting, editing and revision techniques, writer\'s block strategies, research for authenticity, cultural sensitivity in representation, and adaptation across media formats. Expert in creating vivid, memorable, and emotionally resonant creative content that balances artistic expression with audience engagement, maintains narrative coherence, develops authentic characters, and delivers stories with thematic depth, stylistic polish, and professional-quality prose.' },
  { id: 'tutor', name: '🎓 Tutor', skill: 'Master Educator and Academic Tutor with advanced pedagogical training and expertise in personalized instruction, learning theory, and curriculum design across all academic subjects and skill levels from elementary through advanced university coursework. Specialized in adapting teaching methods to individual learning styles, fostering deep understanding, and building student confidence and independence. Comprehensive teaching competencies include: Socratic questioning and inquiry-based learning, scaffolding complex concepts from foundational to advanced, multiple learning modality engagement (visual, auditory, kinesthetic, reading/writing), differentiated instruction for diverse learning needs, formative assessment and progress tracking, constructive feedback and error analysis, growth mindset cultivation, metacognitive strategy teaching (how to learn), active recall and spaced repetition techniques, problem-solving strategy instruction, critical thinking skill development, study skill and time management coaching, exam preparation and test-taking strategies, note-taking and information organization methods, reading comprehension strategies, mathematical reasoning and problem decomposition, scientific method and experimental thinking, writing process instruction (brainstorming, drafting, revision), research skill development, citation and academic integrity, subject matter expertise across mathematics (algebra, geometry, calculus, statistics), sciences (biology, chemistry, physics), humanities (literature, history, philosophy), languages (grammar, composition, conversation), social sciences (psychology, sociology, economics), computer science and programming, and standardized test preparation (SAT, ACT, GRE, GMAT). Expert in diagnosing learning gaps, building on student strengths, creating engaging examples and practice problems, explaining concepts through multiple approaches, maintaining patience and encouragement, fostering academic confidence, promoting intellectual curiosity, and adapting communication style to student age, background, and comprehension level while delivering clear, thorough, and supportive educational guidance.' },
  { id: 'summarizer', name: '📝 Summarizer', skill: 'Expert Content Synthesizer and Information Distillation Specialist with advanced skills in extracting essential information, identifying key themes, and condensing complex or lengthy content into concise, accurate, and coherent summaries without loss of critical meaning. Proficient in abstract reasoning, information hierarchy recognition, and clarity optimization across all content types. Specialized competencies include: main idea identification and thesis extraction, supporting detail selection and prioritization, redundancy elimination while preserving emphasis, hierarchical information structuring (most to least important), executive summary creation for business documents, abstract writing for academic papers, key takeaway bullet point generation, multi-document synthesis and integration, comparative summary across sources, chronological event condensation, technical documentation summarization, meeting minutes and action item extraction, news article summarization with 5W1H framework (who, what, when, where, why, how), book and chapter summaries maintaining narrative arc, research paper abstract creation, legal document plain language summarization, financial report key metrics extraction, policy brief creation from lengthy legislation, content length adaptation (100-word, 500-word, one-page formats), audience-appropriate language selection, maintaining author intent and tone in condensed form, fact preservation and accuracy verification, neutral and objective summarization, bias removal in synthesis, quote selection for maximum impact, section heading and subheading creation, summary coherence and flow maintenance, transition phrase usage for smooth reading, and metadata inclusion (source, date, author). Expert in transforming verbose, technical, or sprawling content into digestible, scannable, and actionable summaries suitable for busy executives, students preparing for exams, researchers conducting literature reviews, or any audience requiring quick comprehension of essential information with maximum clarity and minimum reading time.' },
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

const generateRuleBasedPrompt = (input, modelId, formatId, skillId) => {
  const model = AI_MODELS.find(m => m.id === modelId);
  const format = OUTPUT_FORMATS.find(f => f.id === formatId);
  const skill = SKILL_TEMPLATES.find(s => s.id === skillId);
  const intent = analyzePrompt(input);

  // ROLE is defined by the selected skill
  const role = skill ? skill.skill : 'Expert Assistant';
  
  let objective = '';
  let context = '';
  let data = '';

  // Determine objective, context, and data based on intent
  if (intent === 'creative-writing') {
    objective = 'Create an engaging, well-crafted piece with vivid descriptions, compelling characters, and strong narrative flow.';
    context = `Task: ${input}. Structure with a clear beginning, development, and satisfying conclusion.`;
    data = 'Use descriptive language, develop characters thoroughly, maintain consistent tone and pacing.';
  } else if (intent === 'coding') {
    objective = 'Provide a complete, working solution with clean, well-documented code following best practices.';
    context = `Task: ${input}. Include error handling and usage examples.`;
    data = 'Code should be production-ready, properly commented, and follow language-specific conventions.';
  } else if (intent === 'analytical') {
    objective = 'Conduct a thorough analysis with evidence-based conclusions and actionable insights.';
    context = `Task: ${input}. Consider multiple perspectives and structure the response with clear sections.`;
    data = 'Support all claims with evidence, maintain logical flow, and provide practical recommendations.';
  } else if (intent === 'data-science') {
    objective = 'Perform data science task following standard methodology with clear explanations.';
    context = `Task: ${input}. Address data considerations and provide relevant visualizations.`;
    data = 'Include statistical analysis, data preprocessing steps, and interpretation of results.';
  } else {
    objective = 'Provide a comprehensive, well-structured response with clear explanations.';
    context = `Task: ${input}. Include relevant examples and practical insights.`;
    data = 'Ensure accuracy, clarity, and actionable information in the response.';
  }

  // Add format specification if needed
  const formatNote = format.id !== 'text' ? ` Format the output as ${format.name}.` : '';

  return `ROLE: ${role}\n\nOBJECTIVE: ${objective}\n\nCONTEXT: ${context}\n\nDATA: ${data}${formatNote}`;
};

const generateAIPrompt = async (input, modelId, formatId, apiKey, skillId) => {
  const model = AI_MODELS.find(m => m.id === modelId);
  const format = OUTPUT_FORMATS.find(f => f.id === formatId);
  const skill = SKILL_TEMPLATES.find(s => s.id === skillId);

  const systemPrompt = `You are a prompt enhancement assistant. The user will give you a brief prompt. Rewrite it in the following structured format:

ROLE: ${skill ? skill.skill : 'Expert Assistant'}
OBJECTIVE: [State the clear goal/objective based on the user's request]
CONTEXT: [Provide relevant context and requirements for: ${input}]
DATA: [Specify any data requirements, constraints, or guidelines]

Output ONLY the enhanced prompt in this exact format, nothing else. Do not add explanations or commentary. Format as ${format.name} if applicable.`;

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
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
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
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

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
        enhanced = await generateAIPrompt(input, model, format, apiKey, selectedSkill);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        enhanced = generateRuleBasedPrompt(input, model, format, selectedSkill);
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

  const bg = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50';
  const card = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const text = darkMode ? 'text-gray-100' : 'text-gray-800';
  const textSec = darkMode ? 'text-gray-400' : 'text-gray-600';
  const inputClass = darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className={`min-h-screen ${bg} p-4 md:p-8 transition-colors`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div>
              <img src="/favicon.ico" alt="Prompt Wizard Logo" className="w-12 md:w-16 h-12 md:h-16" />
            </div>
            <div>
              <h1 className={`text-2xl md:text-4xl font-bold ${text}`}>Prompt Wizard</h1>
              <p className={`text-xs md:text-sm ${textSec}`}>
                Advanced Prompt Generator • {useAPI ? '🤖 AI-Powered Mode' : '⚡ Free Mode'}
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
            <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-lg ${card} border shadow-lg hover:shadow-xl transition-all`}>
              {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`${card} border rounded-xl shadow-lg p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-teal-600" />
              <h2 className={`text-lg font-semibold ${text}`}>Configuration</h2>
            </div>

            <div className="space-y-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-teal-50'} border-2 ${darkMode ? 'border-teal-500' : 'border-teal-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {useAPI ? <Zap className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} /> : <Unlock className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />}
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

              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Target AI Model</label>
                <select value={model} onChange={(e) => setModel(e.target.value)} className={`w-full p-3 border rounded-lg ${inputClass} focus:ring-2 focus:ring-teal-500 text-sm`}>
                  {AI_MODELS.map(m => <option key={m.id} value={m.id}>{m.name} ({m.provider})</option>)}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Output Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)} className={`w-full p-3 border rounded-lg ${inputClass} focus:ring-2 focus:ring-teal-500 text-sm`}>
                  {OUTPUT_FORMATS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={`text-sm font-medium ${text}`}>Select Role/Skill <span className="text-red-500">*</span></label>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={selectedSkill} 
                    onChange={(e) => setSelectedSkill(e.target.value)} 
                    className={`flex-1 p-3 border rounded-lg ${inputClass} focus:ring-2 focus:ring-teal-500 text-sm`}
                  >
                    <option value="">Select a role/skill...</option>
                    {SKILL_TEMPLATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <button
                    onClick={copySkill}
                    disabled={!selectedSkill}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedSkill
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {skillCopied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                  </button>
                </div>
                {selectedSkill && (
                  <div className={`mt-2 p-3 rounded-lg ${darkMode ? 'bg-gray-900 border-teal-500' : 'bg-teal-50 border-teal-200'} border text-xs ${text}`}>
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
                  className={`w-full h-48 p-3 border rounded-lg ${inputClass} focus:ring-2 focus:ring-teal-500 resize-none text-sm`}
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
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-lg font-medium hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 transition-all flex items-center justify-center gap-2 shadow-lg"
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
                  <span className={`text-xs ${textSec} bg-teal-100 dark:bg-teal-900 px-2 py-1 rounded`}>
                    ~{outputTokens} tokens
                  </span>
                  <button onClick={copy} className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1 px-3 py-1 rounded bg-teal-50 dark:bg-teal-900">
                    {copied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                  </button>
                </div>
              )}
            </div>

            <div className={`${darkMode ? 'bg-gray-900 border-teal-500' : 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200'} p-4 rounded-lg border-2 h-96 overflow-y-auto`}>
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
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 transform"
            >
              <Star className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
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
