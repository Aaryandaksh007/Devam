import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // Allow up to 60 seconds for Vercel Serverless Function to prevent 504 timeouts

export async function POST(req: NextRequest) {
  try {
    const { message, scanData, scores, history } = await req.json();

    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      // Fallback — return a generic response if no API key
      return NextResponse.json({
        response: {
          text: "I'm currently in demo mode. Please try the demo to explore my full capabilities!",
          empathyTone: "analytical",
        },
      });
    }

    // Build a context-aware prompt for the AI wellness coach
    const stress = scores?.stress || 50;
    const empathyDirective =
      stress > 70
        ? "Use a compassionate, gentle tone. The user appears highly stressed."
        : stress < 40
        ? "Use a motivational, upbeat tone. The user is doing well."
        : "Use an analytical, balanced tone.";

    const scoresContext = scores
      ? `USER'S CURRENT WELLNESS SCORES: Overall: ${scores.overall}/100, Stress: ${scores.stress}/100, Recovery: ${scores.recovery}/100, Sleep Quality: ${scores.sleepQuality}/100, Energy: ${scores.energy}/100, Focus: ${scores.focus}/100, Mental Wellness: ${scores.mentalWellness}/100, Hydration: ${scores.hydration}/100, Activity: ${scores.activity}/100, Health Age: ${scores.healthAge}, Consistency: ${scores.consistency}/100.`
      : "No wellness scores available yet.";

    const recentHistory = (history || [])
      .slice(-6)
      .map((h: any) => `${h.role}: ${h.content}`)
      .join("\n");

    const systemPrompt = `You are LifeDrishti AI Coach, a warm, knowledgeable, and empathetic wellness assistant. You provide personalized health insights based on the user's multi-modal wellness data (face, voice, lifestyle, wearable).

CRITICAL RULES:
1. ${empathyDirective}
2. Always reference the user's ACTUAL data when answering.
3. Use bullet points and structured formatting for readability.
4. Keep responses concise (150-250 words max).
5. End every response with a brief wellness disclaimer in italics.
6. Never diagnose diseases or recommend medications.
7. You are an EDUCATIONAL wellness assistant, NOT a medical professional.
8. ALWAYS respond in the EXACT SAME LANGUAGE as the user's message (e.g., if they speak Hindi, respond in Hindi).

${scoresContext}

RECENT CONVERSATION:
${recentHistory}`;

    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`NVIDIA Chat API error ${res.status}: ${errText}`);
      throw new Error(`NVIDIA API error ${res.status}`);
    }

    const result = await res.json();
    const text = result.choices?.[0]?.message?.content || "";

    const empathyTone =
      stress > 70 ? "compassionate" : stress < 40 ? "motivational" : "analytical";

    return NextResponse.json({
      response: {
        text: text.trim(),
        empathyTone,
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      response: {
        text: "I'm having trouble processing right now. Please try again in a moment. In the meantime, remember to stay hydrated and take short breaks!\n\n*LifeDrishti AI is an educational wellness tool, not a medical diagnostic system.*",
        empathyTone: "analytical",
      },
    }, { status: 200 });
  }
}
