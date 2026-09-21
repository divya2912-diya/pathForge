import React from "react";

export function GlassCard({ children, className = "", strong = false, hover = false, style = {} }) {
  return (
    <div
      className={`${strong ? "lp-glass-strong" : "lp-glass"} rounded-2xl ${hover ? "lp-card-hover" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export default GlassCard;
