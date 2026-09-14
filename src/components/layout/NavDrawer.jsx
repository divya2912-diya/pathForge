import React from "react";
import { Flame, X } from "lucide-react";
import { NAV_MENU } from "../../data/mockData";

export function NavDrawer({ open, onClose, active, onNavigate }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lp-fade-up cursor-pointer"
          style={{ animationDuration: ".25s" }}
          onClick={onClose}
        />
      )}
      <aside
        className="fixed top-0 left-0 h-screen z-50 w-72 lp-glass-strong flex flex-col transition-transform duration-300"
        style={{ transform: open ? "translateX(0)" : "translateX(-110%)" }}
      >
        <div className="flex items-center justify-between px-5 py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate("home")} title="Go to Home">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden" style={{ background: "linear-gradient(135deg, #22d3ee, #3b82f6 50%, #f97316)" }}>
              <Flame size={18} color="#04121a" fill="#04121a" />
            </div>
            <span className="lp-display font-bold text-[16px] bg-gradient-to-r from-cyan-300 via-blue-200 to-orange-400 bg-clip-text text-transparent">PathForge</span>
          </div>
          <button onClick={onClose} className="cursor-pointer">
            <X size={18} style={{ color: "var(--text-dim)" }} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto lp-scrollbar px-3 py-4 space-y-1">
          {NAV_MENU.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`lp-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left cursor-pointer ${active === id ? "active" : ""}`}
              style={{ color: active === id ? "#fff" : "var(--text-dim)" }}
            >
              <Icon size={17} className="shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default NavDrawer;
