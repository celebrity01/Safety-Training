import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { Question } from "../types";
import { SCENARIO_CATEGORIES } from "../constants";
import { imageManifest } from "../static/images";

// API key management
let API_KEY: string | null = null;
let ai: GoogleGenAI | null = null;

// Try to get API key from multiple sources
function getApiKey(): string | null {
  // First try localStorage (user entered)
  const storedKey = localStorage.getItem("prepzone_api_key");
  if (storedKey && validateApiKey(storedKey)) {
    return storedKey;
  }

  // Fall back to environment variable
  const envKey = (window as any).process?.env?.API_KEY;
  if (envKey && validateApiKey(envKey)) {
    return envKey;
  }

  return null;
}

// Validate API key format
function validateApiKey(key: string): boolean {
  const trimmedKey = key.trim();
  return trimmedKey.length === 39 && trimmedKey.startsWith("AIza");
}

// Initialize or reinitialize the AI client
function initializeAI(): boolean {
  API_KEY = getApiKey();
  if (!API_KEY) {
    ai = null;
    return false;
  }

  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
    return true;
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
    ai = null;
    return false;
  }
}

// Set API key and reinitialize
export function setApiKey(key: string): boolean {
  if (!validateApiKey(key)) {
    throw new Error(
      'Invalid API key format. Key must be 39 characters long and start with "AIza".',
    );
  }

  localStorage.setItem("prepzone_api_key", key.trim());
  return initializeAI();
}

// Check if API is ready
export function isApiReady(): boolean {
  return ai !== null;
}

// Get current API key status
export function getApiKeyStatus(): {
  hasKey: boolean;
  isValid: boolean;
  keyPreview?: string;
} {
  const key = getApiKey();
  if (!key) {
    return { hasKey: false, isValid: false };
  }

  return {
    hasKey: true,
    isValid: validateApiKey(key),
    keyPreview: key.substring(0, 8) + "..." + key.substring(key.length - 4),
  };
}

// Initialize on load
initializeAI();

const questionSchema = {
  type: Type.OBJECT,
  properties: {
    question: {
      type: Type.STRING,
      description: "The scenario question for the user.",
    },
    choices: {
      type: Type.ARRAY,
      description:
        "An array of 2 to 3 possible actions for the user to choose from.",
      items: { type: Type.STRING },
    },
    correctChoiceIndex: {
      type: Type.INTEGER,
      description:
        "The 0-based index of the correct choice in the 'choices' array. This choice must be the objectively safest and best practice.",
    },
    feedback: {
      type: Type.ARRAY,
      description:
        "An array of feedback strings, one for each choice, in the same order. Explain why each choice is good or bad in a supportive, educational tone.",
      items: { type: Type.STRING },
    },
  },
  required: ["question", "choices", "correctChoiceIndex", "feedback"],
};

const recommendationsSchema = {
  type: Type.OBJECT,
  properties: {
    contextualAlert: {
      type: Type.STRING,
      description:
        "A short, location-specific safety alert, max 2-3 sentences. Example: 'Flood warnings are in effect for coastal areas of Lagos this week.'",
    },
    trainingRecommendationKey: {
      type: Type.STRING,
      description: `A suggestion for which training scenario to try next, justified by user stats or location. Must be one of these keys: ${SCENARIO_CATEGORIES.map((c) => c.key).join(", ")}.`,
    },
    trainingRecommendationReason: {
      type: Type.STRING,
      description:
        "The reason for the training recommendation. Example: 'Your performance in Flood Response is lower than other scenarios.'",
    },
    preparednessTip: {
      type: Type.STRING,
      description:
        "A general, actionable disaster preparedness tip relevant to the user's profile or location.",
    },
  },
  required: [
    "contextualAlert",
    "trainingRecommendationKey",
    "trainingRecommendationReason",
    "preparednessTip",
  ],
};

const generateQuestion = async (
  categoryTitle: string,
  systemInstruction: string,
  location: string,
  context?: string,
): Promise<Question> => {
  if (!ai) {
    throw new Error("API key not configured. Please set your Gemini API key.");
  }

  try {
    const prompt = context
      ? `The scenario is '${categoryTitle}' in ${location}. Here is what just happened: ${context}. Now, create the next logical question and choices in this scenario.`
      : `Create the first challenging scenario question for: '${categoryTitle}' in ${location}.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: questionSchema,
      },
    });

    let text = response.text?.trim() || "";
    if (text.startsWith("```json")) {
      text = text.substring(7, text.length - 3).trim();
    }

    const questionData = JSON.parse(text);

    if (
      !questionData.question ||
      !questionData.choices ||
      questionData.choices.length < 2 ||
      questionData.feedback.length !== questionData.choices.length
    ) {
      throw new Error("Received invalid question data structure from AI.");
    }

    return questionData as Question;
  } catch (error) {
    console.error("Error generating question:", error);
    if (error instanceof SyntaxError) {
      throw new Error(
        "Failed to parse the AI's response. The data was not valid JSON.",
      );
    }
    throw new Error("Failed to generate scenario question.");
  }
};

export const generateInitialScenario = async (
  categoryTitle: string,
  systemInstruction: string,
  location: string,
): Promise<Question> => {
  try {
    return await generateQuestion(categoryTitle, systemInstruction, location);
  } catch (error) {
    console.error("Error in generateInitialScenario:", error);
    throw error;
  }
};

export const generateNextQuestion = async (
  categoryTitle: string,
  systemInstruction: string,
  context: string,
  location: string,
): Promise<Question> => {
  return generateQuestion(categoryTitle, systemInstruction, location, context);
};

export const generateGameSummary = async (
  summaryPrompt: string,
): Promise<string> => {
  if (!ai) {
    throw new Error("API key not configured. Please set your Gemini API key.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: summaryPrompt,
    });
    return response.text || "Error generating summary.";
  } catch (error) {
    console.error("Error generating game summary:", error);
    throw new Error("Failed to generate performance summary.");
  }
};

const getFallbackImage = (categoryKey: string): string => {
  const images = imageManifest[categoryKey] || imageManifest.roadAccident; // Default fallback
  return images[Math.floor(Math.random() * images.length)];
};

export const generateScenarioImage = async (
  prompt: string,
  categoryKey: string,
): Promise<string> => {
  // Use static images directly instead of AI generation
  // This avoids the "body stream already read" error and billing requirements
  return getFallbackImage(categoryKey);
};

export const generateEmergencyBroadcast = async (
  language: string,
): Promise<GenerateContentResponse> => {
  if (!ai) {
    throw new Error("API key not configured. Please set your Gemini API key.");
  }

  try {
    const prompt = `Using Google Search for the latest information, act as the Nigerian National Emergency Management Agency (NEMA). Generate one realistic and recent public safety announcement or emergency alert relevant to Nigeria. The alert must be in ${language}. Your response MUST be a single JSON object with three keys: "title" (string), "message" (string), and "severity" (string, which must be one of 'Alert', 'Warning', 'Info'). Do not include any other text or markdown formatting like \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Removed responseMimeType and responseSchema to comply with API rules for tool use.
      },
    });

    return response; // Return the full response to access groundingMetadata
  } catch (error) {
    console.error("Error generating emergency broadcast:", error);
    throw new Error("Failed to generate emergency broadcast.");
  }
};

export const generateChatReply = async (
  chatHistory: string,
  contactName: string,
  language: string,
): Promise<string> => {
  if (!ai) {
    throw new Error("API key not configured. Please set your Gemini API key.");
  }

  try {
    const systemInstruction = `You are simulating a person named '${contactName}' in a private chat during a potential emergency in Nigeria. Your replies should be short, realistic, and in ${language}. Keep the tone appropriate for the contact (e.g., caring for family, formal for community watch).`;
    const prompt = `This is our chat history. The last message was from me. Please reply as ${contactName}.\n\nChat History:\n${chatHistory}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { systemInstruction },
    });

    return response.text || "No reply generated.";
  } catch (error) {
    console.error("Error generating chat reply:", error);
    throw new Error("Failed to generate chat reply.");
  }
};

export const getPersonalizedRecommendations = async (
  location: string,
  level: number,
  performanceStats: object,
  language: string,
): Promise<any> => {
  if (!ai) {
    throw new Error("API key not configured. Please set your Gemini API key.");
  }

  try {
    const prompt = `You are a personalization AI for the NEMA PrepZone app. The user is at Level ${level}, located in ${location}, Nigeria. Their performance stats are: ${JSON.stringify(performanceStats)}. Based on this, generate a JSON object in ${language} with the specified schema.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction:
          "Generate only the JSON object based on the user's profile. Be concise and highly relevant to their context.",
        responseMimeType: "application/json",
        responseSchema: recommendationsSchema,
      },
    });

    let text = response.text?.trim() || "";
    if (text.startsWith("```json")) {
      text = text.substring(7, text.length - 3).trim();
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    throw new Error("Failed to generate personalized recommendations.");
  }
};
