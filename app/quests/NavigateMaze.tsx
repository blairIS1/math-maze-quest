"use client";
import { useState, useEffect, useRef } from "react";
import CalcBuddy from "./CalcBuddy";
import Confetti from "./Confetti";
import SpeakingIndicator from "./SpeakingIndicator";
import { sfxTap, sfxCorrect, sfxWrong, sfxCelebrate } from "./sfx";
import { speak, stopSpeaking } from "./speak";
import { VOICE } from "./voice";
import { TrainingData, generateMazeEvents, MazeEvent } from "./data";

export default function NavigateMaze({ training, onComplete }: { training: TrainingData; onComplete: () => void }) {
  const [events] = useState(() => generateMazeEvents(training));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [mood, setMood] = useState<"idle" | "happy" | "thinking" | "scared" | "celebrate">("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout>(undefined);
  const ev = events[idx];

  useEffect(() => {
    speak(VOICE.q4Start).then(() => setDisabled(false));
    return () => { stopSpeaking(); clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (!ev || disabled) return;
    setAiAnswer(null);
    timerRef.current = setTimeout(() => setAiAnswer(ev.aiChoice), ev.aiDelay);
    return () => clearTimeout(timerRef.current);
  }, [idx, disabled, ev]);

  if (!ev) return null;

  const answer = (choice: string) => {
    if (disabled) return;
    setDisabled(true);
    clearTimeout(timerRef.current);
    sfxTap();
    const correct = choice === ev.correct;
    if (correct) {
      sfxCorrect();
      setMood("happy");
      setShowConfetti(true);
      setScore((s) => s + 1);
      speak(VOICE.q4Correct).then(() => advance());
    } else {
      sfxWrong();
      setMood("scared");
      speak(VOICE.q4Wrong).then(() => advance());
    }
  };

  const advance = () => {
    setShowConfetti(false);
    setAiAnswer(null);
    if (idx + 1 >= events.length) {
      setMood("celebrate");
      sfxCelebrate();
      speak(VOICE.q4Done).then(() => onComplete());
    } else {
      setIdx(idx + 1);
      setMood("idle");
      setDisabled(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-4 fade-in">
      <SpeakingIndicator />
      <Confetti active={showConfetti} />
      <CalcBuddy mood={mood} size={100} />
      <h2 className="text-2xl font-bold">🗺️ Navigate the Maze!</h2>
      <p className="text-sm opacity-60">Turn {idx + 1} / {events.length} — Score: {score}</p>
      <p className="text-xl font-bold text-center">{ev.q}</p>
      {aiAnswer && (
        <p className="text-sm opacity-70 fade-in">🤖 Calc suggests: <strong>{aiAnswer}</strong></p>
      )}
      <div className="flex flex-wrap gap-3 justify-center">
        {ev.choices.map((c) => (
          <button key={c} className="btn btn-primary text-xl px-6 py-3 min-w-[80px]" disabled={disabled} onClick={() => answer(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs opacity-50">
        {ev.features.join(" • ")}
      </div>
    </div>
  );
}
