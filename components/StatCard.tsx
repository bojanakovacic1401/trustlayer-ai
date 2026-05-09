import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
  sub: string;
};

export function StatCard({ icon: Icon, label, value, sub }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{sub}</p>
        </div>

        <div className="rounded-2xl bg-slate-100 p-3">
          <Icon className="h-5 w-5 text-slate-700" />
        </div>
      </div>
    </div>
  );
}