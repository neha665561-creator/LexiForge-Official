import { Terminal } from "lucide-react";

export function EmptyResultState() {
  return (
    <section className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 p-10 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-surface-elevated">
        <Terminal className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold tracking-tight">No compilation yet</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-muted-foreground">
        Draft an instruction in the composer and run <span className="font-mono text-foreground">Optimize prompt</span>.
        Results, metrics, and rationale will surface here.
      </p>
      <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span className="h-px w-6 bg-border" />
        awaiting input
        <span className="h-px w-6 bg-border" />
      </div>
    </section>
  );
}
