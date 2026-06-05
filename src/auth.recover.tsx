import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AuthField, AuthShell } from "@/components/auth/AuthShell";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth/recover")({
  head: () => ({
    meta: [
      { title: "Recover access — LexiForge" },
      { name: "description", content: "Recover access to your LexiForge workspace." },
    ],
  }),
  component: RecoverRoute,
});

function RecoverRoute() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    toast.success("Recovery email dispatched", {
      description: "If an account exists, instructions are on their way.",
    });
  }

  return (
    <>
      <AuthShell
        title="Recover session"
        subtitle="We'll send a one-time recovery link to your email."
        footer={
          <>
            Remembered it?{" "}
            <Link to="/auth/signin" className="font-medium text-primary hover:underline">
              Back to sign in
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
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send recovery link"}
          </button>
        </form>
      </AuthShell>
      <Toaster />
    </>
  );
}
