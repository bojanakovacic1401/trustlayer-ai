import { RotateCcw, SlidersHorizontal } from "lucide-react";
import type { SecurityPolicyConfig } from "@/lib/types";

type PolicyBuilderProps = {
  policyConfig: SecurityPolicyConfig;
  onChange: (policyConfig: SecurityPolicyConfig) => void;
  onReset: () => void;
};

const policyItems: {
  key: keyof SecurityPolicyConfig;
  title: string;
  description: string;
}[] = [
  {
    key: "blockPromptInjection",
    title: "Block prompt injection",
    description: "Stop hidden instructions from controlling the AI agent.",
  },
  {
    key: "blockExternalRecipients",
    title: "Block external recipients",
    description: "Prevent data exfiltration to suspicious external emails.",
  },
  {
    key: "redactCredentials",
    title: "Redact credentials",
    description: "Require secrets, tokens, and passwords to be removed.",
  },
  {
    key: "requireApprovalForToolCalls",
    title: "Require approval for tool calls",
    description: "Force human review before the agent performs actions.",
  },
  {
    key: "blockDestructiveActions",
    title: "Block destructive actions",
    description: "Stop risky API, database, or system operations.",
  },
  {
    key: "auditAllActions",
    title: "Audit all actions",
    description: "Keep a log of every AI agent decision and tool request.",
  },
];

export function PolicyBuilder({
  policyConfig,
  onChange,
  onReset,
}: PolicyBuilderProps) {
  function togglePolicy(key: keyof SecurityPolicyConfig) {
    onChange({
      ...policyConfig,
      [key]: !policyConfig[key],
    });
  }

  const enabledCount = Object.values(policyConfig).filter(Boolean).length;

  return (
    <section className="mb-6 rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
            <SlidersHorizontal className="h-5 w-5 text-lime-300" />
            Policy Builder
          </h2>

          <p className="mt-1 text-sm text-white/45">
            Configure how TrustLayer reacts before an AI agent executes actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs text-lime-200">
            {enabledCount}/6 controls enabled
          </span>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/55 transition hover:border-lime-300/30 hover:text-lime-200"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {policyItems.map((item) => {
          const enabled = policyConfig[item.key];

          return (
            <button
              key={item.key}
              onClick={() => togglePolicy(item.key)}
              className={`rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 ${
                enabled
                  ? "border-lime-300/30 bg-lime-300/10"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-semibold text-white">{item.title}</p>

                <span
                  className={`relative h-6 w-11 rounded-full transition ${
                    enabled ? "bg-lime-300" : "bg-white/15"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-black transition ${
                      enabled ? "left-6" : "left-1"
                    }`}
                  />
                </span>
              </div>

              <p className="text-sm leading-6 text-white/45">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}