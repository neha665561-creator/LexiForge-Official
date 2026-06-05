import { Activity, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { Link } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type WorkspaceTab = "workspace" | "evaluations" | "api";

interface TopNavProps {
  connectionStatus?: "online" | "degraded" | "offline";
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
}

const TABS: ReadonlyArray<{ id: WorkspaceTab; label: string }> = [
  { id: "workspace", label: "Workspace" },
  { id: "evaluations", label: "Evaluations" },
  { id: "api", label: "API Reference" },
];

export function TopNav({ connectionStatus = "online", activeTab, onTabChange }: TopNavProps) {
  const statusLabel =
    connectionStatus === "online"
      ? "Inference online"
      : connectionStatus === "degraded"
        ? "Degraded"
        : "Offline";
  const statusDot =
    connectionStatus === "online"
      ? "bg-success"
      : connectionStatus === "degraded"
        ? "bg-warning"
        : "bg-destructive";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface/80 px-6 backdrop-blur">
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => onTabChange("workspace")}
          className="flex items-center gap-2.5 focus:outline-none"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="font-mono text-[13px] font-bold">Lx</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight">LexiForge</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              v0.1.0
            </span>
          </div>
        </button>

        <nav className="hidden items-center gap-1 md:flex" role="tablist">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabChange(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-border bg-surface-elevated px-2.5 py-1 sm:flex">
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full ${statusDot} opacity-60`}
            />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${statusDot}`} />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {statusLabel}
          </span>
          <Activity className="h-3 w-3 text-muted-foreground" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md border border-border bg-surface-elevated px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary/15 font-mono text-[11px] font-semibold text-primary">
              DV
            </div>
            <span className="hidden sm:inline">dev@lexiforge</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Signed in (preview)
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/auth/signin" className="flex items-center gap-2">
                <User className="h-3.5 w-3.5" /> Sign in
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/auth/signup" className="flex items-center gap-2">
                <Settings className="h-3.5 w-3.5" /> Create account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/auth/recover" className="flex items-center gap-2 text-muted-foreground">
                <LogOut className="h-3.5 w-3.5" /> Recover session
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
