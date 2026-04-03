"use client";
import { useState, useEffect } from "react";
import { useGameGraph, GameNode } from "./quests/gameGraph";
import TrainMath from "./quests/TrainMath";
import TrainingSummary from "./quests/TrainingSummary";
import TestMath from "./quests/TestMath";
import NavigateMaze from "./quests/NavigateMaze";
import CalcBuddy from "./quests/CalcBuddy";
import Confetti from "./quests/Confetti";
import SessionTimer, { useSessionTimer } from "./quests/SessionTimer";
import SpeakingIndicator from "./quests/SpeakingIndicator";
import { sfxTap, sfxCelebrate } from "./quests/sfx";
import { startMusic, stopMusic } from "./quests/music";
import { recordCompletion, getCompletions } from "./quests/scores";
import { VOICE } from "./quests/voice";
import { TrainingData } from "./quests/data";

const GAME_GRAPH: GameNode[] = [
  { id: "start", on: { BEGIN: "menu" } },
  {
    id: "menu",
    enter: [
      { type: "speak", key: VOICE.welcome },
      { type: "speak", key: VOICE.menuSubtitle },
      { type: "unlock" },
    ],
    on: { Q1: "train", Q2: "test", Q3: "maze" },
  },
  { id: "train",   on: { COMPLETE: "summary" } },
  { id: "summary", on: { NEXT: "test" } },
  { id: "test",    on: { PASS: "maze", RETRAIN: "train" } },
  { id: "maze",    on: { COMPLETE: "menu" } },
];

const PARTS = [
  { emoji: "🧮", label: "Calculator" },
  { emoji: "👁️", label: "Sensors" },
  { emoji: "🧠", label: "Math Brain" },
  { emoji: "🗺️", label: "Maze Map" },
];
const QUESTS = [
  { name: "🧮 Train Math Brain", event: "Q1" },
  { name: "🧪 Test Skills",      event: "Q2" },
  { name: "🗺️ Navigate Maze",   event: "Q3" },
];

export default function Home() {
  const { state, send } = useGameGraph(GAME_GRAPH, "start");
  const [completed, setCompleted] = useState([false, false, false]);
  const [training, setTraining] = useState<TrainingData>({});
  const [completions, setCompletions] = useState(0);
  const { expired, dismiss } = useSessionTimer();

  useEffect(() => { setCompletions(getCompletions()); }, []);
  const markDone = (i: number) => setCompleted((p) => { const n = [...p]; n[i] = true; return n; });

  if (expired) { stopMusic(); return <SessionTimer onDismiss={dismiss} />; }

  const { nodeId, inputEnabled } = state;

  if (nodeId === "start") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4 fade-in">
        <SpeakingIndicator />
        <CalcBuddy mood="idle" size={160} />
        <h1 className="text-4xl font-bold text-center">🤖 Math Maze Quest</h1>
        <p className="text-lg text-center opacity-80 max-w-md px-4">
          Teach Calc the robot math so it can navigate through a maze!
        </p>
        <button className="btn btn-primary text-2xl px-8 py-4" onClick={() => { sfxTap(); startMusic(); send("BEGIN"); }}>🎮 Start Adventure!</button>
        {completions > 0 && <p className="text-sm opacity-40">🏆 Completed {completions} time{completions > 1 ? "s" : ""}!</p>}
      </div>
    );
  }

  if (nodeId === "menu") {
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
              <span className="text-xs">{p.label}</span>
            </div>
          ))}
        </div>
        <div className="text-sm opacity-60">{completed.filter(Boolean).length}/3 quests</div>
        <div className="flex flex-col gap-3 w-full max-w-sm px-4">
          {QUESTS.map((q, i) => (
            <button key={i} className="btn btn-primary flex justify-between items-center"
              style={{ opacity: i === 0 || completed[i - 1] ? 1 : 0.4 }}
              disabled={!inputEnabled || (i > 0 && !completed[i - 1])}
              onClick={() => { sfxTap(); send(q.event); }}>
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

  if (nodeId === "train") {
    return <TrainMath onComplete={(data) => {
      setTraining((prev) => { const m = { ...prev }; for (const [k, v] of Object.entries(data)) m[k] = (m[k] || 0) + v; return m; });
      markDone(0);
      send("COMPLETE", data);
    }} />;
  }

  if (nodeId === "summary") {
    return <TrainingSummary training={training} onComplete={() => send("NEXT")} />;
  }

  if (nodeId === "test") {
    return <TestMath training={training} onComplete={(retrain) => {
      if (retrain) send("RETRAIN");
      else { markDone(1); send("PASS"); }
    }} />;
  }

  if (nodeId === "maze") {
    return <NavigateMaze training={training} onComplete={() => {
      markDone(2);
      setCompletions(recordCompletion());
      sfxCelebrate();
      send("COMPLETE");
    }} />;
  }

  return null;
}
