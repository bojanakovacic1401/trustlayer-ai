import {
  Archive,
  Bot,
  FileSearch,
  Gauge,
  LockKeyhole,
  Route,
  Shield,
  SlidersHorizontal,
} from "lucide-react";

export function SystemArchitecture() {
  return (
    <section className="mt-6 rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
      <div className="mb-5">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-lime-300/80">
          System Architecture
        </p>

        <h2 className="text-2xl font-semibold text-white">
          How TrustLayer protects an AI agent before execution
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
          The system works as a middleware layer between the user, the AI agent,
          documents, policies, and external tools.
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-6">
        <ArchitectureStep
          icon={<Bot className="h-5 w-5" />}
          title="User request"
          text="Prompt and business task enter the agent workspace."
        />

        <ArchitectureStep
          icon={<FileSearch className="h-5 w-5" />}
          title="Content scan"
          text="Documents are checked for hidden instructions and sensitive data."
        />

        <ArchitectureStep
          icon={<Gauge className="h-5 w-5" />}
          title="Risk score"
          text="Threats are converted into Low, Medium, High, or Critical risk."
        />

        <ArchitectureStep
          icon={<SlidersHorizontal className="h-5 w-5" />}
          title="Policy engine"
          text="Enterprise rules decide whether to allow, warn, escalate, or block."
        />

        <ArchitectureStep
          icon={<LockKeyhole className="h-5 w-5" />}
          title="Tool guard"
          text="Email, API, database, and export actions are checked before execution."
        />

        <ArchitectureStep
          icon={<Archive className="h-5 w-5" />}
          title="Audit logs"
          text="Every decision is stored for security review and compliance."
        />
      </div>

      <div className="mt-5 rounded-3xl border border-lime-300/20 bg-lime-300/10 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-black/40 text-lime-300">
            <Shield className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold text-white">Key technical point</p>
            <p className="mt-1 text-sm leading-6 text-white/60">
              TrustLayer does not rely on an LLM to decide security. The core
              protection is deterministic: patterns, policies, tool permissions,
              destinations, and audit rules. This makes the system more reliable
              and explainable.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
          <Route className="h-4 w-4 text-lime-300" />
          Request flow
        </p>

        <p className="font-mono text-xs leading-6 text-white/55">
          User Prompt → Document Scan → Risk Engine → Policy Builder → Tool Call
          Guard → Operator Approval → Safe Response → Security Logs
        </p>
      </div>
    </section>
  );
}

function ArchitectureStep({
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

      <p className="mt-2 text-xs leading-5 text-white/45">{text}</p>
    </div>
  );
}