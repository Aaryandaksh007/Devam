import type { GameState, Achievement, DailyMission } from "./types";

export const LEVEL_THRESHOLDS = [
  0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200,
  6500, 8000, 10000, 12500, 15000, 18000, 22000, 27000, 33000, 40000,
];

export const LEVEL_TITLES = [
  "Newcomer", "Explorer", "Seeker", "Learner", "Tracker",
  "Observer", "Analyst", "Optimizer", "Master", "Guardian",
  "Champion", "Sage", "Visionary", "Legend", "Transcendent",
  "Immortal", "Cosmic", "Ethereal", "Infinite", "Ascended",
];

export function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXPProgress(xp: number): { current: number; required: number; percentage: number } {
  const level = getLevelFromXP(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold + 5000;
  const current = xp - currentThreshold;
  const required = nextThreshold - currentThreshold;
  return { current, required, percentage: Math.min(100, (current / required) * 100) };
}

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

export function calculateStreak(lastActiveDate: string): number {
  const last = new Date(lastActiveDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays <= 1 ? 1 : 0;
}
