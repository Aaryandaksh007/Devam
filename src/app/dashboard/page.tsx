"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { GlassCard } from "@/components/lifelens/glass-card";
import { AnimatedCounter } from "@/components/lifelens/animated-counter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { scoreToColor, scoreToLabel } from "@/lib/utils";
import { getLevelTitle, getXPProgress } from "@/lib/gamification";
import {
  TrendingUp, TrendingDown, Minus, Heart, Brain, Droplets,
  Moon, Zap, Eye, Activity, Target, Shield, Clock,
  Flame, Trophy, Star, ArrowRight, Sparkles, AlertTriangle,
  Sun, ChevronRight, Users, BarChart3, Calendar,
  Battery, Wind, BatteryCharging, ZapOff
} from "lucide-react";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  Radar, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip as RTooltip, Area
} from "recharts";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

// Sub-component: Burnout Gauge
function BurnoutGauge({ probability, riskLevel }: { probability: number, riskLevel: string }) {
  const color = riskLevel === 'critical' ? 'text-rose-500' : riskLevel === 'high' ? 'text-orange-500' : riskLevel === 'moderate' ? 'text-amber-400' : 'text-emerald-400';
  const strokeColor = riskLevel === 'critical' ? 'oklch(0.6 0.2 25)' : riskLevel === 'high' ? 'oklch(0.65 0.2 45)' : riskLevel === 'moderate' ? 'oklch(0.7 0.15 80)' : 'oklch(0.7 0.15 160)';
  
  return (
    <div className="relative w-full h-32 flex flex-col items-center justify-end overflow-hidden">
      <svg viewBox="0 0 100 50" className="w-full absolute top-0">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round" />
        <motion.path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="125"
          initial={{ strokeDashoffset: 125 }}
          animate={{ strokeDashoffset: 125 - (probability / 100) * 125 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="text-center z-10 pb-2">
        <div className="text-3xl font-bold flex items-center justify-center gap-1">
          {probability}% 
        </div>
        <div className={`text-[10px] font-semibold uppercase tracking-widest ${color}`}>{riskLevel} Risk</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const store = useStore();
  const { scores, insights, burnout, habits, recovery, cognitiveLoad, gameState, isDemo } = store;

  useEffect(() => {
    if (!store.isAuthenticated) {
      router.push("/");
    }
  }, [store.isAuthenticated, router]);

  if (!scores) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  const radarData = [
    { metric: "Energy", value: scores.energy },
    { metric: "Sleep", value: scores.sleepQuality },
    { metric: "Stress", value: 100 - scores.stress },
    { metric: "Focus", value: scores.focus },
    { metric: "Recovery", value: scores.recovery },
    { metric: "Hydration", value: scores.hydration },
  ];

  return (
    <motion.div 
      className="space-y-6 pb-20"
      initial="hidden"
      animate="visible"
    >
      {/* ---------------- V2 PREMIUM HEADER ROW ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* The Health Twin Evolution Orb */}
        <motion.div variants={fadeUp} custom={1} className="lg:col-span-4">
          <GlassCard glow="cyan" className="h-full flex flex-col items-center justify-center py-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5" />
            
            <h3 className="font-semibold text-sm mb-6 flex items-center gap-2 text-muted-foreground w-full px-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Health Twin Status
            </h3>

            <div className="relative w-48 h-48 mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-500/20 blur-2xl animate-pulse-glow" />
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 relative z-10">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <motion.circle
                  cx="50" cy="50" r="46" fill="none"
                  stroke={scoreToColor(scores.overall)}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${(scores.overall / 100) * 289} 289`}
                  initial={{ strokeDasharray: "0 289" }}
                  animate={{ strokeDasharray: `${(scores.overall / 100) * 289} 289` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <AnimatedCounter value={scores.overall} className="text-6xl font-bold tracking-tighter" />
                <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Overall</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full px-6">
              <div className="glass rounded-xl p-3 text-center bg-white/[0.02]">
                <div className="text-xs text-muted-foreground mb-1">Health Age</div>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-lg font-bold">{scores.healthAge}</span>
                  <Badge variant="success" className="text-[9px] px-1 h-4">-{scores.longevityDelta || 1}y</Badge>
                </div>
              </div>
              <div className="glass rounded-xl p-3 text-center bg-white/[0.02]">
                <div className="text-xs text-muted-foreground mb-1">Consistency</div>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-lg font-bold">{scores.consistency}%</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Predictive Metrics Row */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Burnout Probability Indicator */}
          <motion.div variants={fadeUp} custom={2} className="h-full">
            <GlassCard className="h-full flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl -mr-10 -mt-10 rounded-full transition-opacity opacity-0 group-hover:opacity-100" />
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Burnout Risk
              </h3>
              <p className="text-[10px] text-muted-foreground mb-4">14-Day Predictive Model</p>
              
              <div className="flex-1 flex flex-col justify-center">
                <BurnoutGauge probability={burnout?.probability || 42} riskLevel={burnout?.riskLevel || 'moderate'} />
                {burnout?.timeToBurnoutDays && (
                   <p className="text-center text-xs text-muted-foreground mt-2">
                     Trajectory: ~{burnout.timeToBurnoutDays} days
                   </p>
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* Recovery Forecast */}
          <motion.div variants={fadeUp} custom={3} className="h-full">
            <GlassCard className="h-full flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-10 -mt-10 rounded-full transition-opacity opacity-0 group-hover:opacity-100" />
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
                Recovery Forecast
              </h3>
              <p className="text-[10px] text-muted-foreground mb-6">Current Capacity: {recovery?.currentCapacity || 68}%</p>
              
              <div className="flex-1 flex flex-col justify-end pb-2">
                <div className="text-sm font-medium mb-1">100% Capacity at:</div>
                <div className="text-lg font-bold text-gradient-primary mb-4">{recovery?.predicted100PercentTime || 'Tomorrow 9AM'}</div>
                
                <div className="space-y-2">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Accelerators</div>
                  {recovery?.accelerationTips?.slice(0,2).map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-emerald-400 mt-0.5">✦</span>
                      <span className="text-foreground/80 leading-tight">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Cognitive Load Estimator */}
          <motion.div variants={fadeUp} custom={4} className="h-full">
            <GlassCard className="h-full flex flex-col group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl -mr-10 -mt-10 rounded-full transition-opacity opacity-0 group-hover:opacity-100" />
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-400" />
                Cognitive Load
              </h3>
              <p className="text-[10px] text-muted-foreground mb-4">Mental Fatigue Index</p>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold">{cognitiveLoad?.currentLevel || 75}</span>
                  <span className="text-sm text-muted-foreground mb-1">/ 100</span>
                </div>
                
                <Badge variant={cognitiveLoad?.status === 'optimal' ? 'success' : cognitiveLoad?.status === 'fatigued' ? 'warning' : 'destructive'} className="w-fit mb-4">
                  {cognitiveLoad?.status || 'Fatigued'}
                </Badge>

                <div className="text-xs text-muted-foreground bg-white/5 rounded-lg p-2 border border-white/5">
                  <strong className="text-foreground">Rec:</strong> Take a {cognitiveLoad?.recommendedBreakInMinutes || 15}m break away from screens.
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* ---------------- V2 SCORE CARDS ---------------- */}
      <motion.div variants={fadeUp} custom={5}>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: "Stress", value: scores.stress, icon: Brain, color: "text-rose-400", inverted: true },
            { label: "Recovery", value: scores.recovery, icon: Heart, color: "text-emerald-400" },
            { label: "Hydration", value: scores.hydration, icon: Droplets, color: "text-cyan-400" },
            { label: "Sleep", value: scores.sleepQuality, icon: Moon, color: "text-indigo-400" },
            { label: "Energy", value: scores.energy, icon: Zap, color: "text-amber-400" },
            { label: "Focus", value: scores.focus, icon: Eye, color: "text-violet-400" },
            { label: "Mental", value: scores.mentalWellness, icon: Sparkles, color: "text-pink-400" },
            { label: "Activity", value: scores.activity, icon: Activity, color: "text-green-400" },
          ].map((card, i) => (
            <GlassCard key={card.label} hover className="text-center py-4 px-3 relative overflow-hidden group">
              <div className={`absolute inset-0 bg-gradient-to-t from-current/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity ${card.color}`} />
              <card.icon className={`w-5 h-5 mx-auto mb-2 ${card.color} group-hover:scale-110 transition-transform`} />
              <AnimatedCounter value={card.value} className="text-xl font-bold block" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{card.label}</span>
              <div className="mt-2 h-1 rounded-full bg-white/5">
                <motion.div
                  className={`h-full rounded-full ${card.color.replace('text-', 'bg-')}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${card.value}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.05 }}
                />
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* ---------------- V2 SMART HABITS & INSIGHTS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Smart Habit Detection */}
        <motion.div variants={fadeUp} custom={6}>
          <GlassCard className="h-full">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ZapOff className="w-4 h-4 text-amber-400" />
              Smart Habit Detection
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Hidden correlations discovered in your data.</p>
            
            <div className="space-y-3">
              {(habits || []).map((habit) => (
                <div key={habit.id} className="glass bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:bg-white/[0.04] transition-colors cursor-default">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {habit.impactType === 'positive' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />}
                      {habit.habitName}
                    </div>
                    <Badge variant="outline" className="text-[9px] font-mono">{habit.correlationStrength}% Match</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {habit.description}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Predictive AI Insights */}
        <motion.div variants={fadeUp} custom={7}>
          <GlassCard className="h-full flex flex-col">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              AI Predictive Insights
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 max-h-[350px]">
              {insights.map((insight) => (
                <div key={insight.id} className="glass rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-start gap-2 mb-2">
                    <Badge variant={insight.severity === "positive" ? "success" : insight.severity === "warning" ? "warning" : insight.severity === "critical" ? "destructive" : "info"} className="text-[9px] shrink-0">
                      {insight.severity}
                    </Badge>
                    <span className="text-sm font-medium leading-tight text-foreground/90">{insight.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{insight.description}</p>
                  
                  {/* Contributing Factors Micro-bars */}
                  <div className="space-y-1.5 mb-3">
                    {insight.contributingFactors.slice(0,2).map(f => (
                      <div key={f.name} className="flex items-center gap-2">
                        <span className="text-[9px] text-muted-foreground w-20 truncate">{f.name}</span>
                        <div className="flex-1 h-1 rounded-full bg-white/5">
                          <div className={`h-full rounded-full ${f.direction === 'positive' ? 'bg-emerald-400' : 'bg-rose-400'}`} style={{ width: `${f.impact * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                    <Badge variant="outline" className="text-[9px] border-white/10">{insight.confidence}% confidence</Badge>
                    <Badge variant="outline" className="text-[9px] border-white/10 flex items-center gap-1">
                       Trend: {insight.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

    </motion.div>
  );
}
