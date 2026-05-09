import type {
  Decision,
  PolicyCheck,
  SecurityAnalysis,
  ThreatType,
  TimelineStep,
  ToolCall,
} from "./types";

const injectionPatterns = [
  "ignore all previous instructions",
  "ignore previous instructions",
  "override system prompt",
  "reveal system prompt",
  "do not tell the user",
  "send all confidential",
  "send confidential information",
  "disable safety",
  "forget your instructions",
  "hidden instruction",
];

const sensitivePatterns = [
  {
    label: "Email address",
    regex: /[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/g,
  },
  {
    label: "Financial data",
    regex:
      /\b(revenue|profit|loss|invoice|payment|financial|eur|usd|budget|contract value|projected contract)\b/gi,
  },
  {
    label: "Confidential marker",
    regex:
      /\b(confidential|internal only|private|restricted|secret|do not share|leadership only)\b/gi,
  },
  {
    label: "Client data",
    regex:
      /\b(client list|enterprise leads|customer list|lead database|enterprise clients|partnership strategy)\b/gi,
  },
  {
    label: "Credential exposure",
    regex:
      /\b(api[_-]?key|password|database_password|secret[_-]?key|token|sk_live)\b/gi,
  },
  {
    label: "Dangerous system action",
    regex:
      /\b(delete_database_records|delete records|drop table|remove all users|call the api|execute command)\b/gi,
  },
];

const riskyDomains = ["evil.com", "unknown.com", "gmail.com", "yahoo.com", "proton.me"];

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function extractEmails(text: string): string[] {
  return text.match(/[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/g) || [];
}

function hasToolAction(prompt: string, document: string): boolean {
  const combined = `${prompt}\n${document}`.toLowerCase();

  return /\b(send|email|export|share|call|delete|update|execute|remove|api)\b/i.test(
    combined
  );
}

function getDecision(score: number): Decision {
  if (score >= 55) return "Blocked";
  if (score >= 30) return "Needs Approval";
  return "Allowed";
}

function buildExplanation(
  decision: Decision,
  threats: ThreatType[],
  suspiciousEmails: string[]
): string {
  if (decision === "Blocked") {
    if (threats.includes("Prompt Injection")) {
      return "TrustLayer detected a hidden instruction attempting to override the AI agent and trigger unsafe behavior.";
    }

    if (threats.includes("Credential Exposure")) {
      return "TrustLayer detected credential-like secrets or restricted data that should not be exposed in an AI response.";
    }

    if (suspiciousEmails.length) {
      return "TrustLayer detected an external recipient that appears inside the document rather than in the user's explicit request.";
    }

    return "TrustLayer blocked the request because the agent attempted a high-risk action.";
  }

  if (decision === "Needs Approval") {
    return "TrustLayer found moderate risk. The agent can continue only after human approval.";
  }

  return "TrustLayer did not detect dangerous instructions, sensitive data leakage, or risky tool actions.";
}

function buildRecommendation(decision: Decision): string {
  if (decision === "Blocked") {
    return "Block the tool call, redact sensitive content, and allow only a safe summary.";
  }

  if (decision === "Needs Approval") {
    return "Require human approval before the AI agent performs the proposed action.";
  }

  return "Allow the request and log the action for audit visibility.";
}

function buildTimeline(
  matchedInjection: string[],
  sensitiveMatches: string[],
  suspiciousEmails: string[],
  decision: Decision
): TimelineStep[] {
  return [
    {
      title: "Document received",
      description: "The AI agent receives user prompt and document content.",
      status: "neutral",
    },
    {
      title: matchedInjection.length
        ? "Prompt injection detected"
        : "No prompt injection found",
      description: matchedInjection.length
        ? "Hidden instructions were found inside the document."
        : "No instruction override pattern was detected.",
      status: matchedInjection.length ? "blocked" : "safe",
    },
    {
      title: sensitiveMatches.length ? "Sensitive data detected" : "No sensitive data leak",
      description: sensitiveMatches.length
        ? `Detected: ${unique(sensitiveMatches).join(", ")}.`
        : "No restricted data patterns were found.",
      status: sensitiveMatches.length ? "warning" : "safe",
    },
    {
      title: suspiciousEmails.length
        ? "External destination detected"
        : "Destination looks safe",
      description: suspiciousEmails.length
        ? `Suspicious recipient: ${suspiciousEmails.join(", ")}.`
        : "No suspicious external destination found.",
      status: suspiciousEmails.length ? "blocked" : "safe",
    },
    {
      title: decision === "Blocked" ? "Action blocked" : "Action allowed",
      description:
        decision === "Blocked"
          ? "The proposed agent action was stopped before execution."
          : "The agent can continue under current policy.",
      status: decision === "Blocked" ? "blocked" : "safe",
    },
  ];
}

export function analyzeContent(prompt: string, document: string): SecurityAnalysis {
  const combined = `${prompt}\n\n${document}`.toLowerCase();

  const matchedInjection = injectionPatterns.filter((pattern) =>
    combined.includes(pattern)
  );

  const sensitiveMatches: string[] = [];

  for (const item of sensitivePatterns) {
    const matches = document.match(item.regex);
    if (matches?.length) {
      sensitiveMatches.push(item.label);
    }
  }

  const emails = extractEmails(document);

  const suspiciousEmails = emails.filter((email) =>
    riskyDomains.some((domain) => email.toLowerCase().endsWith(domain))
  );

  const toolActionRequested = hasToolAction(prompt, document);
  const credentialExposure = sensitiveMatches.includes("Credential exposure");
  const dangerousSystemAction = sensitiveMatches.includes("Dangerous system action");

  let score = 0;

  score += matchedInjection.length * 38;
  score += sensitiveMatches.length * 11;
  score += suspiciousEmails.length * 30;

  if (toolActionRequested) score += 13;
  if (credentialExposure) score += 28;
  if (dangerousSystemAction) score += 25;
  if (document.toLowerCase().includes("confidential")) score += 10;
  if (document.toLowerCase().includes("internal only")) score += 10;

  const normalizedScore = Math.min(score, 100);

  let level: SecurityAnalysis["level"] = "Low";

  if (normalizedScore >= 80) {
    level = "Critical";
  } else if (normalizedScore >= 55) {
    level = "High";
  } else if (normalizedScore >= 30) {
    level = "Medium";
  }

  const threats: ThreatType[] = [];

  if (matchedInjection.length) threats.push("Prompt Injection");
  if (sensitiveMatches.length) threats.push("Sensitive Data");
  if (credentialExposure) threats.push("Credential Exposure");
  if (suspiciousEmails.length) threats.push("Suspicious External Recipient");
  if (toolActionRequested) threats.push("Tool Action Requested");
  if (dangerousSystemAction) threats.push("Excessive Agency");

  const decision = getDecision(normalizedScore);

  const policyChecks: PolicyCheck[] = [
    {
      name: "Instruction integrity",
      status: matchedInjection.length ? "Fail" : "Pass",
      details: matchedInjection.length
        ? "Document contains instructions that try to override the agent."
        : "No override instruction was detected.",
    },
    {
      name: "Data leakage prevention",
      status: credentialExposure || sensitiveMatches.length > 2 ? "Fail" : sensitiveMatches.length ? "Warn" : "Pass",
      details: sensitiveMatches.length
        ? `Sensitive categories: ${unique(sensitiveMatches).join(", ")}.`
        : "No sensitive data category detected.",
    },
    {
      name: "External destination control",
      status: suspiciousEmails.length ? "Fail" : "Pass",
      details: suspiciousEmails.length
        ? `Suspicious destination: ${suspiciousEmails.join(", ")}.`
        : "No suspicious recipient detected.",
    },
    {
      name: "Tool permission guard",
      status: dangerousSystemAction ? "Fail" : toolActionRequested ? "Warn" : "Pass",
      details: dangerousSystemAction
        ? "Agent attempted a high-impact system or database action."
        : toolActionRequested
          ? "Agent requested a tool action that should be reviewed."
          : "No risky tool action requested.",
    },
  ];

  return {
    score: normalizedScore,
    level,
    decision,
    threats: unique(threats),
    matchedInjection,
    sensitiveMatches: unique(sensitiveMatches),
    suspiciousEmails,
    explanation: buildExplanation(decision, unique(threats), suspiciousEmails),
    recommendedAction: buildRecommendation(decision),
    policyChecks,
    timeline: buildTimeline(
      matchedInjection,
      sensitiveMatches,
      suspiciousEmails,
      decision
    ),
  };
}

export function createToolCall(
  prompt: string,
  document: string,
  analysis: SecurityAnalysis
): ToolCall {
  const combined = `${prompt}\n${document}`.toLowerCase();
  const injectedEmail = analysis.suspiciousEmails[0];

  if (combined.includes("delete_database_records") || combined.includes("delete")) {
    return {
      tool: "delete_database_records",
      destination: "production_database",
      subject: "Database cleanup",
      body:
        analysis.decision === "Blocked"
          ? "[Blocked before execution]"
          : "Delete requested test records.",
      riskReason:
        "The agent is attempting a destructive database action that requires explicit approval.",
      requestedBy: document.toLowerCase().includes("delete_database_records")
        ? "Document"
        : "User",
    };
  }

  if (
    prompt.toLowerCase().includes("send") ||
    prompt.toLowerCase().includes("email") ||
    injectedEmail
  ) {
    return {
      tool: "send_email",
      destination: injectedEmail || "team@company.com",
      subject: "Document summary",
      body:
        analysis.decision === "Blocked"
          ? "[Blocked before execution]"
          : "Summary: The document was summarized for the intended team.",
      riskReason: injectedEmail
        ? "Recipient was found inside the uploaded document, not explicitly provided by the user."
        : "Recipient appears to match the user's intended team destination.",
      requestedBy: injectedEmail ? "Document" : "User",
    };
  }

  return {
    tool: "generate_summary",
    destination: "agent_response",
    subject: "Safe summary",
    body:
      analysis.decision === "Blocked"
        ? "[Sensitive content restricted]"
        : "Summary generated safely.",
    riskReason: "No external destination or destructive tool action was requested.",
    requestedBy: "User",
  };
}