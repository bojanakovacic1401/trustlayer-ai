"use client";

import { Download } from "lucide-react";
import type { SecurityAnalysis, SecurityEvent, ToolCall } from "@/lib/types";

type ExportReportButtonProps = {
  scenarioName: string;
  prompt: string;
  documentText: string;
  analysis: SecurityAnalysis;
  toolCall: ToolCall;
  events: SecurityEvent[];
  lastAnalyzedAt: string | null;
};

export function ExportReportButton({
  scenarioName,
  prompt,
  documentText,
  analysis,
  toolCall,
  events,
  lastAnalyzedAt,
}: ExportReportButtonProps) {
  function exportReport() {
    const report = `TrustLayer AI Security Report

Scenario:
${scenarioName}

Scan time:
${lastAnalyzedAt || new Date().toISOString()}

Decision:
${analysis.decision}

Risk:
${analysis.level} (${analysis.score}/100)

Explanation:
${analysis.explanation}

Recommended action:
${analysis.recommendedAction}

Detected threats:
${analysis.threats.length ? analysis.threats.join(", ") : "None"}

Proposed tool call:
Tool: ${toolCall.tool}
Destination: ${toolCall.destination}
Requested by: ${toolCall.requestedBy}
Reason: ${toolCall.riskReason}

Policy checks:
${analysis.policyChecks
  .map((check) => `- ${check.name}: ${check.status} — ${check.details}`)
  .join("\n")}

Attack timeline:
${analysis.timeline
  .map((step, index) => `${index + 1}. ${step.title} — ${step.description}`)
  .join("\n")}

Security events:
${
  events.length
    ? events
        .map(
          (event) =>
            `- [${event.time}] ${event.type} | Risk: ${event.risk} | Action: ${event.action} | Source: ${event.source}`
        )
        .join("\n")
    : "No logged events yet."
}

User prompt:
${prompt}

Document preview:
${documentText.slice(0, 1200)}
`;

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `trustlayer-security-report-${Date.now()}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={exportReport}
      className="inline-flex items-center gap-2 rounded-full border border-lime-300/25 bg-lime-300/10 px-4 py-2 text-sm font-semibold text-lime-200 transition hover:border-lime-300/50 hover:bg-lime-300/20"
    >
      <Download className="h-4 w-4" />
      Export Security Report
    </button>
  );
}