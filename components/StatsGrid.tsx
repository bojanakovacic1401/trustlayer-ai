import type { ReactNode } from "react";
import { Activity, CircleDot, XCircle, Zap } from "lucide-react";

type StatsGridProps = {
  totalEvents: number;
  blockedCount: number;
  highRiskCount: number;
  loggedCount: number;
};

export function StatsGrid({
  totalEvents,
  blockedCount,
  highRiskCount,
  loggedCount,
}: StatsGridProps) {
  return (
    <section className="mb-6 grid gap-4 md:grid-cols-4">
      <Stat icon={<Activity className="h-5 w-5" />} label="Events" value={totalEvents} />
      <Stat icon={<XCircle className="h-5 w-5" />} label="Blocked" value={blockedCount} />
      <Stat icon={<Zap className="h-5 w-5" />} label="High Risk" value={highRiskCount} />
      <Stat icon={<CircleDot className="h-5 w-5" />} label="Logged" value={loggedCount} />
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[1.5rem] border border-lime-300/15 bg-black/45 p-4 backdrop-blur-xl">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300/10 text-lime-300">
        {icon}
      </div>

      <p className="text-3xl font-semibold text-white">{value}</p>

      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>
    </div>
  );
}