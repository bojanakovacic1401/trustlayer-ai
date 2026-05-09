"use client";

import { useState } from "react";

import { ActionApprovalPanel } from "@/components/ActionApprovalPanel";
import { AgentWorkspace } from "@/components/AgentWorkspace";
import { ApiStatusBar } from "@/components/ApiStatusBar";
import {
  AttackTimeline,
  PolicyChecks,
  SafeAgentResponse,
} from "@/components/TrustPanels";
import { DemoScript } from "@/components/DemoScript";
import { ExportReportButton } from "@/components/ExportReportButton";
import { Hero } from "@/components/Hero";
import { RiskCard } from "@/components/RiskCard";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { SecurityLogs } from "@/components/SecurityLogs";
import { StatsGrid } from "@/components/StatsGrid";
import { TopNav } from "@/components/TopNav";

import { defaultScenario, demoScenarios } from "@/lib/demoData";
import { analyzeContent, createToolCall } from "@/lib/securityEngine";
import type {
  OperatorDecision,
  SecurityAnalysis,
  SecurityEvent,
  ToolCall,
} from "@/lib/types";

type AnalyzeApiResponse =
  | {
      ok: true;
      requestId: string;
      scenarioId: string;
      analysis: SecurityAnalysis;
      toolCall: ToolCall;
      timestamp: string;
      durationMs: number;
    }
  | {
      ok: false;
      error: string;
    };

const initialAnalysis = analyzeContent(
  defaultScenario.prompt,
  defaultScenario.document
);

const initialToolCall = createToolCall(
  defaultScenario.prompt,
  defaultScenario.document,
  initialAnalysis
);

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Home() {
  const [activeScenarioId, setActiveScenarioId] = useState(defaultScenario.id);
  const [documentText, setDocumentText] = useState(defaultScenario.document);
  const [prompt, setPrompt] = useState(defaultScenario.prompt);
  const [analysis, setAnalysis] = useState<SecurityAnalysis>(initialAnalysis);
  const [toolCall, setToolCall] = useState<ToolCall>(initialToolCall);
  const [hasRun, setHasRun] = useState(false);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiStatus, setApiStatus] = useState<"idle" | "connected" | "error">(
    "idle"
  );
  const [scanStep, setScanStep] = useState("Ready to analyze agent activity.");
  const [isDirty, setIsDirty] = useState(false);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<string | null>(null);
  const [operatorDecision, setOperatorDecision] =
    useState<OperatorDecision | null>(null);

  const activeScenario =
    demoScenarios.find((scenario) => scenario.id === activeScenarioId) ||
    defaultScenario;

  function createId() {
    return `${Date.now()}-${Math.random()}`;
  }

  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function buildEvents(
    currentAnalysis: SecurityAnalysis,
    currentToolCall: ToolCall
  ) {
    const time = getTime();
    const newEvents: SecurityEvent[] = [];

    currentAnalysis.policyChecks.forEach((check) => {
      if (check.status === "Fail") {
        newEvents.push({
          id: createId(),
          time,
          type: check.name,
          risk: currentAnalysis.level,
          action: "Blocked",
          source: check.details,
        });
      }

      if (check.status === "Warn") {
        newEvents.push({
          id: createId(),
          time,
          type: check.name,
          risk:
            currentAnalysis.level === "Low" ? "Medium" : currentAnalysis.level,
          action: "Logged",
          source: check.details,
        });
      }
    });

    newEvents.push({
      id: createId(),
      time,
      type: `Tool Call: ${currentToolCall.tool}`,
      risk: currentAnalysis.level,
      action: currentAnalysis.decision,
      source: currentToolCall.destination,
    });

    return newEvents;
  }

  async function runSimulation() {
    try {
      setIsAnalyzing(true);
      setHasRun(false);
      setOperatorDecision(null);
      setApiStatus("idle");

      setScanStep("Step 1/4 — Inspecting prompt and document...");
      await wait(350);

      setScanStep("Step 2/4 — Checking prompt injection patterns...");
      await wait(350);

      setScanStep("Step 3/4 — Evaluating sensitive data and destinations...");
      await wait(350);

      setScanStep("Step 4/4 — Calling /api/analyze security endpoint...");

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          document: documentText,
          scenarioId: activeScenarioId,
        }),
      });

      const data = (await response.json()) as AnalyzeApiResponse;

      if (!response.ok || !data.ok) {
        throw new Error("error" in data ? data.error : "API analysis failed.");
      }

      setAnalysis(data.analysis);
      setToolCall(data.toolCall);
      setLastAnalyzedAt(data.timestamp);
      setApiStatus("connected");
      setScanStep(
        `Scan complete — ${data.analysis.decision} in ${data.durationMs}ms.`
      );
      setIsDirty(false);
      setHasRun(true);

      const newEvents = buildEvents(data.analysis, data.toolCall);
      setEvents((prev) => [...newEvents, ...prev].slice(0, 12));
    } catch {
      setApiStatus("error");
      setScanStep("API error — analysis could not be completed.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function loadScenario(scenarioId: string) {
    const scenario = demoScenarios.find((item) => item.id === scenarioId);

    if (!scenario) return;

    const nextAnalysis = analyzeContent(scenario.prompt, scenario.document);
    const nextToolCall = createToolCall(
      scenario.prompt,
      scenario.document,
      nextAnalysis
    );

    setActiveScenarioId(scenario.id);
    setPrompt(scenario.prompt);
    setDocumentText(scenario.document);
    setAnalysis(nextAnalysis);
    setToolCall(nextToolCall);
    setHasRun(false);
    setIsDirty(false);
    setApiStatus("idle");
    setLastAnalyzedAt(null);
    setOperatorDecision(null);
    setScanStep("Scenario loaded. Ready to analyze through API.");
  }

  function updatePrompt(value: string) {
    setPrompt(value);
    setIsDirty(true);
    setOperatorDecision(null);
  }

  function updateDocument(value: string) {
    setDocumentText(value);
    setIsDirty(true);
    setOperatorDecision(null);
  }

  function handleOperatorDecision(decision: OperatorDecision) {
    setOperatorDecision(decision);

    const event: SecurityEvent = {
      id: createId(),
      time: getTime(),
      type: `Operator Decision: ${decision}`,
      risk: analysis.level,
      action: decision,
      source: `${toolCall.tool} → ${toolCall.destination}`,
    };

    setEvents((prev) => [event, ...prev].slice(0, 12));
  }

  const blockedCount = events.filter((event) => event.action === "Blocked").length;

  const highRiskCount = events.filter((event) =>
    ["High", "Critical"].includes(event.risk)
  ).length;

  const loggedCount = events.filter((event) => event.action === "Logged").length;

  const safeResponse =
    operatorDecision === "Approved"
      ? "The operator approved the action. TrustLayer will allow execution and keep a full audit log."
      : operatorDecision === "Blocked"
        ? "The operator blocked the action. The AI agent will not execute the proposed tool call."
        : operatorDecision === "Redacted"
          ? "TrustLayer will redact sensitive content before allowing a safe continuation."
          : operatorDecision === "Human Review"
            ? "The action has been escalated to a human reviewer before execution."
            : analysis.decision === "Blocked"
              ? "I can summarize safe parts of the document, but I will not follow hidden instructions, expose restricted data, or execute risky tool actions."
              : analysis.decision === "Needs Approval"
                ? "This request may continue only after a human reviews the proposed action."
                : "The document can be summarized safely under the current security policy.";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030603] text-[#f5f5f0]">
      <div className="radial-glow absolute inset-0" />
      <div className="cyber-grid absolute inset-0 opacity-70" />
      <div className="scan-line pointer-events-none absolute left-0 top-0 h-24 w-full opacity-30" />

      <div className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-lime-400/20 blur-[120px]" />
      <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-green-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-6">
        <TopNav onRun={runSimulation} isAnalyzing={isAnalyzing} />

        <Hero
          analysis={analysis}
          onRun={runSimulation}
          onLoadSafe={() => loadScenario("clean-request")}
          isAnalyzing={isAnalyzing}
        />

        <ScenarioSelector
          scenarios={demoScenarios}
          activeScenarioId={activeScenarioId}
          onSelectScenario={loadScenario}
        />

        <ApiStatusBar
          isAnalyzing={isAnalyzing}
          apiStatus={apiStatus}
          scanStep={scanStep}
          isDirty={isDirty}
          lastAnalyzedAt={lastAnalyzedAt}
        />

        <StatsGrid
          totalEvents={events.length}
          blockedCount={blockedCount}
          highRiskCount={highRiskCount}
          loggedCount={loggedCount}
        />

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <AgentWorkspace
            activeScenarioName={activeScenario.name}
            prompt={prompt}
            documentText={documentText}
            isAnalyzing={isAnalyzing}
            onPromptChange={updatePrompt}
            onDocumentChange={updateDocument}
            onAnalyze={runSimulation}
          />

          <div className="space-y-6">
            <RiskCard analysis={analysis} toolCall={toolCall} />

            <ActionApprovalPanel
              analysis={analysis}
              toolCall={toolCall}
              operatorDecision={operatorDecision}
              onDecision={handleOperatorDecision}
            />

            <SafeAgentResponse hasRun={hasRun} response={safeResponse} />

            <div className="rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Security Report
                  </h3>
                  <p className="mt-1 text-sm text-white/45">
                    Export current scan results for audit or demo review.
                  </p>
                </div>

                <ExportReportButton
                  scenarioName={activeScenario.name}
                  prompt={prompt}
                  documentText={documentText}
                  analysis={analysis}
                  toolCall={toolCall}
                  events={events}
                  lastAnalyzedAt={lastAnalyzedAt}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <AttackTimeline analysis={analysis} />
          <PolicyChecks analysis={analysis} />
        </section>

        <SecurityLogs events={events} />

        <DemoScript />
      </div>
    </main>
  );
}