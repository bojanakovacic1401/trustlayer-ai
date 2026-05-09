import { ArrowRight, Sparkles } from "lucide-react";
import type { SecurityAnalysis } from "@/lib/types";

type HeroProps = {
  analysis: SecurityAnalysis;
  onRun: () => void;
  onLoadSafe: () => void;
  isAnalyzing: boolean;
};

export function Hero({ analysis, onRun, onLoadSafe, isAnalyzing }: HeroProps) {
  return (
    <section className="relative mb-14 text-center">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/25 bg-white/[0.04] px-4 py-2 text-xs text-lime-200 backdrop-blur">
        <Sparkles className="h-4 w-4" />
        AI Agent Security Platform
      </div>

      <h1 className="mx-auto max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white md:text-8xl">
        Secure AI agents <br />
        <span className="text-lime-300">before they act.</span>
      </h1>

      <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
        TrustLayer detects prompt injection, sensitive data leakage, suspicious
        destinations, and unsafe tool calls before an AI agent can execute them.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onClick={onRun}
          disabled={isAnalyzing}
          className="group rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAnalyzing ? "Running security scan..." : "Run attack simulation"}
          <ArrowRight className="ml-2 inline h-4 w-4 transition group-hover:translate-x-1" />
        </button>

        <button
          onClick={onLoadSafe}
          disabled={isAnalyzing}
          className="rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:border-lime-300/40 hover:text-lime-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Load safe workflow
        </button>
      </div>

      <div className="float-card absolute left-4 top-36 hidden w-56 rounded-3xl border border-lime-300/20 bg-black/50 p-4 text-left backdrop-blur-xl md:block">
        <p className="text-xs uppercase tracking-[0.2em] text-lime-300">
          Current risk
        </p>

        <p className="mt-2 text-2xl font-semibold text-white">
          {analysis.level}
        </p>

        <p className="mt-2 text-xs leading-5 text-white/45">
          {analysis.explanation}
        </p>
      </div>

      <div className="float-card-delay absolute right-6 top-48 hidden w-60 rounded-3xl border border-lime-300/20 bg-black/50 p-4 text-left backdrop-blur-xl lg:block">
        <p className="text-xs uppercase tracking-[0.2em] text-lime-300">
          Decision
        </p>

        <p className="mt-2 text-2xl font-semibold text-white">
          {analysis.decision}
        </p>

        <p className="mt-2 text-xs leading-5 text-white/45">
          Unsafe actions are stopped before execution.
        </p>
      </div>
    </section>
  );
}