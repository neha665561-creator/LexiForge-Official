import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AuthField, AuthShell } from "@/components/auth/AuthShell";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — LexiForge" },
      { name: "description", content: "Sign in to your LexiForge workspace." },
    ],
  }),
  component: SignInRoute,
});

function SignInRoute() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    // Auth wiring point — replace with `supabase.auth.signInWithPassword(...)`.
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    toast.info("Authentication not yet provisioned", {
      description: "Connect Lovable Cloud to activate Supabase Auth.",
    });
  }

  return (
    <>
      <AuthShell
        title="Sign in"
        subtitle="Access your prompt optimization workspace."
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link to="/auth/signup" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthField
            id="email"
            label="email"
            type="email"
            placeholder="you@company.dev"
            autoComplete="email"
          />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
              >
                password
              </label>
              <Link
                to="/auth/recover"
                className="font-mono text-[10px] uppercase tracking-wider text-primary hover:underline"
              >
                recover
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-10 rounded-md border border-border bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60"
          >
            {submitting ? "Authenticating…" : "Sign in"}
          </button>
        </form>
      </AuthShell>
      <Toaster />
    </>
  );
}
