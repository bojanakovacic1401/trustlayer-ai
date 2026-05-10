# TrustLayer AI

**TrustLayer AI** is an AI agent security firewall that detects prompt injection, sensitive data leakage, suspicious destinations, and unsafe tool calls before an autonomous AI agent executes an action.

The project demonstrates how companies can safely deploy AI agents that read documents, send emails, call APIs, and interact with business systems.

---

## Problem

AI agents are becoming powerful enough to perform real business actions, not just generate text.

They can:

- read internal documents
- summarize confidential files
- send emails
- call APIs
- access databases
- automate workflows

This creates a new security risk.

A malicious instruction hidden inside a document, email, or webpage can manipulate an AI agent into doing something unsafe, such as sending confidential data to an external address.

This is known as **prompt injection** or **indirect prompt injection**.

---

## Solution

TrustLayer AI acts as a security layer between the AI agent and its actions.

Before an agent executes a tool call, TrustLayer analyzes:

- user prompt
- uploaded document content
- hidden instructions
- sensitive data
- suspicious external recipients
- dangerous tool actions
- active enterprise security policies

Then it decides whether the action should be:

- allowed
- blocked
- redacted
- escalated for human review

---

## Key Features

### AI Agent Security Firewall

Detects risky agent workflows before execution.

### Prompt Injection Detection

Finds hidden instructions such as:

- ignore previous instructions
- reveal system prompt
- send confidential information
- do not tell the user

### Sensitive Data Detection

Detects content such as:

- API keys
- passwords
- tokens
- financial data
- confidential markers
- client data

### Suspicious Destination Detection

Flags external or suspicious recipients such as:

- attacker domains
- personal email domains
- unknown destinations

### Tool Call Guard

Simulates and evaluates agent actions such as:

- sending emails
- generating summaries
- deleting database records
- exporting confidential data

### Policy Builder

Allows security teams to configure controls:

- block prompt injection
- block external recipients
- redact credentials
- require approval for tool calls
- block destructive actions
- audit all actions

### Operator Approval Panel

A security operator can choose:

- approve
- block
- redact
- require human review

### Security Logs

Every action and decision is logged for audit visibility.

### Export Security Report

Exports the current scan result as a text report for compliance, review, or demo purposes.

---

## Demo Scenarios

The application includes multiple realistic AI-agent risk scenarios:

1. **Prompt Injection**  
   A hidden instruction inside a document attempts to override the AI agent.

2. **Sensitive Data Leak**  
   A document contains API keys, passwords, and restricted data.

3. **Email Exfiltration**  
   The agent is manipulated into sending confidential information to an external recipient.

4. **Excessive Agency**  
   The agent attempts a risky database or system action.

5. **System Prompt Leak**  
   The document attempts to reveal hidden system instructions and internal policies.

6. **Clean Request**  
   A safe business workflow with no dangerous content.

---

## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React**
- **Next.js API Routes**

---

## Architecture

```txt
User Prompt
   ↓
Uploaded Document
   ↓
TrustLayer Security Engine
   ↓
Risk Scoring
   ↓
Policy Builder
   ↓
Tool Call Guard
   ↓
Operator Approval
   ↓
Safe Agent Response
   ↓
Security Logs / Report Export
```

---

## Project Structure

```txt
trustlayer-ai/
  app/
    api/
      analyze/
        route.ts
      logs/
        route.ts
    globals.css
    layout.tsx
    page.tsx

  components/
    ActionApprovalPanel.tsx
    AgentWorkspace.tsx
    ApiStatusBar.tsx
    ExecutiveSummary.tsx
    ExportReportButton.tsx
    Hero.tsx
    PolicyBuilder.tsx
    RiskCard.tsx
    ScenarioSelector.tsx
    SecurityLogs.tsx
    StatsGrid.tsx
    SystemArchitecture.tsx
    TopNav.tsx
    TrustPanels.tsx

  lib/
    demoData.ts
    policies.ts
    securityEngine.ts
    types.ts
```

---

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app:

```txt
http://localhost:3000
```

Build for production:

```bash
npm run build
```

---

## How to Use

1. Select a demo scenario.
2. Review the user prompt and uploaded document.
3. Click **Analyze**.
4. TrustLayer runs the security engine through the API.
5. Review the risk score, policy checks, timeline, and proposed tool call.
6. Choose an operator action:
   - Approve
   - Block
   - Redact
   - Human Review
7. Export the security report if needed.

---

## Why It Matters

AI agents are moving from passive assistants to autonomous systems that can perform real actions.

Without a security layer, companies risk:

- confidential data leakage
- manipulated agent behavior
- unsafe API calls
- unauthorized email exfiltration
- loss of audit visibility
- compliance failures

TrustLayer AI helps companies deploy AI agents safely by adding a clear, configurable, and explainable control layer.

---

## Hackathon Category Fit

This project fits strongly into:

- **Artificial Intelligence & Intelligent Systems**
- **Cybersecurity & Digital Trust**
- **Software Engineering & Product Development**

It combines AI-agent safety, security policy enforcement, risk analysis, and product-quality dashboard design.

---

## Future Improvements

- User authentication
- Persistent database logs
- Real file upload support
- Real email/API tool integrations
- Organization-level policy templates
- Role-based access control
- Admin dashboard
- SOC/SIEM integration
- Vercel deployment
- Multi-agent monitoring

---

## Status

MVP completed.

The current version demonstrates the full TrustLayer workflow:

```txt
Prompt + Document → Security Analysis → Policy Decision → Tool Guard → Operator Approval → Safe Response → Audit Log
```

---

## License

MIT