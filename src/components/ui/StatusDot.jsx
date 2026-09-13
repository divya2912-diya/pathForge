import React from "react";
import { Check, PlayCircle, CircleDot, Lock } from "lucide-react";

export function StatusDot({ status }) {
  const map = {
    done: { bg: "#34d399", icon: Check },
    "in-progress": { bg: "#22d3ee", icon: PlayCircle },
    upcoming: { bg: "#64748b", icon: CircleDot },
    locked: { bg: "#475569", icon: Lock },
  };
  const { bg } = map[status] || map.upcoming;
  return (
    <div
      className="w-2.5 h-2.5 rounded-full shrink-0"
      style={{ background: bg, boxShadow: status !== "locked" ? `0 0 8px ${bg}` : "none" }}
    />
  );
}

export default StatusDot;
