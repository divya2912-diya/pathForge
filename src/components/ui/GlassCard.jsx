import React from "react";

export function GlassCard({ children, className = "", strong = false, hover = false, style = {}, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`${strong ? "lp-glass-strong" : "lp-glass"} rounded-2xl ${hover ? "lp-card-hover" : ""} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassCard;
