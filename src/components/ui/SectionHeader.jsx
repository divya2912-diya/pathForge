import React from "react";

export function SectionHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
      <div>
        {eyebrow && <p className="text-xs font-medium mb-1" style={{ color: "#67e8f9" }}>{eyebrow}</p>}
        <h2 className="lp-display text-xl md:text-2xl font-semibold">{title}</h2>
        {subtitle && <p className="text-sm mt-1" style={{ color: "var(--text-dim)" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export default SectionHeader;
