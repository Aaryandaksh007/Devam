"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { DisclaimerBanner } from "@/components/lifelens/disclaimer-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, MessageCircle, FileText, Trophy, TrendingUp,
  Users, Eye, Settings, LogOut, Menu, X, Zap,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/coach", label: "AI Coach", icon: MessageCircle },
  { href: "/dashboard/report", label: "Weekly Report", icon: FileText },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isDemo, logout, gameState } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 glass-strong transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gradient-primary">LifeDrishti AI</span>
            {isDemo && <Badge variant="warning" className="text-[10px] px-1.5 py-0">Demo</Badge>}
          </div>

          {/* Nav Items */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="mt-auto space-y-3">
            {gameState && (
              <div className="glass rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Level {gameState.level}</span>
                  <span className="text-xs text-primary">{gameState.xp} XP</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (gameState.xp % 1000) / 10)}%` }} />
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-orange-400">🔥</span>
                  <span className="text-xs text-muted-foreground">{gameState.streak} day streak</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user?.name || "User"}</div>
                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
              </div>
            </div>

            <Link href="/">
              <Button variant="ghost" size="sm" className="w-full gap-2 text-muted-foreground" onClick={() => logout()}>
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 glass-strong h-14 flex items-center justify-between px-4 lg:px-6">
          <button className="lg:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            {isDemo && (
              <Badge variant="warning" className="gap-1 text-xs">
                <Zap className="w-3 h-3" /> Demo Mode
              </Badge>
            )}
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-6">
          <DisclaimerBanner />
          {children}
        </div>
      </main>
    </div>
  );
}
