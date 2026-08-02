"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ParticleBackground } from "@/components/lifelens/particle-background";
import { GlassCard } from "@/components/lifelens/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain, Heart, Mic, Eye, Activity, Shield, Sparkles, ArrowRight,
  Zap, Moon, Droplets, TrendingUp, MessageCircle, Target,
  ChevronDown, Star, Lock, BarChart3, Waves, Clock,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function LandingPage() {
  const router = useRouter();
  const { loadDemo } = useStore();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDemo = () => {
    loadDemo();
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ParticleBackground count={60} />

      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrollY > 50 ? "rgba(10, 10, 30, 0.8)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(20px)" : "none",
          borderBottom: scrollY > 50 ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gradient-primary">LifeDrishti AI</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Button variant="ghost" size="sm" onClick={handleDemo}>
              Demo
            </Button>
            <Button size="sm" onClick={() => router.push("/auth")} className="gap-2">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="absolute inset-0 grid-bg" />

        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-violet-500/10 blur-[100px] animate-float-delayed" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-8"
          >
            <motion.div variants={fadeUp} custom={0}>
              <Badge variant="info" className="px-4 py-1.5 text-sm gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Preventive Wellness
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
            >
              <span className="text-gradient-primary">See Your Health</span>
              <br />
              <span className="text-foreground/90">Before You Feel It.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              LifeDrishti AI creates your personal wellness twin by combining facial signals, voice patterns, 
              lifestyle habits, and wearable data into one intelligent, explainable AI engine.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Button
                size="xl"
                variant="glow"
                onClick={() => router.push("/auth")}
                className="group gap-3 text-base"
              >
                <Brain className="w-5 h-5" />
                Start AI Health Scan
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="xl"
                variant="glass"
                onClick={handleDemo}
                className="gap-3 text-base"
              >
                <Zap className="w-5 h-5 text-amber-400" />
                Experience Demo
              </Button>
            </motion.div>

            <motion.p variants={fadeUp} custom={4} className="text-xs text-muted-foreground/60">
              Educational wellness tool · Not a medical diagnostic system · Your data stays private
            </motion.p>
          </motion.div>

          {/* Floating Health Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            className="mt-16 flex justify-center"
          >
            <div className="relative w-64 h-64 animate-float-slow">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 blur-xl" />
              <div className="absolute inset-4 rounded-full glass border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gradient-primary">72</div>
                  <div className="text-sm text-muted-foreground mt-1">Wellness Score</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400">+4 this week</span>
                  </div>
                </div>
              </div>
              {/* Orbiting dots */}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "oklch(0.75 0.18 180)" : "oklch(0.65 0.22 290)",
                    top: "50%",
                    left: "50%",
                  }}
                  animate={{
                    x: [
                      Math.cos((i * Math.PI * 2) / 6) * 120,
                      Math.cos((i * Math.PI * 2) / 6 + Math.PI * 2) * 120,
                    ],
                    y: [
                      Math.sin((i * Math.PI * 2) / 6) * 120,
                      Math.sin((i * Math.PI * 2) / 6 + Math.PI * 2) * 120,
                    ],
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-12 flex justify-center"
          >
            <ChevronDown className="w-6 h-6 text-muted-foreground/40 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-primary">Multi-Modal</span> AI Intelligence
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We don't just look at one signal. LifeDrishti combines multiple everyday data streams 
              into one holistic wellness picture.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Eye, title: "Face Analysis", desc: "Estimate stress, fatigue, hydration and wellness signals from facial appearance", color: "from-cyan-400 to-blue-500", glow: "cyan" as const },
              { icon: Mic, title: "Voice Intelligence", desc: "Analyze stress, energy, confidence and mood patterns from your voice", color: "from-violet-400 to-purple-500", glow: "violet" as const },
              { icon: Heart, title: "Wearable Sync", desc: "Heart rate, HRV, sleep, steps, SpO2 — all in one unified view", color: "from-rose-400 to-pink-500", glow: "none" as const },
              { icon: Activity, title: "Lifestyle Tracking", desc: "Sleep, exercise, diet, screen time, and habits feed the AI engine", color: "from-emerald-400 to-green-500", glow: "teal" as const },
              { icon: MessageCircle, title: "AI Wellness Coach", desc: "Conversational assistant that answers using YOUR actual data", color: "from-amber-400 to-orange-500", glow: "none" as const },
              { icon: Target, title: "Future Predictions", desc: "See tomorrow's energy, stress forecasts, and recovery projections", color: "from-indigo-400 to-blue-500", glow: "violet" as const },
            ].map((feature, i) => (
              <motion.div key={feature.title} variants={fadeUp} custom={i}>
                <GlassCard glow={feature.glow} className="h-full group cursor-default">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl sm:text-5xl font-bold mb-4">
              How <span className="text-gradient-primary">LifeDrishti</span> Works
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to unlock your personal AI wellness twin.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { step: "01", icon: Eye, title: "Scan", desc: "Quick face photo and voice recording" },
              { step: "02", icon: Activity, title: "Input", desc: "Lifestyle habits and wearable data" },
              { step: "03", icon: Brain, title: "Analyze", desc: "AI fuses all signals into one model" },
              { step: "04", icon: Sparkles, title: "Insights", desc: "Explainable scores & recommendations" },
            ].map((item, i) => (
              <motion.div key={item.step} variants={fadeUp} custom={i}>
                <GlassCard className="text-center relative overflow-hidden">
                  <div className="absolute top-3 right-3 text-6xl font-bold text-white/[0.03]">{item.step}</div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1.5">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Engine Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.h2 variants={fadeUp} custom={0} className="text-4xl sm:text-5xl font-bold mb-6">
                  Explainable <span className="text-gradient-primary">AI Engine</span>
                </motion.h2>
                <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Every prediction explains WHY. No black boxes. LifeDrishti shows contributing factors, 
                  confidence levels, supporting data, and actionable improvement suggestions.
                </motion.p>
                <motion.div variants={fadeUp} custom={2} className="space-y-4">
                  {[
                    { icon: BarChart3, text: "Cross-modal signal fusion" },
                    { icon: Waves, text: "Relationship inference across data streams" },
                    { icon: TrendingUp, text: "Historical trend analysis" },
                    { icon: Shield, text: "Confidence-weighted predictions" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm text-foreground/80">{item.text}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
              <motion.div variants={fadeUp} custom={3}>
                <GlassCard glow="cyan" className="p-0 overflow-hidden">
                  <div className="p-5 border-b border-white/5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      AI Insight — Stress Analysis
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="text-sm font-medium">
                      "Stress Score increased because your recent sleep duration decreased while heart rate variability also declined."
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground mb-1">Contributing Factors</div>
                      {[
                        { name: "Sleep Duration ↓", pct: 40, color: "bg-rose-400" },
                        { name: "HRV Decline ↓", pct: 30, color: "bg-amber-400" },
                        { name: "Screen Time ↑", pct: 20, color: "bg-violet-400" },
                        { name: "Caffeine ↑", pct: 10, color: "bg-cyan-400" },
                      ].map((f) => (
                        <div key={f.name} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-28 shrink-0">{f.name}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-white/5">
                            <div className={`h-full rounded-full ${f.color}`} style={{ width: `${f.pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-8">{f.pct}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <Badge variant="info">87% Confidence</Badge>
                      <Badge variant="warning">Declining</Badge>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-gradient-primary">Privacy</span> First
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground mb-12">
              Your health data is yours. Period.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={2}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { icon: Lock, title: "Encrypted", desc: "End-to-end encryption" },
                { icon: Shield, title: "You Own It", desc: "Delete anytime" },
                { icon: Eye, title: "Transparent", desc: "Clear consent flow" },
                { icon: Zap, title: "Local First", desc: "Process locally when possible" },
              ].map((item) => (
                <GlassCard key={item.title} className="text-center py-8">
                  <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="font-semibold mb-1">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </GlassCard>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl sm:text-5xl font-bold mb-4">
              Loved by <span className="text-gradient-primary">Early Users</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { name: "Dr. Sarah Kim", role: "Wellness Researcher", quote: "LifeDrishti makes preventive health accessible and engaging. The multi-modal approach is genuinely innovative.", stars: 5 },
              { name: "Marcus T.", role: "Software Engineer", quote: "The AI coach actually references my real data. It's not generic advice — it's personalized and actionable.", stars: 5 },
              { name: "Priya N.", role: "Graduate Student", quote: "The gamification keeps me coming back. I've improved my sleep by 1.5 hours just by following the daily missions.", stars: 5 },
            ].map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} custom={i}>
                <GlassCard className="h-full">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 mb-5 leading-relaxed italic">"{t.quote}"</p>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to <span className="text-shimmer">see your health</span>?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground mb-10">
              Your AI wellness twin is waiting. Start your first scan in under 2 minutes.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="xl" variant="glow" onClick={() => router.push("/auth")} className="gap-3 text-base">
                <Brain className="w-5 h-5" />
                Start AI Health Scan
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="xl" variant="glass" onClick={handleDemo} className="gap-3 text-base">
                <Zap className="w-5 h-5 text-amber-400" />
                Try Demo Instantly
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
              <Eye className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gradient-primary">LifeDrishti AI</span>
          </div>
          <p className="text-xs text-muted-foreground/50 text-center">
            Educational wellness assistant · Not a medical diagnostic system · © {new Date().getFullYear()} LifeDrishti AI
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground/40">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
