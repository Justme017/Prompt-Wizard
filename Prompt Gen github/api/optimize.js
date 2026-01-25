import { encoding_for_model } from "tiktoken";

/* ---------------- MODEL CONFIG ---------------- */

const MODELS = {
  "gpt-4o": { priceIn: 5 / 1e6 },
  "gpt-4.1": { priceIn: 10 / 1e6 },
  "claude-3-opus": { priceIn: 15 / 1e6 }
};

/* ---------------- TOKENIZERS ---------------- */

function openAITokens(text, model) {
  const enc = encoding_for_model(model);
  const tokens = enc.encode(text).length;
  enc.free();
  return tokens;
}


// Placeholder: simple word count for Claude models
function claudeTokens(text) {
  return text.trim().split(/\s+/).length;
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

  let tokens =
    model.startsWith("gpt")
      ? openAITokens(optimized, model)
      : claudeTokens(optimized);

  const cost = tokens * MODELS[model].priceIn;

  res.status(200).json({
    optimized,
    tokens,
    cost: cost.toFixed(6),
    modeUsed: finalMode
  });
}
