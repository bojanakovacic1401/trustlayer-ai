import { AlertTriangle, CheckCircle2, FileText, Flame, Lock, XCircle } from "lucide-react";
import type { SecurityAnalysis, TimelineStatus } from "@/lib/types";

type SafeAgentResponseProps = {
  hasRun: boolean;
  response: string;
};

export function SafeAgentResponse({ hasRun, response }: SafeAgentResponseProps) {
  return (
    <div className="rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <FileText className="h-5 w-5 text-lime-300" />
        Safe Agent Response
      </h3>

      <p className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/65">
        {hasRun ? response : "Run the simulation to see the protected response."}
      </p>
    </div>
  );
}

export function AttackTimeline({ analysis }: { analysis: SecurityAnalysis }) {
  return (
    <div className="rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
        <Flame className="h-5 w-5 text-lime-300" />
        Attack Timeline
      </h2>

      <div className="space-y-3">
        {analysis.timeline.map((step, index) => (
          <div
            key={step.title}
            className="flex gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div
              className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${timelineClasses(
                step.status
              )}`}
            >
              {index + 1}
            </div>

            <div>
              <p className="font-semibold text-white">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-white/50">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PolicyChecks({ analysis }: { analysis: SecurityAnalysis }) {
  return (
    <div className="rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
        <Lock className="h-5 w-5 text-lime-300" />
        Policy Checks
      </h2>

      <div className="space-y-3">
        {analysis.policyChecks.map((check) => (
          <div
            key={check.name}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="font-semibold text-white">{check.name}</p>
              <StatusBadge status={check.status} />
            </div>

            <p className="text-sm leading-6 text-white/50">{check.details}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-3xl border border-lime-300/20 bg-lime-300/10 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-lime-200">
          Recommended action
        </p>

        <p className="mt-2 text-sm leading-6 text-white/70">
          {analysis.recommendedAction}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "Pass" | "Warn" | "Fail" }) {
  if (status === "Pass") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs text-lime-200">
        <CheckCircle2 className="h-3 w-3" />
        Pass
      </span>
    );
  }

  if (status === "Warn") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-3 py-1 text-xs text-yellow-200">
        <AlertTriangle className="h-3 w-3" />
        Warn
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-red-300/20 bg-red-300/10 px-3 py-1 text-xs text-red-200">
      <XCircle className="h-3 w-3" />
      Fail
    </span>
  );
}

function timelineClasses(status: TimelineStatus) {
  if (status === "blocked") {
    return "border-red-300/30 bg-red-300/10 text-red-200";
  }

  if (status === "warning") {
    return "border-yellow-300/30 bg-yellow-300/10 text-yellow-200";
  }

  if (status === "safe") {
    return "border-lime-300/30 bg-lime-300/10 text-lime-200";
  }

  return "border-white/15 bg-white/[0.04] text-white/50";
}