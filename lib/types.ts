export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type Decision = "Allowed" | "Needs Approval" | "Blocked";

export type ThreatType =
  | "Prompt Injection"
  | "Sensitive Data"
  | "Suspicious External Recipient"
  | "Tool Action Requested"
  | "Credential Exposure"
  | "Excessive Agency";

export type TimelineStatus = "neutral" | "safe" | "warning" | "blocked";

export type TimelineStep = {
  title: string;
  description: string;
  status: TimelineStatus;
};

export type PolicyCheck = {
  name: string;
  status: "Pass" | "Warn" | "Fail";
  details: string;
};

export type SecurityPolicyConfig = {
  blockPromptInjection: boolean;
  blockExternalRecipients: boolean;
  redactCredentials: boolean;
  requireApprovalForToolCalls: boolean;
  blockDestructiveActions: boolean;
  auditAllActions: boolean;
};

export type SecurityAnalysis = {
  score: number;
  level: RiskLevel;
  decision: Decision;
  threats: ThreatType[];
  matchedInjection: string[];
  sensitiveMatches: string[];
  suspiciousEmails: string[];
  explanation: string;
  recommendedAction: string;
  policyChecks: PolicyCheck[];
  timeline: TimelineStep[];
};

export type ToolCall = {
  tool: string;
  destination: string;
  subject: string;
  body: string;
  riskReason: string;
  requestedBy: "User" | "Document" | "Agent";
};

export type OperatorDecision =
  | "Approved"
  | "Blocked"
  | "Redacted"
  | "Human Review";

export type SecurityEvent = {
  id: string;
  time: string;
  type: string;
  risk: RiskLevel;
  action:
    | Decision
    | OperatorDecision
    | "Redacted"
    | "Logged"
    | "Manual Override";
  source: string;
};

export type SemanticSecurityReview = {
  enabled: boolean;
  model: string;
  confidence: "Low" | "Medium" | "High";
  severity: RiskLevel;
  promptInjectionLikely: boolean;
  dataLeakLikely: boolean;
  suspiciousDestinationLikely: boolean;
  unsafeToolLikely: boolean;
  summary: string;
  matchedSignals: string[];
  recommendedAction: string;
};