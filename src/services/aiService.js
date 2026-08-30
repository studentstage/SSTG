import { GoogleGenAI } from "@google/genai";

const API_KEY_STORAGE = "sstg_gemini_api_key";

export function getGeminiApiKey() {
  return (
    import.meta.env.VITE_GEMINI_API_KEY ||
    localStorage.getItem(API_KEY_STORAGE) ||
    ""
  );
}

export function setGeminiApiKey(key) {
  if (key) {
    localStorage.setItem(API_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE);
  }
}

export const aiService = {
  async askGemini(promptText) {
    const apiKey = getGeminiApiKey();

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const interaction = await ai.interactions.create({
          model: "gemini-3.7-flash",
          input: promptText,
        });

        if (interaction && interaction.output_text) {
          return interaction.output_text;
        }
        if (interaction && interaction.text) {
          return interaction.text;
        }
      } catch (err) {
        console.warn("Gemini Interactions API error, using academic fallback:", err);
      }
    } else {
      try {
        // Try without explicit key if environment provides it
        const ai = new GoogleGenAI({});
        const interaction = await ai.interactions.create({
          model: "gemini-3.7-flash",
          input: promptText,
        });

        if (interaction && (interaction.output_text || interaction.text)) {
          return interaction.output_text || interaction.text;
        }
      } catch (err) {
        console.log("Using built-in academic engine (no API key configured)");
      }
    }

    return null; // Signals caller to use academic engine
  }
};
