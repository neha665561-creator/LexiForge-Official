import { Check, Star } from "lucide-react";
import { useState } from "react";

import type { FeedbackRecord } from "@/types/optimization";

interface FeedbackPanelProps {
  payloadId: string;
  onSubmit: (record: FeedbackRecord) => void;
}

export function FeedbackPanel({ payloadId, onSubmit }: FeedbackPanelProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const active = hover || rating;

  function handleSubmit() {
    if (rating === 0) return;
    onSubmit({
      payloadId,
      rating,
      comment: comment.trim(),
      submittedAt: new Date().toISOString(),
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="flex items-center gap-3 rounded-lg border border-success/40 bg-success/10 px-5 py-4">
        <Check className="h-4 w-4 text-success" />
        <div>
          <p className="text-xs font-semibold text-success">Feedback recorded</p>
          <p className="font-mono text-[10px] text-success/80">
            payload={payloadId.slice(0, 8)} · rating={rating}/5
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">Evaluate output</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Your rating feeds the model evaluation harness.
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          rlhf.signal
        </span>
      </header>

      <div className="mb-3 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(value)}
            aria-label={`${value} of 5 stars`}
            className="rounded p-1 transition-transform focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            <Star
              className={`h-5 w-5 transition-colors ${
                value <= active
                  ? "fill-primary text-primary"
                  : "fill-transparent text-muted-foreground/40"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 font-mono text-[11px] tabular-nums text-muted-foreground">
          {rating > 0 ? `${rating}/5` : "—"}
        </span>
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Optional: what worked, what's missing, what to try next…"
        rows={3}
        className="w-full resize-y rounded-md border border-border bg-input px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      />

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={rating === 0}
          className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit evaluation
        </button>
      </div>
    </section>
  );
}
