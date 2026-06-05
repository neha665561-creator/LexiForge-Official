import { Clock, History, Trash2 } from "lucide-react";

import { deriveSessionTitle } from "@/services/optimizationEngine";
import type { OptimizationPayload } from "@/types/optimization";

interface HistorySidebarProps {
  entries: OptimizationPayload[];
  activeId: string | null;
  onSelect: (entry: OptimizationPayload) => void;
  onClear: () => void;
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function HistorySidebar({ entries, activeId, onSelect, onClear }: HistorySidebarProps) {
  return (
    <aside className="flex h-full flex-col rounded-lg border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <History className="h-3.5 w-3.5 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-wider">Session history</h2>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={entries.length === 0}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-30"
          aria-label="Clear history"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-2">
        {entries.length === 0 ? (
          <p className="px-3 py-6 text-center text-[11px] leading-relaxed text-muted-foreground">
            Past runs appear here. Click any session to reload its payload.
          </p>
        ) : (
          <ul className="space-y-1">
            {entries.map((entry) => {
              const isActive = entry.id === activeId;
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(entry)}
                    className={`flex w-full flex-col gap-1 rounded-md border px-3 py-2.5 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
                      isActive
                        ? "border-primary/40 bg-primary/10"
                        : "border-transparent hover:border-border hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="line-clamp-1 text-[12.5px] font-medium text-foreground">
                        {deriveSessionTitle(entry.rawPrompt)}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] tabular-nums text-primary">
                        {entry.overallScore}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{formatRelative(entry.createdAt)}</span>
                      <span>·</span>
                      <span>{entry.modelTarget.split(" ")[0]}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
