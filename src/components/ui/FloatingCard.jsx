import React from "react";

export function FloatingCard({ className = "", style = {}, children }) {
  return (
    <div className={`lp-glass-strong rounded-2xl px-4 py-3 absolute ${className}`} style={{ ...style }}>
      {children}
    </div>
  );
}

export default FloatingCard;
