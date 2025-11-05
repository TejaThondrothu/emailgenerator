
import { GoogleGenAI } from "@google/genai";
import { EmailTone } from '../types';

export const generateEmail = async (content: string, tone: EmailTone): Promise<string> => {
  if (!content.trim()) {
    throw new Error("Content cannot be empty.");
  }
  // FIX: Use `process.env.API_KEY` as per guidelines, which also resolves the TypeScript error.
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash';

  const prompt = `
You are an expert email writer. Your task is to transform the provided content into a well-structured email.

**Instructions:**
1.  **Analyze the Content:** Read the provided content carefully to understand its main points, purpose, and key information.
2.  **Determine Email Type:** Based on the content, decide the most appropriate email format (e.g., announcement, summary, follow-up, request).
3.  **Set the Tone:** The email's tone must be **${tone}**.
4.  **Generate a Subject Line:** Create a clear, concise, and engaging subject line. Prefix the subject line with "Subject: ".
5.  **Write the Body:** Compose the email body. It should be easy to read, well-organized, and effectively convey the information from the original content. Use paragraphs and bullet points where appropriate.
6.  **Add a Closing:** Include a suitable closing (e.g., "Best regards," "Thanks,").
7.  **Format:** The final output must be only the full email text, starting with the subject line. Do not include any extra explanations, markdown formatting like \`\`\`, or preamble before the email content. Just the raw text of the email.

**Content to transform:**
---
${content}
---
`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
  });

  return response.text;
};

export const translateText = async (text: string, language: string): Promise<string> => {
    if (!text.trim()) {
        throw new Error("Text to translate cannot be empty.");
    }
    // FIX: Use `process.env.API_KEY` as per guidelines, which also resolves the TypeScript error.
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured. Please set the API_KEY environment variable.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash';

    const prompt = `Translate the following English text to ${language}. Provide only the translation. If the input starts with "Subject: ", the output must also start with "Subject: " followed by the translated subject line.

---
${text}
---
`;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });

    return response.text;
};
