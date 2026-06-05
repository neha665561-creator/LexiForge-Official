import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Server function: calls the Lovable AI Gateway to compile a raw natural-language
// instruction into a structured prompt + scoring payload. Returns plain DTOs only.

const RequestSchema = z.object({
  rawPrompt: z.string().min(1).max(8000),
  modelTarget: z.string().min(1).max(120),
  language: z.string().min(1).max(60),
});

const SYSTEM_PROMPT = `You are LexiForge — an elite Prompt Engineering compiler used by senior AI engineering teams.

Your job: take a user's RAW natural-language instruction and re-architect it into a production-grade, deterministic prompt optimized for the user's target LLM, and SCORE it across five engineering dimensions.

Hard rules:
- You MUST respond with ONE JSON object only. No prose, no markdown fences, no commentary.
- The "optimizedPrompt" field must itself be a multi-line MARKDOWN string containing these labeled sections in order:
  # Role
  # Objective
  # Context
  # Operating Constraints   (include negative constraints — what the model must NOT do)
  # Output Contract         (numbered list of required output components)
  # Few-shot Anchor         (one short input → output example)
- The optimized prompt must INSTRUCT the model to respond in the user's selected output language. The optimized prompt ITSELF stays in English (it's an engineering artifact); the language directive lives inside its "Operating Constraints".
- Tune the optimized prompt for the named target model's known strengths (system-frame style, structured output, tool-use posture).
- All scores are integers 0–100. "overallScore" must be a weighted blend of the five metrics that you compute yourself; do not just average.

Required JSON shape (no extra keys):
{
  "optimizedPrompt": string,
  "overallScore": number,
  "metrics": {
    "clarity": number,
    "specificity": number,
    "context": number,
    "constraints": number,
    "examples": number
  },
  "confidence": "Low" | "Medium" | "High",
  "learning": {
    "whatChanged": string,
    "whyItWorks": string,
    "tips": string[]
  }
}

"learning.tips" must contain 3 concise, actionable engineering tips (each ≤ 200 chars) that reference the LOWEST-scoring metric explicitly.
"learning.whatChanged" explains the structural transformation in 2–4 sentences.
"learning.whyItWorks" explains in 2–4 sentences why this structure improves faithfulness on the chosen target model.`;

interface AIResponse {
  optimizedPrompt: string;
  overallScore: number;
  metrics: {
    clarity: number;
    specificity: number;
    context: number;
    constraints: number;
    examples: number;
  };
  confidence: "Low" | "Medium" | "High";
  learning: {
    whatChanged: string;
    whyItWorks: string;
    tips: string[];
  };
}

function clamp(n: unknown, fallback = 60): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function normalize(parsed: unknown): AIResponse {
  const p = (parsed ?? {}) as Record<string, unknown>;
  const m = (p.metrics ?? {}) as Record<string, unknown>;
  const l = (p.learning ?? {}) as Record<string, unknown>;
  const tips = Array.isArray(l.tips) ? (l.tips as unknown[]).map((t) => String(t)).slice(0, 6) : [];
  const conf = String(p.confidence ?? "Medium");
  const confidence: "Low" | "Medium" | "High" =
    conf === "Low" || conf === "Medium" || conf === "High" ? conf : "Medium";

  return {
    optimizedPrompt: String(p.optimizedPrompt ?? ""),
    overallScore: clamp(p.overallScore, 70),
    metrics: {
      clarity: clamp(m.clarity),
      specificity: clamp(m.specificity),
      context: clamp(m.context),
      constraints: clamp(m.constraints),
      examples: clamp(m.examples),
    },
    confidence,
    learning: {
      whatChanged: String(l.whatChanged ?? ""),
      whyItWorks: String(l.whyItWorks ?? ""),
      tips,
    },
  };
}

export const optimizePromptFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RequestSchema.parse(data))
  .handler(async ({ data }): Promise<AIResponse> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY is not configured on the server.");
    }

    const userMessage = [
      `TARGET MODEL: ${data.modelTarget}`,
      `OUTPUT LANGUAGE: ${data.language}`,
      ``,
      `RAW PROMPT:`,
      `"""`,
      data.rawPrompt,
      `"""`,
      ``,
      `Compile the raw prompt now. Respond with ONE JSON object matching the required shape.`,
    ].join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) {
      throw new Error("Rate limit exceeded — please wait a moment and retry.");
    }
    if (res.status === 402) {
      throw new Error("AI credits exhausted — add credits to the workspace to continue.");
    }
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("ai gateway error", res.status, text);
      throw new Error(`AI gateway returned ${res.status}.`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content ?? "";

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Tolerate accidental code fences.
      const stripped = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      try {
        parsed = JSON.parse(stripped);
      } catch {
        throw new Error("AI returned non-JSON output. Please retry.");
      }
    }

    return normalize(parsed);
  });
