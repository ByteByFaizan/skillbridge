"use server";

import { getEnv, getOptionalEnv } from "@/lib/env";

/**
 * OpenRouter API client for SkillBridge career analysis.
 * Uses GPT-4 or compatible model (Tech Stack: GPT-5.2 when available; fallback to openai/gpt-4o).
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "openai/gpt-4o"; // Use gpt-4o; replace with gpt-5.2 when available on OpenRouter

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: { content: string };
    finish_reason: string;
  }>;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2
): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || res.status === 400 || res.status === 401) {
        return res;
      }
      if (i < retries && (res.status === 429 || res.status >= 500)) {
        const delay = Math.min(1000 * Math.pow(2, i), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return res;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Max retries reached");
}

export async function chat(
  messages: OpenRouterMessage[],
  options?: { model?: string; maxTokens?: number }
): Promise<string> {
  const apiKey = getEnv("OPENROUTER_API_KEY");

  const res = await fetchWithRetry(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": getOptionalEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
    },
    body: JSON.stringify({
      model: options?.model ?? DEFAULT_MODEL,
      messages,
      max_tokens: options?.maxTokens ?? 3000, // Keep under free-tier limit (~3592); increase after adding credits at openrouter.ai/settings/credits
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    if (res.status === 401) {
      throw new Error("Invalid API key. Please check your OpenRouter configuration.");
    }
    if (res.status === 429) {
      throw new Error("Rate limited by OpenRouter. Please try again in a moment.");
    }
    throw new Error(`OpenRouter API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as OpenRouterResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from OpenRouter");
  }
  return content;
}
