import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // Allow up to 60 seconds for Vercel Serverless Function to prevent 504 timeouts

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing NVIDIA API Key" }, { status: 500 });
    }

    const prompt = `Analyze this human face for wellness biomarkers. Output ONLY valid JSON, no markdown formatting.
    Extract the following metrics (0-100 scale, where 100 is optimal/highest):
    {
      "stressIndicator": <number>,
      "eyeFatigue": <number>,
      "sleepDeprivation": <number>,
      "hydrationClues": <number>,
      "skinBrightness": <number>,
      "attentionLevel": <number>,
      "generalWellness": <number>,
      "summary": "<short description of the facial state>"
    }`;

    // Ensure it's a full data URI for OpenAI compatible endpoints
    const dataUri = imageBase64.startsWith("data:") 
      ? imageBase64 
      : `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`;

    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta/llama-3.2-11b-vision-instruct",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: dataUri } }
            ]
          }
        ],
        temperature: 0.5,
        max_tokens: 512,
      })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`NVIDIA API error ${res.status}: ${text}`);
    }

    const result = await res.json();
    const text = result.choices?.[0]?.message?.content || "";
    
    // Extract JSON if it was wrapped in markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response");
    }

    const data = JSON.parse(jsonMatch[0]);
    data.timestamp = new Date().toISOString();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Face analysis error:", error);
    return NextResponse.json({ error: error.message || "Failed to process image" }, { status: 500 });
  }
}
