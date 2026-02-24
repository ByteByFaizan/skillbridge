import { CareerReportSchema, type CareerReport, type CareerInput } from "@/utils/validators";
import {
  SYSTEM_PROMPT,
  DEVELOPER_PROMPT,
  buildUserPrompt,
  buildRepairPrompt,
} from "./prompts";

/* ═══════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════ */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 60_000; // 60s timeout for AI calls

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("Missing OPENROUTER_API_KEY env var");
  return key;
}

function getModel(): string {
  return process.env.OPENROUTER_MODEL ?? "openai/gpt-4.1";
}

/* ═══════════════════════════════════════════════════════
   MAIN CALL
   ═══════════════════════════════════════════════════════ */

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function callOpenRouter(messages: OpenRouterMessage[]): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Best practice: use AbortController to prevent indefinite hangs
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
        "HTTP-Referer": appUrl,
        "X-Title": "SkillBridge",
      },
      body: JSON.stringify({
        model: getModel(),
        messages,
        temperature: 0.7,
        max_tokens: 2500,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`OpenRouter API error ${res.status}: ${text.slice(0, 200)}`);
    }

    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenRouter returned an empty response");
    }
    return content.trim();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(`OpenRouter request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

/* ═══════════════════════════════════════════════════════
   PARSE + VALIDATE
   ═══════════════════════════════════════════════════════ */

function parseAndValidate(raw: string): {
  success: true;
  data: CareerReport;
} | {
  success: false;
  error: string;
  raw: string;
} {
  // Strip potential markdown fences
  let cleaned = raw;
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return { success: false, error: "Response is not valid JSON", raw: cleaned };
  }

  const result = CareerReportSchema.safeParse(parsed);
  if (result.success) {
    return { success: true, data: result.data as CareerReport };
  }

  // Build a human-readable error from zod issues
  const errMsg = result.error?.issues
    ? result.error.issues
        .map((i: { path?: unknown[]; message?: string }) =>
          `${(i.path ?? []).join(".")}: ${i.message}`
        )
        .join("; ")
    : "Schema validation failed";
  return { success: false, error: errMsg, raw: cleaned };
}

/* ═══════════════════════════════════════════════════════
   PUBLIC: generateCareerReport
   ═══════════════════════════════════════════════════════ */

export async function generateCareerReport(
  input: CareerInput
): Promise<CareerReport> {
  const messages: OpenRouterMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "system", content: DEVELOPER_PROMPT },
    { role: "user", content: buildUserPrompt(input) },
  ];

  // First attempt
  const rawFirst = await callOpenRouter(messages);
  const firstResult = parseAndValidate(rawFirst);
  if (firstResult.success) return firstResult.data;

  // Repair retry (one chance)
  const repairMsg = buildRepairPrompt(firstResult.raw, firstResult.error);
  messages.push({ role: "assistant", content: rawFirst });
  messages.push({ role: "user", content: repairMsg });

  const rawSecond = await callOpenRouter(messages);
  const secondResult = parseAndValidate(rawSecond);
  if (secondResult.success) return secondResult.data;

  throw new Error(
    `AI output failed validation after repair attempt: ${secondResult.error}`
  );
}
