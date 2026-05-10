import { Mic2, Presentation, ShieldCheck } from "lucide-react";

export function DemoScript() {
  return (
    <section className="my-6 rounded-[2rem] border border-lime-300/15 bg-black/45 p-5 backdrop-blur-xl">
      <div className="mb-5">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-lime-300/80">
          Presentation Helper
        </p>

        <h2 className="text-2xl font-semibold text-white">
          What to say during the hackathon demo
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">
          Use this section as your speaking guide. It explains the problem,
          attack, solution, and business value in a simple way.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <Mic2 className="mb-3 h-5 w-5 text-lime-300" />
          <p className="mb-2 font-semibold text-lime-200">30-second pitch</p>
          <p className="text-sm leading-6 text-white/60">
            “AI agents are becoming powerful enough to read documents, send
            emails, call APIs, and change business systems. But hidden
            instructions inside content can manipulate them. TrustLayer is a
            firewall for AI agents: it detects prompt injection, sensitive data,
            unsafe destinations, and risky tool calls before execution.”
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <Presentation className="mb-3 h-5 w-5 text-lime-300" />
          <p className="mb-2 font-semibold text-lime-200">Live demo flow</p>
          <ol className="list-decimal space-y-2 pl-4 text-sm leading-6 text-white/60">
            <li>Select Prompt Injection or Email Exfiltration.</li>
            <li>Show the hidden malicious instruction in the document.</li>
            <li>Click Analyze and show the risk score.</li>
            <li>Show Policy Checks and Attack Timeline.</li>
            <li>Use Agent Action Approval to Block or Redact.</li>
            <li>Show Security Logs and Export Security Report.</li>
          </ol>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <ShieldCheck className="mb-3 h-5 w-5 text-lime-300" />
          <p className="mb-2 font-semibold text-lime-200">Closing line</p>
          <p className="text-sm leading-6 text-white/60">
            “Companies want AI automation, but they also need control.
            TrustLayer gives teams the missing trust layer between AI agents and
            real business actions.”
          </p>
        </div>
      </div>
    </section>
  );
}