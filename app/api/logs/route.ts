import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Security logs endpoint is ready.",
    logs: [],
  });
}