import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;

export function SupabaseFallbackNotice() {
  const connected = Boolean(SUPABASE_URL && SUPABASE_URL.length > 0);
  if (connected) return null;
  return (
    <div
      role="alert"
      className="mb-5 flex items-start gap-2.5 rounded-md border border-warning/40 bg-warning/10 px-3 py-2.5 text-[11px] leading-relaxed"
    >
      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
      <div className="text-muted-foreground">
        <span className="font-medium text-foreground">Authentication is in preview mode.</span>{" "}
        Please connect Supabase via the Lovable Integrations tab to enable persistent cloud saving.
        You can keep using the workspace — sessions are stored locally in the meantime.
      </div>
    </div>
  );
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Marketing / brand panel */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-surface p-10 lg:flex">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="font-mono text-sm font-bold">Lx</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">LexiForge</span>
          </Link>
        </div>
        <div className="relative space-y-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
            language and expression refinement
          </p>
          <h2 className="text-2xl font-semibold leading-tight tracking-tight">
            Compile natural language into measurable AI instructions.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            LexiForge gives engineering teams a deterministic prompt pipeline — typed payloads,
            explainable rationale, and quality metrics you can wire into CI.
          </p>
        </div>
        <div className="relative font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          © 2026 LexiForge Labs · v0.1.0
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:mb-10">
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 lg:hidden"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <span className="font-mono text-xs font-bold">Lx</span>
              </div>
              <span className="text-sm font-semibold tracking-tight">LexiForge</span>
            </Link>
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <SupabaseFallbackNotice />
          {children}
          <div className="mt-6 text-center text-xs text-muted-foreground">{footer}</div>
        </div>
      </main>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

export function AuthField({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  required = true,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="h-10 rounded-md border border-border bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      />
    </div>
  );
}
