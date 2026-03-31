import { GoogleGenAI } from "@google/genai";

// Vite exposes GEMINI_API_KEY via vite.config.ts define (process.env.GEMINI_API_KEY)
// and also available as import.meta.env.VITE_GEMINI_API_KEY if prefixed
const apiKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || (process.env.GEMINI_API_KEY as string) || "";

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will not work.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const getGeminiModel = (modelName = "gemini-3-flash-preview") => {
  return ai.models.generateContent({
    model: modelName,
    contents: "",
  });
};
