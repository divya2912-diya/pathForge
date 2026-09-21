import React, { useState, useEffect } from "react";

export function AnalyzingScreen({ onDone }) {
  const messages = [
    "Reading your academic profile...",
    "Mapping previous learning and skills...",
    "Cross-referencing verified sources...",
    "Detecting skill gaps for AI/ML Engineer...",
    "Generating your personalized roadmap...",
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= messages.length - 1) {
      const t = setTimeout(onDone, 1100);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIdx(i => i + 1), 700);
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.08), transparent 60%)" }} />
      <div className="relative z-10 flex flex-col items-center">
        <div className="lp-orb lp-spin-slow rounded-full mb-10" style={{
          width: 130, height: 130,
          background: "radial-gradient(circle at 35% 30%, rgba(103,232,249,0.6), rgba(139,92,246,0.35) 60%, transparent 75%)",
          border: "1px solid rgba(255,255,255,0.15)",
        }} />
        <h2 className="lp-display text-2xl font-semibold mb-3">AI is analyzing your profile...</h2>
        <p className="text-sm" style={{ color: "#67e8f9" }}>{messages[idx]}</p>
        <div className="w-64 h-1.5 rounded-full mt-8" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#22d3ee,#8b5cf6)", width: `${((idx + 1) / messages.length) * 100}%`, transition: "width .6s ease" }} />
        </div>
      </div>
    </div>
  );
}

export default AnalyzingScreen;
