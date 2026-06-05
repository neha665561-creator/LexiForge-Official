import { Clock } from "lucide-react";

import { type OptimizationPayload } from "@/types/optimization";

interface EvaluationsViewProps {
  entries: OptimizationPayload[];
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function scoreTone(score: number): string {
  if (score >= 85) return "text-success";
  if (score >= 70) return "text-primary";
  if (score >= 55) return "text-warning";
  return "text-destructive";
}

export function EvaluationsView({ entries }: EvaluationsViewProps) {
  if (entries.length === 0) {
    return (
      <section className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card p-10 text-center">
        <Clock className="h-6 w-6 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">No evaluations yet</h2>
        <p className="max-w-sm text-xs text-muted-foreground">
          Optimize a prompt from the Workspace tab. Every compiled session is logged here with its
          full metric breakdown.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">Evaluations</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {entries.length} compiled prompt{entries.length === 1 ? "" : "s"} · sorted newest first
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          run_log
        </span>
      </header>

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-elevated/60">
            <tr className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 font-medium">Prompt</th>
              <th className="px-3 py-2 font-medium">Target</th>
              <th className="px-3 py-2 font-medium">Lang</th>
              <th className="px-3 py-2 text-right font-medium">Overall</th>
              <th className="px-3 py-2 text-right font-medium">Clar</th>
              <th className="px-3 py-2 text-right font-medium">Spec</th>
              <th className="px-3 py-2 text-right font-medium">Ctx</th>
              <th className="px-3 py-2 text-right font-medium">Cons</th>
              <th className="px-3 py-2 text-right font-medium">Ex</th>
              <th className="px-3 py-2 font-medium">Conf</th>
              <th className="px-3 py-2 font-medium">When</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => {
              const head = e.rawPrompt.replace(/\s+/g, " ").trim();
              const title = head.length > 64 ? `${head.slice(0, 61)}…` : head;
              return (
                <tr
                  key={e.id}
                  className="border-b border-border/60 last:border-b-0 hover:bg-secondary/40"
                >
                  <td className="px-3 py-2 align-top text-foreground">{title || "—"}</td>
                  <td className="px-3 py-2 align-top font-mono text-[11px] text-muted-foreground">
                    {e.modelTarget.split(" ")[0]}
                  </td>
                  <td className="px-3 py-2 align-top font-mono text-[11px] text-muted-foreground">
                    {e.language}
                  </td>
                  <td className={`px-3 py-2 text-right align-top font-mono font-semibold ${scoreTone(e.overallScore)}`}>
                    {e.overallScore}
                  </td>
                  <td className="px-3 py-2 text-right align-top font-mono text-muted-foreground">
                    {e.metrics.clarity}
                  </td>
                  <td className="px-3 py-2 text-right align-top font-mono text-muted-foreground">
                    {e.metrics.specificity}
                  </td>
                  <td className="px-3 py-2 text-right align-top font-mono text-muted-foreground">
                    {e.metrics.context}
                  </td>
                  <td className="px-3 py-2 text-right align-top font-mono text-muted-foreground">
                    {e.metrics.constraints}
                  </td>
                  <td className="px-3 py-2 text-right align-top font-mono text-muted-foreground">
                    {e.metrics.examples}
                  </td>
                  <td className="px-3 py-2 align-top font-mono text-[11px] text-foreground">
                    {e.confidence}
                  </td>
                  <td className="px-3 py-2 align-top font-mono text-[11px] text-muted-foreground">
                    {fmtDate(e.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
