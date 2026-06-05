import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

import { ApiReferenceView } from "@/components/workspace/ApiReferenceView";
import { EmptyResultState } from "@/components/workspace/EmptyResultState";
import { EvaluationsView } from "@/components/workspace/EvaluationsView";
import { FeedbackPanel } from "@/components/workspace/FeedbackPanel";
import { HistorySidebar } from "@/components/workspace/HistorySidebar";
import { LearningAccordion } from "@/components/workspace/LearningAccordion";
import { MetricsPanel } from "@/components/workspace/MetricsPanel";
import { PromptComposer } from "@/components/workspace/PromptComposer";
import { ResultPanel } from "@/components/workspace/ResultPanel";
import { TopNav, type WorkspaceTab } from "@/components/workspace/TopNav";
import { Toaster } from "@/components/ui/sonner";
import { loadHistory, persistHistory } from "@/lib/history-store";
import { optimizePrompt } from "@/services/optimizationEngine";
import {
  type FeedbackRecord,
  type OptimizationPayload,
  type SupportedLanguage,
  type TargetModel,
} from "@/types/optimization";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LexiForge — Prompt Optimization Workspace" },
      {
        name: "description",
        content:
          "LexiForge compiles natural-language instructions into optimized, measurable AI prompts with metric breakdowns and rationale.",
      },
      { property: "og:title", content: "LexiForge — Prompt Optimization Workspace" },
      {
        property: "og:description",
        content:
          "Engineering-first platform that transforms raw prompts into structured, model-tuned instructions with quality analytics.",
      },
    ],
  }),
  component: WorkspaceRoute,
});

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_DISMISS_KEY = "lexiforge.supabase-banner-dismissed";

function WorkspaceRoute() {
  const [rawPrompt, setRawPrompt] = useState("");
  const [modelTarget, setModelTarget] = useState<TargetModel>("GPT-4o (OpenAI)");
  const [language, setLanguage] = useState<SupportedLanguage>("English");
  const [isLoading, setIsLoading] = useState(false);
  const [activePayload, setActivePayload] = useState<OptimizationPayload | null>(null);
  const [history, setHistory] = useState<OptimizationPayload[]>([]);
  const [feedback, setFeedback] = useState<Record<string, FeedbackRecord>>({});
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("workspace");
  const [supabaseBannerDismissed, setSupabaseBannerDismissed] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
    try {
      setSupabaseBannerDismissed(
        typeof window !== "undefined" &&
          window.localStorage.getItem(SUPABASE_DISMISS_KEY) === "1",
      );
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    persistHistory(history);
  }, [history]);

  const handleOptimize = useCallback(async () => {
    if (rawPrompt.trim().length === 0 || isLoading) return;
    setIsLoading(true);
    try {
      const payload = await optimizePrompt({ rawPrompt, modelTarget, language });
      setActivePayload(payload);
      setHistory((prev) => [payload, ...prev.filter((entry) => entry.id !== payload.id)]);
      toast.success("Prompt compiled", {
        description: `Composite score ${payload.overallScore}/100 · ${payload.confidence} confidence`,
      });
    } catch (error) {
      console.error("optimizePrompt failed", error);
      const message =
        error instanceof Error ? error.message : "The compiler returned an unexpected error.";
      toast.error("Optimization failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  }, [rawPrompt, modelTarget, language, isLoading]);

  const handleSelectHistory = useCallback((entry: OptimizationPayload) => {
    setActivePayload(entry);
    setRawPrompt(entry.rawPrompt);
    setModelTarget(entry.modelTarget);
    setLanguage(entry.language);
    setActiveTab("workspace");
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setActivePayload(null);
  }, []);

  const handleFeedback = useCallback((record: FeedbackRecord) => {
    setFeedback((prev) => ({ ...prev, [record.payloadId]: record }));
    toast.success("Evaluation submitted", {
      description: `Rating ${record.rating}/5 captured locally.`,
    });
  }, []);

  const dismissSupabaseBanner = useCallback(() => {
    setSupabaseBannerDismissed(true);
    try {
      window.localStorage.setItem(SUPABASE_DISMISS_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  const hasResult = activePayload !== null;
  const activeFeedback = useMemo(
    () => (activePayload ? feedback[activePayload.id] : undefined),
    [activePayload, feedback],
  );

  const supabaseConnected = Boolean(SUPABASE_URL && SUPABASE_URL.length > 0);
  const showSupabaseBanner = !supabaseConnected && !supabaseBannerDismissed;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        {showSupabaseBanner && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 px-4 py-3"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <div className="flex-1 text-xs leading-relaxed">
              <p className="font-medium text-foreground">
                Cloud persistence is not enabled for this workspace.
              </p>
              <p className="mt-0.5 text-muted-foreground">
                Please connect Supabase via the Lovable Integrations tab to enable persistent cloud
                saving. Your sessions are being stored in local storage in the meantime — fully
                functional, but scoped to this browser.
              </p>
            </div>
            <button
              type="button"
              onClick={dismissSupabaseBanner}
              aria-label="Dismiss"
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {activeTab === "workspace" && (
          <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,460px)_minmax(0,1fr)]">
            <div className="order-3 xl:order-1">
              <HistorySidebar
                entries={history}
                activeId={activePayload?.id ?? null}
                onSelect={handleSelectHistory}
                onClear={handleClearHistory}
              />
            </div>

            <div className="order-1 flex flex-col gap-4 xl:order-2">
              <PromptComposer
                rawPrompt={rawPrompt}
                onRawPromptChange={setRawPrompt}
                modelTarget={modelTarget}
                onModelTargetChange={setModelTarget}
                language={language}
                onLanguageChange={setLanguage}
                onOptimize={handleOptimize}
                isLoading={isLoading}
              />

              <section className="rounded-lg border border-border bg-card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pipeline status
                </h3>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <dt className="font-mono text-muted-foreground">target</dt>
                    <dd className="mt-0.5 font-mono text-foreground">
                      {modelTarget.split(" ")[0]}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-muted-foreground">locale</dt>
                    <dd className="mt-0.5 font-mono text-foreground">{language}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-muted-foreground">runs</dt>
                    <dd className="mt-0.5 font-mono text-foreground">{history.length}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-muted-foreground">last_score</dt>
                    <dd className="mt-0.5 font-mono text-primary">
                      {history[0]?.overallScore ?? "—"}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

            <div className="order-2 flex flex-col gap-4 xl:order-3">
              {hasResult && activePayload ? (
                <>
                  <ResultPanel payload={activePayload} />
                  <MetricsPanel
                    overallScore={activePayload.overallScore}
                    metrics={activePayload.metrics}
                    confidence={activePayload.confidence}
                  />
                  <LearningAccordion learning={activePayload.learning} />
                  {!activeFeedback && (
                    <FeedbackPanel payloadId={activePayload.id} onSubmit={handleFeedback} />
                  )}
                </>
              ) : (
                <EmptyResultState />
              )}
            </div>
          </div>
        )}

        {activeTab === "evaluations" && <EvaluationsView entries={history} />}

        {activeTab === "api" && <ApiReferenceView />}
      </main>

      <Toaster />
    </div>
  );
}
