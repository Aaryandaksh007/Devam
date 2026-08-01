"use client";

import { useStore } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Zap, Beaker } from "lucide-react";

export function DemoToggle() {
  const { isDemoMode, setDemoMode } = useStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 p-3 rounded-full shadow-2xl">
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${!isDemoMode ? "text-primary" : "text-muted-foreground"}`}>
        <Zap className="w-3.5 h-3.5" /> Live
      </div>
      
      <Switch 
        checked={isDemoMode}
        onCheckedChange={setDemoMode}
        className="data-[state=checked]:bg-indigo-500"
      />
      
      <div className={`flex items-center gap-1.5 text-xs font-semibold ${isDemoMode ? "text-indigo-400" : "text-muted-foreground"}`}>
        <Beaker className="w-3.5 h-3.5" /> Judge Mode
      </div>
    </div>
  );
}
