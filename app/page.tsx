"use client";
import { useState, useEffect } from "react";
import TrainMath from "./quests/TrainMath";
import TrainingSummary from "./quests/TrainingSummary";
import TestMath from "./quests/TestMath";
import NavigateMaze from "./quests/NavigateMaze";
import CalcBuddy from "./quests/CalcBuddy";
import Confetti from "./quests/Confetti";
import SessionTimer, { useSessionTimer } from "./quests/SessionTimer";
import SpeakingIndicator, { useSpeaking } from "./quests/SpeakingIndicator";
import { sfxTap, sfxCelebrate } from "./quests/sfx";
import { speak, stopSpeaking } from "./quests/speak";
import { startMusic, stopMusic } from "./quests/music";
import { recordCompletion, getCompletions } from "./quests/scores";
import { VOICE } from "./quests/voice";
import { TrainingData } from "./quests/data";

const PARTS = [
  { emoji: "🧮", label: "Calculator", voice: VOICE.partCalc },
  { emoji: "👁️", label: "Sensors", voice: VOICE.partSensors },
  { emoji: "🧠", label: "Math Brain", voice: VOICE.partBrain },
  { emoji: "🗺️", label: "Maze Map", voice: VOICE.partMap },
];
const QUESTS = [
  { name: "🧮 Train Math Brain", voice: VOICE.questTrain },
  { name: "🧪 Test Skills", voice: VOICE.questTest },
  { name: "🗺️ Navigate Maze", voice: VOICE.questNavigate },
];

type Phase = "start" | "menu" | "train" | "summary" | "test" | "maze";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("start");
  const [completed, setCompleted] = useState([false, false, false]);
  const [training, setTraining] = useState<TrainingData>({});
  const [completions, setCompletions] = useState(0);
  const { expired, dismiss } = useSessionTimer();
  useSpeaking();

  useEffect(() => { setCompletions(getCompletions()); }, []);
  const markDone = (i: number) => setCompleted((p) => { const n = [...p]; n[i] = true; return n; });

  const startGame = () => { stopSpeaking(); sfxTap(); startMusic(); speak(VOICE.welcome).then(() => { setPhase("menu"); speak(VOICE.menuSubtitle); }); };
  const startQuest = (p: Phase) => { stopSpeaking(); sfxTap(); setPhase(p); };

  if (expired) { stopMusic(); return <SessionTimer onDismiss={dismiss} />; }

  if (phase === "start") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4 fade-in">
        <SpeakingIndicator />
        <CalcBuddy mood="idle" size={160} />
        <h1 className="text-4xl font-bold text-center">🤖 Math Maze Quest</h1>
        <p className="text-lg text-center opacity-80 max-w-md px-4">
          Teach Calc the robot math so it can navigate through a maze!
        </p>
        <button className="btn btn-primary text-2xl px-8 py-4" onClick={startGame}>🎮 Start Adventure!</button>
        {completions > 0 && <p className="text-sm opacity-40">🏆 Completed {completions} time{completions > 1 ? "s" : ""}!</p>}
      </div>
    );
  }

  if (phase === "menu") {
    const phases: Phase[] = ["train", "test", "maze"];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 fade-in">
        <SpeakingIndicator />
        <Confetti active={completed.every(Boolean)} />
        <CalcBuddy mood={completed.every(Boolean) ? "celebrate" : "idle"} size={140} />
        <h1 className="text-3xl font-bold text-center">Math Maze Quest!</h1>
        <p className="text-base text-center opacity-70 max-w-md px-4">Collect all parts to complete the maze!</p>
        <div className="flex gap-3 flex-wrap justify-center">
          {PARTS.map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-1" style={{ opacity: completed[Math.min(i, 2)] ? 1 : 0.3 }}>
              <span className="text-3xl" style={{ filter: completed[Math.min(i, 2)] ? "none" : "grayscale(1)" }}>{p.emoji}</span>
              <span className="text-xs" onClick={() => speak(p.voice)} style={{ cursor: "pointer" }}>{p.label}</span>
            </div>
          ))}
        </div>
        <div className="text-sm opacity-60">{completed.filter(Boolean).length}/3 quests</div>
        <div className="flex flex-col gap-3 w-full max-w-sm px-4">
          {QUESTS.map((q, i) => (
            <button key={i} className="btn btn-primary flex justify-between items-center"
              style={{ opacity: i === 0 || completed[i - 1] ? 1 : 0.4 }}
              disabled={i > 0 && !completed[i - 1]}
              onClick={() => startQuest(phases[i])}>
              <span>{q.name}</span>
              {completed[i] ? <span>✅</span> : <span className="opacity-40">{PARTS[i].emoji}</span>}
            </button>
          ))}
        </div>
        {completed.every(Boolean) && (
          <div className="text-xl font-bold text-center fade-in" style={{ color: "var(--success)" }}>
            🎉 Mission complete! Calc mastered math!
          </div>
        )}
      </div>
    );
  }

  return <>
    {phase === "train" && <TrainMath onComplete={(data) => {
      setTraining((prev) => { const m = { ...prev }; for (const [k, v] of Object.entries(data)) m[k] = (m[k] || 0) + v; return m; });
      markDone(0); setPhase("summary");
    }} />}
    {phase === "summary" && <TrainingSummary training={training} onComplete={() => setPhase("test")} />}
    {phase === "test" && <TestMath training={training} onComplete={(retrain) => { if (retrain) setPhase("train"); else { markDone(1); setPhase("maze"); } }} />}
    {phase === "maze" && <NavigateMaze training={training} onComplete={() => { markDone(2); setCompletions(recordCompletion()); sfxCelebrate(); setPhase("menu"); }} />}
  </>;
}
