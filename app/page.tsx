"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, FileText, ShieldCheck } from "lucide-react";

import { ActionApprovalPanel } from "@/components/ActionApprovalPanel";
import { AgentWorkspace } from "@/components/AgentWorkspace";
import { ApiStatusBar } from "@/components/ApiStatusBar";
import { ExecutiveSummary } from "@/components/ExecutiveSummary";
import { SystemArchitecture } from "@/components/SystemArchitecture";
import { AttackTimeline, PolicyChecks } from "@/components/TrustPanels";
import { ExportReportButton } from "@/components/ExportReportButton";
import { Hero } from "@/components/Hero";
import { PolicyBuilder } from "@/components/PolicyBuilder";
import { RiskCard } from "@/components/RiskCard";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { SecurityLogs } from "@/components/SecurityLogs";
import { SemanticReviewCard } from "@/components/SemanticReviewCard";
import { StatsGrid } from "@/components/StatsGrid";
import { TopNav } from "@/components/TopNav";

import { defaultScenario, demoScenarios } from "@/lib/demoData";
import { defaultPolicyConfig } from "@/lib/policies";
import { analyzeContent, createToolCall } from "@/lib/securityEngine";
import type {
  OperatorDecision,
  SecurityAnalysis,
  SecurityEvent,
  SecurityPolicyConfig,
  SemanticSecurityReview,
  ToolCall,
} from "@/lib/types";

type AnalyzeApiResponse =
  | {
      ok: true;
      requestId: string;
      scenarioId: string;
      analysis: SecurityAnalysis;
      toolCall: ToolCall;
      semanticReview: SemanticSecurityReview;
      policyConfig: SecurityPolicyConfig;
      timestamp: string;
      durationMs: number;
    }
  | {
      ok: false;
      error: string;
    };

const initialAnalysis = analyzeContent(
  defaultScenario.prompt,
  defaultScenario.document,
  defaultPolicyConfig
);

const initialToolCall = createToolCall(
  defaultScenario.prompt,
  defaultScenario.document,
  initialAnalysis
);

const initialSemanticReview: SemanticSecurityReview = {
  enabled: false,
  model: "not-run-yet",
  confidence: "Medium",
  severity: "Low",
  promptInjectionLikely: false,
  dataLeakLikely: false,
  suspiciousDestinationLikely: false,
  unsafeToolLikely: false,
  summary:
    "Run analysis to enable semantic AI review. Deterministic policy checks are already active.",
  matchedSignals: [],
  recommendedAction: "Run the security scan to generate AI-assisted review.",
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Home() {
  const [activeScenarioId, setActiveScenarioId] = useState(defaultScenario.id);
  const [documentText, setDocumentText] = useState(defaultScenario.document);
  const [prompt, setPrompt] = useState(defaultScenario.prompt);
  const [policyConfig, setPolicyConfig] =
    useState<SecurityPolicyConfig>(defaultPolicyConfig);

  const [analysis, setAnalysis] = useState<SecurityAnalysis>(initialAnalysis);
  const [toolCall, setToolCall] = useState<ToolCall>(initialToolCall);
  const [semanticReview, setSemanticReview] =
    useState<SemanticSecurityReview>(initialSemanticReview);

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

  useEffect(() => {
    const savedEvents = window.localStorage.getItem("trustlayer-events");

    if (!savedEvents) return;

    try {
      setEvents(JSON.parse(savedEvents).slice(0, 12));
    } catch {
      window.localStorage.removeItem("trustlayer-events");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("trustlayer-events", JSON.stringify(events));
  }, [events]);

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

      setScanStep("Step 1/5 — Inspecting prompt and document...");
      await wait(300);

      setScanStep("Step 2/5 — Checking deterministic security rules...");
      await wait(300);

      setScanStep("Step 3/5 — Applying active security policies...");
      await wait(300);

      setScanStep("Step 4/5 — Running semantic AI security review...");
      await wait(300);

      setScanStep("Step 5/5 — Calling /api/analyze security endpoint...");

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          document: documentText,
          scenarioId: activeScenarioId,
          policyConfig,
        }),
      });

      const data = (await response.json()) as AnalyzeApiResponse;

      if (!response.ok || !data.ok) {
        throw new Error("error" in data ? data.error : "API analysis failed.");
      }

      setAnalysis(data.analysis);
      setToolCall(data.toolCall);
      setSemanticReview(data.semanticReview);
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
      setSemanticReview(initialSemanticReview);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function loadScenario(scenarioId: string) {
    const scenario = demoScenarios.find((item) => item.id === scenarioId);

    if (!scenario) return;

    const nextAnalysis = analyzeContent(
      scenario.prompt,
      scenario.document,
      policyConfig
    );

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
    setSemanticReview(initialSemanticReview);
    setHasRun(false);
    setIsDirty(false);
    setApiStatus("idle");
    setLastAnalyzedAt(null);
    setOperatorDecision(null);
    setScanStep("Scenario loaded. Ready to analyze through API.");
  }

  function updatePrompt(value: string) {
    const nextAnalysis = analyzeContent(value, documentText, policyConfig);
    const nextToolCall = createToolCall(value, documentText, nextAnalysis);

    setPrompt(value);
    setAnalysis(nextAnalysis);
    setToolCall(nextToolCall);
    setSemanticReview(initialSemanticReview);
    setIsDirty(true);
    setOperatorDecision(null);
  }

  function updateDocument(value: string) {
    const nextAnalysis = analyzeContent(prompt, value, policyConfig);
    const nextToolCall = createToolCall(prompt, value, nextAnalysis);

    setDocumentText(value);
    setAnalysis(nextAnalysis);
    setToolCall(nextToolCall);
    setSemanticReview(initialSemanticReview);
    setIsDirty(true);
    setOperatorDecision(null);
  }

  function updatePolicyConfig(nextPolicyConfig: SecurityPolicyConfig) {
    const nextAnalysis = analyzeContent(prompt, documentText, nextPolicyConfig);
    const nextToolCall = createToolCall(prompt, documentText, nextAnalysis);

    setPolicyConfig(nextPolicyConfig);
    setAnalysis(nextAnalysis);
    setToolCall(nextToolCall);
    setSemanticReview(initialSemanticReview);
    setIsDirty(true);
    setOperatorDecision(null);
    setScanStep("Policy changed. Analyze again to confirm through API.");
  }

  function resetPolicyConfig() {
    updatePolicyConfig(defaultPolicyConfig);
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

  const blockedCount = events.filter(
    (event) => event.action === "Blocked"
  ).length;

  const highRiskCount = events.filter((event) =>
    ["High", "Critical"].includes(event.risk)
  ).length;

  const loggedCount = events.filter((event) => event.action === "Logged").length;

  const enabledPolicyCount = Object.values(policyConfig).filter(Boolean).length;

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

      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 py-6 lg:px-6">
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

        <PolicyBuilder
          policyConfig={policyConfig}
          onChange={updatePolicyConfig}
          onReset={resetPolicyConfig}
        />

        <ExecutiveSummary
          activeScenarioName={activeScenario.name}
          riskLevel={analysis.level}
          decision={analysis.decision}
          enabledPolicyCount={enabledPolicyCount}
          totalEvents={events.length}
        />

        <StatsGrid
          totalEvents={events.length}
          blockedCount={blockedCount}
          highRiskCount={highRiskCount}
          loggedCount={loggedCount}
        />

        <section className="space-y-6">
          <section className="rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-lime-300/80">
                  Live Agent Inspection
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Input analysis and risk decision
                </h2>
              </div>

              <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-1 text-xs font-semibold text-lime-200">
                {analysis.level} risk
              </span>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
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
                <SemanticReviewCard review={semanticReview} />
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-lime-300/80">
                  Threat Handling
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Attack path and operator control
                </h2>
              </div>

              <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1 text-xs text-white/50">
                Action guard active
              </span>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <AttackTimeline analysis={analysis} />

              <ActionApprovalPanel
                analysis={analysis}
                toolCall={toolCall}
                operatorDecision={operatorDecision}
                onDecision={handleOperatorDecision}
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-lime-300/80">
                  Enforcement Center
                </p>

                <h2 className="mt-1 text-2xl font-semibold text-white">
                  Policy result, safe response, and audit export
                </h2>
              </div>

              <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-1 text-xs font-semibold text-lime-200">
                {enabledPolicyCount}/6 policies enabled
              </span>
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <PolicyChecks analysis={analysis} />

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex h-full flex-col gap-5">
                  <div>
                    <h3 className="flex items-center gap-2 text-xl font-semibold text-white">
                      <ShieldCheck className="h-5 w-5 text-lime-300" />
                      Response & Report Center
                    </h3>

                    <p className="mt-1 text-sm text-white/45">
                      Protected response, execution status, report export, and
                      final enforcement state.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-lime-200">
                      Safe agent response
                    </p>

                    <p className="text-sm leading-6 text-white/65">
                      {hasRun
                        ? safeResponse
                        : "Run the simulation to generate the protected agent response."}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/40">
                        Execution status
                      </p>

                      <p
                        className={`text-base font-semibold ${
                          analysis.decision === "Blocked"
                            ? "text-red-200"
                            : analysis.decision === "Needs Approval"
                              ? "text-yellow-200"
                              : "text-lime-200"
                        }`}
                      >
                        {operatorDecision
                          ? `Operator set: ${operatorDecision}`
                          : `System decision: ${analysis.decision}`}
                      </p>

                      <p className="mt-3 text-xs leading-5 text-white/45">
                        Current tool: {toolCall.tool} → {toolCall.destination}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/40">
                        Last analyzed
                      </p>

                      <p className="text-base font-semibold text-white">
                        {lastAnalyzedAt
                          ? new Date(lastAnalyzedAt).toLocaleString()
                          : "Not analyzed yet"}
                      </p>

                      <p className="mt-3 text-xs leading-5 text-white/45">
                        API status: {apiStatus}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/40">
                        Enforcement mode
                      </p>

                      <p className="text-base font-semibold text-lime-200">
                        {analysis.decision === "Blocked"
                          ? "Prevent execution"
                          : analysis.decision === "Needs Approval"
                            ? "Require review"
                            : "Allow safely"}
                      </p>

                      <p className="mt-3 text-xs leading-5 text-white/45">
                        Based on active policy configuration and detected threat
                        signals.
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/40">
                        Audit status
                      </p>

                      <p className="text-base font-semibold text-lime-200">
                        {policyConfig.auditAllActions
                          ? "Audit enabled"
                          : "Audit optional"}
                      </p>

                      <p className="mt-3 text-xs leading-5 text-white/45">
                        Session contains {events.length} logged security events.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/35 p-5">
                    <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                      <CheckCircle2 className="h-4 w-4 text-lime-300" />
                      Current protection state
                    </p>

                    <p className="text-sm leading-6 text-white/60">
                      TrustLayer is evaluating prompt integrity, data leakage,
                      destination safety, tool permissions, and operator approval
                      before the agent executes any business action.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-lime-300/20 bg-lime-300/10 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="flex items-center gap-2 font-semibold text-white">
                          <FileText className="h-4 w-4 text-lime-300" />
                          Security Report
                        </p>

                        <p className="mt-1 text-sm text-white/55">
                          Export the current scan for audit, compliance, or
                          review.
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
              </div>
            </div>
          </section>
        </section>

        <SecurityLogs events={events} />

        <SystemArchitecture />
      </div>
    </main>
  );
}