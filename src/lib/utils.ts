import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scoreToLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  if (score >= 40) return "Needs Attention";
  return "Critical";
}

export function scoreToColor(score: number): string {
  if (score >= 85) return "hsl(160, 84%, 60%)";
  if (score >= 70) return "hsl(142, 71%, 55%)";
  if (score >= 55) return "hsl(48, 96%, 53%)";
  if (score >= 40) return "hsl(25, 95%, 53%)";
  return "hsl(0, 84%, 60%)";
}

export function scoreToGradient(score: number): string {
  if (score >= 85) return "from-emerald-400 to-cyan-400";
  if (score >= 70) return "from-green-400 to-emerald-400";
  if (score >= 55) return "from-yellow-400 to-amber-400";
  if (score >= 40) return "from-orange-400 to-red-400";
  return "from-red-500 to-rose-500";
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
