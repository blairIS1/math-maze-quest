"use client";
import { useState, useEffect } from "react";
import CalcBuddy from "./CalcBuddy";
import Confetti from "./Confetti";
import SpeakingIndicator from "./SpeakingIndicator";
import { sfxTap, sfxCorrect, sfxWrong, sfxCelebrate } from "./sfx";
import { speak, stopSpeaking } from "./speak";
import { VOICE } from "./voice";
import { TrainingData, generateTestRounds, MazeRound } from "./data";

export default function TestMath({ training, onComplete }: { training: TrainingData; onComplete: (retrain: boolean) => void }) {
  const [rounds] = useState(() => generateTestRounds(training));
  const [idx, setIdx] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [mood, setMood] = useState<"idle" | "happy" | "thinking" | "scared" | "celebrate">("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showAi, setShowAi] = useState(false);
  const round = rounds[idx];

  useEffect(() => {
    speak(VOICE.q3Start).then(() => setDisabled(false));
    return () => stopSpeaking();
  }, []);

  if (!round) return null;

  const reveal = () => {
    if (disabled) return;
    sfxTap();
    setDisabled(true);
    setMood("thinking");
    setShowAi(true);
  };

  const judge = (aiCorrect: boolean) => {
    setDisabled(true);
    sfxTap();
    const actuallyCorrect = round.aiChoice === round.correct;
    if (aiCorrect === actuallyCorrect) {
      sfxCorrect();
      setMood("happy");
      setShowConfetti(true);
      speak(VOICE.correct).then(() => advance());
    } else {
      sfxWrong();
      setMood("scared");
      setMistakes((m) => m + 1);
      speak(VOICE.wrong).then(() => advance());
    }
  };

  const advance = () => {
    setShowConfetti(false);
    setShowAi(false);
    if (idx + 1 >= rounds.length) {
      setMood("celebrate");
      sfxCelebrate();
      const needRetrain = mistakes >= 3;
      speak(needRetrain ? VOICE.q3Retrain : VOICE.q3Done).then(() => onComplete(needRetrain));
    } else {
      setIdx(idx + 1);
      setMood("idle");
      setDisabled(false);
    }
  };

  const confColor = round.confidence >= 85 ? "var(--success)" : round.confidence >= 50 ? "var(--warn)" : "#ef4444";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 p-4 fade-in">
      <SpeakingIndicator />
      <Confetti active={showConfetti} />
      <CalcBuddy mood={mood} size={100} />
      <h2 className="text-2xl font-bold">🧪 Test Calc's Skills!</h2>
      <p className="text-sm opacity-60">{idx + 1} / {rounds.length}</p>
      <p className="text-xl font-bold text-center">{round.q}</p>
      {!showAi ? (
        <button className="btn btn-primary text-lg px-8 py-3" disabled={disabled} onClick={reveal}>
          🤖 Let Calc Try!
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3 fade-in">
          <div className="flex items-center gap-2">
            <span className="text-sm">Confidence:</span>
            <div className="w-32 h-4 rounded-full overflow-hidden" style={{ background: "var(--card)" }}>
              <div className="h-full rounded-full" style={{ width: `${round.confidence}%`, background: confColor }} />
            </div>
            <span className="text-sm">{round.confidence}%</span>
          </div>
          <p className="text-lg">Calc says: <strong>{round.aiChoice}</strong></p>
          {round.reason && <p className="text-sm opacity-60">{round.reason}</p>}
          <div className="flex gap-3">
            <span className="text-xs opacity-50">{round.features.join(" • ")}</span>
          </div>
          <p className="text-sm opacity-70">Is Calc right?</p>
          <div className="flex gap-4">
            <button className="btn btn-primary px-6 py-2" onClick={() => judge(true)}>✅ Yes!</button>
            <button className="btn btn-primary px-6 py-2" onClick={() => judge(false)}>❌ Nope!</button>
          </div>
        </div>
      )}
    </div>
  );
}
