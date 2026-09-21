import React from "react";

export function Pill({ children, tone = "default" }) {
  const tones = {
    default: { background: "rgba(255,255,255,0.06)", color: "#c7cede", border: "1px solid rgba(255,255,255,0.12)" },
    cyan: { background: "rgba(34,211,238,0.12)", color: "#67e8f9", border: "1px solid rgba(34,211,238,0.3)" },
    violet: { background: "rgba(139,92,246,0.12)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.3)" },
    amber: { background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" },
    green: { background: "rgba(52,211,153,0.12)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.3)" },
    red: { background: "rgba(248,113,113,0.12)", color: "#fca5a5", border: "1px solid rgba(248,113,113,0.3)" },
  };
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={tones[tone]}>
      {children}
    </span>
  );
}

export default Pill;
