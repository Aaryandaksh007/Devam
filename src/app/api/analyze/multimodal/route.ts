import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60; // Allow up to 60 seconds for Vercel Serverless Function to prevent 504 timeouts

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scanData } = body;

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing NVIDIA API Key" }, { status: 500 });
    }

    const prompt = `You are LifeDrishti AI, an elite educational wellness intelligence engine. Analyze the following multi-modal wellness data and generate a comprehensive V2 predictive wellness assessment. Output ONLY valid JSON matching the exact schema requested. No markdown wrapping.

FACE ANALYSIS: ${JSON.stringify(scanData.face)}
VOICE ANALYSIS: ${JSON.stringify(scanData.voice)}
LIFESTYLE DATA: ${JSON.stringify(scanData.lifestyle)}
WEARABLE DATA: ${JSON.stringify({
      heartRate: scanData.wearable?.heartRate,
      hrv: scanData.wearable?.heartRateVariability,
      sleepScore: scanData.wearable?.sleepScore,
      steps: scanData.wearable?.steps,
      restingHR: scanData.wearable?.restingHeartRate,
    })}

Generate a JSON response with this EXACT schema:
{
  "scores": {
    "overall": <0-100>, "stress": <0-100>, "recovery": <0-100>, "hydration": <0-100>,
    "sleepQuality": <0-100>, "energy": <0-100>, "focus": <0-100>, "mentalWellness": <0-100>,
    "activity": <0-100>, "lifestyle": <0-100>, "consistency": <0-100>, "healthAge": <age>,
    "longevityDelta": <estimated years added/lost>, "cognitiveLoadScore": <0-100>
  },
  "insights": [
    {
      "id": "<string>", "title": "<string>", "description": "<detailed correlation>",
      "category": "<stress|sleep|activity|nutrition|mental|recovery|hydration|general>",
      "severity": "<info|warning|critical|positive>",
      "contributingFactors": [{"name": "<factor>", "impact": <0-1>, "direction": "<positive|negative>"}],
      "confidence": <0-100>, "trend": "<improving|stable|declining>", "suggestions": ["<string>"]
    }
  ],
  "predictions": [
    {
      "id": "<string>", "label": "<string>", "currentValue": <number>, "predictedValue": <number>,
      "confidence": <0-100>, "timeframe": "<string>", "trend": "<up|down|stable>", "explanation": "<string>"
    }
  ],
  "burnout": {
    "probability": <0-100>, "riskLevel": "<low|moderate|high|critical>", "timeToBurnoutDays": <number>,
    "keyRiskFactors": ["<string>"], "preventativeActions": ["<string>"]
  },
  "habits": [
    {
      "id": "<string>", "habitName": "<string>", "correlatedMetric": "<string>",
      "correlationStrength": <0-100>, "description": "<string>", "impactType": "<positive|negative>"
    }
  ],
  "recovery": {
    "currentCapacity": <0-100>, "predicted100PercentTime": "<string>",
    "limitingFactors": ["<string>"], "accelerationTips": ["<string>"]
  },
  "cognitiveLoad": {
    "currentLevel": <0-100>, "status": "<optimal|fatigued|overloaded>",
    "contributingFactors": [{"name": "<string>", "impact": <number>}], "recommendedBreakInMinutes": <number>
  }
}

Ensure robust cross-referencing between modalities.`;

    const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-8b-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 4096,
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`NVIDIA API error ${res.status}: ${errText}`);
    }

    const result = await res.json();
    const text = result.choices?.[0]?.message?.content || "";
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Add timestamps and IDs
    parsed.insights = parsed.insights.map((ins: any, i: number) => ({ ...ins, id: ins.id || `ai-${i}`, timestamp: new Date().toISOString() }));
    parsed.predictions = parsed.predictions.map((p: any, i: number) => ({ ...p, id: p.id || `pred-${i}` }));

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Multimodal analysis error:", error);
    return NextResponse.json({ error: error.message || "Failed to process multimodal data" }, { status: 500 });
  }
}
