import type {
  FaceAnalysis, VoiceAnalysis, LifestyleData, WearableData, WearableSnapshot,
  WellnessScores, AIInsight, FuturePrediction, Achievement, DailyMission,
  GameState, CommunityInsight, WeeklyReport, UserProfile, ScanData,
  MorningBriefing, EveningReflection,
  BurnoutIndicator, SmartHabit, RecoveryForecast, AIWellnessTimelineEvent,
  WearableAnomaly, CognitiveLoad, SleepArchitecture, SeasonalInsight,
  DietaryImpact, PersonalizedGoal
} from "./types";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rng = seededRandom(42);
const r = (min: number, max: number) => Math.round(min + rng() * (max - min));
const rf = (min: number, max: number) => +(min + rng() * (max - min)).toFixed(1);

function generateHistory(days: number): WearableSnapshot[] {
  const history: WearableSnapshot[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayVariation = Math.sin(i * 0.8) * 10;
    history.push({
      date: d.toISOString().slice(0, 10),
      heartRate: r(62, 78) + Math.round(dayVariation * 0.3),
      hrv: r(35, 65) - Math.round(dayVariation * 0.2),
      sleepScore: r(60, 92) - Math.round(dayVariation * 0.4),
      steps: r(4000, 12000) + Math.round(dayVariation * 100),
      calories: r(1800, 2800),
      spO2: rf(95, 99),
      restingHR: r(56, 68),
      activeMinutes: r(15, 90),
      stressLevel: r(20, 75) + Math.round(dayVariation * 0.5),
    });
  }
  return history;
}

export const DEMO_FACE: FaceAnalysis = {
  stressIndicator: 62,
  eyeFatigue: 55,
  sleepDeprivation: 48,
  hydrationClues: 71,
  skinBrightness: 68,
  attentionLevel: 73,
  generalWellness: 66,
  timestamp: new Date().toISOString(),
};

export const DEMO_VOICE: VoiceAnalysis = {
  stress: 58,
  energy: 64,
  confidence: 72,
  fatigue: 45,
  speechStability: 78,
  moodTrend: "neutral",
  timestamp: new Date().toISOString(),
};

export const DEMO_LIFESTYLE: LifestyleData = {
  sleepHours: 6.5,
  exerciseMinutes: 30,
  dietQuality: 65,
  waterIntake: 5,
  screenTimeHours: 8,
  caffeineIntake: 3,
  smokingFrequency: "none",
  alcoholFrequency: "occasional",
  workingHours: 9,
  studyHours: 2,
  mentalWellness: 68,
};

const history = generateHistory(30);

export const DEMO_WEARABLE: WearableData = {
  heartRate: 72,
  heartRateVariability: 48,
  sleepScore: 74,
  steps: 7842,
  calories: 2150,
  spO2: 97.2,
  restingHeartRate: 62,
  activeMinutes: 42,
  history,
};

export const DEMO_SCORES: WellnessScores = {
  overall: 72,
  stress: 62,
  recovery: 68,
  hydration: 71,
  sleepQuality: 65,
  energy: 70,
  focus: 73,
  mentalWellness: 68,
  activity: 66,
  lifestyle: 69,
  consistency: 74,
  healthAge: 27,
  longevityDelta: 2.5,
  cognitiveLoadScore: 75,
};

export const DEMO_INSIGHTS: AIInsight[] = [
  {
    id: "ins-1",
    title: "Sleep Duration Below Optimal",
    description: "Your average sleep of 6.5 hours is below the recommended 7-9 hours. This correlates with elevated morning stress levels and reduced HRV observed in your wearable data.",
    category: "sleep",
    severity: "warning",
    contributingFactors: [
      { name: "Sleep Duration", impact: 0.4, direction: "negative" },
      { name: "Screen Time", impact: 0.25, direction: "negative" },
      { name: "Caffeine Intake", impact: 0.15, direction: "negative" },
      { name: "Work Hours", impact: 0.2, direction: "negative" },
    ],
    confidence: 87,
    trend: "declining",
    suggestions: [
      "Aim for 7+ hours of sleep tonight",
      "Reduce screen time 1 hour before bed",
      "Limit caffeine after 2 PM",
      "Consider a consistent bedtime routine",
    ],
    timestamp: new Date().toISOString(),
  },
  {
    id: "ins-2",
    title: "Stress Recovery Improving",
    description: "Your heart rate variability has shown a 12% improvement over the past 5 days, suggesting better stress recovery. Your morning exercise sessions correlate strongly with this improvement.",
    category: "recovery",
    severity: "positive",
    contributingFactors: [
      { name: "Morning Exercise", impact: 0.45, direction: "positive" },
      { name: "HRV Trend", impact: 0.3, direction: "positive" },
      { name: "Resting Heart Rate", impact: 0.25, direction: "positive" },
    ],
    confidence: 82,
    trend: "improving",
    suggestions: [
      "Keep up the morning exercise routine",
      "Consider adding 5 minutes of stretching",
      "Track which exercises give you the best recovery",
    ],
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "ins-3",
    title: "Hydration Trending Down",
    description: "Your water intake has gradually declined this week from 7 glasses to 5 glasses daily. Your face analysis suggests mild dehydration indicators, and skin brightness has decreased.",
    category: "hydration",
    severity: "warning",
    contributingFactors: [
      { name: "Water Intake", impact: 0.5, direction: "negative" },
      { name: "Skin Brightness", impact: 0.2, direction: "negative" },
      { name: "Caffeine Ratio", impact: 0.3, direction: "negative" },
    ],
    confidence: 79,
    trend: "declining",
    suggestions: [
      "Set hourly water reminders",
      "Replace one coffee with herbal tea",
      "Keep a water bottle at your desk",
      "Eat water-rich fruits and vegetables",
    ],
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "ins-4",
    title: "Voice Energy Correlates with Sleep",
    description: "Your voice energy increases significantly on days you sleep more than 7 hours. Today's voice analysis shows moderate energy, consistent with last night's 6.5 hours of sleep.",
    category: "general",
    severity: "info",
    contributingFactors: [
      { name: "Sleep Duration", impact: 0.6, direction: "negative" },
      { name: "Voice Energy Score", impact: 0.4, direction: "negative" },
    ],
    confidence: 74,
    trend: "stable",
    suggestions: [
      "Prioritize 7+ hours of sleep for better daytime energy",
      "Your optimal sleep window appears to be 10:30 PM - 6:00 AM",
    ],
    timestamp: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "ins-5",
    title: "Focus Drops After Extended Screen Time",
    description: "Your focus and attention levels decrease significantly after 6 hours of continuous screen time. Consider implementing the 20-20-20 rule and scheduled breaks.",
    category: "mental",
    severity: "info",
    contributingFactors: [
      { name: "Screen Time", impact: 0.45, direction: "negative" },
      { name: "Eye Fatigue", impact: 0.3, direction: "negative" },
      { name: "Attention Level", impact: 0.25, direction: "negative" },
    ],
    confidence: 81,
    trend: "stable",
    suggestions: [
      "Take a 5-minute break every 50 minutes",
      "Use the 20-20-20 rule: look at something 20 feet away for 20 seconds every 20 minutes",
      "Consider blue light filtering glasses",
    ],
    timestamp: new Date(Date.now() - 21600000).toISOString(),
  },
];

export const DEMO_PREDICTIONS: FuturePrediction[] = [
  {
    id: "pred-1",
    label: "Tomorrow's Energy",
    currentValue: 70,
    predictedValue: 74,
    confidence: 78,
    timeframe: "Tomorrow",
    trend: "up",
    explanation: "Based on your planned early bedtime and lower caffeine intake today, we predict slightly higher energy levels tomorrow.",
  },
  {
    id: "pred-2",
    label: "Tomorrow's Stress",
    currentValue: 62,
    predictedValue: 58,
    confidence: 72,
    timeframe: "Tomorrow",
    trend: "down",
    explanation: "Your exercise session today and improving HRV trend suggest lower stress levels tomorrow.",
  },
  {
    id: "pred-3",
    label: "Weekly Recovery",
    currentValue: 68,
    predictedValue: 75,
    confidence: 65,
    timeframe: "Next 7 days",
    trend: "up",
    explanation: "If you maintain your current exercise routine and improve sleep to 7+ hours, your recovery score should reach 75 by next week.",
  },
  {
    id: "pred-4",
    label: "Health Momentum",
    currentValue: 72,
    predictedValue: 78,
    confidence: 60,
    timeframe: "Next 30 days",
    trend: "up",
    explanation: "Your consistent daily activity and gradual improvement trends suggest your overall wellness could reach 78 within a month.",
  },
];

export const DEMO_ACHIEVEMENTS: Achievement[] = [
  { id: "ach-1", title: "First Scan", description: "Complete your first AI wellness scan", icon: "🔬", unlocked: true, unlockedAt: new Date().toISOString(), xpReward: 100, category: "milestone" },
  { id: "ach-2", title: "Hydration Hero", description: "Drink 8+ glasses of water for 3 days straight", icon: "💧", unlocked: true, unlockedAt: new Date(Date.now() - 86400000).toISOString(), xpReward: 150, category: "challenge" },
  { id: "ach-3", title: "Early Bird", description: "Wake up before 7 AM for 5 days", icon: "🌅", unlocked: true, unlockedAt: new Date(Date.now() - 172800000).toISOString(), xpReward: 200, category: "streak" },
  { id: "ach-4", title: "Step Master", description: "Reach 10,000 steps in a single day", icon: "👟", unlocked: true, unlockedAt: new Date(Date.now() - 259200000).toISOString(), xpReward: 150, category: "milestone" },
  { id: "ach-5", title: "Zen Mode", description: "Achieve stress score below 30 for a full day", icon: "🧘", unlocked: false, xpReward: 250, category: "wellness" },
  { id: "ach-6", title: "Week Warrior", description: "Maintain a 7-day streak", icon: "🔥", unlocked: true, unlockedAt: new Date(Date.now() - 604800000).toISOString(), xpReward: 300, category: "streak" },
  { id: "ach-7", title: "Recovery Champion", description: "Reach recovery score of 90+", icon: "💚", unlocked: false, xpReward: 350, category: "wellness" },
  { id: "ach-8", title: "Perfect Sleep", description: "Sleep 8+ hours for 3 nights straight", icon: "😴", unlocked: false, xpReward: 200, category: "challenge" },
  { id: "ach-9", title: "Wellness Explorer", description: "Use every feature of LifeDrishti AI", icon: "🧭", unlocked: false, xpReward: 500, category: "milestone" },
  { id: "ach-10", title: "Month Master", description: "Maintain a 30-day streak", icon: "👑", unlocked: false, xpReward: 1000, category: "streak" },
];

export const DEMO_MISSIONS: DailyMission[] = [
  { id: "mis-1", title: "Hydration Check", description: "Drink at least 8 glasses of water today", xpReward: 50, completed: false, category: "hydration", target: 8, current: 5 },
  { id: "mis-2", title: "Move & Groove", description: "Get at least 30 minutes of active movement", xpReward: 75, completed: true, category: "activity", target: 30, current: 42 },
  { id: "mis-3", title: "Screen Break", description: "Take a 5-minute break from screens every hour", xpReward: 40, completed: false, category: "mindfulness", target: 8, current: 3 },
  { id: "mis-4", title: "Mindful Moment", description: "Spend 5 minutes on deep breathing or meditation", xpReward: 60, completed: false, category: "mindfulness" },
  { id: "mis-5", title: "Early Rest", description: "Start winding down by 10 PM tonight", xpReward: 50, completed: false, category: "sleep" },
];

export const DEMO_GAME_STATE: GameState = {
  xp: 1850,
  level: 7,
  streak: 12,
  longestStreak: 18,
  achievements: DEMO_ACHIEVEMENTS,
  dailyMissions: DEMO_MISSIONS,
  weeklyChallenge: {
    title: "Consistency King",
    description: "Complete all daily missions for 5 out of 7 days this week",
    progress: 3,
    target: 5,
    xpReward: 500,
  },
};

export const DEMO_COMMUNITY: CommunityInsight[] = [
  { metric: "Sleep", userValue: 6.5, communityAverage: 7.1, percentile: 38, ageGroupAverage: 6.8, unit: "hrs" },
  { metric: "Steps", userValue: 7842, communityAverage: 8200, percentile: 45, ageGroupAverage: 7500, unit: "steps" },
  { metric: "Stress", userValue: 62, communityAverage: 55, percentile: 65, ageGroupAverage: 58, unit: "score" },
  { metric: "Hydration", userValue: 5, communityAverage: 6.5, percentile: 32, ageGroupAverage: 6.0, unit: "glasses" },
  { metric: "Active Minutes", userValue: 42, communityAverage: 45, percentile: 48, ageGroupAverage: 38, unit: "min" },
  { metric: "Heart Rate", userValue: 72, communityAverage: 70, percentile: 55, ageGroupAverage: 71, unit: "bpm" },
];

export const DEMO_WEEKLY_REPORT: WeeklyReport = {
  weekStart: new Date(Date.now() - 604800000).toISOString().slice(0, 10),
  weekEnd: new Date().toISOString().slice(0, 10),
  overallScore: 72,
  previousScore: 68,
  strengths: [
    "Consistent morning exercise routine",
    "Improving heart rate variability",
    "Good speech stability and confidence levels",
    "Steady resting heart rate",
  ],
  improvements: [
    "Increase sleep duration to 7+ hours",
    "Improve daily water intake",
    "Reduce evening screen time",
    "Add more variety to diet",
  ],
  topInsights: DEMO_INSIGHTS.slice(0, 3),
  recommendations: [
    "Establish a consistent bedtime of 10:30 PM",
    "Set hourly hydration reminders on your phone",
    "Introduce a 10-minute stretching routine after waking up",
    "Try replacing afternoon coffee with green tea",
    "Schedule a 20-minute walk during lunch break",
  ],
  achievementsUnlocked: 4,
  streakDays: 12,
  encouragement: "You're making steady progress! Your recovery score improved by 6% this week, and your exercise consistency is excellent. Small improvements in sleep and hydration will unlock significant wellness gains. Keep going — you're building a healthier future one day at a time! 💪",
};

export const DEMO_USER: UserProfile = {
  id: "demo-user-1",
  name: "Alex Chen",
  email: "alex@lifedrishti.demo",
  age: 28,
  gender: "male",
  joinedAt: new Date(Date.now() - 2592000000).toISOString(),
};

export const DEMO_SCAN_DATA: ScanData = {
  face: DEMO_FACE,
  voice: DEMO_VOICE,
  lifestyle: DEMO_LIFESTYLE,
  wearable: DEMO_WEARABLE,
};

export const DEMO_MORNING: MorningBriefing = {
  greeting: "Good morning, Alex! ☀️",
  todayFocus: "Your HRV improved overnight — great recovery. Let's capitalize on this energy with a focused morning workout and steady hydration.",
  predictedEnergy: 74,
  predictedStress: 45,
  topMission: DEMO_MISSIONS[0],
  motivationalQuote: "The greatest wealth is health. — Virgil",
};

export const DEMO_EVENING: EveningReflection = {
  summary: "Today was a productive day. You completed 2 out of 5 missions and maintained consistent activity levels. Your stress stayed manageable throughout the afternoon.",
  accomplishments: [
    "Hit your exercise goal with 42 active minutes",
    "Maintained stable heart rate throughout the day",
    "Took 3 screen breaks (aim for more tomorrow)",
  ],
  tomorrowAdvice: "Try to get to bed 30 minutes earlier tonight. Your data shows you perform best with 7+ hours of sleep.",
  sleepRecommendation: "Start winding down at 10:00 PM. Dim lights, put away screens, and try a few minutes of deep breathing.",
  gratitudePrompt: "What's one healthy choice you made today that you're proud of?",
};

export function generateStressHeatmap(): number[][] {
  const heatmap: number[][] = [];
  for (let day = 0; day < 7; day++) {
    const row: number[] = [];
    for (let hour = 0; hour < 24; hour++) {
      let base = 30;
      if (hour >= 0 && hour < 6) base = 15 + r(0, 10);
      else if (hour >= 6 && hour < 9) base = 25 + r(0, 15);
      else if (hour >= 9 && hour < 12) base = 40 + r(0, 20);
      else if (hour >= 12 && hour < 14) base = 35 + r(0, 15);
      else if (hour >= 14 && hour < 18) base = 50 + r(0, 25);
      else if (hour >= 18 && hour < 21) base = 35 + r(0, 20);
      else base = 25 + r(0, 15);
      row.push(Math.min(100, base));
    }
    heatmap.push(row);
  }
  return heatmap;
}

export function generateMoodCalendar(): { date: string; mood: number; emoji: string }[] {
  const calendar: { date: string; mood: number; emoji: string }[] = [];
  const now = new Date();
  const emojis = ["😫", "😟", "😐", "🙂", "😊", "😄"];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const mood = r(1, 5);
    calendar.push({
      date: d.toISOString().slice(0, 10),
      mood,
      emoji: emojis[mood],
    });
  }
  return calendar;
}

/* -------------------------------------------------------------------------- */
/*                        V2 PREMIUM FEATURE DEMO DATA                        */
/* -------------------------------------------------------------------------- */

export const DEMO_BURNOUT: BurnoutIndicator = {
  probability: 42,
  riskLevel: "moderate",
  timeToBurnoutDays: 14,
  keyRiskFactors: [
    "Sustained elevated evening cortisol proxy (HRV drops)",
    "Consistent screen time > 8hrs/day",
    "Shortened sleep duration trends over 5 days"
  ],
  preventativeActions: [
    "Implement a hard stop on work emails at 6 PM",
    "Increase weekend active recovery (light walking)",
    "Ensure 7.5+ hours of sleep tonight"
  ]
};

export const DEMO_SMART_HABITS: SmartHabit[] = [
  {
    id: "sh-1",
    habitName: "Late Night Screen Time",
    correlatedMetric: "Morning Energy Score",
    correlationStrength: 82,
    description: "When you use screens past 10 PM, your morning energy score drops by an average of 15%.",
    impactType: "negative"
  },
  {
    id: "sh-2",
    habitName: "Morning Hydration",
    correlatedMetric: "Afternoon Focus",
    correlationStrength: 75,
    description: "Drinking 2+ glasses of water before 9 AM is strongly correlated with sustained focus at 2 PM.",
    impactType: "positive"
  }
];

export const DEMO_RECOVERY_FORECAST: RecoveryForecast = {
  currentCapacity: 68,
  predicted100PercentTime: "Tomorrow at 9:00 AM",
  limitingFactors: ["Mild sleep debt", "Accumulated muscular fatigue from yesterday"],
  accelerationTips: ["15 minutes of foam rolling", "Magnesium supplement before bed"]
};

export const DEMO_TIMELINE_EVENTS: AIWellnessTimelineEvent[] = [
  {
    id: "tl-1",
    date: new Date(Date.now() - 172800000).toISOString(),
    eventType: "anomaly",
    title: "HRV Drop Detected",
    description: "Unusual drop in HRV detected. Possibly linked to late meal.",
    impactScore: -4
  },
  {
    id: "tl-2",
    date: new Date(Date.now() - 432000000).toISOString(),
    eventType: "habit_formed",
    title: "Consistent Morning Routine",
    description: "Maintained morning workout for 7 consecutive days.",
    impactScore: +8
  },
  {
    id: "tl-3",
    date: new Date(Date.now() - 1209600000).toISOString(),
    eventType: "milestone",
    title: "Wellness Peak",
    description: "Achieved highest monthly wellness score (82).",
    impactScore: +5
  }
];

export const DEMO_ANOMALIES: WearableAnomaly[] = [
  {
    id: "wa-1",
    metric: "Resting Heart Rate",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    expectedRange: "55 - 65 bpm",
    actualValue: "72 bpm",
    severity: "low",
    description: "Elevated resting heart rate detected during sedentary period.",
    actionRequired: "Monitor for signs of mild stress or impending illness."
  }
];

export const DEMO_COGNITIVE_LOAD: CognitiveLoad = {
  currentLevel: 75,
  status: "fatigued",
  contributingFactors: [
    { name: "Continuous Focus Blocks", impact: 40 },
    { name: "Blue Light Exposure", impact: 35 },
    { name: "Mild Dehydration", impact: 25 }
  ],
  recommendedBreakInMinutes: 15
};

export const DEMO_SLEEP_ARCH: SleepArchitecture = {
  idealBedtime: "10:15 PM",
  idealWakeTime: "06:30 AM",
  windDownRoutine: [
    "9:15 PM - Dim overhead lights",
    "9:30 PM - Stop screen usage",
    "9:45 PM - Light reading or stretching",
    "10:15 PM - Lights out"
  ],
  predictedQuality: 88
};

export const DEMO_SEASONAL: SeasonalInsight = {
  season: "Autumn",
  affectedMetrics: ["Vitamin D / Energy", "Sleep Onset"],
  description: "As daylight hours decrease, you typically experience a 10% drop in morning energy.",
  recommendation: "Consider a light therapy lamp in the morning and a Vitamin D supplement."
};

export const DEMO_DIET_IMPACT: DietaryImpact = {
  foodCategory: "High Glycemic Carbs",
  energyImpact: -25,
  moodImpact: -15,
  description: "Meals heavy in simple carbs are consistently followed by an energy crash 2 hours later."
};

export const DEMO_GOALS: PersonalizedGoal[] = [
  {
    id: "g-1",
    title: "Optimize Sleep Window",
    metric: "Sleep Quality",
    targetValue: 85,
    currentValue: 65,
    deadline: new Date(Date.now() + 1209600000).toISOString(),
    status: "at_risk"
  },
  {
    id: "g-2",
    title: "Sustain HRV Improvements",
    metric: "Heart Rate Variability",
    targetValue: 55,
    currentValue: 48,
    deadline: new Date(Date.now() + 604800000).toISOString(),
    status: "on_track"
  }
];
