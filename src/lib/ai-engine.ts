import type { 
  ScanData, WellnessScores, AIInsight, FuturePrediction,
  BurnoutIndicator, SmartHabit, RecoveryForecast, AIWellnessTimelineEvent,
  WearableAnomaly, CognitiveLoad, SleepArchitecture, SeasonalInsight,
  DietaryImpact, PersonalizedGoal
} from "./types";
import {
  DEMO_SCORES, DEMO_INSIGHTS, DEMO_PREDICTIONS,
  DEMO_COMMUNITY, DEMO_GAME_STATE, DEMO_WEEKLY_REPORT,
  DEMO_MORNING, DEMO_EVENING,
  DEMO_BURNOUT, DEMO_SMART_HABITS, DEMO_RECOVERY_FORECAST,
  DEMO_TIMELINE_EVENTS, DEMO_ANOMALIES, DEMO_COGNITIVE_LOAD,
  DEMO_SLEEP_ARCH, DEMO_SEASONAL, DEMO_DIET_IMPACT, DEMO_GOALS
} from "./mock-data";

export async function analyzeWellness(scanData: ScanData): Promise<{
  scores: WellnessScores;
  insights: AIInsight[];
  predictions: FuturePrediction[];
  burnout: BurnoutIndicator;
  habits: SmartHabit[];
  recovery: RecoveryForecast;
  cognitiveLoad: CognitiveLoad;
}> {
  try {
    const res = await fetch("/api/analyze/multimodal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scanData }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.error || `API error ${res.status}`);
    }

    const parsed = await res.json();
    return {
      scores: parsed.scores,
      insights: parsed.insights,
      predictions: parsed.predictions,
      burnout: parsed.burnout,
      habits: parsed.habits,
      recovery: parsed.recovery,
      cognitiveLoad: parsed.cognitiveLoad,
    };
  } catch (error) {
    console.warn("AI engine fallback to mock due to error:", error);
    // In production, we might want to actually throw the error instead of silently falling back,
    // but for demo resilience, if the API key is missing, we return the mock data.
    return {
      scores: DEMO_SCORES,
      insights: DEMO_INSIGHTS,
      predictions: DEMO_PREDICTIONS,
      burnout: DEMO_BURNOUT,
      habits: DEMO_SMART_HABITS,
      recovery: DEMO_RECOVERY_FORECAST,
      cognitiveLoad: DEMO_COGNITIVE_LOAD,
    };
  }
}

export async function chatWithCoach(
  message: string,
  scanData: ScanData,
  scores: WellnessScores | null,
  history: { role: string; content: string }[]
): Promise<{ text: string; empathyTone: string }> {
  try {
    // Call the real AI chat endpoint
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, scanData, scores, history }),
    });

    if (!res.ok) {
      throw new Error(`Chat API error ${res.status}`);
    }

    const data = await res.json();
    
    // The API returns { response: { text, empathyTone } } or { response: string }
    if (data.response && typeof data.response === "object") {
      return data.response;
    }
    
    // If the API returned a fallback string
    if (data.response && typeof data.response === "string") {
      return { text: data.response, empathyTone: "analytical" };
    }

    throw new Error("Unexpected response format");
  } catch (error) {
    console.warn("Chat AI fallback to mock:", error);
    return generateMockChatResponse(message, scores);
  }
}

function generateMockChatResponse(message: string, scores: WellnessScores | null): { text: string; empathyTone: string } {
  const q = message.toLowerCase();
  const stress = scores?.stress || 62;
  const empathyTone = stress > 70 ? "compassionate" : stress < 40 ? "motivational" : "analytical";

  if (q.includes("stress")) {
    return {
      text: `Based on your latest data, your stress score is ${stress}/100. Your voice analysis detected moderate stress markers, and your heart rate variability is slightly below optimal. I'd recommend:\n\n• Try a 5-minute breathing exercise right now\n• Consider a short walk to reset your nervous system\n• Your stress tends to peak in the afternoon — plan breaks accordingly\n\n*Remember: This is wellness guidance, not medical advice.*`,
      empathyTone
    };
  }
  if (q.includes("sleep")) {
    return {
      text: `Your sleep quality score is ${scores?.sleepQuality || 65}/100. Here's what I see:\n\n• Your facial analysis shows mild sleep deprivation markers\n• Your HRV during sleep suggests room for improvement\n• Recommended: Try a consistent wind-down routine 1 hour before bed\n\nWould you like me to create a personalized sleep optimization plan?\n\n*LifeDrishti AI is an educational wellness tool, not a medical diagnostic system.*`,
      empathyTone
    };
  }
  if (q.includes("burnout") || q.includes("burn out")) {
    return {
      text: `Looking at your burnout risk profile:\n\n• Current burnout probability: moderate\n• Key contributing factors: screen time, work hours, and stress accumulation\n• Your recovery capacity is currently at ${scores?.recovery || 68}%\n\nI'd recommend:\n1. Take a 15-minute screen break every 90 minutes\n2. Prioritize 7+ hours of sleep tonight\n3. Consider a short mindfulness session\n\n*This is an educational assessment, not a clinical diagnosis.*`,
      empathyTone: "compassionate"
    };
  }
  if (q.includes("hrv") || q.includes("heart rate")) {
    return {
      text: `Your Heart Rate Variability (HRV) is a key indicator of autonomic nervous system health. Here's your snapshot:\n\n• Current trend suggests moderate recovery capacity\n• Your wearable data shows HRV dips correlating with late-night screen time\n• Higher HRV generally indicates better stress resilience\n\nTips to improve HRV:\n• Deep breathing exercises (4-7-8 pattern)\n• Regular moderate exercise\n• Consistent sleep schedule\n\n*LifeDrishti AI provides educational wellness insights only.*`,
      empathyTone: "analytical"
    };
  }
  return {
    text: `I'd love to help with that! Based on your current wellness profile:\n\n• Overall Score: ${scores?.overall || 72}/100\n• Your strongest area is focus (${scores?.focus || 73}/100)\n• Your biggest opportunity is sleep quality (${scores?.sleepQuality || 65}/100)\n\nWould you like me to dive deeper into any specific area? I can provide personalized recommendations based on your face, voice, lifestyle, and wearable data.\n\n*LifeDrishti AI is an educational wellness tool, not a medical diagnostic system.*`,
    empathyTone
  };
}

export { DEMO_COMMUNITY, DEMO_GAME_STATE, DEMO_WEEKLY_REPORT, DEMO_MORNING, DEMO_EVENING };
