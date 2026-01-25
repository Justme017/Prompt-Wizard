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
  let base = prompt
    .replace(/\s+/g, " ")
    .replace(/please|kindly|very|really/gi, "")
    .trim();

  if (mode === "strict") return base;
  if (mode === "balanced") return `Focus on accuracy. ${base}`;
  if (mode === "creative") return `Be creative but concise. ${base}`;
  return base;
}

function recommendedMode(prompt) {
  const p = prompt.toLowerCase();
  if (p.match(/code|debug|analyze|fix/)) return "strict";
  if (p.match(/explain|summarize|compare/)) return "balanced";
  if (p.match(/brainstorm|idea|story/)) return "creative";
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
