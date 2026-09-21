import React, { useState, useEffect } from "react";

export function ProgressBar({ value, tone = "cyan", height = 8, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), 150 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  const grad = {
    cyan: "linear-gradient(90deg,#22d3ee,#3b82f6)",
    violet: "linear-gradient(90deg,#8b5cf6,#c084fc)",
    green: "linear-gradient(90deg,#34d399,#22d3ee)",
    amber: "linear-gradient(90deg,#fbbf24,#f97316)",
  }[tone] || "linear-gradient(90deg,#22d3ee,#3b82f6)";

  return (
    <div style={{ height, background: "rgba(255,255,255,0.07)", borderRadius: 999 }}>
      <div style={{ width: `${w}%`, height: "100%", borderRadius: 999, background: grad, transition: "width 1.1s cubic-bezier(.2,.8,.2,1)" }} />
    </div>
  );
}

export default ProgressBar;
