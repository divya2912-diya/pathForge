import React, { useState, useEffect } from "react";

export function ProgressRing({ value, size = 120, stroke = 10, label, sublabel, tone = "#22d3ee" }) {
  const [animVal, setAnimVal] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimVal(value), 200);
    return () => clearTimeout(t);
  }, [value]);

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (animVal / 100) * c;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={tone} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="lp-display text-2xl font-semibold">{label ?? `${value}%`}</span>
        {sublabel && <span className="text-xs text-slate-400 mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}

export default ProgressRing;
