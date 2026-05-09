export function DemoScript() {
  return (
    <section className="my-6 rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
      <h2 className="mb-3 text-xl font-semibold text-white">Demo Script</h2>

      <div className="grid gap-4 text-sm leading-6 text-white/60 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-2 font-semibold text-lime-200">1. Show the risk</p>
          <p>
            “AI agents can now read documents and take actions, but hidden
            instructions can manipulate them.”
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-2 font-semibold text-lime-200">2. Run the attack</p>
          <p>
            “This document contains a hidden instruction telling the agent to send
            confidential data externally.”
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-2 font-semibold text-lime-200">3. Show TrustLayer</p>
          <p>
            “TrustLayer detects the attack, blocks the tool call, explains the
            reason, and logs everything for audit.”
          </p>
        </div>
      </div>
    </section>
  );
}