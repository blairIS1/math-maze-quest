"use client";
import { useState, useEffect } from "react";
import CalcBuddy from "./CalcBuddy";
import Confetti from "./Confetti";
import SpeakingIndicator from "./SpeakingIndicator";
import { sfxTap, sfxCorrect, sfxWrong, sfxCelebrate } from "./sfx";
import { speak, stopSpeaking } from "./speak";
import { VOICE } from "./voice";
import { TRAIN_ITEMS, TrainingData, CAT_LABELS } from "./data";

export default function TrainMath({ onComplete }: { onComplete: (data: TrainingData) => void }) {
  const [idx, setIdx] = useState(0);
  const [mood, setMood] = useState<"idle" | "happy" | "thinking" | "celebrate">("idle");
  const [training, setTraining] = useState<TrainingData>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const items = TRAIN_ITEMS;
  const item = items[idx];

  useEffect(() => {
    speak(VOICE.q1Start).then(() => speak(VOICE.q1Instruction)).then(() => setDisabled(false));
    return () => stopSpeaking();
  }, []);

  if (!item) return null;

  const choices = item.category === "comparison"
    ? [item.answer, item.answer === "14" ? "9" : item.answer === "6" ? "11" : "?"]
    : [item.answer, String(Number(item.answer) + 1), String(Number(item.answer) - 1), String(Number(item.answer) + 2)];

  const shuffled = [...new Set(choices)].sort(() => Math.random() - 0.5);

  const pick = (choice: string) => {
    if (disabled) return;
    setDisabled(true);
    sfxTap();
    const correct = choice === item.answer;
    if (correct) {
      sfxCorrect();
      setMood("happy");
      setShowConfetti(true);
      setTraining((p) => ({ ...p, [item.category]: (p[item.category] || 0) + 1 }));
      speak(item.voiceCorrect).then(() => {
        setShowConfetti(false);
        if (idx + 1 >= items.length) {
          setMood("celebrate");
          sfxCelebrate();
          speak(VOICE.q1Done).then(() => onComplete({ ...training, [item.category]: (training[item.category] || 0) + 1 }));
        } else {
          setIdx(idx + 1);
          setMood("idle");
          setDisabled(false);
        }
      });
    } else {
      sfxWrong();
      setMood("thinking");
      speak(item.voiceWrong).then(() => { setMood("idle"); setDisabled(false); });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 fade-in">
      <SpeakingIndicator />
      <Confetti active={showConfetti} />
      <CalcBuddy mood={mood} size={120} />
      <h2 className="text-2xl font-bold">🧮 Train My Math Brain!</h2>
      <p className="text-sm opacity-60">{idx + 1} / {items.length}</p>
      <div className="text-5xl">{item.emoji}</div>
      <p className="text-xl font-bold text-center">{item.label}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {shuffled.map((c) => (
          <button key={c} className="btn btn-primary text-xl px-6 py-3 min-w-[80px]" disabled={disabled} onClick={() => pick(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        {Object.entries(CAT_LABELS).map(([k, v]) => (
          <span key={k} className="text-xs opacity-50">{v.emoji} {training[k] || 0}</span>
        ))}
      </div>
    </div>
  );
}
