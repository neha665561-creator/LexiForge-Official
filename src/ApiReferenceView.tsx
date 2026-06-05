import { Check, Copy } from "lucide-react";
import { useState } from "react";

const ENDPOINT = "https://api.lexiforge.dev/v1/optimize";

const CURL_SAMPLE = `curl -X POST ${ENDPOINT} \\
  -H "Authorization: Bearer $LEXIFORGE_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "rawPrompt": "Write a SQL query that finds customers who churned within 30 days of upgrading.",
    "modelTarget": "GPT-4o (OpenAI)",
    "language": "English"
  }'`;

const JS_SAMPLE = `const res = await fetch("${ENDPOINT}", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${process.env.LEXIFORGE_API_KEY}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    rawPrompt: "Summarize this earnings call into 5 bullets with risk flags.",
    modelTarget: "Claude 3.5 Sonnet (Anthropic)",
    language: "English",
  }),
});

const payload = await res.json();
// payload.optimizedPrompt, payload.overallScore, payload.metrics, ...`;

const RESPONSE_SAMPLE = `{
  "id": "opt_lq8a2x_4f7d1c",
  "optimizedPrompt": "# Role\\nYou are an expert SQL engineer...\\n\\n# Objective\\n...",
  "overallScore": 87,
  "metrics": {
    "clarity": 88,
    "specificity": 91,
    "context": 82,
    "constraints": 86,
    "examples": 84
  },
  "confidence": "High",
  "learning": {
    "whatChanged": "Re-scoped the request into a Role / Objective / Constraints / Contract frame.",
    "whyItWorks": "Splitting the system frame reduces variance and improves faithfulness on GPT-4o.",
    "tips": [
      "Pin success criteria — replace vague verbs with measurable acceptance checks.",
      "Add a few-shot anchor that mirrors your real input shape.",
      "Ask the model to self-grade against the contract before finalizing."
    ]
  },
  "createdAt": "2026-06-05T14:22:08.310Z"
}`;

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // noop
    }
  }

  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border bg-surface-elevated/60 px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function ApiReferenceView() {
  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border border-border bg-card p-5">
        <header className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              POST /v1/optimize
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Hypothetical reference for the LexiForge Compile API. Submit a raw prompt; receive a
              structured AI prompt, metric breakdown, and learning rationale.
            </p>
          </div>
          <span className="rounded-md border border-border bg-surface-elevated px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
            stable
          </span>
        </header>

        <dl className="mt-4 grid grid-cols-1 gap-3 text-[11px] sm:grid-cols-3">
          <div>
            <dt className="font-mono text-muted-foreground">endpoint</dt>
            <dd className="mt-0.5 font-mono text-foreground">{ENDPOINT}</dd>
          </div>
          <div>
            <dt className="font-mono text-muted-foreground">auth</dt>
            <dd className="mt-0.5 font-mono text-foreground">Bearer token</dd>
          </div>
          <div>
            <dt className="font-mono text-muted-foreground">content-type</dt>
            <dd className="mt-0.5 font-mono text-foreground">application/json</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Request body
        </h3>
        <div className="mt-3 overflow-hidden rounded-md border border-border">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface-elevated/60">
              <tr className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-3 py-2 font-medium">Field</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/60">
                <td className="px-3 py-2 font-mono text-foreground">rawPrompt</td>
                <td className="px-3 py-2 font-mono text-muted-foreground">string</td>
                <td className="px-3 py-2 text-muted-foreground">
                  Natural-language instruction (≤ 4,000 chars).
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <td className="px-3 py-2 font-mono text-foreground">modelTarget</td>
                <td className="px-3 py-2 font-mono text-muted-foreground">string</td>
                <td className="px-3 py-2 text-muted-foreground">
                  e.g. <span className="font-mono text-foreground">GPT-4o (OpenAI)</span>,{" "}
                  <span className="font-mono text-foreground">Claude 3.5 Sonnet (Anthropic)</span>.
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-mono text-foreground">language</td>
                <td className="px-3 py-2 font-mono text-muted-foreground">string</td>
                <td className="px-3 py-2 text-muted-foreground">
                  Output language directive (English, Spanish, Mandarin, Arabic, …).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Examples
        </h3>
        <div className="mt-3 flex flex-col gap-3">
          <CodeBlock language="bash · curl" code={CURL_SAMPLE} />
          <CodeBlock language="typescript" code={JS_SAMPLE} />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          200 OK · response
        </h3>
        <div className="mt-3">
          <CodeBlock language="json" code={RESPONSE_SAMPLE} />
        </div>
      </section>
    </div>
  );
}
