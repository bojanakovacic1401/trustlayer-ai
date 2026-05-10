import type { DemoScenario } from "@/lib/demoData";

type ScenarioSelectorProps = {
  scenarios: DemoScenario[];
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
};

function getCategoryClasses(category: string) {
  if (category === "Critical") {
    return "border-red-300/20 bg-red-300/10 text-red-200";
  }

  if (category === "High") {
    return "border-orange-300/20 bg-orange-300/10 text-orange-200";
  }

  if (category === "Medium") {
    return "border-yellow-300/20 bg-yellow-300/10 text-yellow-200";
  }

  return "border-lime-300/20 bg-lime-300/10 text-lime-200";
}

export function ScenarioSelector({
  scenarios,
  activeScenarioId,
  onSelectScenario,
}: ScenarioSelectorProps) {
  return (
    <section className="mb-6 rounded-[2rem] border border-lime-300/15 bg-black/25 p-4 backdrop-blur-xl">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-lime-300/80">
            Attack Scenarios
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Choose how the AI agent gets attacked
          </h2>
        </div>

        <p className="text-sm text-white/45">
          {scenarios.length} demo workflows available
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => onSelectScenario(scenario.id)}
            className={`group relative overflow-hidden rounded-[1.5rem] border p-5 text-left backdrop-blur-xl transition hover:-translate-y-1 ${
              scenario.id === activeScenarioId
                ? "border-lime-300/60 bg-lime-300/10 shadow-[0_0_35px_rgba(163,230,53,0.18)]"
                : "border-lime-300/15 bg-black/45 hover:border-lime-300/40 hover:bg-lime-300/10"
            }`}
          >
            <div className="absolute right-[-40px] top-[-40px] h-28 w-28 rounded-full bg-lime-300/10 blur-2xl transition group-hover:bg-lime-300/20" />

            <div className="relative">
              <p
                className={`mb-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] ${getCategoryClasses(
                  scenario.category
                )}`}
              >
                {scenario.category}
              </p>

              <p className="text-base font-semibold text-white">
                {scenario.name}
              </p>

              <p className="mt-2 text-sm leading-5 text-white/45">
                {scenario.label}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}