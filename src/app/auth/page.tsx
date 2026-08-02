"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ParticleBackground } from "@/components/lifelens/particle-background";
import { GlassCard } from "@/components/lifelens/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, ArrowRight, Mail, Lock, User, Sparkles, Zap } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const { login, loadDemo } = useStore();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(name || "User", email || "user@lifelens.ai");
    router.push("/onboarding");
  };

  const handleDemo = () => {
    loadDemo();
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <ParticleBackground count={30} />
      <div className="absolute inset-0 grid-bg" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient-primary">LifeDrishti AI</span>
          </div>
          <p className="text-sm text-muted-foreground">Your personal AI wellness twin</p>
        </div>

        <GlassCard glow="cyan" className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "signup" : "login"}
              initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-1">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {isSignUp ? "Start your wellness journey today" : "Continue your wellness journey"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Alex Chen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" size="lg" variant="glow">
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                variant="glass"
                className="w-full gap-2"
                size="lg"
                onClick={handleDemo}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                Experience Demo Instantly
              </Button>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </GlassCard>

        <p className="text-center text-xs text-muted-foreground/50 mt-6">
          Educational wellness assistant · Not a medical diagnostic system
        </p>
      </motion.div>
    </div>
  );
}
