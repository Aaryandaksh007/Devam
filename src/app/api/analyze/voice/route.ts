import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audioBase64 } = body;

    if (!audioBase64) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }

    // Simulate API delay for NVIDIA API (which doesn't natively support Audio Blob sentiment analysis yet)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Fallback Mock Analyzer for Voice since NVIDIA API lacks native Audio-to-Sentiment endpoint
    const data = {
      stress: Math.floor(Math.random() * 40) + 30, // 30-70
      energy: Math.floor(Math.random() * 40) + 40, // 40-80
      confidence: Math.floor(Math.random() * 30) + 60, // 60-90
      fatigue: Math.floor(Math.random() * 40) + 20, // 20-60
      speechStability: Math.floor(Math.random() * 20) + 70, // 70-90
      moodTrend: "positive",
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Voice analysis error:", error);
    return NextResponse.json({ error: error.message || "Failed to process audio" }, { status: 500 });
  }
}
