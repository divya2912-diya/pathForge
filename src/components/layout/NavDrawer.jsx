import React from "react";
import { Flame, X, LogIn, LogOut } from "lucide-react";
import { NAV_MENU } from "../../data/mockData";
import { LanguageSelector } from "../ui/LanguageSelector";
import { getTranslation } from "../../services/i18nService";

export function NavDrawer({ open, onClose, active, onNavigate, language = "en", onLanguageChange, student, onLogout }) {
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
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate("home")} title="Go to Home">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden" style={{ background: "linear-gradient(135deg, #22d3ee, #3b82f6 50%, #f97316)" }}>
              <Flame size={18} color="#04121a" fill="#04121a" />
            </div>
            <span className="lp-display font-bold text-[16px] bg-gradient-to-r from-cyan-300 via-blue-200 to-orange-400 bg-clip-text text-transparent">PathForge</span>
          </div>
          <button onClick={onClose} className="cursor-pointer text-slate-400 hover:text-white">
            <X size={18} />
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
              <span>{getTranslation(`nav.${id}`, language) !== `nav.${id}` ? getTranslation(`nav.${id}`, language) : label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">App Language:</span>
            <LanguageSelector currentLang={language} onLanguageChange={onLanguageChange} />
          </div>

          {student ? (
            <button
              onClick={() => {
                onClose();
                if (onLogout) onLogout();
              }}
              className="lp-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left cursor-pointer hover:bg-red-500/10 hover:text-red-400 text-rose-300 transition-colors"
            >
              <LogOut size={17} className="shrink-0 text-rose-400" />
              <span>{getTranslation("nav.logout", language)}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onNavigate("login");
              }}
              className={`lp-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left cursor-pointer ${active === "login" ? "active" : ""}`}
              style={{ color: active === "login" ? "#fff" : "var(--text-dim)" }}
            >
              <LogIn size={17} className="shrink-0 text-cyan-400" />
              <span>{getTranslation("nav.login", language)}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

export default NavDrawer;
