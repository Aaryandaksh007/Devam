export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: "male" | "female" | "other";
  avatar?: string;
  joinedAt: string;
}

export interface FaceAnalysis {
  stressIndicator: number;
  eyeFatigue: number;
  sleepDeprivation: number;
  hydrationClues: number;
  skinBrightness: number;
  attentionLevel: number;
  generalWellness: number;
  timestamp: string;
}

export interface VoiceAnalysis {
  stress: number;
  energy: number;
  confidence: number;
  fatigue: number;
  speechStability: number;
  moodTrend: "positive" | "neutral" | "negative";
  timestamp: string;
}

export interface LifestyleData {
  sleepHours: number;
  exerciseMinutes: number;
  dietQuality: number;
  waterIntake: number;
  screenTimeHours: number;
  caffeineIntake: number;
  smokingFrequency: "none" | "occasional" | "regular";
  alcoholFrequency: "none" | "occasional" | "moderate" | "heavy";
  workingHours: number;
  studyHours: number;
  mentalWellness: number;
}

export interface WearableData {
  heartRate: number;
  heartRateVariability: number;
  sleepScore: number;
  steps: number;
  calories: number;
  spO2: number;
  restingHeartRate: number;
  activeMinutes: number;
  history: WearableSnapshot[];
}

export interface WearableSnapshot {
  date: string;
  heartRate: number;
  hrv: number;
  sleepScore: number;
  steps: number;
  calories: number;
  spO2: number;
  restingHR: number;
  activeMinutes: number;
  stressLevel: number;
}

export interface WellnessScores {
  overall: number;
  stress: number;
  recovery: number;
  hydration: number;
  sleepQuality: number;
  energy: number;
  focus: number;
  mentalWellness: number;
  activity: number;
  lifestyle: number;
  consistency: number;
  healthAge: number;
  longevityDelta: number;
  cognitiveLoadScore: number;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: "stress" | "sleep" | "activity" | "nutrition" | "mental" | "recovery" | "hydration" | "general";
  severity: "info" | "warning" | "critical" | "positive";
  contributingFactors: ContributingFactor[];
  confidence: number;
  trend: "improving" | "stable" | "declining";
  suggestions: string[];
  timestamp: string;
}

export interface ContributingFactor {
  name: string;
  impact: number; // percentage
  direction: "positive" | "negative";
}

export interface FuturePrediction {
  id: string;
  label: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
  trend: "up" | "down" | "stable";
  explanation: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  category: "streak" | "milestone" | "challenge" | "wellness";
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  category: "hydration" | "activity" | "sleep" | "mindfulness" | "nutrition";
  target?: number;
  current?: number;
}

export interface GameState {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  achievements: Achievement[];
  dailyMissions: DailyMission[];
  weeklyChallenge: {
    title: string;
    description: string;
    progress: number;
    target: number;
    xpReward: number;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  empathyTone?: "compassionate" | "motivational" | "analytical" | "urgent";
}

export interface CommunityInsight {
  metric: string;
  userValue: number;
  communityAverage: number;
  percentile: number;
  ageGroupAverage: number;
  unit: string;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  overallScore: number;
  previousScore: number;
  strengths: string[];
  improvements: string[];
  topInsights: AIInsight[];
  recommendations: string[];
  achievementsUnlocked: number;
  streakDays: number;
  encouragement: string;
}

export interface ScanData {
  face?: FaceAnalysis;
  voice?: VoiceAnalysis;
  lifestyle?: LifestyleData;
  wearable?: WearableData;
}

export type ScanStep = "face" | "voice" | "lifestyle" | "wearable" | "processing" | "complete";

export interface MorningBriefing {
  greeting: string;
  todayFocus: string;
  predictedEnergy: number;
  predictedStress: number;
  topMission: DailyMission;
  motivationalQuote: string;
}

export interface EveningReflection {
  summary: string;
  accomplishments: string[];
  tomorrowAdvice: string;
  sleepRecommendation: string;
  gratitudePrompt: string;
}

/* -------------------------------------------------------------------------- */
/*                        V2 PREMIUM FEATURE INTERFACES                       */
/* -------------------------------------------------------------------------- */

export interface BurnoutIndicator {
  probability: number; // 0-100%
  riskLevel: "low" | "moderate" | "high" | "critical";
  timeToBurnoutDays?: number;
  keyRiskFactors: string[];
  preventativeActions: string[];
}

export interface SmartHabit {
  id: string;
  habitName: string;
  correlatedMetric: string;
  correlationStrength: number; // 0-100%
  description: string;
  impactType: "positive" | "negative";
}

export interface RecoveryForecast {
  currentCapacity: number; // 0-100%
  predicted100PercentTime: string; // ISO String or relative e.g., "Tomorrow at 8 AM"
  limitingFactors: string[];
  accelerationTips: string[];
}

export interface AIWellnessTimelineEvent {
  id: string;
  date: string;
  eventType: "milestone" | "anomaly" | "habit_formed" | "intervention";
  title: string;
  description: string;
  impactScore?: number; // +/- change in overall wellness
}

export interface WearableAnomaly {
  id: string;
  metric: string;
  timestamp: string;
  expectedRange: string;
  actualValue: string;
  severity: "low" | "medium" | "high";
  description: string;
  actionRequired?: string;
}

export interface CognitiveLoad {
  currentLevel: number; // 0-100
  status: "optimal" | "fatigued" | "overloaded";
  contributingFactors: { name: string; impact: number }[];
  recommendedBreakInMinutes: number;
}

export interface SleepArchitecture {
  idealBedtime: string;
  idealWakeTime: string;
  windDownRoutine: string[];
  predictedQuality: number; // 0-100
}

export interface SeasonalInsight {
  season: "Spring" | "Summer" | "Autumn" | "Winter";
  affectedMetrics: string[];
  description: string;
  recommendation: string;
}

export interface DietaryImpact {
  foodCategory: string;
  energyImpact: number; // -100 to 100
  moodImpact: number; // -100 to 100
  description: string;
}

export interface PersonalizedGoal {
  id: string;
  title: string;
  metric: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: "on_track" | "at_risk" | "completed";
}
