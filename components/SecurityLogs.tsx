import type { SecurityEvent } from "@/lib/types";

type SecurityLogsProps = {
  events: SecurityEvent[];
};

export function SecurityLogs({ events }: SecurityLogsProps) {
  return (
    <section className="mt-6 rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">Security Logs</h2>

        <p className="mt-1 text-sm text-white/45">
          Audit trail of blocked attacks and risky agent actions.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-lime-300/70">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Source</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-white/40">
                  No events yet. Run the simulation.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="text-white/65 hover:bg-white/[0.03]">
                  <td className="px-4 py-3 font-mono text-xs">{event.time}</td>

                  <td className="px-4 py-3 font-medium text-white">
                    {event.type}
                  </td>

                  <td className="px-4 py-3">{event.risk}</td>

                  <td className="px-4 py-3">
                    <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs text-lime-200">
                      {event.action}
                    </span>
                  </td>

                  <td className="max-w-[360px] truncate px-4 py-3 font-mono text-xs">
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