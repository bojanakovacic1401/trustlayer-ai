import {
  Building2,
  CircleDollarSign,
  Layers3,
  ShieldAlert,
  Target,
  Users,
} from "lucide-react";
import type { Decision, RiskLevel } from "@/lib/types";

type ExecutiveSummaryProps = {
  activeScenarioName: string;
  riskLevel: RiskLevel;
  decision: Decision;
  enabledPolicyCount: number;
  totalEvents: number;
};

export function ExecutiveSummary({
  activeScenarioName,
  riskLevel,
  decision,
  enabledPolicyCount,
  totalEvents,
}: ExecutiveSummaryProps) {
  return (
    <section className="mb-6 rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-lime-300/80">
            Executive Summary
          </p>

          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            TrustLayer turns unsafe AI agents into governed enterprise workflows.
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
            AI agents are moving from chat to action: reading documents, sending
            emails, calling APIs, and touching business systems. TrustLayer adds
            a security control layer before those actions happen.
          </p>
        </div>

        <div className="rounded-3xl border border-lime-300/20 bg-lime-300/10 px-5 py-4 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-lime-200">
            Current decision
          </p>
          <p className="mt-1 text-2xl font-semibold text-white">{decision}</p>
          <p className="mt-1 text-xs text-white/45">{riskLevel} risk</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SummaryCard
          icon={<ShieldAlert className="h-5 w-5" />}
          title="Problem"
          text="AI agents can be manipulated by hidden instructions inside documents, emails, web pages, and user-provided content."
        />

        <SummaryCard
          icon={<Layers3 className="h-5 w-5" />}
          title="Solution"
          text="TrustLayer checks prompts, documents, tool calls, destinations, sensitive data, and security policies before execution."
        />

        <SummaryCard
          icon={<Target className="h-5 w-5" />}
          title="Demo focus"
          text={`Current scenario: ${activeScenarioName}. The system analyzes risk, applies policies, blocks or escalates actions, and logs the result.`}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <SummaryCard
          icon={<Users className="h-5 w-5" />}
          title="Users"
          text="Security teams, IT admins, compliance teams, SaaS platforms, and companies deploying internal AI agents."
        />

        <SummaryCard
          icon={<Building2 className="h-5 w-5" />}
          title="Business value"
          text="Prevents data leakage, reduces AI workflow risk, creates audit visibility, and makes AI agents safer to deploy."
        />

        <SummaryCard
          icon={<CircleDollarSign className="h-5 w-5" />}
          title="Model"
          text="Enterprise SaaS priced by workspace, protected agent, policy controls, and monitored tool calls."
        />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Metric label="Policies enabled" value={`${enabledPolicyCount}/6`} />
        <Metric label="Session events" value={String(totalEvents)} />
        <Metric label="Category" value="Cybersecurity + AI" />
      </div>
    </section>
  );
}

function SummaryCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300/10 text-lime-300">
        {icon}
      </div>

      <p className="font-semibold text-white">{title}</p>

      <p className="mt-2 text-sm leading-6 text-white/50">{text}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-lime-300/15 bg-lime-300/10 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-lime-200">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}