"use client";
import { useEffect, useState } from "react";
import CalcBuddy from "./CalcBuddy";
import SpeakingIndicator from "./SpeakingIndicator";
import { speak, stopSpeaking } from "./speak";
import { VOICE } from "./voice";
import { TrainingData, CATEGORIES, CAT_LABELS, getConfidence } from "./data";

export default function TrainingSummary({ training, onComplete }: { training: TrainingData; onComplete: () => void }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    speak(VOICE.summary).then(() => {
      const hasBias = CATEGORIES.some((c) => (training[c] || 0) > 3);
      const hasMissing = CATEGORIES.some((c) => !training[c]);
      if (hasBias) return speak(VOICE.summaryBias);
      if (hasMissing) return speak(VOICE.summaryLearned);
    }).then(() => setReady(true));
    return () => stopSpeaking();
  }, [training]);

  const max = Math.max(1, ...CATEGORIES.map((c) => training[c] || 0));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 fade-in">
      <SpeakingIndicator />
      <CalcBuddy mood="thinking" size={120} />
      <h2 className="text-2xl font-bold">🧠 What Calc Learned</h2>
      <div className="w-full max-w-sm flex flex-col gap-3">
        {CATEGORIES.map((cat) => {
          const count = training[cat] || 0;
          const conf = getConfidence(training, cat);
          const info = CAT_LABELS[cat];
          return (
            <div key={cat} className="flex items-center gap-2">
              <span className="text-xl w-8">{info.emoji}</span>
              <span className="text-sm w-24">{info.label}</span>
              <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: "var(--card)" }}>
                <div className="h-full rounded-full transition-all" style={{
                  width: `${(count / max) * 100}%`,
                  background: conf >= 85 ? "var(--success)" : conf >= 50 ? "var(--warn)" : "#ef4444",
                }} />
              </div>
              <span className="text-xs w-8 text-right">{conf}%</span>
            </div>
          );
        })}
      </div>
      {CATEGORIES.some((c) => !training[c]) && (
        <p className="text-sm opacity-70" style={{ color: "var(--warn)" }}>⚠️ Some math types have no data — Calc might guess wrong!</p>
      )}
      {ready && (
        <button className="btn btn-primary text-lg px-8 py-3 fade-in" onClick={onComplete}>
          🚀 Test Calc's Skills!
        </button>
      )}
    </div>
  );
}
