import OpenAI from "openai";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const useGoogle = Boolean(process.env.GOOGLE_API_KEY);
const apiKey = process.env.GOOGLE_API_KEY || process.env.OPENAI_API_KEY;
const defaultModel = useGoogle ? "gemini-2.0-flash" : "gpt-4o-mini";
const modelName = process.env.OPENAI_MODEL || defaultModel;

const client = new OpenAI({
  apiKey,
  ...(useGoogle ? { baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/" } : {}),
});

export const JudgeSchema = z.object({
  score: z.number().min(0).max(1),
  verdict: z.enum(["pass", "fail"]),
  reason: z.string(),
});

function extractJson(text) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1) throw new Error("No JSON object found in judge output");
  return text.slice(first, last + 1);
}

export async function judgePair(expected, actualAnswer) {
  const prompt = `You are a strict but fair evaluation judge. Given an expected answer and an actual assistant answer, score the assistant from 0.0 to 1.0 where 1.0 is perfect. Provide ONLY a JSON object matching: {"score": number, "verdict": "pass"|"fail", "reason": string}.

Expected:\n${expected}\n\nActual:\n${actualAnswer}\n\nPass threshold: 0.8 -> pass.

Be concise and focus on correctness, factuality, and relevance.`;

  const res = await client.chat.completions.create({
    model: modelName,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.0,
    max_tokens: 400,
  });

  const raw = res.choices?.[0]?.message?.content ?? "";
  const jsonText = extractJson(raw);
  const parsed = JSON.parse(jsonText);
  return JudgeSchema.parse(parsed);
}
