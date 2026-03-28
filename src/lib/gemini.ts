import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

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
