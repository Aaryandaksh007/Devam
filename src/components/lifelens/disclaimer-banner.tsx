"use client";

import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs text-amber-300/90">
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
      <span>
        LifeDrishti AI is an <strong>educational wellness assistant</strong>, not a medical diagnostic system. 
        It does not diagnose diseases or recommend medications. Consult a healthcare professional for medical advice.
      </span>
    </div>
  );
}
