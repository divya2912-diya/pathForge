import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "../../services/i18nService";

export function LanguageSelector({ currentLang = "en", onLanguageChange, compact = false }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setOpen(false);
    if (onLanguageChange && code !== currentLang) {
      onLanguageChange(code);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left z-[200]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-xs font-bold text-slate-200 transition-all cursor-pointer shadow-sm"
        title="Select Interface & AI Language"
        aria-label="Language Selector"
      >
        <span className="text-sm">🌐</span>
        <span>{activeLangObj.name}</span>
        <ChevronDown size={13} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-2 w-48 rounded-2xl bg-[#0d1525] border border-cyan-500/40 shadow-[0_-8px_32px_rgba(0,0,0,0.6)] p-1.5 z-[200]">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10 mb-1">
            Select Language
          </div>
          <div className="space-y-1">
            {SUPPORTED_LANGUAGES.slice(0, 3).map((lang) => {
              const isSelected = lang.code === currentLang;
              const flag = lang.code === "en" ? "🇬🇧" : "🇮🇳";
              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                      : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  {isSelected && <Check size={14} className="text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
