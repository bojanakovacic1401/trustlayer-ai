import { Terminal } from "lucide-react";

type AgentWorkspaceProps = {
  activeScenarioName: string;
  prompt: string;
  documentText: string;
  isAnalyzing: boolean;
  onPromptChange: (value: string) => void;
  onDocumentChange: (value: string) => void;
  onAnalyze: () => void;
};

export function AgentWorkspace({
  activeScenarioName,
  prompt,
  documentText,
  isAnalyzing,
  onPromptChange,
  onDocumentChange,
  onAnalyze,
}: AgentWorkspaceProps) {
  return (
    <div className="rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 shadow-[0_0_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
            <Terminal className="h-5 w-5 text-lime-300" />
            Agent Workspace
          </h2>

          <p className="mt-1 text-sm text-white/45">
            Scenario: {activeScenarioName}
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="rounded-full bg-lime-300 px-5 py-2 text-sm font-bold text-black shadow-[0_0_30px_rgba(163,230,53,0.35)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      <label className="mb-4 block">
        <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-lime-300/80">
          User prompt
        </span>

        <textarea
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          rows={3}
          className="w-full resize-none rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-lime-300/40"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-lime-300/80">
          Uploaded document
        </span>

        <textarea
          value={documentText}
          onChange={(event) => onDocumentChange(event.target.value)}
          rows={16}
          className="w-full resize-none rounded-3xl border border-white/10 bg-white/[0.04] p-4 font-mono text-xs leading-5 text-white/75 outline-none transition placeholder:text-white/30 focus:border-lime-300/40"
        />
      </label>
    </div>
  );
}