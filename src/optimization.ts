// Domain types for the LexiForge optimization pipeline.

export type ConfidenceLevel = "Low" | "Medium" | "High";

export type TargetModel =
  | "GPT-4o (OpenAI)"
  | "GPT-4-Turbo"
  | "Claude 3.5 Sonnet (Anthropic)"
  | "Claude 3 Opus"
  | "Gemini 1.5 Pro (Google)"
  | "Llama 3 (Meta)"
  | "DeepSeek-V3"
  | "Mistral Large";

export type SupportedLanguage =
  | "English"
  | "Hindi"
  | "Spanish"
  | "French"
  | "German"
  | "Mandarin"
  | "Japanese"
  | "Arabic"
  | "Russian"
  | "Portuguese";

export interface MetricBreakdown {
  clarity: number;
  specificity: number;
  context: number;
  constraints: number;
  examples: number;
}

export interface LearningData {
  whatChanged: string;
  whyItWorks: string;
  tips: string[];
}

export interface OptimizationPayload {
  id: string;
  rawPrompt: string;
  optimizedPrompt: string;
  modelTarget: TargetModel;
  language: SupportedLanguage;
  overallScore: number;
  metrics: MetricBreakdown;
  confidence: ConfidenceLevel;
  learning: LearningData;
  createdAt: string;
}

export interface FeedbackRecord {
  payloadId: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

export const TARGET_MODELS: readonly TargetModel[] = [
  "GPT-4o (OpenAI)",
  "GPT-4-Turbo",
  "Claude 3.5 Sonnet (Anthropic)",
  "Claude 3 Opus",
  "Gemini 1.5 Pro (Google)",
  "Llama 3 (Meta)",
  "DeepSeek-V3",
  "Mistral Large",
] as const;

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Japanese",
  "Arabic",
  "Russian",
  "Portuguese",
] as const;

export const PROMPT_MAX_LENGTH = 4000;
