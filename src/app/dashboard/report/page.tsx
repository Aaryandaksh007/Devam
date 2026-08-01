"use client";

import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { DEMO_WEEKLY_REPORT } from "@/lib/mock-data";
import { GlassCard } from "@/components/lifelens/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, FileText, Calendar as CalendarIcon, 
  TrendingUp, Award, Activity, Heart, Brain, 
  ChevronRight, Stethoscope, FileOutput
} from "lucide-react";
import { scoreToColor } from "@/lib/utils";
import { AnimatedCounter } from "@/components/lifelens/animated-counter";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
};

export default function ReportPage() {
  const { user, scores, weeklyReport, isDemoMode } = useStore();
  const report = weeklyReport || DEMO_WEEKLY_REPORT;

  if (!scores) return null;

  const scoreDiff = report.overallScore - report.previousScore;
  const isPositive = scoreDiff >= 0;

  const generatePDF = async () => {
    const element = document.getElementById("report-container");
    if (!element) return;
    
    // Slight delay to ensure fonts/animations are settled
    await new Promise(r => setTimeout(r, 100));
    
    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#000000" });
    const imgData = canvas.toDataURL("image/jpeg", 0.9);
    
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`LifeLens_Clinical_Report_${user?.name || "User"}.pdf`);
  };

  return (
    <motion.div 
      id="report-container"
      className="space-y-6 pb-20 max-w-5xl mx-auto p-4 bg-background"
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Weekly Executive Brief</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <CalendarIcon className="w-4 h-4" />
            {report.weekStart} to {report.weekEnd}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={generatePDF} variant="outline" className="glass bg-white/5 border-white/10 flex items-center gap-2 rounded-full">
            <Download className="w-4 h-4" />
            Standard PDF
          </Button>
          <Button onClick={generatePDF} className="bg-primary hover:bg-primary/90 text-black flex items-center gap-2 rounded-full font-semibold shadow-[0_0_20px_rgba(0,255,200,0.3)]">
            <Stethoscope className="w-4 h-4" />
            Share with Doctor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Metric */}
        <motion.div variants={fadeUp} custom={1} className="md:col-span-1">
          <GlassCard glow="cyan" className="h-full flex flex-col items-center justify-center py-8 text-center">
            <h3 className="font-semibold text-sm mb-4">Overall Trajectory</h3>
            
            <div className="relative w-32 h-32 mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                <motion.circle
                  cx="50" cy="50" r="46" fill="none"
                  stroke={scoreToColor(report.overallScore)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${(report.overallScore / 100) * 289} 289`}
                  initial={{ strokeDasharray: "0 289" }}
                  animate={{ strokeDasharray: `${(report.overallScore / 100) * 289} 289` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatedCounter value={report.overallScore} className="text-4xl font-bold tracking-tighter" />
              </div>
            </div>

            <div className={`flex items-center gap-1 font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
              {Math.abs(scoreDiff)} pts vs last week
            </div>
            
            <div className="mt-6 w-full px-6">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="text-xs text-muted-foreground mb-1">Longevity Impact</div>
                <div className="text-sm font-semibold text-cyan-400">+{scores.longevityDelta} Projected Years</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Breakdown */}
        <motion.div variants={fadeUp} custom={2} className="md:col-span-2">
          <GlassCard className="h-full">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Biomarker Shifts
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Stress Resilience", value: scores.stress, target: 80, icon: Brain },
                { label: "Recovery Capacity", value: scores.recovery, target: 85, icon: Heart },
                { label: "Sleep Architecture", value: scores.sleepQuality, target: 90, icon: CalendarIcon },
                { label: "Metabolic Activity", value: scores.activity, target: 75, icon: Activity },
              ].map((metric, i) => (
                <div key={metric.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <metric.icon className="w-3.5 h-3.5" /> {metric.label}
                    </span>
                    <span className="font-semibold">{metric.value}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 relative overflow-hidden">
                    <motion.div
                      className="absolute top-0 left-0 h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    />
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-white z-10 opacity-50" 
                      style={{ left: `${metric.target}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-1 text-right">Target: {metric.target}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths & Improvements */}
        <motion.div variants={fadeUp} custom={3}>
          <GlassCard className="h-full">
            <h3 className="font-semibold mb-4 text-emerald-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Positive Adaptations
            </h3>
            <ul className="space-y-3 mb-8">
              {report.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">✓</div>
                  <span className="text-foreground/80 leading-relaxed">{str}</span>
                </li>
              ))}
            </ul>

            <h3 className="font-semibold mb-4 text-amber-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 rotate-180" /> Optimization Targets
            </h3>
            <ul className="space-y-3">
              {report.improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">!</div>
                  <span className="text-foreground/80 leading-relaxed">{imp}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </motion.div>

        {/* Actions & Achievements */}
        <motion.div variants={fadeUp} custom={4} className="flex flex-col gap-6">
          <GlassCard>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Prescriptive Actions
            </h3>
            <div className="space-y-3">
              {report.recommendations.map((rec, i) => (
                <div key={i} className="glass p-3 rounded-lg border border-white/5 flex items-start gap-3 hover:bg-white/[0.02] transition-colors cursor-default">
                  <span className="font-mono text-primary text-xs mt-0.5">{i + 1}.</span>
                  <span className="text-sm text-foreground/80 leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard glow="violet" className="flex-1 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5">
            <h3 className="font-semibold text-lg mb-2">Physiological Summary</h3>
            <p className="text-sm text-muted-foreground leading-relaxed italic">"{report.encouragement}"</p>
          </GlassCard>
        </motion.div>
      </div>
      
    </motion.div>
  );
}
