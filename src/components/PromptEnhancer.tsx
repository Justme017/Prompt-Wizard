import { useState, useMemo, useEffect } from "react";
import { Sparkles, Copy, Check, Moon, Sun } from "lucide-react";
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

export const PromptEnhancer = () => {
  console.log("PromptEnhancer component rendering");

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
    localStorage.setItem("darkMode", isDark.toString());
  }, [isDark]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setIsDark(savedDarkMode === "true");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
    }
  }, []);

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

  try {
    console.log("PromptEnhancer: Starting render");
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Prompt Wizard</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="w-10 h-10"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Settings Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Model</label>
              <Select value={model} onValueChange={(value: AIModel) => setModel(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((modelOption) => (
                    <SelectItem key={modelOption.value} value={modelOption.value}>
                      {modelOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mode</label>
              <Select value={mode} onValueChange={(value: Mode) => setMode(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strict">Strict</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Output Format</label>
              <Select value={format} onValueChange={(value: OutputFormat) => setFormat(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {OUTPUT_FORMATS.map((formatOption) => (
                    <SelectItem key={formatOption.value} value={formatOption.value}>
                      {formatOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Input Prompt</h2>
            <Textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="min-h-[150px]"
            />
            <div className="text-sm text-muted-foreground">
              {inputTokens} tokens
            </div>
          </div>

          {/* Enhance Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleEnhance}
              disabled={!inputPrompt.trim() || isEnhancing}
              className="px-8 py-3 text-lg"
            >
              {isEnhancing ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
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
          {outputPrompt && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Enhanced Prompt</h2>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {tokens} tokens • ${cost.toFixed(4)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <Textarea
                value={outputPrompt}
                readOnly
                className="min-h-[200px] font-mono text-sm"
                placeholder="Your enhanced prompt will appear here..."
              />
            </div>
          )}
          
          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Made with ❤️ by Shubham Mehta
              </p>
              <p className="text-xs text-muted-foreground">
                Licensed under Creative Commons (CC) Attribution-ShareAlike 4.0 International
              </p>
            </div>
          </footer>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering PromptEnhancer:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-center text-red-500">Error Loading Prompt Wizard</h1>
          <p className="text-center">Check console for details.</p>
          <pre className="bg-red-50 p-4 rounded text-sm overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
};
