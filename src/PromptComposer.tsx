import { Loader2, Sparkles } from "lucide-react";

import {
  PROMPT_MAX_LENGTH,
  SUPPORTED_LANGUAGES,
  TARGET_MODELS,
  type SupportedLanguage,
  type TargetModel,
} from "@/types/optimization";

interface PromptComposerProps {
  rawPrompt: string;
  onRawPromptChange: (value: string) => void;
  modelTarget: TargetModel;
  onModelTargetChange: (value: TargetModel) => void;
  language: SupportedLanguage;
  onLanguageChange: (value: SupportedLanguage) => void;
  onOptimize: () => void;
  isLoading: boolean;
}

export function PromptComposer({
  rawPrompt,
  onRawPromptChange,
  modelTarget,
  onModelTargetChange,
  language,
  onLanguageChange,
  onOptimize,
  isLoading,
}: PromptComposerProps) {
  const charCount = rawPrompt.length;
  const overLimit = charCount > PROMPT_MAX_LENGTH;
  const disabled = isLoading || rawPrompt.trim().length === 0 || overLimit;

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Composer</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Draft the natural-language instruction. The optimizer compiles it to a Structured AI Prompt.
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          step.01
        </span>
      </header>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="raw-prompt"
            className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            raw_prompt
          </label>
          <span
            className={`font-mono text-[10px] ${
              overLimit ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {charCount.toLocaleString()} / {PROMPT_MAX_LENGTH.toLocaleString()}
          </span>
        </div>
        <textarea
          id="raw-prompt"
          value={rawPrompt}
          onChange={(event) => onRawPromptChange(event.target.value)}
          placeholder="Describe what the model should do. E.g. 'Write a SQL query that finds customers who churned within 30 days of upgrading.'"
          spellCheck={false}
          className="min-h-44 w-full resize-y rounded-md border border-border bg-input px-3 py-2.5 font-mono text-[13px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="model-target"
            className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            target_model
          </label>
          <select
            id="model-target"
            value={modelTarget}
            onChange={(event) => onModelTargetChange(event.target.value as TargetModel)}
            className="h-9 rounded-md border border-border bg-input px-2.5 text-xs text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            {TARGET_MODELS.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="output-language"
            className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            output_language
          </label>
          <select
            id="output-language"
            value={language}
            onChange={(event) => onLanguageChange(event.target.value as SupportedLanguage)}
            className="h-9 rounded-md border border-border bg-input px-2.5 text-xs text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        <p className="font-mono text-[10px] text-muted-foreground">
          {disabled && !isLoading ? "↳ enter a prompt to optimize" : "↳ ready to compile"}
        </p>
        <button
          type="button"
          onClick={onOptimize}
          disabled={disabled}
          aria-busy={isLoading}
          className="relative inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span
            className={`flex items-center gap-2 transition-opacity ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Optimize prompt
          </span>
          {isLoading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
            </span>
          )}
        </button>
      </div>
    </section>
  );
}
