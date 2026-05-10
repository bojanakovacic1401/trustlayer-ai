import type { SecurityPolicyConfig } from "./types";

export const defaultPolicyConfig: SecurityPolicyConfig = {
  blockPromptInjection: true,
  blockExternalRecipients: true,
  redactCredentials: true,
  requireApprovalForToolCalls: true,
  blockDestructiveActions: true,
  auditAllActions: true,
};

export const strictPolicyConfig: SecurityPolicyConfig = {
  blockPromptInjection: true,
  blockExternalRecipients: true,
  redactCredentials: true,
  requireApprovalForToolCalls: true,
  blockDestructiveActions: true,
  auditAllActions: true,
};

export const monitorOnlyPolicyConfig: SecurityPolicyConfig = {
  blockPromptInjection: false,
  blockExternalRecipients: false,
  redactCredentials: false,
  requireApprovalForToolCalls: false,
  blockDestructiveActions: false,
  auditAllActions: true,
};