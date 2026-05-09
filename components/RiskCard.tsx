import { AlertTriangle, Database, Mail, Shield } from "lucide-react";
import type { SecurityAnalysis, ToolCall } from "@/lib/types";

type RiskCardProps = {
  analysis: SecurityAnalysis;
  toolCall: ToolCall;
};

export function RiskCard({ analysis, toolCall }: RiskCardProps) {
  return (
    <div className="rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 shadow-[0_0_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
            <Shield className="h-5 w-5 text-lime-300" />
            Risk Analysis
          </h2>

          <p className="mt-1 text-sm text-white/45">
            Live security decision engine.
          </p>
        </div>

        <span className="rounded-full border border-lime-300/25 bg-lime-300/10 px-4 py-1 text-xs font-bold text-lime-200">
          {analysis.level}
        </span>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex justify-between text-sm text-white/65">
          <span>Risk score</span>
          <span>{analysis.score}/100</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-lime-300 shadow-[0_0_25px_rgba(163,230,53,0.75)] transition-all"
            style={{ width: `${analysis.score}%` }}
          />
        </div>
      </div>

      <div className="mb-5 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/45">
          Decision
        </p>

        <p className="text-3xl font-semibold text-lime-300">
          {analysis.decision}
        </p>

        <p className="mt-3 text-sm leading-6 text-white/55">
          {analysis.explanation}
        </p>
      </div>

      <div className="mb-5">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/45">
          Detected threats
        </p>

        <div className="flex flex-wrap gap-2">
          {analysis.threats.length === 0 ? (
            <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs text-lime-200">
              No threats detected
            </span>
          ) : (
            analysis.threats.map((threat) => (
              <span
                key={threat}
                className="inline-flex items-center gap-1 rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs text-lime-100"
              >
                <AlertTriangle className="h-3 w-3" />
                {threat}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/40 p-4">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          {toolCall.tool.includes("database") ? (
            <Database className="h-4 w-4 text-lime-300" />
          ) : (
            <Mail className="h-4 w-4 text-lime-300" />
          )}
          Proposed tool call
        </p>

        <div className="space-y-2 text-sm text-white/60">
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
    </div>
  );
}