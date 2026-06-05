import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AuthField, AuthShell } from "@/components/auth/AuthShell";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Create account — LexiForge" },
      { name: "description", content: "Provision a new LexiForge workspace." },
    ],
  }),
  component: SignUpRoute,
});

function SignUpRoute() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    toast.info("Account provisioning not yet enabled", {
      description: "Connect Lovable Cloud to enable Supabase signup.",
    });
  }

  return (
    <>
      <AuthShell
        title="Create account"
        subtitle="Provision a new workspace and start optimizing prompts."
        footer={
          <>
            Already have an account?{" "}
            <Link to="/auth/signin" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AuthField
            id="name"
            label="full_name"
            placeholder="Ada Lovelace"
            autoComplete="name"
          />
          <AuthField
            id="email"
            label="work_email"
            type="email"
            placeholder="you@company.dev"
            autoComplete="email"
          />
          <AuthField
            id="password"
            label="password"
            type="password"
            placeholder="Min. 12 characters"
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60"
          >
            {submitting ? "Provisioning…" : "Create account"}
          </button>
          <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
            By continuing you agree to the{" "}
            <a href="#" className="underline hover:text-foreground">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-foreground">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </AuthShell>
      <Toaster />
    </>
  );
}
