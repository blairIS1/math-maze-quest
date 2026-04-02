"use client";
type Mood = "idle" | "happy" | "thinking" | "scared" | "celebrate";

export default function CalcBuddy({ mood = "idle", size = 120 }: { mood?: Mood; size?: number }) {
  const bounce = mood === "celebrate" ? "animate-bounce" : mood === "happy" ? "animate-pulse" : "";
  const face = mood === "happy" ? "😄" : mood === "thinking" ? "🤔" : mood === "scared" ? "😰" : mood === "celebrate" ? "🤩" : "🙂";
  return (
    <div className={`flex flex-col items-center ${bounce}`}>
      <div style={{ fontSize: size * 0.8, lineHeight: 1 }}>🤖</div>
      <div style={{ fontSize: size * 0.3, marginTop: -size * 0.15 }}>{face}</div>
      {mood === "celebrate" && <div className="text-xs mt-1">✨🧮✨</div>}
    </div>
  );
}
