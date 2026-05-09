import { AlertTriangle, CheckCircle2, Loader2, ServerCog } from "lucide-react";

type ApiStatusBarProps = {
  isAnalyzing: boolean;
  apiStatus: "idle" | "connected" | "error";
  scanStep: string;
  isDirty: boolean;
  lastAnalyzedAt: string | null;
};

export function ApiStatusBar({
  isAnalyzing,
  apiStatus,
  scanStep,
  isDirty,
  lastAnalyzedAt,
}: ApiStatusBarProps) {
  return (
    <section className="mb-6 rounded-[1.5rem] border border-lime-300/15 bg-black/45 p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300/10 text-lime-300">
            {isAnalyzing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : apiStatus === "error" ? (
              <AlertTriangle className="h-5 w-5 text-red-300" />
            ) : apiStatus === "connected" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <ServerCog className="h-5 w-5" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              {isAnalyzing
                ? "Analyzing through API..."
                : apiStatus === "error"
                  ? "API analysis failed"
                  : apiStatus === "connected"
                    ? "API Mode Active"
                    : "API Mode Ready"}
            </p>

            <p className="mt-1 text-xs text-white/45">{scanStep}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isDirty && (
            <span className="rounded-full border border-yellow-300/20 bg-yellow-300/10 px-3 py-1 text-xs text-yellow-200">
              Draft changed — analyze again
            </span>
          )}

          {lastAnalyzedAt && (
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/45">
              Last scan: {new Date(lastAnalyzedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}