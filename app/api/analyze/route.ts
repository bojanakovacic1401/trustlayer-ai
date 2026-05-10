import { NextResponse } from "next/server";
import {
  applySemanticReview,
  planAgentToolCallWithAI,
  reviewSecuritySemantics,
} from "@/lib/aiSecurity";
import { defaultPolicyConfig } from "@/lib/policies";
import { analyzeContent, createToolCall } from "@/lib/securityEngine";
import type { SecurityPolicyConfig } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const body = await request.json();

    const prompt = String(body.prompt || "");
    const document = String(body.document || "");
    const scenarioId = String(body.scenarioId || "custom");

    const policyConfig: SecurityPolicyConfig = {
      ...defaultPolicyConfig,
      ...(body.policyConfig || {}),
    };

    if (!prompt.trim() && !document.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Prompt or document content is required.",
        },
        { status: 400 }
      );
    }

    const baseAnalysis = analyzeContent(prompt, document, policyConfig);

    const semanticReview = await reviewSecuritySemantics({
      prompt,
      document,
      analysis: baseAnalysis,
    });

    const analysis = applySemanticReview(
      baseAnalysis,
      semanticReview,
      policyConfig
    );

    const aiPlannedToolCall = await planAgentToolCallWithAI({
      prompt,
      document,
      analysis,
    });

    const toolCall =
      aiPlannedToolCall || createToolCall(prompt, document, analysis);

    return NextResponse.json({
      ok: true,
      requestId: `req_${Date.now()}`,
      scenarioId,
      analysis,
      toolCall,
      semanticReview,
      policyConfig,
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - startedAt,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to analyze request.",
      },
      { status: 500 }
    );
  }
}