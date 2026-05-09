import { Shield } from "lucide-react";

type TopNavProps = {
  onRun: () => void;
  isAnalyzing: boolean;
};

export function TopNav({ onRun, isAnalyzing }: TopNavProps) {
  return (
    <nav className="mb-14 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-lime-300/30 bg-lime-300/10 shadow-[0_0_30px_rgba(163,230,53,0.25)]">
          <Shield className="h-5 w-5 text-lime-300" />
        </div>

        <span className="text-sm font-semibold tracking-[0.28em] text-white">
          TRUSTLAYER
        </span>
      </div>

      <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.22em] text-white/55 md:flex">
        <span>Agents</span>
        <span>Policies</span>
        <span>Firewall</span>
        <span>Logs</span>
      </div>

      <button
        onClick={onRun}
        disabled={isAnalyzing}
        className="rounded-full border border-lime-300/30 bg-lime-300 px-5 py-2 text-sm font-bold text-black shadow-[0_0_40px_rgba(163,230,53,0.35)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isAnalyzing ? "Scanning..." : "Run Demo"}
      </button>
    </nav>
  );
}