// Service layer for prompt optimization.
// Calls the LexiForge server function which proxies to the Lovable AI Gateway.

import { optimizePromptFn } from "@/lib/optimize.functions";
import {
  type OptimizationPayload,
  type SupportedLanguage,
  type TargetModel,
} from "@/types/optimization";

export interface OptimizeRequest {
  rawPrompt: string;
  modelTarget: TargetModel;
  language: SupportedLanguage;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `opt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function optimizePrompt(req: OptimizeRequest): Promise<OptimizationPayload> {
  const ai = await optimizePromptFn({ data: req });

  return {
    id: generateId(),
    rawPrompt: req.rawPrompt,
    optimizedPrompt: ai.optimizedPrompt,
    modelTarget: req.modelTarget,
    language: req.language,
    overallScore: ai.overallScore,
    metrics: ai.metrics,
    confidence: ai.confidence,
    learning: ai.learning,
    createdAt: new Date().toISOString(),
  };
}

export function deriveSessionTitle(rawPrompt: string): string {
  const cleaned = rawPrompt.trim().replace(/\s+/g, " ");
  if (cleaned.length === 0) return "Untitled session";
  const head = cleaned.split(/[.!?\n]/)[0] ?? cleaned;
  return head.length > 56 ? `${head.slice(0, 53)}…` : head;
}
