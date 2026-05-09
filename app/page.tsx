"use client";

import { useMemo, useState } from "react";

import { AgentWorkspace } from "@/components/AgentWorkspace";
import { AttackTimeline, PolicyChecks, SafeAgentResponse } from "@/components/TrustPanels";
import { DemoScript } from "@/components/DemoScript";
import { Hero } from "@/components/Hero";
import { RiskCard } from "@/components/RiskCard";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { SecurityLogs } from "@/components/SecurityLogs";
import { StatsGrid } from "@/components/StatsGrid";
import { TopNav } from "@/components/TopNav";

import { defaultScenario, demoScenarios } from "@/lib/demoData";
import { analyzeContent, createToolCall } from "@/lib/securityEngine";
import type { SecurityEvent } from "@/lib/types";

export default function Home() {
  const [activeScenarioId, setActiveScenarioId] = useState(defaultScenario.id);
  const [documentText, setDocumentText] = useState(defaultScenario.document);
  const [prompt, setPrompt] = useState(defaultScenario.prompt);
  const [hasRun, setHasRun] = useState(false);
  const [events, setEvents] = useState<SecurityEvent[]>([]);

  const activeScenario = useMemo(() => {
    return (
      demoScenarios.find((scenario) => scenario.id === activeScenarioId) ||
      defaultScenario
    );
  }, [activeScenarioId]);

  const analysis = useMemo(() => {
    return analyzeContent(prompt, documentText);
  }, [prompt, documentText]);

  const toolCall = useMemo(() => {
    return createToolCall(prompt, documentText, analysis);
  }, [prompt, documentText, analysis]);

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

  function runSimulation() {
    const time = getTime();
    const newEvents: SecurityEvent[] = [];

    analysis.policyChecks.forEach((check) => {
      if (check.status === "Fail") {
        newEvents.push({
          id: createId(),
          time,
          type: check.name,
          risk: analysis.level,
          action: "Blocked",
          source: check.details,
        });
      }

      if (check.status === "Warn") {
        newEvents.push({
          id: createId(),
          time,
          type: check.name,
          risk: analysis.level === "Low" ? "Medium" : analysis.level,
          action: "Logged",
          source: check.details,
        });
      }
    });

    newEvents.push({
      id: createId(),
      time,
      type: `Tool Call: ${toolCall.tool}`,
      risk: analysis.level,
      action: analysis.decision,
      source: toolCall.destination,
    });

    setEvents((prev) => [...newEvents, ...prev].slice(0, 12));
    setHasRun(true);
  }

  function loadScenario(scenarioId: string) {
    const scenario = demoScenarios.find((item) => item.id === scenarioId);

    if (!scenario) return;

    setActiveScenarioId(scenario.id);
    setPrompt(scenario.prompt);
    setDocumentText(scenario.document);
    setHasRun(false);
  }

  const blockedCount = events.filter((event) => event.action === "Blocked").length;

  const highRiskCount = events.filter((event) =>
    ["High", "Critical"].includes(event.risk)
  ).length;

  const loggedCount = events.filter((event) => event.action === "Logged").length;

  const safeResponse =
    analysis.decision === "Blocked"
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
        <TopNav onRun={runSimulation} />

        <Hero
          analysis={analysis}
          onRun={runSimulation}
          onLoadSafe={() => loadScenario("clean-request")}
        />

        <ScenarioSelector
          scenarios={demoScenarios}
          activeScenarioId={activeScenarioId}
          onSelectScenario={loadScenario}
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
            onPromptChange={setPrompt}
            onDocumentChange={setDocumentText}
            onAnalyze={runSimulation}
          />

          <div className="space-y-6">
            <RiskCard analysis={analysis} toolCall={toolCall} />

            <SafeAgentResponse hasRun={hasRun} response={safeResponse} />
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