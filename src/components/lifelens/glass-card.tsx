"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "cyan" | "teal" | "violet" | "none";
  hover?: boolean;
}

export function GlassCard({ className, glow = "none", hover = true, children, ...props }: GlassCardProps) {
  const glowClass = {
    cyan: "glow-cyan",
    teal: "glow-teal",
    violet: "glow-violet",
    none: "",
  }[glow];

  return (
    <div
      className={cn(
        "glass rounded-2xl p-6",
        glowClass,
        hover && "transition-all duration-300 hover:bg-white/[0.07] hover:scale-[1.01] hover:shadow-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
