import { encoding_for_model } from "tiktoken";

/* ---------------- MODEL CONFIG ---------------- */

const MODELS = {
  // OpenAI
  "gpt-4o": { priceIn: 5 / 1e6, provider: "openai" },
  "gpt-4o-mini": { priceIn: 0.15 / 1e6, provider: "openai" },
  "gpt-4.1": { priceIn: 10 / 1e6, provider: "openai" },
  // Anthropic (approximate)
  "claude-3-opus": { priceIn: 15 / 1e6, provider: "anthropic" },
  "claude-3-sonnet": { priceIn: 3 / 1e6, provider: "anthropic" },
  "claude-3-haiku": { priceIn: 0.25 / 1e6, provider: "anthropic" },
  // Groq (approximate prices)
  "llama3-8b-8192": { priceIn: 0.05 / 1e6, provider: "groq" },
  "llama3-70b-8192": { priceIn: 0.59 / 1e6, provider: "groq" },
  "mixtral-8x7b-32768": { priceIn: 0.24 / 1e6, provider: "groq" },
  "gemma-7b-it": { priceIn: 0.07 / 1e6, provider: "groq" }
};

/* ---------------- TOKENIZERS ---------------- */

function openAITokens(text, model) {
  try {
    const enc = encoding_for_model(model.startsWith("gpt") ? "gpt-4" : "cl100k_base");
    const tokens = enc.encode(text).length;
    enc.free();
    return tokens;
  } catch {
    return text.trim().split(/\s+/).length * 1.3; // approximate
  }
}

// Placeholder: approximate for non-OpenAI models
function approximateTokens(text) {
  return Math.ceil(text.trim().split(/\s+/).length * 1.3);
}

/* ---------------- COMPRESSION ---------------- */

function compress(prompt, mode) {
  let optimized = prompt
    // Basic cleanup
    .replace(/\s+/g, " ")
    .replace(/\n+/g, " ")
    .trim();

  // Remove common filler words and phrases
  const fillers = /\b(please|kindly|very|really|so|just|actually|basically|essentially|literally|honestly|truly|absolutely|completely|totally|extremely|quite|rather|somewhat|fairly|pretty|really)\b/gi;
  optimized = optimized.replace(fillers, "");

  // Remove redundant phrases
  optimized = optimized.replace(/\b(i want you to|i need you to|i would like you to)\b/gi, "");
  optimized = optimized.replace(/\b(can you please|could you please)\b/gi, "");
  optimized = optimized.replace(/\b(make sure to|be sure to|remember to)\b/gi, "");

  // Shorten common constructions
  optimized = optimized.replace(/\b(do not|don't)\b/gi, "avoid");
  optimized = optimized.replace(/\b(it is|it's)\b/gi, "is");
  optimized = optimized.replace(/\b(there is|there's)\b/gi, "is");
  optimized = optimized.replace(/\b(there are|there're)\b/gi, "are");

  // Clean up extra spaces again
  optimized = optimized.replace(/\s+/g, " ").trim();

  // Apply intelligent prompt engineering based on content
  const lowerPrompt = optimized.toLowerCase();

  if (lowerPrompt.includes("code") || lowerPrompt.includes("program") || lowerPrompt.includes("function")) {
    optimized = `Write clean, efficient, well-commented code. Include error handling: ${optimized}`;
  } else if (lowerPrompt.includes("explain") || lowerPrompt.includes("describe")) {
    optimized = `Explain step-by-step with examples and clear reasoning: ${optimized}`;
  } else if (lowerPrompt.includes("analyze") || lowerPrompt.includes("review")) {
    optimized = `Provide detailed analysis with evidence, pros/cons, and recommendations: ${optimized}`;
  } else if (lowerPrompt.includes("summarize") || lowerPrompt.includes("summary")) {
    optimized = `Create concise summary with key points, main ideas, and conclusions: ${optimized}`;
  } else if (lowerPrompt.includes("write") || lowerPrompt.includes("create") || lowerPrompt.includes("generate")) {
    optimized = `Write original, engaging, well-structured content with clear introduction and conclusion: ${optimized}`;
  } else if (lowerPrompt.includes("question") || lowerPrompt.includes("answer")) {
    optimized = `Provide comprehensive answer with reasoning and supporting evidence: ${optimized}`;
  } else if (lowerPrompt.includes("list") || lowerPrompt.includes("steps")) {
    optimized = `Provide numbered list or step-by-step guide: ${optimized}`;
  }

  // Add output format hints
  if (lowerPrompt.includes("list") || lowerPrompt.includes("steps") || lowerPrompt.includes("guide")) {
    optimized += ". Format as numbered steps.";
  } else if (lowerPrompt.includes("compare") || lowerPrompt.includes("vs")) {
    optimized += ". Use table or structured comparison format.";
  } else if (lowerPrompt.includes("pros") || lowerPrompt.includes("cons")) {
    optimized += ". Structure as advantages and disadvantages.";
  }

  // Apply mode-specific enhancements
  if (mode === "strict") {
    return `Be precise and factual: ${optimized}`;
  } else if (mode === "balanced") {
    return `Provide accurate, helpful response: ${optimized}`;
  } else if (mode === "creative") {
    return `Be innovative and comprehensive: ${optimized}`;
  }

  return optimized;
}

function recommendedMode(prompt) {
  const p = prompt.toLowerCase();
  if (p.match(/code|debug|program|function|algorithm|syntax/)) return "strict";
  if (p.match(/explain|describe|how|what|why|analyze|review|compare/)) return "balanced";
  if (p.match(/brainstorm|idea|story|creative|write|generate|design/)) return "creative";
  if (p.match(/summarize|concise|brief|short/)) return "strict";
  return "balanced";
}

/* ---------------- HANDLER ---------------- */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { prompt, model, mode } = req.body;

  const finalMode =
    mode === "recommended" ? recommendedMode(prompt) : mode;

  const optimized = compress(prompt, finalMode);

  let tokens;
  const provider = MODELS[model].provider;
  if (provider === "openai") {
    tokens = openAITokens(optimized, model);
  } else {
    tokens = approximateTokens(optimized);
  }

  const cost = tokens * MODELS[model].priceIn;

  res.status(200).json({
    optimized,
    tokens,
    cost: cost.toFixed(6),
    modeUsed: finalMode
  });
}
