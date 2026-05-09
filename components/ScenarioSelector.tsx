import type { DemoScenario } from "@/lib/demoData";

type ScenarioSelectorProps = {
  scenarios: DemoScenario[];
  activeScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
};

export function ScenarioSelector({
  scenarios,
  activeScenarioId,
  onSelectScenario,
}: ScenarioSelectorProps) {
  return (
    <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onSelectScenario(scenario.id)}
          className={`rounded-[1.5rem] border p-4 text-left backdrop-blur-xl transition hover:-translate-y-1 ${
            scenario.id === activeScenarioId
              ? "border-lime-300/60 bg-lime-300/10 shadow-[0_0_35px_rgba(163,230,53,0.18)]"
              : "border-lime-300/15 bg-black/45 hover:border-lime-300/40 hover:bg-lime-300/10"
          }`}
        >
          <p className="mb-2 inline-flex rounded-full border border-lime-300/20 bg-lime-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-lime-200">
            {scenario.category}
          </p>

          <p className="text-sm font-semibold text-white">{scenario.name}</p>

          <p className="mt-1 text-xs leading-5 text-white/45">
            {scenario.label}
          </p>
        </button>
      ))}
    </section>
  );
}