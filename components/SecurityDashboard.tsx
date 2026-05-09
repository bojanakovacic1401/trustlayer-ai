import { Search } from "lucide-react";
import type { SecurityEvent } from "@/lib/types";

type SecurityDashboardProps = {
  events: SecurityEvent[];
};

export function SecurityDashboard({ events }: SecurityDashboardProps) {
  return (
    <section className="mt-6 rounded-3xl border border-white/10 bg-white p-5 text-slate-950 shadow-2xl shadow-slate-950/30">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Security Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">
            Audit trail of agent risks, blocked actions, and sensitive data events.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400">Session logs</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Source</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No security events yet. Run the attack simulation.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {event.time}
                  </td>

                  <td className="px-4 py-3 font-medium">{event.type}</td>

                  <td className="px-4 py-3">{event.risk}</td>

                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                      {event.action}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {event.source}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}