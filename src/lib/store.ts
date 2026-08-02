import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  UserProfile, ScanData, WellnessScores, AIInsight, FuturePrediction,
  GameState, ChatMessage, CommunityInsight, WeeklyReport, ScanStep,
  MorningBriefing, EveningReflection,
  BurnoutIndicator, SmartHabit, RecoveryForecast, CognitiveLoad
} from "./types";
import {
  DEMO_USER, DEMO_SCAN_DATA, DEMO_SCORES, DEMO_INSIGHTS,
  DEMO_PREDICTIONS, DEMO_GAME_STATE, DEMO_COMMUNITY,
  DEMO_WEEKLY_REPORT, DEMO_MORNING, DEMO_EVENING,
  DEMO_BURNOUT, DEMO_SMART_HABITS, DEMO_RECOVERY_FORECAST,
  DEMO_COGNITIVE_LOAD
} from "./mock-data";

interface LifeLensState {
  isAuthenticated: boolean;
  isDemo: boolean;
  isDemoMode: boolean;
  user: UserProfile | null;
  scanStep: ScanStep;
  scanData: ScanData;
  scores: WellnessScores | null;
  insights: AIInsight[];
  predictions: FuturePrediction[];
  
  // V2 Premium Features
  burnout: BurnoutIndicator | null;
  habits: SmartHabit[];
  recovery: RecoveryForecast | null;
  cognitiveLoad: CognitiveLoad | null;

  gameState: GameState | null;
  community: CommunityInsight[];
  weeklyReport: WeeklyReport | null;
  chatHistory: ChatMessage[];
  morning: MorningBriefing | null;
  evening: EveningReflection | null;
  isProcessing: boolean;

  login: (name: string, email: string) => void;
  logout: () => void;
  loadDemo: () => void;
  setScanStep: (step: ScanStep) => void;
  updateScanData: (data: Partial<ScanData>) => void;
  setScores: (scores: WellnessScores) => void;
  setInsights: (insights: AIInsight[]) => void;
  setPredictions: (predictions: FuturePrediction[]) => void;
  
  // V2 Setters
  setPremiumData: (data: {
    burnout: BurnoutIndicator;
    habits: SmartHabit[];
    recovery: RecoveryForecast;
    cognitiveLoad: CognitiveLoad;
  }) => void;

  setProcessing: (v: boolean) => void;
  setDemoMode: (isDemo: boolean) => void;
  addChatMessage: (msg: ChatMessage) => void;
  completeMission: (id: string) => void;
  resetAll: () => void;
}

const initialState = {
  isAuthenticated: false,
  isDemo: false,
  isDemoMode: false,
  user: null,
  scanStep: "face" as ScanStep,
  scanData: {},
  scores: null,
  insights: [],
  predictions: [],
  burnout: null,
  habits: [],
  recovery: null,
  cognitiveLoad: null,
  gameState: null,
  community: [],
  weeklyReport: null,
  chatHistory: [],
  morning: null,
  evening: null,
  isProcessing: false,
};

export const useStore = create<LifeLensState>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: (name, email) =>
        set({
          isAuthenticated: true,
          user: {
            id: "user-" + Date.now(),
            name,
            email,
            age: 28,
            gender: "other",
            joinedAt: new Date().toISOString(),
          },
        }),

      logout: () => set({ ...initialState }),

      loadDemo: () =>
        set({
          isAuthenticated: true,
          isDemo: true,
          isDemoMode: true,
          user: DEMO_USER,
          scanStep: "complete",
          scanData: DEMO_SCAN_DATA,
          scores: DEMO_SCORES,
          insights: DEMO_INSIGHTS,
          predictions: DEMO_PREDICTIONS,
          burnout: DEMO_BURNOUT,
          habits: DEMO_SMART_HABITS,
          recovery: DEMO_RECOVERY_FORECAST,
          cognitiveLoad: DEMO_COGNITIVE_LOAD,
          gameState: DEMO_GAME_STATE,
          community: DEMO_COMMUNITY,
          weeklyReport: DEMO_WEEKLY_REPORT,
          morning: DEMO_MORNING,
          evening: DEMO_EVENING,
          chatHistory: [
            {
              id: "welcome",
              role: "assistant",
              content: "Hello Alex! 👋 I'm your LifeDrishti AI Coach. I've analyzed your latest wellness data and I'm ready to help you understand your health signals. Ask me anything about your sleep, stress, activity, or any wellness topic!",
              timestamp: new Date().toISOString(),
            },
          ],
          isProcessing: false,
        }),

      setScanStep: (step) => set({ scanStep: step }),

      updateScanData: (data) =>
        set((state) => ({ scanData: { ...state.scanData, ...data } })),

      setScores: (scores) => set({ scores }),

      setInsights: (insights) => set({ insights }),

      setPredictions: (predictions) => set({ predictions }),

      setPremiumData: (data) => set({ ...data }),

      setProcessing: (isProcessing) => set({ isProcessing }),

      setDemoMode: (demo) => {
        if (demo) {
          set({ isDemo: true, isDemoMode: true });
          get().loadDemo();
        } else {
          set({ isDemo: false, isDemoMode: false, ...initialState, isAuthenticated: true, user: get().user });
        }
      },

      addChatMessage: (msg) =>
        set((state) => ({ chatHistory: [...state.chatHistory, msg] })),

      completeMission: (id) =>
        set((state) => {
          if (!state.gameState) return {};
          const missions = state.gameState.dailyMissions.map((m) =>
            m.id === id ? { ...m, completed: true } : m
          );
          const mission = state.gameState.dailyMissions.find((m) => m.id === id);
          const xpGain = mission?.xpReward || 0;
          return {
            gameState: {
              ...state.gameState,
              dailyMissions: missions,
              xp: state.gameState.xp + xpGain,
            },
          };
        }),

      resetAll: () => set({ ...initialState }),
    }),
    {
      name: "lifelens-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isDemo: state.isDemo,
        user: state.user,
        scanStep: state.scanStep,
        scores: state.scores,
        gameState: state.gameState,
        burnout: state.burnout,
        recovery: state.recovery,
      }),
    }
  )
);
