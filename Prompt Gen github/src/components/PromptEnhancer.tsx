import { useState, useMemo, useEffect } from "react";
import { Sparkles, Copy, Check, Zap, Scale, Palette, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

type Mode = "strict" | "balanced" | "creative";
type OutputFormat = "plain" | "json" | "markdown" | "xml";
type AIModel = "gpt-4" | "gpt-3.5" | "claude-3" | "claude-2" | "gemini-pro" | "gemini-ultra" | "llama-3" | "mistral";

const AI_MODELS: { value: AIModel; label: string; provider: string }[] = [
  { value: "gpt-4", label: "GPT-4 Turbo", provider: "OpenAI" },
  { value: "gpt-3.5", label: "GPT-3.5 Turbo", provider: "OpenAI" },
  { value: "claude-3", label: "Claude 3 Opus", provider: "Anthropic" },
  { value: "claude-2", label: "Claude 2", provider: "Anthropic" },
  { value: "gemini-pro", label: "Gemini Pro", provider: "Google" },
  { value: "gemini-ultra", label: "Gemini Ultra", provider: "Google" },
  { value: "llama-3", label: "Llama 3 70B", provider: "Meta" },
  { value: "mistral", label: "Mistral Large", provider: "Mistral AI" },
];

const OUTPUT_FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "plain", label: "Plain Text" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "xml", label: "XML" },
];

const estimateTokens = (text: string): number => {
  if (!text) return 0;
  // Rough estimation: ~4 chars per token for English
  return Math.ceil(text.length / 4);
};

const enhancePrompt = (
  prompt: string,
  mode: Mode,
  format: OutputFormat,
  model: AIModel
): string => {
  if (!prompt.trim()) return "";

  const modeInstructions = {
    strict: `You are a precise assistant. Follow instructions exactly without deviation. Be concise and factual.`,
    balanced: `You are a helpful assistant. Balance creativity with accuracy. Provide thorough yet focused responses.`,
    creative: `You are a creative assistant. Think outside the box, offer unique perspectives, and explore innovative solutions.`,
  };

  const formatInstructions = {
    plain: "",
    json: `\n\nFormat your response as valid JSON with the following structure:\n{\n  "response": "your main response",\n  "key_points": ["point1", "point2"],\n  "summary": "brief summary"\n}`,
    markdown: `\n\nFormat your response using Markdown:\n- Use headers (##) for sections\n- Use bullet points for lists\n- Use **bold** for emphasis\n- Include code blocks where relevant`,
    xml: `\n\nFormat your response as valid XML:\n<response>\n  <main>your main response</main>\n  <key_points>\n    <point>point1</point>\n  </key_points>\n  <summary>brief summary</summary>\n</response>`,
  };

  const modelOptimizations: Record<AIModel, string> = {
    "gpt-4": "Think step by step. Use your advanced reasoning capabilities.",
    "gpt-3.5": "Be clear and direct. Focus on the most relevant information.",
    "claude-3": "Consider multiple perspectives. Be thorough yet concise.",
    "claude-2": "Structure your response clearly. Acknowledge limitations.",
    "gemini-pro": "Leverage your multimodal understanding. Be comprehensive.",
    "gemini-ultra": "Use advanced reasoning. Consider edge cases.",
    "llama-3": "Be direct and informative. Focus on accuracy.",
    "mistral": "Provide clear, structured responses. Be efficient.",
  };

  const enhanced = `# System Context
${modeInstructions[mode]}

# Model Optimization
${modelOptimizations[model]}

# User Request
${prompt.trim()}
${formatInstructions[format]}

# Guidelines
- Stay focused on the user's core request
- Provide actionable and relevant information
- Be ${mode === "strict" ? "precise and factual" : mode === "creative" ? "innovative and exploratory" : "balanced and thorough"}`;

  return enhanced;
};

export const PromptEnhancer = () => {
  const [inputPrompt, setInputPrompt] = useState("");
  const [outputPrompt, setOutputPrompt] = useState("");
  const [mode, setMode] = useState<Mode>("balanced");
  const [format, setFormat] = useState<OutputFormat>("plain");
  const [model, setModel] = useState<AIModel>("gpt-4");
  const [copied, setCopied] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [tokens, setTokens] = useState(0);
  const [cost, setCost] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const inputTokens = useMemo(() => estimateTokens(inputPrompt), [inputPrompt]);

  const handleEnhance = async () => {
    if (!inputPrompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to enhance.",
        variant: "destructive",
      });
      return;
    }

    setIsEnhancing(true);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputPrompt,
          model: model,
          mode: mode,
          format: format,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance prompt');
      }

      const data = await response.json();
      setOutputPrompt(data.optimized);
      setTokens(data.tokens);
      setCost(parseFloat(data.cost));

      toast({
        title: "Prompt enhanced!",
        description: `Optimized for ${AI_MODELS.find(m => m.value === model)?.label}`,
      });
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      toast({
        title: "Error",
        description: "Failed to enhance prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopy = async () => {
    if (!outputPrompt) return;
    
    await navigator.clipboard.writeText(outputPrompt);
    setCopied(true);
    
    toast({
      title: "Copied!",
      description: "Enhanced prompt copied to clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Dark Mode Toggle */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full bg-card border-border/50 hover:bg-accent"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>

        {/* Header */}
        <header className="text-center space-y-4 animate-fade-in -mt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI Prompt Enhancer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Craft Better Prompts
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your prompts into optimized, model-specific instructions for better AI responses.
          </p>
        </header>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in">
          {/* AI Model Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">AI Model</label>
            <Select value={model} onValueChange={(v) => setModel(v as AIModel)}>
              <SelectTrigger className="w-[200px] bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-lg z-50">
                {AI_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    <div className="flex items-center gap-2">
                      <span>{m.label}</span>
                      <span className="text-xs text-muted-foreground">({m.provider})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Format Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Output Format</label>
            <Select value={format} onValueChange={(v) => setFormat(v as OutputFormat)}>
              <SelectTrigger className="w-[160px] bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-lg z-50">
                {OUTPUT_FORMATS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Enhancement Mode</label>
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setMode("strict")}
                className={`mode-button mode-button-strict flex items-center gap-2 ${mode === "strict" ? "active" : ""}`}
              >
                <Zap className="w-4 h-4" />
                Strict
              </button>
              <button
                onClick={() => setMode("balanced")}
                className={`mode-button mode-button-balanced flex items-center gap-2 ${mode === "balanced" ? "active" : ""}`}
              >
                <Scale className="w-4 h-4" />
                Balanced
              </button>
              <button
                onClick={() => setMode("creative")}
                className={`mode-button mode-button-creative flex items-center gap-2 ${mode === "creative" ? "active" : ""}`}
              >
                <Palette className="w-4 h-4" />
                Creative
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
          {/* Input Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Original Prompt</h2>
              <span className="token-badge">
                <span className="w-2 h-2 rounded-full bg-primary/60"></span>
                {inputTokens.toLocaleString()} tokens
              </span>
            </div>
            <div className="relative">
              <Textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="min-h-[300px] resize-none bg-surface-sunken border-border/50 focus:border-primary/50 transition-colors text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              onClick={handleEnhance}
              disabled={!inputPrompt.trim() || isEnhancing}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              size="lg"
            >
              {isEnhancing ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-pulse-soft" />
                  Enhancing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Enhance Prompt
                </>
              )}
            </Button>
          </div>

          {/* Output Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Enhanced Prompt</h2>
              <div className="flex items-center gap-3">
                {outputPrompt && (
                  <>
                    <span className="token-badge">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      {tokens.toLocaleString()} tokens
                    </span>
                    <span className="cost-badge">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      ${cost.toFixed(6)}
                    </span>
                  </>
                )}
                {outputPrompt && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
            <div className="relative">
              <Textarea
                value={outputPrompt}
                readOnly
                placeholder="Enhanced prompt will appear here..."
                className="min-h-[300px] resize-none bg-surface-sunken border-border/50 text-foreground placeholder:text-muted-foreground font-mono text-sm"
              />
              {!outputPrompt && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-muted-foreground">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Your enhanced prompt will appear here</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Optimized for <strong className="text-foreground">{AI_MODELS.find(m => m.value === model)?.label}</strong>
              </span>
              <span>
                Mode: <strong className="text-foreground capitalize">{mode}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Token Summary */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-xl bg-card border border-border/50 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{inputTokens.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Input Tokens</div>
            </div>
            <div className="w-px h-10 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{outputTokens.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Output Tokens</div>
            </div>
            <div className="w-px h-10 bg-border"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{(inputTokens + outputTokens).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Tokens</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
