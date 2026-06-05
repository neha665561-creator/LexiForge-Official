import type { ConfidenceLevel, MetricBreakdown } from "@/types/optimization";
import { ScoreRing } from "./ScoreRing";

interface MetricsPanelProps {
  overallScore: number;
  metrics: MetricBreakdown;
  confidence: ConfidenceLevel;
}

const METRIC_ORDER: Array<{ key: keyof MetricBreakdown; label: string }> = [
  { key: "clarity", label: "Clarity" },
  { key: "specificity", label: "Specificity" },
  { key: "context", label: "Context" },
  { key: "constraints", label: "Constraints" },
  { key: "examples", label: "Examples" },
];

function confidenceClasses(level: ConfidenceLevel): string {
  switch (level) {
    case "High":
      return "border-success/40 bg-success/10 text-success";
    case "Medium":
      return "border-warning/40 bg-warning/10 text-warning";
    case "Low":
      return "border-destructive/40 bg-destructive/10 text-destructive";
  }
}

export function MetricsPanel({ overallScore, metrics, confidence }: MetricsPanelProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Quality analytics</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Weighted across five dimensions of prompt engineering hygiene.
          </p>
        </div>
        <span
          className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${confidenceClasses(confidence)}`}
        >
          confidence · {confidence}
        </span>
      </header>

      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex shrink-0 items-center gap-4">
          <ScoreRing score={overallScore} />
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              composite_score
            </span>
            <span className="font-mono text-2xl font-bold tabular-nums">
              {overallScore}
              <span className="text-base font-normal text-muted-foreground">/100</span>
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5 md:border-l md:border-border md:pl-5">
          {METRIC_ORDER.map(({ key, label }) => {
            const value = metrics[key];
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground">{label}</span>
                  <span className="font-mono text-[11px] tabular-nums text-foreground">{value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                    style={{ width: `${value}%` }}
                    role="progressbar"
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={label}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
