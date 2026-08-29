import OpenAI from "openai";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const useGoogle = Boolean(process.env.GOOGLE_API_KEY);
const apiKey = process.env.GOOGLE_API_KEY || process.env.OPENAI_API_KEY;
const defaultGoogleModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const defaultOpenAiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
const modelName = useGoogle ? defaultGoogleModel : defaultOpenAiModel;

const client = new OpenAI({
  apiKey,
  ...(useGoogle ? { baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/" } : {}),
});

export const ResponseSchema = z.object({
  answer: z.string(),
  metadata: z
    .object({ confidence: z.number().min(0).max(1).optional() })
    .optional(),
});

function extractJson(text) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1) throw new Error("No JSON object found in model output");
  const json = text.slice(first, last + 1);
  return json;
}

export async function askChatbot(userPrompt, systemPrompt = "You are a helpful assistant.") {
  const instruction = `Respond ONLY with a single JSON object. Keys:
- answer: string — the assistant's answer text.
- metadata: { confidence: number between 0 and 1 } (optional)

Do NOT include any prose outside the JSON object.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt + "\n\n" + instruction },
  ];

  const res = await client.chat.completions.create({
    model: modelName,
    messages,
    temperature: 0.2,
    max_tokens: 800,
  });

  const raw = res.choices?.[0]?.message?.content ?? res.choices?.[0]?.message ?? "";
  const jsonText = extractJson(raw);
  const parsed = JSON.parse(jsonText);
  return ResponseSchema.parse(parsed);
}
