import { NextResponse } from "next/server";
import { analyzeContent, createToolCall } from "@/lib/securityEngine";

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const body = await request.json();

    const prompt = String(body.prompt || "");
    const document = String(body.document || "");
    const scenarioId = String(body.scenarioId || "custom");

    if (!prompt.trim() && !document.trim()) {
      return NextResponse.json(
        {
          ok: false,
          error: "Prompt or document content is required.",
        },
        { status: 400 }
      );
    }

    const analysis = analyzeContent(prompt, document);
    const toolCall = createToolCall(prompt, document, analysis);

    return NextResponse.json({
      ok: true,
      requestId: `req_${Date.now()}`,
      scenarioId,
      analysis,
      toolCall,
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