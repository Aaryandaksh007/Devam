import { NextRequest, NextResponse } from "next/server";
import { chatWithCoach } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  try {
    const { message, scanData, scores, history } = await req.json();
    const response = await chatWithCoach(message, scanData, scores, history || []);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { response: "I'm having trouble right now. Please try again in a moment." },
      { status: 200 }
    );
  }
}
