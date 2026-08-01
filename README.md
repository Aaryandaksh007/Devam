# LifeLens AI 🔬

> **"See Your Health Before You Feel It."**

LifeLens AI is a multi-modal AI wellness twin that creates personalized, preventive health insights by combining facial appearance, voice patterns, lifestyle habits, and wearable metrics into one explainable AI engine.

⚠️ **LifeLens AI is an educational wellness assistant, NOT a medical diagnostic system.**

---

## ✨ Features

- **🧠 Multi-Modal AI Engine** — Fuses face, voice, lifestyle, and wearable data into unified wellness scores
- **📊 Premium Health Dashboard** — Animated wellness ring, radar chart, stress heatmap, activity rings, mood calendar
- **💬 AI Wellness Coach** — Conversational assistant that answers using YOUR actual data
- **📈 Explainable AI** — Every prediction explains WHY with contributing factors and confidence levels
- **🎯 Future Predictions** — Tomorrow's energy, stress forecasts, and recovery projections
- **🏆 Gamification** — XP, levels, streaks, achievements, daily missions, weekly challenges
- **📋 Weekly Report** — Beautiful PDF-exportable wellness summary
- **👥 Community Insights** — Anonymized comparisons with similar users
- **🔒 Privacy First** — User controls all data, transparent consent
- **⚡ Demo Mode** — One-click access to explore every feature

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your NVIDIA_API_KEY

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 + Glassmorphism |
| Animation | Framer Motion |
| UI Components | ShadCN UI (Radix) |
| Charts | Recharts |
| AI Engine | NVIDIA NIM API (Llama 3.1 70B) |
| State | Zustand + localStorage |
| Icons | Lucide React |

---

## 📁 Architecture

```
src/
├── app/
│   ├── page.tsx              # Cinematic landing page
│   ├── auth/page.tsx         # Authentication
│   ├── onboarding/page.tsx   # 5-step scan wizard
│   ├── dashboard/
│   │   ├── page.tsx          # Health dashboard
│   │   ├── coach/page.tsx    # AI coach
│   │   └── report/page.tsx   # Weekly report
│   └── api/
│       ├── analyze/route.ts  # Wellness analysis
│       └── chat/route.ts     # AI coach chat
├── components/
│   ├── ui/                   # ShadCN components
│   └── lifelens/             # Custom components
└── lib/
    ├── store.ts              # Zustand state
    ├── ai-engine.ts          # Multi-modal AI
    ├── mock-data.ts          # Realistic demo data
    ├── types.ts              # TypeScript types
    ├── gamification.ts       # XP/Level system
    └── utils.ts              # Utilities
```

---

## 🎯 For Judges

**Click "Experience Demo" on the landing page** to instantly explore every feature with realistic sample data.

Key things to notice:
1. **Multi-modal AI fusion** — face + voice + lifestyle + wearable = unified wellness
2. **Explainable AI** — every score shows contributing factors + confidence
3. **Premium design** — glassmorphism, animations, dark mode, interactive charts
4. **Gamification** — XP, levels, streaks, achievements keep users engaged
5. **Privacy** — clear disclaimer, no medical claims, user data control

---

## 📜 License

MIT — Built for hackathon demonstration purposes.

**LifeLens AI does not diagnose diseases or recommend medications. Always consult a qualified healthcare professional for medical advice.**
