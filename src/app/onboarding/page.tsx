"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import Papa from "papaparse";
import { DEMO_FACE, DEMO_VOICE, DEMO_LIFESTYLE, DEMO_WEARABLE } from "@/lib/mock-data";
import { GlassCard } from "@/components/lifelens/glass-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Eye, Mic, Activity, Brain, ArrowRight, ArrowLeft,
  Upload, Camera, Check, Watch, Droplets,
  Moon, Coffee, Dumbbell, Monitor, Zap
} from "lucide-react";
import { analyzeWellness } from "@/lib/ai-engine";

const steps = [
  { id: "face", label: "Face", icon: Eye },
  { id: "voice", label: "Voice", icon: Mic },
  { id: "lifestyle", label: "Lifestyle", icon: Activity },
  { id: "wearable", label: "Wearable", icon: Watch },
  { id: "processing", label: "Analyze", icon: Brain },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { isDemoMode, updateScanData, setPremiumData, setScores, setInsights, setPredictions, scanData } = useStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [processingStage, setProcessingStage] = useState(0);
  
  // Face State
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [isUploadingFace, setIsUploadingFace] = useState(false);
  const [faceResults, setFaceResults] = useState<any>(null);

  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [voiceAudio, setVoiceAudio] = useState<string | null>(null);
  const [isUploadingVoice, setIsUploadingVoice] = useState(false);
  const [voiceResults, setVoiceResults] = useState<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordInterval = useRef<NodeJS.Timeout | null>(null);

  // Lifestyle State
  const [lifestyle, setLifestyle] = useState({
    sleepHours: 7, exerciseMinutes: 30, waterIntake: 6,
    screenTimeHours: 6, caffeineIntake: 2, workingHours: 8,
  });

  // Wearable State
  const [wearableData, setWearableData] = useState<any>(null);

  const progress = ((currentStep + 1) / steps.length) * 100;

  // Face Dropzone
  const onDropFace = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    setIsUploadingFace(true);
    try {
      // Compress
      const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1024 });
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setFaceImage(base64);

        if (isDemoMode) {
          setFaceResults(DEMO_FACE);
          updateScanData({ face: DEMO_FACE });
          setIsUploadingFace(false);
          return;
        }

        // Call real API
        try {
          const res = await fetch("/api/analyze/face", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
          });
          if (!res.ok) throw new Error("Failed to analyze face");
          const data = await res.json();
          setFaceResults(data);
          updateScanData({ face: data });
        } catch (e: any) {
          toast.error(e.message || "Face analysis failed");
          setFaceResults(DEMO_FACE);
          updateScanData({ face: DEMO_FACE });
        }
        setIsUploadingFace(false);
      };
    } catch (e) {
      toast.error("Error processing image");
      setIsUploadingFace(false);
    }
  }, [isDemoMode, updateScanData]);

  const { getRootProps: getFaceRootProps, getInputProps: getFaceInputProps, isDragActive: isFaceDrag } = useDropzone({
    onDrop: onDropFace, accept: { "image/*": [] }, maxFiles: 1,
  });

  // Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          setVoiceAudio(base64);
          setIsUploadingVoice(true);

          if (isDemoMode) {
            setVoiceResults(DEMO_VOICE);
            updateScanData({ voice: DEMO_VOICE });
            setIsUploadingVoice(false);
            return;
          }

          try {
            const res = await fetch("/api/analyze/voice", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audioBase64: base64, mimeType: "audio/webm" }),
            });
            if (!res.ok) throw new Error("Failed to analyze voice");
            const data = await res.json();
            setVoiceResults(data);
            updateScanData({ voice: data });
          } catch (e: any) {
            toast.error(e.message || "Voice analysis failed");
            setVoiceResults(DEMO_VOICE);
            updateScanData({ voice: DEMO_VOICE });
          }
          setIsUploadingVoice(false);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      recordInterval.current = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
      if (recordInterval.current) clearInterval(recordInterval.current);
    }
  };

  // Wearable Dropzone
  const onDropWearable = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const row: any = results.data[0];
          const data = {
            heartRate: row.HeartRate || row.HR || 65,
            heartRateVariability: row.HRV || 45,
            steps: row.Steps || 8000,
            sleepScore: row.SleepScore || row.Sleep || 80,
            restingHeartRate: row.RestingHR || 60,
          };
          setWearableData(data);
          updateScanData({ wearable: data });
          toast.success("Wearable data synced!");
        }
      },
      error: () => toast.error("Failed to parse CSV"),
    });
  }, [updateScanData]);

  const { getRootProps: getWearableRootProps, getInputProps: getWearableInputProps } = useDropzone({
    onDrop: onDropWearable, accept: { "text/csv": [".csv"] }, maxFiles: 1,
  });

  const nextStep = () => {
    if (currentStep === 2) updateScanData({ lifestyle: { ...DEMO_LIFESTYLE, ...lifestyle } });
    if (currentStep === 3 && !wearableData) updateScanData({ wearable: DEMO_WEARABLE });
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  useEffect(() => {
    if (currentStep === 4) {
      const stages = [
        "Analyzing facial features...",
        "Processing voice patterns...",
        "Evaluating lifestyle habits...",
        "Reading wearable metrics...",
        "Cross-referencing signals...",
        "Generating holistic wellness profile...",
      ];
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setProcessingStage(i);
      }, 1000);

      const processFinal = async () => {
        try {
          const result = await analyzeWellness(useStore.getState().scanData);
          setScores(result.scores);
          setInsights(result.insights);
          setPredictions(result.predictions);
          setPremiumData({
            burnout: result.burnout,
            habits: result.habits,
            recovery: result.recovery,
            cognitiveLoad: result.cognitiveLoad,
          });

          // Save to Firestore if live mode and auth is present
          if (!isDemoMode && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
            try {
              const { db } = await import("@/lib/firebase");
              const { doc, setDoc } = await import("firebase/firestore");
              const userId = useStore.getState().user?.id || `anon-${Date.now()}`;
              await setDoc(doc(db, "users", userId, "scans", Date.now().toString()), result);
            } catch (fbError) {
              console.warn("Firestore save skipped:", fbError);
            }
          }

          clearInterval(interval);
          setProcessingStage(stages.length);
          setTimeout(() => router.push("/dashboard"), 800);
        } catch (e) {
          toast.error("Multi-modal analysis failed");
          clearInterval(interval);
          setTimeout(() => router.push("/dashboard"), 800);
        }
      };
      
      processFinal();
      return () => clearInterval(interval);
    }
  }, [currentStep, router, setScores, setInsights, setPredictions, setPremiumData]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="absolute inset-0 grid-bg" />

      {/* Step Indicator */}
      <div className="relative z-10 w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-3">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                i < currentStep ? "bg-primary text-primary-foreground" :
                i === currentStep ? "bg-primary/20 text-primary border border-primary/30" :
                "bg-white/5 text-muted-foreground"
              }`}>
                {i < currentStep ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-12 sm:w-20 h-0.5 mx-1 rounded-full transition-all duration-300 ${
                  i < currentStep ? "bg-primary" : "bg-white/10"
                }`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Step Content */}
      <div className="relative z-10 w-full max-w-2xl">
        <AnimatePresence mode="wait" custom={1}>
          
          {/* FACE */}
          {currentStep === 0 && (
            <motion.div key="face" variants={slideVariants} initial="enter" animate="center" exit="exit" custom={1} transition={{ duration: 0.3 }}>
              <GlassCard glow="cyan" className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Face Analysis</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
                  Upload a photo to estimate wellness signals. Handled securely and instantly.
                </p>

                {!faceResults ? (
                  <div
                    {...getFaceRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-12 transition-colors cursor-pointer group ${isFaceDrag ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-primary/30'}`}
                  >
                    <input {...getFaceInputProps()} />
                    {isUploadingFace ? (
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
                        <p className="text-sm text-primary">Analyzing with Gemini Vision...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4 group-hover:text-primary transition-colors" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground/50 mt-1">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </div>
                ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                    <div className="w-32 h-32 rounded-2xl mx-auto overflow-hidden relative border border-white/10">
                      {faceImage && <img src={faceImage} alt="Face" className="w-full h-full object-cover" />}
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 to-transparent animate-scan-line" style={{ height: "4px" }} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto mt-4">
                      <div className="glass rounded-lg p-2 text-center"><div className="text-xs text-muted-foreground">Stress</div><div className="text-sm font-semibold text-primary">{faceResults.stressIndicator || 0}%</div></div>
                      <div className="glass rounded-lg p-2 text-center"><div className="text-xs text-muted-foreground">Fatigue</div><div className="text-sm font-semibold text-primary">{faceResults.eyeFatigue || 0}%</div></div>
                      <div className="glass rounded-lg p-2 text-center"><div className="text-xs text-muted-foreground">Hydration</div><div className="text-sm font-semibold text-primary">{faceResults.hydrationClues || 0}%</div></div>
                      <div className="glass rounded-lg p-2 text-center"><div className="text-xs text-muted-foreground">Wellness</div><div className="text-sm font-semibold text-primary">{faceResults.generalWellness || 0}%</div></div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { setFaceResults(null); setFaceImage(null); }} className="mt-4 text-xs">
                      Retake Photo
                    </Button>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          )}

          {/* VOICE */}
          {currentStep === 1 && (
            <motion.div key="voice" variants={slideVariants} initial="enter" animate="center" exit="exit" custom={1} transition={{ duration: 0.3 }}>
              <GlassCard glow="violet" className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
                  <Mic className="w-8 h-8 text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Voice Analysis</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
                  Record a short clip talking about your day to analyze stress and energy patterns.
                </p>

                {!voiceResults ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-1 h-20">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 rounded-full bg-violet-400/60"
                          animate={isRecording ? { height: [8, Math.random() * 60 + 10, 8] } : { height: 8 }}
                          transition={{ duration: 0.5, repeat: isRecording ? Infinity : 0, delay: i * 0.05, ease: "easeInOut" }}
                        />
                      ))}
                    </div>

                    {isRecording && <div className="text-sm text-muted-foreground font-mono">Recording... 00:{recordSeconds.toString().padStart(2, '0')}</div>}
                    {isUploadingVoice && <div className="text-sm text-violet-400 animate-pulse">Analyzing with Gemini Audio...</div>}

                    <Button size="lg" variant={isRecording ? "destructive" : "glow"} onClick={isRecording ? stopRecording : startRecording} className="gap-2" disabled={isUploadingVoice}>
                      {isRecording ? <>Stop Recording</> : <><Mic className="w-4 h-4" /> Start Recording</>}
                    </Button>
                  </div>
                ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4">
                    {voiceAudio && <audio src={voiceAudio} controls className="mx-auto h-8 opacity-70 mt-2" />}
                    <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto mt-4">
                      <div className="glass rounded-lg p-2 text-center"><div className="text-xs text-muted-foreground">Stress</div><div className="text-sm font-semibold text-violet-400">{voiceResults.stress || 0}%</div></div>
                      <div className="glass rounded-lg p-2 text-center"><div className="text-xs text-muted-foreground">Energy</div><div className="text-sm font-semibold text-violet-400">{voiceResults.energy || 0}%</div></div>
                      <div className="glass rounded-lg p-2 text-center"><div className="text-xs text-muted-foreground">Confidence</div><div className="text-sm font-semibold text-violet-400">{voiceResults.confidence || 0}%</div></div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { setVoiceResults(null); setVoiceAudio(null); }} className="mt-4 text-xs">
                      Re-record Audio
                    </Button>
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          )}

          {/* LIFESTYLE */}
          {currentStep === 2 && (
            <motion.div key="lifestyle" variants={slideVariants} initial="enter" animate="center" exit="exit" custom={1} transition={{ duration: 0.3 }}>
              <GlassCard glow="teal" className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Lifestyle Check</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Moon, label: "Sleep Hours", key: "sleepHours", min: 3, max: 12, step: 0.5, suffix: "h" },
                    { icon: Dumbbell, label: "Exercise (min)", key: "exerciseMinutes", min: 0, max: 120, step: 5, suffix: "m" },
                    { icon: Droplets, label: "Water Glasses", key: "waterIntake", min: 0, max: 15, step: 1, suffix: "" },
                    { icon: Monitor, label: "Screen Time", key: "screenTimeHours", min: 0, max: 16, step: 0.5, suffix: "h" },
                  ].map((field) => (
                    <div key={field.key} className="glass rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2"><field.icon className="w-4 h-4 text-primary" /><span className="text-sm font-medium">{field.label}</span></div>
                        <span className="text-sm font-bold text-primary">{(lifestyle as any)[field.key]}{field.suffix}</span>
                      </div>
                      <input type="range" min={field.min} max={field.max} step={field.step} value={(lifestyle as any)[field.key]} onChange={(e) => setLifestyle({ ...lifestyle, [field.key]: parseFloat(e.target.value) })} className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer accent-primary" />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* WEARABLE */}
          {currentStep === 3 && (
            <motion.div key="wearable" variants={slideVariants} initial="enter" animate="center" exit="exit" custom={1} transition={{ duration: 0.3 }}>
              <GlassCard className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-6">
                  <Watch className="w-8 h-8 text-rose-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Connect Wearable</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">Upload Apple Health or Fitbit CSV export.</p>

                {!wearableData ? (
                  <div {...getWearableRootProps()} className="border-2 border-dashed border-white/10 rounded-2xl p-12 hover:border-primary/30 transition-colors cursor-pointer group max-w-sm mx-auto mb-6">
                    <input {...getWearableInputProps()} />
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4 group-hover:text-primary transition-colors" />
                    <p className="text-sm text-muted-foreground">Drop CSV file here</p>
                  </div>
                ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-4 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-emerald-400">Wearable Synced</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                      <div className="glass rounded-lg p-2 text-center"><div className="text-xs text-muted-foreground">Heart Rate</div><div className="text-sm font-semibold text-rose-400">{wearableData.heartRate} bpm</div></div>
                      <div className="glass rounded-lg p-2 text-center"><div className="text-xs text-muted-foreground">HRV</div><div className="text-sm font-semibold text-rose-400">{wearableData.heartRateVariability} ms</div></div>
                      <div className="glass rounded-lg p-2 text-center"><div className="text-xs text-muted-foreground">Steps</div><div className="text-sm font-semibold text-rose-400">{wearableData.steps}</div></div>
                      <div className="glass rounded-lg p-2 text-center"><div className="text-xs text-muted-foreground">Sleep Score</div><div className="text-sm font-semibold text-rose-400">{wearableData.sleepScore}</div></div>
                    </div>
                  </motion.div>
                )}

                <Button variant="outline" size="sm" onClick={() => { setWearableData(DEMO_WEARABLE); updateScanData({ wearable: DEMO_WEARABLE }); toast.success("Used Mock Wearable Data"); }}>
                  Use Apple Watch Mock Data
                </Button>
              </GlassCard>
            </motion.div>
          )}

          {/* PROCESSING */}
          {currentStep === 4 && (
            <motion.div key="processing" variants={slideVariants} initial="enter" animate="center" exit="exit" custom={1} transition={{ duration: 0.3 }}>
              <GlassCard glow="cyan" className="text-center p-12">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 animate-pulse-glow" />
                  <div className="absolute inset-2 rounded-full border border-cyan-400/20 animate-spin-slow" />
                  <div className="absolute inset-5 rounded-full border border-violet-400/20 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "15s" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">AI Analysis in Progress</h2>
                <div className="space-y-3 max-w-sm mx-auto">
                  {[
                    "Analyzing facial features...",
                    "Processing voice patterns...",
                    "Evaluating lifestyle habits...",
                    "Cross-referencing signals via Gemini...",
                  ].map((stage, i) => (
                    <motion.div key={stage} initial={{ opacity: 0 }} animate={{ opacity: i <= processingStage ? 1 : 0.3 }} className="flex items-center gap-3">
                      {i < processingStage ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : i === processingStage ? <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" /> : <div className="w-4 h-4 rounded-full border border-white/10 shrink-0" />}
                      <span className="text-sm text-left">{stage}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex items-center justify-between mt-6">
            <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0} className="gap-2"><ArrowLeft className="w-4 h-4" /> Back</Button>
            <Button variant="glow" onClick={nextStep} className="gap-2" disabled={(currentStep === 0 && !faceResults) || (currentStep === 1 && !voiceResults)}>
              {currentStep === 3 ? "Analyze" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
