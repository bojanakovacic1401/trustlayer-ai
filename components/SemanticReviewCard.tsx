import { BrainCircuit, CheckCircle2, CircleAlert } from "lucide-react";
import type { SemanticSecurityReview } from "@/lib/types";

type SemanticReviewCardProps = {
  review: SemanticSecurityReview;
};

export function SemanticReviewCard({ review }: SemanticReviewCardProps) {
  const activeSignals = [
    review.promptInjectionLikely && "Prompt injection",
    review.dataLeakLikely && "Data leak",
    review.suspiciousDestinationLikely && "Suspicious destination",
    review.unsafeToolLikely && "Unsafe tool action",
  ].filter(Boolean);

  return (
    <div className="rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
            <BrainCircuit className="h-5 w-5 text-lime-300" />
            Semantic AI Review
          </h3>

          <p className="mt-1 text-sm text-white/45">
            AI-assisted review for paraphrased attacks and suspicious intent.
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
            review.enabled
              ? "border-lime-300/20 bg-lime-300/10 text-lime-200"
              : "border-yellow-300/20 bg-yellow-300/10 text-yellow-200"
          }`}
        >
          {review.enabled ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <CircleAlert className="h-3 w-3" />
          )}
          {review.enabled ? "Enabled" : "Fallback"}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Model
          </p>
          <p className="mt-2 font-mono text-sm text-lime-200">
            {review.model}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Confidence
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            {review.confidence} / {review.severity}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-lime-200">
          Review summary
        </p>
        <p className="text-sm leading-6 text-white/65">{review.summary}</p>
      </div>

      <div className="mt-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-lime-200">
          AI-detected signals
        </p>

        <div className="flex flex-wrap gap-2">
          {activeSignals.length ? (
            activeSignals.map((signal) => (
              <span
                key={String(signal)}
                className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs text-lime-200"
              >
                {signal}
              </span>
            ))
          ) : (
            <span className="text-sm text-white/45">
              No semantic threat signals detected.
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-3xl border border-lime-300/20 bg-lime-300/10 p-4">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-lime-200">
          Recommendation
        </p>
        <p className="text-sm leading-6 text-white/70">
          {review.recommendedAction}
        </p>
      </div>
    </div>
  );
}