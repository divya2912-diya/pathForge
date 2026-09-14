import React from "react";
import { Search } from "lucide-react";

export function TopBar({ title, onProfileClick, student }) {
  return (
    <div
      className="flex items-center justify-between pl-20 sm:pl-24 pr-5 md:pr-8 py-5 sticky top-0 z-20"
      style={{ background: "rgba(6,9,17,0.7)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <h1 className="lp-display text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Search size={14} style={{ color: "var(--text-dim)" }} />
          <input placeholder="Search resources, skills, careers..." className="bg-transparent text-sm outline-none w-56" style={{ color: "#eef1f7" }} />
        </div>
        <button
          onClick={onProfileClick}
          aria-label="Open Profile"
          title={`${student?.name || "Alex"}'s Profile`}
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 cursor-pointer hover:ring-2 hover:ring-cyan-400/50 hover:scale-105 active:scale-95 transition-all overflow-hidden"
          style={{ background: student?.avatarColor || "linear-gradient(135deg,#22d3ee,#8b5cf6)", color: "#04121a" }}
        >
          {student?.profilePicture ? (
            <img src={student.profilePicture} alt={student.name || "Profile"} className="w-full h-full object-cover rounded-full" />
          ) : (
            <span>{student?.name ? student.name.charAt(0) : "A"}</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default TopBar;
