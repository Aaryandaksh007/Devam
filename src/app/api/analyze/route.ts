import { NextRequest, NextResponse } from "next/server";
import { analyzeWellness } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  try {
    const scanData = await req.json();
    const result = await analyzeWellness(scanData);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analyze API error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Using fallback engine." },
      { status: 500 }
    );
  }
}
