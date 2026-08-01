"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { GlassCard } from "@/components/lifelens/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatWithCoach } from "@/lib/ai-engine";
import { Send, Bot, User, Sparkles, Mic, Activity, HeartPulse } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

function getEmpathyStyles(tone: string) {
  switch (tone) {
    case "compassionate": return "border-rose-500/30 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.1)]";
    case "motivational": return "border-amber-500/30 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]";
    case "urgent": return "border-red-500/40 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]";
    case "analytical": default: return "border-primary/20 bg-primary/5 shadow-[0_0_15px_rgba(0,255,200,0.1)]";
  }
}

export default function CoachPage() {
  const store = useStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [store.chatHistory, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");
    
    store.addChatMessage({
      id: Date.now().toString(),
      role: "user",
      content: userMsg,
      timestamp: new Date().toISOString(),
    });

    setIsTyping(true);

    try {
      const response = await chatWithCoach(
        userMsg,
        store.scanData,
        store.scores,
        store.chatHistory
      );
      
      store.addChatMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.text,
        timestamp: new Date().toISOString(),
        empathyTone: response.empathyTone as any
      });
    } catch (error) {
      console.error(error);
      store.addChatMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm experiencing a brief connection issue. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        empathyTone: "analytical"
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Mock Voice Sentiment Timeline Data
  const voiceData = Array.from({ length: 24 }).map((_, i) => ({
    time: `${i}:00`,
    stress: 40 + Math.sin(i * 0.5) * 20 + Math.random() * 10,
    energy: 50 + Math.cos(i * 0.5) * 20 + Math.random() * 10
  }));

  const currentTone = store.chatHistory[store.chatHistory.length - 1]?.empathyTone || "analytical";
  const empathyClass = getEmpathyStyles(currentTone);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">
      
      {/* Left Sidebar: Context & Timeline */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-full overflow-y-auto hidden lg:flex">
        
        <GlassCard className={`p-5 transition-all duration-700 ${empathyClass}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Empathy Engine</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Active State: {currentTone}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
             LifeLens continuously adapts its conversational tone and UI aesthetics based on your real-time physiological stress and vocal fatigue markers.
          </p>
        </GlassCard>

        <GlassCard className="flex-1 min-h-[250px] flex flex-col p-4">
          <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
            <Mic className="w-4 h-4 text-cyan-400" />
            Vocal Sentiment Timeline
          </h3>
          <p className="text-[10px] text-muted-foreground mb-4">Past 24 Hours</p>
          <div className="flex-1 w-full h-full relative -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={voiceData}>
                <defs>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="stress" stroke="#f43f5e" fillOpacity={1} fill="url(#colorStress)" />
                <Area type="monotone" dataKey="energy" stroke="#fbbf24" fillOpacity={1} fill="url(#colorEnergy)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Stress</div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Energy</div>
          </div>
        </GlassCard>
      </div>

      {/* Right Area: Chat Interface */}
      <GlassCard className="flex-1 flex flex-col h-full overflow-hidden p-0 bg-black/40">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 relative">
              <Bot className="w-5 h-5 text-primary" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">LifeLens Coach</h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <HeartPulse className="w-3 h-3 text-rose-400 animate-pulse" /> Live Telemetry Linked
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {store.chatHistory.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    isUser ? "bg-white/10" : "bg-primary/20 border border-primary/30"
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isUser ? "bg-white/10" : `bg-black/50 border ${getEmpathyStyles(msg.empathyTone || 'analytical').split(' ')[0]}`
                  }`}>
                    {msg.content.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i !== msg.content.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-black/50 rounded-2xl p-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries */}
        {!isTyping && store.chatHistory.length < 3 && (
          <div className="px-6 pb-2 flex gap-2 overflow-x-auto hide-scrollbar">
            {["Why did my HRV drop?", "Am I burning out?", "Optimize my sleep"].map((q) => (
              <Button
                key={q}
                variant="outline"
                size="sm"
                className="rounded-full text-xs bg-white/5 border-white/10 hover:bg-white/10 whitespace-nowrap"
                onClick={() => setInput(q)}
              >
                {q}
              </Button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-black/40 backdrop-blur-xl border-t border-white/5">
          <form onSubmit={handleSubmit} className="flex gap-2 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI coach..."
              className="bg-white/5 border-white/10 rounded-full pl-6 pr-12 py-6 focus-visible:ring-primary/50 text-sm"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 bg-primary hover:bg-primary/80 text-black transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}
