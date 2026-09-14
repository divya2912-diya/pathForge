import React from "react";
import { Home } from "lucide-react";

export function HomeButton({ onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`lp-glass-strong fixed top-4 sm:top-5 left-[68px] z-50 h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
        active
          ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_-3px_rgba(34,211,238,0.3)]"
          : "text-slate-300 hover:text-white hover:border-cyan-400/30 hover:bg-white/[0.06]"
      }`}
      aria-label="Navigate to Home / Dashboard"
      title="Home / Dashboard"
    >
      <Home size={16} className={active ? "text-cyan-300" : "text-slate-400"} />
      <span className="hidden sm:inline">Home</span>
    </button>
  );
}

export default HomeButton;
