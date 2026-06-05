import { Check, Clipboard, FileCode } from "lucide-react";
import { useState } from "react";

import type { OptimizationPayload } from "@/types/optimization";

interface ResultPanelProps {
  payload: OptimizationPayload;
}

export function ResultPanel({ payload }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(payload.optimizedPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can be blocked; ignore — non-critical.
    }
  }

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border bg-surface-elevated px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileCode className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            optimized_prompt.md
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/60">
            · {payload.modelTarget.split(" ")[0]} · {payload.language}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-secondary px-2 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-success" />
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <Clipboard className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </header>
      <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap p-5 font-mono text-[12.5px] leading-relaxed text-foreground">
        {payload.optimizedPrompt}
      </pre>
    </section>
  );
}
