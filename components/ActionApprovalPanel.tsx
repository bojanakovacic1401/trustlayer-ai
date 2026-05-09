import {
  CheckCircle2,
  Eye,
  FileWarning,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";
import type { OperatorDecision, SecurityAnalysis, ToolCall } from "@/lib/types";

type ActionApprovalPanelProps = {
  analysis: SecurityAnalysis;
  toolCall: ToolCall;
  operatorDecision: OperatorDecision | null;
  onDecision: (decision: OperatorDecision) => void;
};

export function ActionApprovalPanel({
  analysis,
  toolCall,
  operatorDecision,
  onDecision,
}: ActionApprovalPanelProps) {
  const isHighRisk =
    analysis.level === "High" || analysis.level === "Critical";

  return (
    <div className="rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <ShieldCheck className="h-5 w-5 text-lime-300" />
            Agent Action Approval
          </h3>

          <p className="mt-1 text-sm text-white/45">
            Decide what happens before the AI agent executes the proposed action.
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs ${
            isHighRisk
              ? "border-red-300/20 bg-red-300/10 text-red-200"
              : "border-lime-300/20 bg-lime-300/10 text-lime-200"
          }`}
        >
          {isHighRisk ? "High control required" : "Standard control"}
        </span>
      </div>

      <div className="mb-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/40">
          Pending agent action
        </p>

        <div className="space-y-2 text-sm text-white/65">
          <p>
            Tool:{" "}
            <span className="font-mono text-lime-200">{toolCall.tool}</span>
          </p>

          <p>
            Destination:{" "}
            <span className="font-mono text-lime-200">
              {toolCall.destination}
            </span>
          </p>

          <p>
            Requested by:{" "}
            <span className="font-mono text-lime-200">
              {toolCall.requestedBy}
            </span>
          </p>

          <p>{toolCall.riskReason}</p>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => onDecision("Approved")}
          className="rounded-3xl border border-lime-300/20 bg-lime-300/10 p-4 text-left transition hover:border-lime-300/50 hover:bg-lime-300/20"
        >
          <CheckCircle2 className="mb-3 h-5 w-5 text-lime-300" />
          <p className="font-semibold text-white">Approve</p>
          <p className="mt-1 text-xs leading-5 text-white/45">
            Allow the agent action to continue.
          </p>
        </button>

        <button
          onClick={() => onDecision("Blocked")}
          className="rounded-3xl border border-red-300/20 bg-red-300/10 p-4 text-left transition hover:border-red-300/50 hover:bg-red-300/20"
        >
          <XCircle className="mb-3 h-5 w-5 text-red-300" />
          <p className="font-semibold text-white">Block</p>
          <p className="mt-1 text-xs leading-5 text-white/45">
            Stop the action before execution.
          </p>
        </button>

        <button
          onClick={() => onDecision("Redacted")}
          className="rounded-3xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-left transition hover:border-yellow-300/50 hover:bg-yellow-300/20"
        >
          <Eye className="mb-3 h-5 w-5 text-yellow-300" />
          <p className="font-semibold text-white">Redact</p>
          <p className="mt-1 text-xs leading-5 text-white/45">
            Remove sensitive content, then continue safely.
          </p>
        </button>

        <button
          onClick={() => onDecision("Human Review")}
          className="rounded-3xl border border-white/15 bg-white/[0.04] p-4 text-left transition hover:border-lime-300/40 hover:bg-white/[0.07]"
        >
          <UserCheck className="mb-3 h-5 w-5 text-lime-300" />
          <p className="font-semibold text-white">Human Review</p>
          <p className="mt-1 text-xs leading-5 text-white/45">
            Escalate to a security or compliance reviewer.
          </p>
        </button>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
          <FileWarning className="h-4 w-4 text-lime-300" />
          Operator decision
        </p>

        {operatorDecision ? (
          <p className="text-sm leading-6 text-white/65">
            Current decision:{" "}
            <span className="font-semibold text-lime-200">
              {operatorDecision}
            </span>
          </p>
        ) : (
          <p className="text-sm leading-6 text-white/45">
            No manual decision yet. TrustLayer default recommendation is{" "}
            <span className="font-semibold text-lime-200">
              {analysis.decision}
            </span>
            .
          </p>
        )}
      </div>
    </div>
  );
}